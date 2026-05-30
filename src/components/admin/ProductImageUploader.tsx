import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Eye, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Progress } from '@/src/components/ui/progress';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';

export interface ProductImage {
  id?: string;
  url: string;
  file?: File;
  isNew?: boolean;
  color?: string;
}

interface ProductImageUploaderProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  colors?: string[];
  maxFilesPerColor?: number;
}

export default function ProductImageUploader({ 
  images = [], 
  onImagesChange, 
  colors = [],
  maxFilesPerColor = 4 
}: ProductImageUploaderProps) {
  const [uploadingGroup, setUploadingGroup] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [draggingGroup, setDraggingGroup] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const processFiles = async (files: FileList | File[], targetColor?: string) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    
    // Basic Validation
    const validFiles = filesArray.filter(file => {
      const isLt5MB = file.size / 1024 / 1024 < 5;
      if (!isLt5MB) toast.error(`${file.name} is larger than 5MB`);
      return isLt5MB;
    });

    if (validFiles.length === 0) return;

    // Check limits for this group
    const currentGroupImages = targetColor 
      ? images.filter(img => img.color === targetColor)
      : images.filter(img => !img.color);

    const limit = targetColor ? maxFilesPerColor : 8; // 8 for general

    if (currentGroupImages.length + validFiles.length > limit) {
      toast.error(`Maximum ${limit} images allowed for ${targetColor ? targetColor + ' color' : 'General'}`);
      return;
    }

    setUploadingGroup(targetColor || 'general');
    const newMedia: ProductImage[] = [...images];

    try {
      let completed = 0;
      for (const file of validFiles) {
        // Create local preview URL
        const previewUrl = URL.createObjectURL(file);
        newMedia.push({ 
          url: previewUrl, 
          file: file,
          isNew: true,
          color: targetColor
        });
        
        completed++;
        setProgress((completed / validFiles.length) * 100);
      }
      onImagesChange(newMedia);
      toast.success('Images added to queue');
    } catch (error) {
      console.error("Error during upload process:", error);
      toast.error('An unexpected error occurred during processing');
    } finally {
      setUploadingGroup(null);
      setProgress(0);
      const inputRef = fileInputRefs.current[targetColor || 'general'];
      if (inputRef) inputRef.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, color?: string) => {
    if (e.target.files) processFiles(e.target.files, color);
  };

  const handleDragOver = (e: React.DragEvent, group: string) => {
    e.preventDefault();
    if (!uploadingGroup) setDraggingGroup(group);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingGroup(null);
  };

  const handleDrop = (e: React.DragEvent, group: string, color?: string) => {
    e.preventDefault();
    setDraggingGroup(null);
    if (!uploadingGroup && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files, color);
    }
  };

  const removeImage = (imageToRemove: ProductImage) => {
    if (imageToRemove.isNew && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    const updatedImages = images.filter(img => img !== imageToRemove);
    onImagesChange(updatedImages);
  };

  const renderGroup = (title: string, groupKey: string, groupImages: ProductImage[], color?: string) => {
    const limit = color ? maxFilesPerColor : 8;
    const isFull = groupImages.length >= limit;

    return (
      <div key={groupKey} className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700">{title} <span className="text-xs text-slate-400 font-normal ml-2">({groupImages.length}/{limit})</span></h4>
        </div>

        {uploadingGroup === groupKey && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-slate-100" />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Dropzone */}
          {!isFull && (
            <div 
              onClick={() => {
                const input = fileInputRefs.current[groupKey];
                if (input) input.click();
              }}
              onDragOver={(e) => handleDragOver(e, groupKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, groupKey, color)}
              className={cn(
                "relative aspect-[3/4] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group",
                uploadingGroup ? "opacity-50 cursor-not-allowed" : "hover:border-primary/40 hover:bg-primary/5",
                draggingGroup === groupKey ? "border-primary bg-primary/5 scale-[0.98]" : "border-slate-200"
              )}
            >
              <input 
                type="file" 
                ref={(el) => fileInputRefs.current[groupKey] = el}
                onChange={(e) => handleFileSelect(e, color)}
                multiple 
                accept="image/jpeg,image/png,image/webp"
                className="hidden" 
                disabled={!!uploadingGroup}
              />
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                {uploadingGroup === groupKey ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : (
                  <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                )}
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary">Add Image</span>
              </div>
            </div>
          )}

          {/* Image Previews */}
          {groupImages.map((img, idx) => (
            <div 
              key={img.id || img.url} 
              className={cn(
                "relative aspect-[3/4] rounded-2xl overflow-hidden border group transition-all duration-500",
                (!color && idx === 0) ? "border-primary ring-4 ring-primary/10 shadow-xl" : "border-slate-100"
              )}
            >
              <img 
                src={img.url} 
                alt={`${title} Image ${idx + 1}`} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setPreviewImage(img.url)}
                  className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-primary"
                >
                  <Eye className="h-5 w-5" />
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeImage(img)}
                  className="h-10 w-10 rounded-xl bg-red-500/20 backdrop-blur-md text-white hover:bg-red-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Badges */}
              {(!color && idx === 0) && (
                <div className="absolute top-3 left-3 bg-primary text-white text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg shadow-lg">
                  Main
                </div>
              )}
              {img.isNew && (
                <div className="absolute top-3 right-3 bg-secondary text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                  New
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const generalImages = images.filter(img => !img.color);

  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 rounded-xl">
            <ImageIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Product Media</h3>
            <p className="text-xs text-slate-500 font-medium">Manage your high-resolution lookbook gallery by color</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <AlertCircle className="h-3 w-3" />
          <span>Standards: 3:4 Ratio • &lt;5MB</span>
        </div>
      </div>

      <div className="space-y-10">
        {renderGroup("General Images", "general", generalImages)}

        {colors.map(color => {
          const colorImages = images.filter(img => img.color === color);
          return renderGroup(`${color} Variant`, `color_${color}`, colorImages, color);
        })}
      </div>

      {/* Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X className="h-8 w-8" />
          </button>
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
