'use client';

import { useState, useCallback } from 'react';
import { Upload, Link as LinkIcon, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
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
    onRemove?.();
  }, [onRemove]);

  if (previewUrl) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={previewUrl}
                alt="Chart preview"
                fill
                className="object-contain"
              />
            </div>
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
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
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
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

              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Processing image...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Drop your chart image here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PNG, JPG, WebP (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
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

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
