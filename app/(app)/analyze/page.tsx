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
import { Analytics } from '@/lib/analytics/mixpanel';
import { useTranslations } from 'next-intl';

export default function AnalyzePage() {
  const t = useTranslations('analysis');
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
    // Track chart upload
    Analytics.chartUploaded(file ? 'file' : 'url');
  };

  const handleRemove = () => {
    setImageUrl(null);
    setImageFile(null);
  };

  const handleAnalyze = async () => {
    if (!imageUrl) {
      toast.error(t('errors.selectImage'));
      return;
    }

    setIsAnalyzing(true);
    const startTime = Date.now();

    // Track analysis started
    Analytics.analysisStarted();

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
          Analytics.analysisFailed(uploadResult.error);
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
        Analytics.analysisFailed(result.error);
        // Reload usage to check if limit was reached
        const usageResult = await getUserAnalysisUsage();
        if (usageResult.success) {
          setUsageInfo(usageResult);
        }
      } else if (result.success) {
        toast.success(t('errors.analysisComplete'));

        // Track analysis completed
        const duration = (Date.now() - startTime) / 1000; // in seconds
        Analytics.analysisCompleted(duration);

        // Reload usage after successful analysis
        const usageResult = await getUserAnalysisUsage();
        if (usageResult.success) {
          setUsageInfo(usageResult);
        }
        router.push(`/analysis/${result.analysisId}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('errors.unexpectedError'));
      Analytics.analysisFailed('Unexpected error');
    } finally {
      setIsAnalyzing(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
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
              <CardTitle>{t('additionalContext')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t('contextPlaceholder')}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                disabled={isAnalyzing || isUploading}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {t('contextHelp')}
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
                  <Link href="/pricing" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 min-h-[56px] text-base sm:text-lg"
                    >
                      <Crown className="mr-2 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{t('upgradeForUnlimited')}</span>
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    {t('reachedLimit', { limit: usageInfo.limit })}
                  </p>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || isUploading || isLoadingUsage}
                    size="lg"
                    className="w-full min-h-[56px] text-base sm:text-lg"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin flex-shrink-0" />
                        <span>{t('uploading')}</span>
                      </>
                    ) : isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin flex-shrink-0" />
                        <span>{t('analyzingChart')}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span>{t('analyzeWithAI')}</span>
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    {usageInfo && usageInfo.tier === 'free' && !usageInfo.hasReachedLimit ? (
                      t('analysesRemaining', { remaining: usageInfo.remaining, limit: usageInfo.limit })
                    ) : (
                      t('analysisTakesTime')
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
            <CardTitle>{t('whatYouGet')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">{t('features.marketStructure.title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('features.marketStructure.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">{t('features.orderBlocks.title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('features.orderBlocks.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">{t('features.liquidity.title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('features.liquidity.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <p className="font-medium">{t('features.tradeSetup.title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('features.tradeSetup.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                5
              </div>
              <div>
                <p className="font-medium">{t('features.educational.title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('features.educational.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
