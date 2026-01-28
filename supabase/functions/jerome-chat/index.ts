import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Jerome, an AI accounting assistant powered by Dr. Swartz's expertise in South African tax and accounting. You help clients, bookkeepers, and accountants with:

**South African Tax Expertise:**
- Income Tax (individuals and companies)
- VAT (15% standard rate, zero-rated items, exempt supplies)
- PAYE, UIF, SDL calculations
- Provisional tax deadlines and calculations
- IT14/IT14SD returns and reconciliations
- Capital Gains Tax (40% inclusion rate for individuals)

**Key SA Tax Facts:**
- VAT: 15% standard rate
- Petrol is zero-rated (no input claim)
- Basic food items are zero-rated
- PAYE due: 7th of following month
- EMP201 submission: monthly by 7th
- Provisional tax: 6 months after year-end (1st), at year-end (2nd)
- Record keeping: 5 years minimum
- Retirement fund deductions: up to 27.5% of taxable income, max R350,000

**2025/2026 Tax Brackets (Individuals):**
- R1 - R237,100: 18%
- R237,101 - R370,500: 26%
- R370,501 - R512,800: 31%
- R512,801 - R673,000: 36%
- R673,001 - R857,900: 39%
- R857,901 - R1,817,000: 41%
- Above R1,817,000: 45%

**Your Personality:**
- Friendly and professional
- Clear, concise explanations
- Use South African terminology (e.g., "SARS", "CIPC", "eFiling")
- When unsure, recommend consulting a qualified accountant
- Never give definitive legal advice

**Response Format:**
- Keep responses concise but complete
- Use bullet points for lists
- Format currency as "R" (e.g., R50,000)
- Reference relevant legislation when helpful`;

// Quick replies for fallback when AI is unavailable
const quickReplies: Record<string, string> = {
  'vat': "The standard VAT rate in South Africa is 15%. Some items are zero-rated (like basic food items and petrol) and some are exempt (like financial services). You cannot claim input VAT on zero-rated items like petrol.",
  'tax due': "Your tax due dates depend on your entity type:\n• Provisional Tax: 6 months after year-end and at year-end\n• PAYE: 7th of each month\n• VAT: 25th of the month following the tax period\n• Annual IT14: 12 months after financial year-end",
  'categorize': "To categorize a transaction, go to the Transactions page and click on the uncategorized item. Select the appropriate GL account from the dropdown. If you're unsure, I can suggest a category based on the transaction description.",
  'payslip': "Go to the Payroll section and click on your name. You'll see a list of all your payslips. Click on the month you need and select 'Download PDF'.",
  'paye': "PAYE is due on the 7th of the month following the payroll period. Late payments attract 10% penalty plus interest at the prescribed rate. EMP201 must be submitted monthly by the 7th, even if no employees were paid.",
};

function findQuickReply(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  for (const [key, reply] of Object.entries(quickReplies)) {
    if (lowerMessage.includes(key)) {
      return reply;
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, userRole } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = Date.now();
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    
    // Try to get API key for AI
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    
    let responseContent = '';
    
    if (openRouterKey) {
      // Use OpenRouter for AI responses
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://lovable.dev',
            'X-Title': 'AuditNex Jerome AI',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.map((m: { role: string; content: string }) => ({
                role: m.role === 'jerome' ? 'assistant' : m.role,
                content: m.content,
              })),
            ],
            stream: true,
          }),
        });

        if (response.ok) {
          // Stream the response
          const encoder = new TextEncoder();
          const decoder = new TextDecoder();
          
          const stream = new ReadableStream({
            async start(controller) {
              const reader = response.body?.getReader();
              if (!reader) {
                controller.close();
                return;
              }

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  const chunk = decoder.decode(value, { stream: true });
                  const lines = chunk.split('\n');

                  for (const line of lines) {
                    if (line.startsWith('data: ')) {
                      const data = line.slice(6);
                      if (data === '[DONE]') continue;
                      
                      try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                          responseContent += content;
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                      } catch {
                        // Skip malformed JSON
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('Stream error:', error);
              } finally {
                // Log the conversation
                await logConversation(userId, userRole, lastUserMessage?.content, responseContent, Date.now() - startTime);
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
              }
            },
          });

          return new Response(stream, {
            headers: {
              ...corsHeaders,
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          });
        }
      } catch (aiError) {
        console.error('AI API error:', aiError);
      }
    }
    
    // Fallback to quick replies
    const quickReply = lastUserMessage ? findQuickReply(lastUserMessage.content) : null;
    responseContent = quickReply || "I'm here to help with South African tax and accounting questions! You can ask me about VAT treatments, PAYE deadlines, tax brackets, and more. What would you like to know?";
    
    // Log the conversation
    await logConversation(userId, userRole, lastUserMessage?.content, responseContent, Date.now() - startTime);
    
    // Return non-streaming response
    return new Response(
      JSON.stringify({ content: responseContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Jerome chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function logConversation(userId: string | null, userRole: string | null, userMessage: string | undefined, jeromeResponse: string, responseTimeMs: number) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey && jeromeResponse && userMessage) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('jerome_chat_logs').insert({
        user_id: userId || null,
        user_role: userRole || null,
        user_message: userMessage,
        jerome_response: jeromeResponse,
        response_time_ms: responseTimeMs,
      });
    }
  } catch (logError) {
    console.error('Failed to log conversation:', logError);
  }
}
