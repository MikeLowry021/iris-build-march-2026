import { useCallback } from 'react';
import { BalanceSheetData, ProfitLossData, calculateBalanceSheetTotals, calculateProfitLossTotals } from '@/lib/financial-types';
import { formatCurrency } from '@/lib/mock-data';

interface PDFOptions {
  companyName: string;
  financialYear: string;
  balanceSheet?: BalanceSheetData;
  profitLoss?: ProfitLossData;
}

export function useFinancialPDF() {
  const generatePDF = useCallback((options: PDFOptions) => {
    const { companyName, financialYear, balanceSheet, profitLoss } = options;

    // Create printable HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Financial Statements - ${companyName} - ${financialYear}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2121; line-height: 1.5; padding: 40px; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2186A1; padding-bottom: 20px; }
          .header h1 { color: #2186A1; font-size: 24px; margin-bottom: 8px; }
          .header p { color: #5E5240; font-size: 14px; }
          .section { margin-bottom: 40px; }
          .section-title { font-size: 18px; font-weight: 600; color: #2186A1; margin-bottom: 16px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
          .subsection { margin-bottom: 20px; }
          .subsection-title { font-size: 14px; font-weight: 600; color: #5E5240; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
          th { background: #f8f8f6; font-weight: 600; color: #5E5240; }
          td:last-child, th:last-child { text-align: right; }
          .total-row { font-weight: 600; background: #f0f9fa; }
          .grand-total { font-weight: 700; background: #2186A1; color: white; }
          .balance-check { margin-top: 20px; padding: 16px; border-radius: 8px; text-align: center; font-weight: 600; }
          .balanced { background: #d4edda; color: #155724; }
          .unbalanced { background: #f8d7da; color: #721c24; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e5e5e5; padding-top: 20px; }
          @media print { body { padding: 20px; } .page-break { page-break-before: always; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${companyName}</h1>
          <p>Financial Statements for the Year Ended ${financialYear}</p>
          <p>Generated on ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
    `;

    // Balance Sheet Section
    if (balanceSheet) {
      const totals = calculateBalanceSheetTotals(balanceSheet);
      htmlContent += `
        <div class="section">
          <h2 class="section-title">Statement of Financial Position (Balance Sheet)</h2>
          
          <div class="subsection">
            <h3 class="subsection-title">Non-Current Assets</h3>
            <table>
              <tr><td>Property, Plant & Equipment</td><td>${formatCurrency(balanceSheet.nonCurrentAssets.propertyPlantEquipment)}</td></tr>
              <tr><td>Intangible Assets</td><td>${formatCurrency(balanceSheet.nonCurrentAssets.intangibleAssets)}</td></tr>
              <tr><td>Investments</td><td>${formatCurrency(balanceSheet.nonCurrentAssets.investments)}</td></tr>
              <tr><td>Other Non-Current Assets</td><td>${formatCurrency(balanceSheet.nonCurrentAssets.otherNonCurrentAssets)}</td></tr>
              <tr class="total-row"><td>Total Non-Current Assets</td><td>${formatCurrency(totals.totalNonCurrentAssets)}</td></tr>
            </table>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">Current Assets</h3>
            <table>
              <tr><td>Inventory</td><td>${formatCurrency(balanceSheet.currentAssets.inventory)}</td></tr>
              <tr><td>Trade Receivables</td><td>${formatCurrency(balanceSheet.currentAssets.tradeReceivables)}</td></tr>
              <tr><td>Cash & Cash Equivalents</td><td>${formatCurrency(balanceSheet.currentAssets.cashAndEquivalents)}</td></tr>
              <tr><td>Other Current Assets</td><td>${formatCurrency(balanceSheet.currentAssets.otherCurrentAssets)}</td></tr>
              <tr class="total-row"><td>Total Current Assets</td><td>${formatCurrency(totals.totalCurrentAssets)}</td></tr>
            </table>
          </div>

          <table>
            <tr class="grand-total"><td>TOTAL ASSETS</td><td>${formatCurrency(totals.totalAssets)}</td></tr>
          </table>

          <div class="subsection">
            <h3 class="subsection-title">Equity</h3>
            <table>
              <tr><td>Share Capital</td><td>${formatCurrency(balanceSheet.equity.shareCapital)}</td></tr>
              <tr><td>Retained Earnings</td><td>${formatCurrency(balanceSheet.equity.retainedEarnings)}</td></tr>
              <tr><td>Reserves</td><td>${formatCurrency(balanceSheet.equity.reserves)}</td></tr>
              <tr class="total-row"><td>Total Equity</td><td>${formatCurrency(totals.totalEquity)}</td></tr>
            </table>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">Non-Current Liabilities</h3>
            <table>
              <tr><td>Long-Term Loans</td><td>${formatCurrency(balanceSheet.nonCurrentLiabilities.longTermLoans)}</td></tr>
              <tr><td>Deferred Tax</td><td>${formatCurrency(balanceSheet.nonCurrentLiabilities.deferredTax)}</td></tr>
              <tr><td>Other Non-Current Liabilities</td><td>${formatCurrency(balanceSheet.nonCurrentLiabilities.otherNonCurrentLiabilities)}</td></tr>
              <tr class="total-row"><td>Total Non-Current Liabilities</td><td>${formatCurrency(totals.totalNonCurrentLiabilities)}</td></tr>
            </table>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">Current Liabilities</h3>
            <table>
              <tr><td>Trade Payables</td><td>${formatCurrency(balanceSheet.currentLiabilities.tradePayables)}</td></tr>
              <tr><td>Short-Term Loans</td><td>${formatCurrency(balanceSheet.currentLiabilities.shortTermLoans)}</td></tr>
              <tr><td>VAT Payable</td><td>${formatCurrency(balanceSheet.currentLiabilities.vatPayable)}</td></tr>
              <tr><td>Other Current Liabilities</td><td>${formatCurrency(balanceSheet.currentLiabilities.otherCurrentLiabilities)}</td></tr>
              <tr class="total-row"><td>Total Current Liabilities</td><td>${formatCurrency(totals.totalCurrentLiabilities)}</td></tr>
            </table>
          </div>

          <table>
            <tr class="grand-total"><td>TOTAL EQUITY & LIABILITIES</td><td>${formatCurrency(totals.totalEquityAndLiabilities)}</td></tr>
          </table>

          <div class="balance-check ${totals.isBalanced ? 'balanced' : 'unbalanced'}">
            ${totals.isBalanced ? '✓ Balance Sheet is Balanced' : '✗ Balance Sheet is NOT Balanced - Please review entries'}
          </div>
        </div>
      `;
    }

    // Profit & Loss Section
    if (profitLoss) {
      const totals = calculateProfitLossTotals(profitLoss);
      htmlContent += `
        <div class="section ${balanceSheet ? 'page-break' : ''}">
          <h2 class="section-title">Statement of Comprehensive Income (Profit & Loss)</h2>
          
          <div class="subsection">
            <h3 class="subsection-title">Revenue</h3>
            <table>
              <tr><td>Sales Revenue</td><td>${formatCurrency(profitLoss.revenue.salesRevenue)}</td></tr>
              <tr><td>Service Revenue</td><td>${formatCurrency(profitLoss.revenue.serviceRevenue)}</td></tr>
              <tr><td>Other Income</td><td>${formatCurrency(profitLoss.revenue.otherIncome)}</td></tr>
              <tr class="total-row"><td>Total Revenue</td><td>${formatCurrency(totals.totalRevenue)}</td></tr>
            </table>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">Cost of Sales</h3>
            <table>
              <tr><td>Direct Materials</td><td>${formatCurrency(profitLoss.costOfSales.directMaterials)}</td></tr>
              <tr><td>Direct Labor</td><td>${formatCurrency(profitLoss.costOfSales.directLabor)}</td></tr>
              <tr><td>Manufacturing Overhead</td><td>${formatCurrency(profitLoss.costOfSales.manufacturingOverhead)}</td></tr>
              <tr class="total-row"><td>Total Cost of Sales</td><td>${formatCurrency(totals.totalCostOfSales)}</td></tr>
            </table>
          </div>

          <table>
            <tr class="grand-total"><td>GROSS PROFIT</td><td>${formatCurrency(totals.grossProfit)} (${totals.grossProfitMargin.toFixed(1)}%)</td></tr>
          </table>

          <div class="subsection">
            <h3 class="subsection-title">Operating Expenses</h3>
            <table>
              <tr><td>Salaries & Wages</td><td>${formatCurrency(profitLoss.operatingExpenses.salariesWages)}</td></tr>
              <tr><td>Rent & Utilities</td><td>${formatCurrency(profitLoss.operatingExpenses.rentUtilities)}</td></tr>
              <tr><td>Depreciation</td><td>${formatCurrency(profitLoss.operatingExpenses.depreciation)}</td></tr>
              <tr><td>Marketing & Advertising</td><td>${formatCurrency(profitLoss.operatingExpenses.marketing)}</td></tr>
              <tr><td>Professional Fees</td><td>${formatCurrency(profitLoss.operatingExpenses.professional)}</td></tr>
              <tr><td>Insurance</td><td>${formatCurrency(profitLoss.operatingExpenses.insurance)}</td></tr>
              <tr><td>Other Expenses</td><td>${formatCurrency(profitLoss.operatingExpenses.other)}</td></tr>
              <tr class="total-row"><td>Total Operating Expenses</td><td>${formatCurrency(totals.totalOperatingExpenses)}</td></tr>
            </table>
          </div>

          <table>
            <tr class="total-row"><td>OPERATING PROFIT</td><td>${formatCurrency(totals.operatingProfit)} (${totals.operatingMargin.toFixed(1)}%)</td></tr>
          </table>

          <div class="subsection">
            <h3 class="subsection-title">Other Items</h3>
            <table>
              <tr><td>Interest Income</td><td>${formatCurrency(profitLoss.otherItems.interestIncome)}</td></tr>
              <tr><td>Interest Expense</td><td>(${formatCurrency(profitLoss.otherItems.interestExpense)})</td></tr>
              <tr class="total-row"><td>Net Finance ${totals.netInterest >= 0 ? 'Income' : 'Cost'}</td><td>${formatCurrency(totals.netInterest)}</td></tr>
            </table>
          </div>

          <table>
            <tr class="total-row"><td>PROFIT BEFORE TAX</td><td>${formatCurrency(totals.profitBeforeTax)}</td></tr>
            <tr><td>Income Tax Expense</td><td>(${formatCurrency(profitLoss.otherItems.taxExpense)})</td></tr>
            <tr class="grand-total"><td>NET PROFIT</td><td>${formatCurrency(totals.netProfit)} (${totals.netProfitMargin.toFixed(1)}%)</td></tr>
          </table>
        </div>
      `;
    }

    htmlContent += `
        <div class="footer">
          <p>This document was generated by Iris</p>
          <p>For official use, please ensure this document is reviewed and signed by an authorized accountant.</p>
        </div>
      </body>
      </html>
    `;

    // Open print dialog with the generated content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }, []);

  return { generatePDF };
}
