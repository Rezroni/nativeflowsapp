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

    console.log('[AnalyzePage] ========== FILE SELECTED ==========');
    console.log('[AnalyzePage] File:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeKB: Math.round(file.size / 1024),
      lastModified: file.lastModified,
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[AnalyzePage] Invalid file type:', file.type);
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB limit for original)
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
      console.log('[AnalyzePage] Processing image...');

      // Import compression utility dynamically
      const { compressImageToDataURL } = await import('@/lib/utils/image-compression');

      // Compress image before creating data URL
      // This dramatically reduces size for camera photos (typically 70-90% reduction)
      console.log('[AnalyzePage] Compressing image...');
      const compressedDataUrl = await compressImageToDataURL(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85, // 85% quality maintains chart readability
        mimeType: 'image/jpeg',
      });

      console.log('[AnalyzePage] ✓ Compression complete');
      console.log('[AnalyzePage] Compressed data URL length:', compressedDataUrl.length);
      console.log('[AnalyzePage] Estimated compressed size:', Math.round(compressedDataUrl.length / 1024), 'KB');

      setImageUrl(compressedDataUrl);
      setImageFile(file); // Keep original file reference
      Analytics.chartUploaded('file');

      toast.success('Image loaded successfully');
    } catch (error) {
      console.error('[AnalyzePage] ❌ Error processing file:', error);
      if (error instanceof Error) {
        console.error('[AnalyzePage] Error message:', error.message);
      }
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
      // IMPORTANT: Prioritize data URL upload (more reliable for mobile camera)
      if (imageUrl && imageUrl.startsWith('data:image/')) {
        console.log('[AnalyzePage] ========== DATA URL UPLOAD FLOW ==========');
        console.log('[AnalyzePage] Detected data URL - using direct upload method');
        console.log('[AnalyzePage] Data URL length:', imageUrl.length, 'characters');
        console.log('[AnalyzePage] Estimated size:', Math.round(imageUrl.length / 1024), 'KB');

        setAnalysisStage('uploading');
        setIsUploading(true);

        // Client-side validation before sending to server
        if (imageUrl.length < 100) {
          console.error('[AnalyzePage] Data URL too short - likely corrupted');
          setAnalysisError('Image data corrupted');
          toast.error('Image data is corrupted. Please take the photo again.');
          setIsAnalyzing(false);
          setIsUploading(false);
          return;
        }

        // Check if data URL is extremely large (might timeout)
        const maxDataUrlSize = 15 * 1024 * 1024; // 15MB in base64
        if (imageUrl.length > maxDataUrlSize) {
          console.error('[AnalyzePage] Data URL too large:', imageUrl.length);
          setAnalysisError('Image too large');
          toast.error('Image is too large. Please reduce quality and try again.');
          setIsAnalyzing(false);
          setIsUploading(false);
          return;
        }

        try {
          // Simulate minimum time for better UX (users can see the progress)
          await new Promise(resolve => setTimeout(resolve, 500));

          console.log('[AnalyzePage] Calling uploadChartImageFromDataUrl...');
          console.log('[AnalyzePage] Timestamp:', new Date().toISOString());

          const uploadResult = await uploadChartImageFromDataUrl(imageUrl);

          console.log('[AnalyzePage] Upload function returned');
          console.log('[AnalyzePage] Result:', uploadResult ? JSON.stringify(uploadResult, null, 2) : 'null');

          setIsUploading(false);

          if (!uploadResult) {
            console.error('[AnalyzePage] ✗ No upload result returned');
            setAnalysisError('Upload failed: No result');
            toast.error('Upload failed. Please try again.');
            Analytics.analysisFailed('No upload result');
            setIsAnalyzing(false);
            return;
          }

          if (uploadResult.error) {
            console.error('[AnalyzePage] ✗ Upload failed with error:', uploadResult.error);
            setAnalysisError(uploadResult.error);
            toast.error(uploadResult.error);
            Analytics.analysisFailed(uploadResult.error);
            setIsAnalyzing(false);
            return;
          }

          if (!uploadResult.url) {
            console.error('[AnalyzePage] ✗ Upload succeeded but no URL returned');
            setAnalysisError('Upload failed: No URL returned');
            toast.error('Upload failed. Please try again.');
            Analytics.analysisFailed('No URL returned from upload');
            setIsAnalyzing(false);
            return;
          }

          finalImageUrl = uploadResult.url;
          console.log('[AnalyzePage] ✓ Upload successful!');
          console.log('[AnalyzePage] Public URL:', finalImageUrl);
        } catch (uploadError) {
          console.error('[AnalyzePage] ❌ Exception during data URL upload:', uploadError);

          // Log detailed error information
          if (uploadError instanceof Error) {
            console.error('[AnalyzePage] Error name:', uploadError.name);
            console.error('[AnalyzePage] Error message:', uploadError.message);
            console.error('[AnalyzePage] Error stack:', uploadError.stack);
          }

          setAnalysisError('Upload failed with exception');
          toast.error('Upload failed. Please check your connection and try again.');
          Analytics.analysisFailed('Upload exception');
          setIsAnalyzing(false);
          setIsUploading(false);
          return;
        }
      }
      // Fallback: Use FormData upload for file objects (when not a data URL)
      else if (imageFile) {
        console.log('[AnalyzePage] Using FormData upload method');
        setAnalysisStage('uploading');
        setIsUploading(true);

        try {
          // Simulate minimum time for better UX (users can see the progress)
          await new Promise(resolve => setTimeout(resolve, 500));

          let uploadResult;

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
