'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Sparkles, Send, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TradingTip {
  title: string;
  content: string;
  category: string;
  difficulty: string;
  actionable: boolean;
}

export default function AdminTipsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [tip, setTip] = useState<TradingTip | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [sendResult, setSendResult] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSendResult(null);

    try {
      const response = await fetch('/api/admin/tips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category || undefined,
          difficulty: difficulty || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tip');
      }

      setTip(data.tip);
      setCustomTitle(data.tip.title);
      setCustomContent(data.tip.content);
      toast.success('Trading tip generated successfully!');
    } catch (error: any) {
      console.error('Error generating tip:', error);
      toast.error(error.message || 'Failed to generate tip');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    const tipToSend = customContent || tip?.content;
    const titleToSend = customTitle || tip?.title;

    if (!tipToSend) {
      toast.error('Please generate or enter a tip first');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/admin/tips/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tip: tipToSend,
          title: titleToSend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send tip');
      }

      setSendResult(data);
      toast.success(`Tip sent to ${data.usersTargeted} users! ✅`);

      // Clear the form after successful send
      setTimeout(() => {
        setTip(null);
        setCustomTitle('');
        setCustomContent('');
        setSendResult(null);
      }, 5000);
    } catch (error: any) {
      console.error('Error sending tip:', error);
      toast.error(error.message || 'Failed to send tip');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trading Tips Manager</h1>
        <p className="text-muted-foreground">
          Generate AI-powered trading tips and send them to users via push notifications
        </p>
      </div>

      <div className="grid gap-6">
        {/* Generation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate Trading Tip
            </CardTitle>
            <CardDescription>
              Use AI to generate a professional trading tip based on Smart Money Concepts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Any category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any category</SelectItem>
                    <SelectItem value="risk_management">Risk Management</SelectItem>
                    <SelectItem value="technical_analysis">Technical Analysis</SelectItem>
                    <SelectItem value="psychology">Trading Psychology</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="market_structure">Market Structure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty (Optional)</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any level</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Tip
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated/Custom Tip */}
        <Card>
          <CardHeader>
            <CardTitle>Tip Content</CardTitle>
            <CardDescription>
              Review and edit the tip before sending. You can also write your own tip.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tip && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">
                  {tip.category.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {tip.difficulty}
                </Badge>
                {tip.actionable && (
                  <Badge variant="default">Actionable</Badge>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter tip title..."
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {customTitle.length}/50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="Enter tip content... You can edit the AI-generated tip or write your own."
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {customContent.length}/200 characters
              </p>
            </div>

            {tip && (
              <Button
                onClick={handleGenerate}
                variant="outline"
                size="sm"
                disabled={isGenerating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New Tip
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Send to Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send to Users
            </CardTitle>
            <CardDescription>
              Send this tip as a push notification to all users who have enabled daily tips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-sm font-medium">Before sending:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Only users with daily tips enabled will receive this</li>
                <li>Users must have granted push notification permission</li>
                <li>Notifications are sent immediately</li>
                <li>Users can disable tips in their settings</li>
              </ul>
            </div>

            {sendResult && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                  ✅ Tip sent successfully!
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Targeted: {sendResult.usersTargeted} users</p>
                  <p>• Successfully sent: {sendResult.totalSuccess} notifications</p>
                  {sendResult.totalFailed > 0 && (
                    <p className="text-yellow-600 dark:text-yellow-400">
                      • Failed: {sendResult.totalFailed} notifications
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={handleSend}
              disabled={isSending || (!customContent && !tip)}
              className="w-full"
              size="lg"
              variant="default"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending to all users...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Push Notification
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
