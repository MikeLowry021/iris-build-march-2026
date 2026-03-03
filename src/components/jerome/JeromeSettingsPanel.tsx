import { useJerome } from '@/contexts/JeromeContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  GraduationCap, 
  PenTool, 
  Mail, 
  Clock,
  Mic,
} from 'lucide-react';

export function JeromeSettingsPanel() {
  const { settings, updateSettings, isVoiceEnabled, setIsVoiceEnabled } = useJerome();

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-3">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Iris AI Settings
          </h3>
          <p className="text-xs text-muted-foreground">
            Customize how Iris AI assists you
          </p>
        </div>

        {/* Notification Frequency */}
        <Card>
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Notification Frequency</CardTitle>
            </div>
            <CardDescription className="text-xs">
              How often should Iris AI notify you?
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <RadioGroup
              value={settings.notificationFrequency}
              onValueChange={(value) => 
                updateSettings({ 
                  notificationFrequency: value as 'every-action' | 'daily-digest' | 'weekly-digest' 
                })
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="every-action" id="every-action" />
                <Label htmlFor="every-action" className="text-sm">Every action</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily-digest" id="daily-digest" />
                <Label htmlFor="daily-digest" className="text-sm">Daily digest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly-digest" id="weekly-digest" />
                <Label htmlFor="weekly-digest" className="text-sm">Weekly digest</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Guidance Level */}
        <Card>
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Guidance Level</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Adjust the complexity of tips and guidance
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <RadioGroup
              value={settings.guidanceLevel}
              onValueChange={(value) => 
                updateSettings({ 
                  guidanceLevel: value as 'beginner' | 'intermediate' | 'advanced' 
                })
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="text-sm">Beginner - More detailed explanations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="text-sm">Intermediate - Balanced guidance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="text-sm">Advanced - Minimal guidance</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Auto-Sign */}
        <Card>
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-2">
              <PenTool className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Auto-Sign</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Allow Iris AI to automatically sign documents when all conditions are met
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-sign" className="text-sm">
                Enable auto-sign
              </Label>
              <Switch
                id="auto-sign"
                checked={settings.autoSignEnabled}
                onCheckedChange={(checked) => updateSettings({ autoSignEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Email Notifications</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Receive email updates from Iris AI
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif" className="text-sm">
                Enable email notifications
              </Label>
              <Switch
                id="email-notif"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSettings({ emailNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferred Contact Time */}
        <Card>
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Preferred Contact Time</CardTitle>
            </div>
            <CardDescription className="text-xs">
              When should Iris AI send digest notifications?
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <RadioGroup
              value={settings.preferredContactTime}
              onValueChange={(value) => 
                updateSettings({ 
                  preferredContactTime: value as 'morning' | 'afternoon' | 'evening' 
                })
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="morning" />
                <Label htmlFor="morning" className="text-sm">Morning (8:00 AM)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="afternoon" id="afternoon" />
                <Label htmlFor="afternoon" className="text-sm">Afternoon (2:00 PM)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="evening" />
                <Label htmlFor="evening" className="text-sm">Evening (6:00 PM)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Voice Features */}
        <Card>
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Voice Features</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Enable voice input and text-to-speech (requires API key)
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-enabled" className="text-sm">
                Enable voice features
              </Label>
              <Switch
                id="voice-enabled"
                checked={isVoiceEnabled}
                onCheckedChange={setIsVoiceEnabled}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
