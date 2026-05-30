import React, { useRef, useState } from 'react';
import { Upload, X, Film, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';

interface ProductVideoUploaderProps {
  videoUrl: string | null;
  videoFile: File | null;
  onVideoChange: (file: File | null, url: string | null) => void;
  onRemoveVideo: () => void;
}

export default function ProductVideoUploader({
  videoUrl,
  videoFile,
  onVideoChange,
  onRemoveVideo
}: ProductVideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    // Basic Validation
    const isLt50MB = file.size / 1024 / 1024 < 50;
    if (!isLt50MB) {
      toast.error(`${file.name} is larger than 50MB`);
      return;
    }

    if (!file.type.startsWith('video/')) {
      toast.error('Only video files are allowed');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onVideoChange(file, previewUrl);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    if (videoFile && videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    onRemoveVideo();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 rounded-xl">
            <Film className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Product Video</h3>
            <p className="text-xs text-slate-500 font-medium">Add a video showcase (Max 1)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <AlertCircle className="h-3 w-3" />
          <span>Standards: MP4/WebM • &lt;50MB</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(!videoUrl && !videoFile) ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group",
              "hover:border-primary/40 hover:bg-primary/5",
              isDragging ? "border-primary bg-primary/5 scale-[0.98]" : "border-slate-200"
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden" 
            />
            <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
              <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary" />
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary">Upload Video</span>
              <span className="text-[8px] text-slate-300 font-medium">MP4, WebM, MOV</span>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary ring-4 ring-primary/10 shadow-xl group transition-all duration-500">
            <video 
              src={videoUrl!} 
              className="h-full w-full object-cover"
              controls
              muted
            />
            
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                onClick={handleRemove}
                className="h-10 w-10 rounded-xl bg-red-500/80 backdrop-blur-md text-white hover:bg-red-600 hover:text-white shadow-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
