'use client';

import { useState, useEffect } from 'react';
import { ChartUploader } from '@/components/analysis/chart-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Crown } from 'lucide-react';
import { analyzeChart, uploadChartImage, getUserAnalysisUsage } from '@/actions/analysis';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AnalyzePage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [usageInfo, setUsageInfo] = useState<any>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);

  useEffect(() => {
    // Load user usage info
    const loadUsage = async () => {
      const result = await getUserAnalysisUsage();
      if (result.success) {
        setUsageInfo(result);
      }
      setIsLoadingUsage(false);
    };
    loadUsage();
  }, []);

  const handleImageSelect = (url: string, file?: File) => {
    setImageUrl(url);
    setImageFile(file || null);
  };

  const handleRemove = () => {
    setImageUrl(null);
    setImageFile(null);
  };

  const handleAnalyze = async () => {
    if (!imageUrl) {
      toast.error('Please select a chart image first');
      return;
    }

    setIsAnalyzing(true);

    try {
      let finalImageUrl = imageUrl;

      // If user uploaded a file (not a URL), upload it first
      if (imageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResult = await uploadChartImage(formData);

        if (uploadResult.error) {
          toast.error(uploadResult.error);
          setIsAnalyzing(false);
          setIsUploading(false);
          return;
        }

        finalImageUrl = uploadResult.url!;
        setIsUploading(false);
      }

      // Perform analysis
      const formData = new FormData();
      formData.append('imageUrl', finalImageUrl);
      if (context.trim()) {
        formData.append('context', context.trim());
      }

      const result = await analyzeChart(formData);

      if (result.error) {
        toast.error(result.error);
        // Reload usage to check if limit was reached
        const usageResult = await getUserAnalysisUsage();
        if (usageResult.success) {
          setUsageInfo(usageResult);
        }
      } else if (result.success) {
        toast.success('Analysis complete!');
        // Reload usage after successful analysis
        const usageResult = await getUserAnalysisUsage();
        if (usageResult.success) {
          setUsageInfo(usageResult);
        }
        router.push(`/analysis/${result.analysisId}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analyze Chart</h1>
        <p className="text-muted-foreground">
          Upload your trading chart and get instant AI-powered Smart Money
          Concepts analysis
        </p>
      </div>

      <div className="space-y-6">
        {/* Chart Uploader */}
        <ChartUploader
          onImageSelect={handleImageSelect}
          onRemove={handleRemove}
          disabled={isAnalyzing || isUploading}
        />

        {/* Additional Context */}
        {imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Context (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional context about the chart (e.g., timeframe, pair, specific questions)..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                disabled={isAnalyzing || isUploading}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Providing context helps the AI give more tailored analysis
              </p>
            </CardContent>
          </Card>
        )}

        {/* Analyze Button or Upgrade Button */}
        {imageUrl && (
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              {!isLoadingUsage && usageInfo?.hasReachedLimit ? (
                <>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Crown className="mr-2 h-5 w-5" />
                      Upgrade to Pro for Unlimited Analyses
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    You've reached your monthly limit of {usageInfo.limit} analyses
                  </p>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || isUploading || isLoadingUsage}
                    size="lg"
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading...
                      </>
                    ) : isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Chart...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Analyze with AI
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    {usageInfo && usageInfo.tier === 'free' && !usageInfo.hasReachedLimit ? (
                      `${usageInfo.remaining} of ${usageInfo.limit} analyses remaining this month`
                    ) : (
                      'Analysis typically takes 10-30 seconds'
                    )}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>What You'll Get</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Market Structure Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Trend direction, Break of Structure (BOS), and Change of
                  Character (CHoCH) identification
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Order Blocks & FVGs</p>
                <p className="text-sm text-muted-foreground">
                  Bullish and bearish order blocks, fair value gaps, and their
                  strength ratings
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Liquidity Zones</p>
                <p className="text-sm text-muted-foreground">
                  Buy-side and sell-side liquidity identification with sweep
                  analysis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <p className="font-medium">Trade Setup Recommendation</p>
                <p className="text-sm text-muted-foreground">
                  Entry, stop loss, take profit levels, and risk-reward ratio
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                5
              </div>
              <div>
                <p className="font-medium">Educational Insights</p>
                <p className="text-sm text-muted-foreground">
                  Learn SMC concepts with detailed explanations and market
                  narratives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
