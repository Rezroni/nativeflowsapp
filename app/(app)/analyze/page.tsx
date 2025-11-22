'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Crown, Camera, Upload, X } from 'lucide-react';
import { analyzeChart, uploadChartImage, uploadChartImageFromDataUrl, getUserAnalysisUsage } from '@/actions/analysis';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Analytics } from '@/lib/analytics/mixpanel';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { AnalysisProgress, type AnalysisStage } from '@/components/analysis/analysis-progress';

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
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('uploading');
  const [analysisError, setAnalysisError] = useState<string | undefined>();

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
    if (!file) {
      console.error('[AnalyzePage] No file provided');
      return;
    }

    console.log('[AnalyzePage] File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[AnalyzePage] Invalid file type:', file.type);
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.error('[AnalyzePage] File too large:', file.size);
      toast.error('Image size must be less than 10MB');
      return;
    }

    // Check for corrupted or empty files
    if (file.size === 0) {
      console.error('[AnalyzePage] Empty file');
      toast.error('The selected file is empty. Please try again.');
      return;
    }

    try {
      console.log('[AnalyzePage] Creating preview URL...');
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        console.log('[AnalyzePage] Preview URL created, length:', url.length);
        setImageUrl(url);
        setImageFile(file);
        Analytics.chartUploaded('file');
      };
      reader.onerror = (error) => {
        console.error('[AnalyzePage] FileReader error:', error);
        toast.error('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('[AnalyzePage] Error processing file:', error);
      toast.error('Failed to process image. Please try again.');
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
    setAnalysisError(undefined);
    const startTime = Date.now();
    Analytics.analysisStarted();

    try {
      let finalImageUrl = imageUrl;

      // Stage 1: Upload file if it's a local file or data URL
      if (imageFile || (imageUrl && imageUrl.startsWith('data:image/'))) {
        setAnalysisStage('uploading');
        setIsUploading(true);

        try {
          // Simulate minimum time for better UX (users can see the progress)
          await new Promise(resolve => setTimeout(resolve, 500));

          let uploadResult;

          // Use data URL upload for camera photos (more reliable on mobile)
          if (imageUrl && imageUrl.startsWith('data:image/')) {
            console.log('[AnalyzePage] Uploading from data URL (camera photo)');
            console.log('[AnalyzePage] Data URL length:', imageUrl.length);

            uploadResult = await uploadChartImageFromDataUrl(imageUrl);
            console.log('[AnalyzePage] Data URL upload result:', uploadResult);
          }
          // Use FormData upload for file objects
          else if (imageFile) {
            console.log('[AnalyzePage] Uploading from File object');
            console.log('[AnalyzePage] File details:', {
              name: imageFile.name,
              type: imageFile.type,
              size: imageFile.size,
            });

            const formData = new FormData();
            formData.append('file', imageFile, imageFile.name);

            console.log('[AnalyzePage] FormData created, calling uploadChartImage...');
            uploadResult = await uploadChartImage(formData);
            console.log('[AnalyzePage] FormData upload result:', uploadResult);
          }

          setIsUploading(false);

          if (!uploadResult) {
            console.error('[AnalyzePage] No upload result');
            setAnalysisError('Upload failed: No result');
            toast.error('Upload failed. Please try again.');
            Analytics.analysisFailed('No upload result');
            setIsAnalyzing(false);
            return;
          }

          if (uploadResult.error) {
            console.error('[AnalyzePage] Upload failed:', uploadResult.error);
            setAnalysisError(uploadResult.error);
            toast.error(uploadResult.error);
            Analytics.analysisFailed(uploadResult.error);
            setIsAnalyzing(false);
            return;
          }

          if (!uploadResult.url) {
            console.error('[AnalyzePage] Upload succeeded but no URL returned');
            setAnalysisError('Upload failed: No URL returned');
            toast.error('Upload failed. Please try again.');
            Analytics.analysisFailed('No URL returned from upload');
            setIsAnalyzing(false);
            return;
          }

          finalImageUrl = uploadResult.url;
          console.log('[AnalyzePage] Upload successful, URL:', finalImageUrl.substring(0, 100) + '...');
        } catch (uploadError) {
          console.error('[AnalyzePage] Exception during upload:', uploadError);
          setAnalysisError('Upload failed with exception');
          toast.error('Upload failed. Please try again.');
          Analytics.analysisFailed('Upload exception');
          setIsAnalyzing(false);
          setIsUploading(false);
          return;
        }
      }

      // Stage 2: Processing image (hash generation)
      setAnalysisStage('processing');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Stage 3: Analyzing with AI
      setAnalysisStage('analyzing');

      // Perform analysis
      const formData = new FormData();
      formData.append('imageUrl', finalImageUrl);
      if (context.trim()) {
        formData.append('context', context.trim());
      }

      const result = await analyzeChart(formData);

      // Stage 4: Generating insights
      setAnalysisStage('generating');
      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.error) {
        setAnalysisError(result.error);
        toast.error(result.error);
        Analytics.analysisFailed(result.error);

        // Reload usage
        const usageResult = await getUserAnalysisUsage();
        if (usageResult.success) {
          setUsageInfo(usageResult);
        }
      } else if (result.success) {
        // Stage 5: Complete
        setAnalysisStage('complete');
        await new Promise(resolve => setTimeout(resolve, 800));

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
      const errorMessage = t('errors.unexpectedError');
      setAnalysisError(errorMessage);
      toast.error(errorMessage);
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

            {/* Progress Indicator - Show when analyzing */}
            {isAnalyzing && (
              <div className="mb-4">
                <AnalysisProgress
                  currentStage={analysisStage}
                  error={analysisError}
                  stageLabels={{
                    uploading: t('progress.uploading') || 'Uploading chart',
                    processing: t('progress.processing') || 'Processing image',
                    analyzing: t('progress.analyzing') || 'Analyzing patterns',
                    generating: t('progress.generating') || 'Generating insights',
                    complete: t('progress.complete') || 'Analysis complete',
                  }}
                />
              </div>
            )}

            {/* Context Input - Hide when analyzing */}
            {!isAnalyzing && (
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
            )}

            {/* Analyze Button - Only show when not analyzing */}
            {!isAnalyzing && (
              <>
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
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <span>{t('analyzeWithAI')}</span>
                    </div>
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
              </>
            )}
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
