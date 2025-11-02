'use client';

import { useState, useCallback } from 'react';
import { Upload, Link as LinkIcon, Loader2, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { duration, easing } from '@/lib/animations/variants';
import Image from 'next/image';

interface ChartUploaderProps {
  onImageSelect: (imageUrl: string, file?: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function ChartUploader({
  onImageSelect,
  onRemove,
  disabled = false,
}: ChartUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setIsLoading(true);

      try {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setPreviewUrl(url);
          onImageSelect(url, file);
          setIsLoading(false);
          // Show success animation briefly
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 2000);
        };
        reader.onerror = () => {
          setError('Failed to read file');
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Failed to process image');
        setIsLoading(false);
      }
    },
    [onImageSelect]
  );

  const handleUrlSubmit = useCallback(() => {
    setError(null);

    if (!urlInput.trim()) {
      setError('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setPreviewUrl(urlInput);
    onImageSelect(urlInput);
    setIsLoading(false);
    // Show success animation briefly
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2000);
  }, [urlInput, onImageSelect]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setUrlInput('');
    setError(null);
    setUploadSuccess(false);
    onRemove?.();
  }, [onRemove]);

  if (previewUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: duration.normal,
          ease: easing.smooth,
        }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <motion.div
                className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: duration.slow,
                  ease: easing.smooth,
                  delay: 0.1,
                }}
              >
                <Image
                  src={previewUrl}
                  alt="Chart preview"
                  fill
                  className="object-contain"
                />
              </motion.div>

              {/* Success indicator */}
              <AnimatePresence>
                {uploadSuccess && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: duration.fast,
                      ease: easing.smooth,
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <p className="text-sm font-medium">Upload successful!</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={disabled}
                animated
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <motion.div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer relative overflow-hidden',
                isDragging
                  ? 'border-primary'
                  : 'border-muted-foreground/25',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              animate={{
                borderColor: isDragging
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--muted-foreground) / 0.25)',
                scale: isDragging ? 1.02 : 1,
              }}
              whileHover={!disabled ? { borderColor: 'hsl(var(--muted-foreground) / 0.5)' } : {}}
              transition={{
                duration: duration.fast,
                ease: easing.smooth,
              }}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => {
                if (!disabled) {
                  document.getElementById('file-input')?.click();
                }
              }}
            >
              {/* Animated background glow when dragging */}
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    className="absolute inset-0 bg-primary/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </AnimatePresence>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                disabled={disabled}
              />

              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        duration: duration.fast,
                        ease: easing.smooth,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <Loader2 className="h-12 w-12 text-primary" />
                      </motion.div>
                      <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="text-sm text-muted-foreground font-medium"
                      >
                        Processing image...
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: duration.normal,
                        ease: easing.smooth,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={
                          isDragging
                            ? { y: [-2, 2, -2] }
                            : {}
                        }
                        transition={
                          isDragging
                            ? {
                                duration: 0.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }
                            : {}
                        }
                      >
                        <Upload
                          className={cn(
                            'h-12 w-12 transition-colors duration-150',
                            isDragging ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium">
                          Drop your chart image here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports PNG, JPG, WebP (max 10MB)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://example.com/chart.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUrlSubmit();
                  }}
                  className="pl-9"
                  disabled={disabled || isLoading}
                />
              </div>
              <Button
                onClick={handleUrlSubmit}
                disabled={disabled || isLoading || !urlInput.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Load'
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Paste a direct link to a chart image from TradingView, Imgur, or
              any public URL
            </p>
          </TabsContent>
        </Tabs>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{
                duration: duration.normal,
                ease: easing.smooth,
              }}
              className="mt-4 overflow-hidden"
            >
              <motion.div
                initial={{ x: -4 }}
                animate={{ x: [0, -4, 4, -4, 4, 0] }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                }}
                className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium"
              >
                {error}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
