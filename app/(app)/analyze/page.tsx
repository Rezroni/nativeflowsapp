'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, Crown, Camera, Upload, X } from 'lucide-react';
import { analyzeChart, uploadChartImage, getUserAnalysisUsage } from '@/actions/analysis';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Analytics } from '@/lib/analytics/mixpanel';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AnalyzePage() {
  const t = useTranslations('analysis');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [usageInfo, setUsageInfo] = useState<any>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const result = await getUserAnalysisUsage();
        if (result.success) {
          setUsageInfo(result);
        }
      } catch (error) {
        console.error('Error loading usage:', error);
      } finally {
        setIsLoadingUsage(false);
      }
    };
    loadUsage();
  }, []);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    try {
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImageUrl(url);
        setImageFile(file);
        Analytics.chartUploaded('file');
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process image');
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    setImageFile(null);
    setContext('');
  };

  const handleAnalyze = async () => {
    if (!imageUrl) {
      toast.error(t('errors.selectImage'));
      return;
    }

    setIsAnalyzing(true);
    const startTime = Date.now();
    Analytics.analysisStarted();

    try {
      let finalImageUrl = imageUrl;

      // Upload file if it's a local file
      if (imageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResult = await uploadChartImage(formData);
        setIsUploading(false);

        if (uploadResult.error) {
          toast.error(uploadResult.error);
          Analytics.analysisFailed(uploadResult.error);
          setIsAnalyzing(false);
          return;
        }

        finalImageUrl = uploadResult.url!;
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

        // Reload usage
        const usageResult = await getUserAnalysisUsage();
        if (usageResult.success) {
          setUsageInfo(usageResult);
        }
      } else if (result.success) {
        toast.success(t('errors.analysisComplete'));
        const duration = (Date.now() - startTime) / 1000;
        Analytics.analysisCompleted(duration);

        // Reload usage
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Image Upload/Preview */}
      <div className="px-4 pb-4">
        {!imageUrl ? (
          <div className="space-y-3">
            {/* Camera Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isAnalyzing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl p-6 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-lg font-bold mb-1">Take Photo</div>
                  <div className="text-sm opacity-90">Use your camera</div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Camera className="h-6 w-6" />
                </div>
              </div>
            </button>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="w-full bg-card/50 backdrop-blur-sm border hover:border-primary/50 rounded-2xl p-6 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-lg font-bold mb-1">Upload Image</div>
                  <div className="text-sm text-muted-foreground">From gallery or files</div>
                </div>
                <div className="bg-primary/10 rounded-full p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
              </div>
            </button>

            {/* Hidden inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>
        ) : (
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-4">
              <Image
                src={imageUrl}
                alt="Chart preview"
                fill
                className="object-contain"
              />
              <button
                onClick={handleRemove}
                disabled={isAnalyzing || isUploading}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-all active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Context Input */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                {t('additionalContext')} <span className="text-muted-foreground">(Optional)</span>
              </label>
              <textarea
                placeholder={t('contextPlaceholder')}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
                disabled={isAnalyzing || isUploading}
                className="w-full px-3 py-2 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('contextHelp')}
              </p>
            </div>

            {/* Analyze Button */}
            {!isLoadingUsage && usageInfo?.hasReachedLimit ? (
              <Link href="/pricing" className="block">
                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-2xl p-4 transition-all active:scale-[0.98] font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="h-5 w-5" />
                    <span>{t('upgradeForUnlimited')}</span>
                  </div>
                </button>
              </Link>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || isUploading || isLoadingUsage}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl p-4 transition-all active:scale-[0.98] font-semibold disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t('uploading')}</span>
                  </div>
                ) : isAnalyzing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t('analyzingChart')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span>{t('analyzeWithAI')}</span>
                  </div>
                )}
              </button>
            )}

            {/* Usage Info */}
            <p className="text-xs text-center text-muted-foreground mt-3">
              {usageInfo && usageInfo.tier === 'free' && !usageInfo.hasReachedLimit ? (
                t('analysesRemaining', { remaining: usageInfo.remaining, limit: usageInfo.limit })
              ) : (
                t('analysisTakesTime')
              )}
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      {!imageUrl && (
        <div className="px-4 pb-6">
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4">
            <h2 className="text-lg font-semibold mb-3">{t('whatYouGet')}</h2>
            <div className="space-y-3">
              {[
                { num: 1, key: 'marketStructure' },
                { num: 2, key: 'orderBlocks' },
                { num: 3, key: 'liquidity' },
                { num: 4, key: 'tradeSetup' },
                { num: 5, key: 'educational' },
              ].map((item) => (
                <div key={item.num} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    {item.num}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t(`features.${item.key}.title`)}</p>
                    <p className="text-xs text-muted-foreground">{t(`features.${item.key}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
