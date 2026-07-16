import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCw, ZoomIn, X, Trash2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Avatar from '@/components/ui/Avatar';

interface AvatarUploadProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, name }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0); // in degrees
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload JPG, PNG, or WEBP.');
      return false;
    }
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setErrorMsg('Image file size exceeds the 5 MB limit.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setZoom(1);
        setRotate(0);
        setPan({ x: 0, y: 0 });
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setZoom(1);
        setRotate(0);
        setPan({ x: 0, y: 0 });
      }
    }
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!previewUrl) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewUrl) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  const handleRemove = () => {
    onChange('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setZoom(1);
    setRotate(0);
    setPan({ x: 0, y: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyCrop = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output is a fixed square avatar (e.g. 300x300 pixels)
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Draw background color (white fallback)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Center of canvas
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw the image centered with the user's pan coordinates
    const img = imgRef.current;
    
    // Scale image to fit inside the 300px box while maintaining ratio
    const ratio = Math.max(size / img.naturalWidth, size / img.naturalHeight);
    const drawWidth = img.naturalWidth * ratio;
    const drawHeight = img.naturalHeight * ratio;

    // Convert CSS panning in container into canvas coordinates
    // Container size is 256px, we need to map container offsets to the actual canvas drawing scale
    const panRatio = size / 256;
    const drawX = (pan.x * panRatio) / (zoom);
    const drawY = (pan.y * panRatio) / (zoom);

    ctx.drawImage(img, -drawWidth / 2 + drawX, -drawHeight / 2 + drawY, drawWidth, drawHeight);

    // Export to base64 DataURL
    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    onChange(base64);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-[#64748B] font-mono">
          Profile Photo Identity
        </Label>
      </div>

      {errorMsg && (
        <p className="text-xs text-[#EF4444] font-semibold bg-[#FEF2F2] border border-[#FEE2E2] px-3 py-1.5 rounded-lg">
          {errorMsg}
        </p>
      )}

      {/* Primary layout */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
        {/* Left Side: Avatar view / Cropper Canvas */}
        <div className="relative shrink-0 select-none">
          {!previewUrl ? (
            <div className="relative group">
              <Avatar
                src={value}
                name={name}
                sizeClass="w-28 h-28 text-2xl rounded-2xl"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold"
              >
                <Camera className="w-5 h-5" />
                <span>Upload</span>
              </button>
            </div>
          ) : (
            // Interactive Crop Viewport
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-28 h-28 rounded-2xl border-2 border-[#4F46E5] bg-white overflow-hidden relative cursor-move flex items-center justify-center"
            >
              <img
                ref={imgRef}
                src={previewUrl}
                alt="Source preview"
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotate}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
                className="pointer-events-none transition-transform duration-75"
              />
              {/* Circular cropping grid preview */}
              <div className="absolute inset-0 border border-white/40 rounded-2xl pointer-events-none" />
              <div className="absolute inset-1.5 border border-dashed border-white/20 rounded-xl pointer-events-none" />
            </div>
          )}
        </div>

        {/* Right Side: Upload controls or Cropper actions */}
        <div className="flex-1 space-y-3.5 w-full">
          {!previewUrl ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#4F46E5] bg-[#EEF2FF]'
                  : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
              }`}
            >
              <Upload className="w-5 h-5 mx-auto text-[#64748B] mb-2" />
              <p className="text-xs font-bold text-[#111827]">
                Drag and drop your image, or <span className="text-[#4F46E5] hover:underline">browse</span>
              </p>
              <p className="text-[10px] text-[#64748B] mt-1 font-mono">
                PNG, JPG, WEBP (Max 5 MB)
              </p>
            </div>
          ) : (
            // Cropper adjustment toolbar
            <div className="space-y-3 bg-white p-3 rounded-xl border border-[#E2E8F0]">
              <p className="text-[11px] font-bold text-[#111827] flex items-center justify-between">
                <span>Crop, Rotate, and Zoom:</span>
                <span className="text-[10px] text-[#64748B] font-mono">Drag photo to adjust center</span>
              </p>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <ZoomIn className="w-3.5 h-3.5 text-[#64748B]" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                  />
                  <span className="text-[10px] font-mono text-[#64748B] w-8 text-right">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F1F5F9] mt-1">
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRotate}
                      className="h-8 px-2.5 text-xs text-[#64748B] border-[#E2E8F0]"
                    >
                      <RotateCw className="w-3.5 h-3.5 mr-1" />
                      Rotate
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setZoom(1);
                        setRotate(0);
                        setPan({ x: 0, y: 0 });
                      }}
                      className="h-8 px-2 text-xs text-[#64748B]"
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="p-1.5 hover:bg-[#F1F5F9] rounded-lg text-[#64748B]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApplyCrop}
                      className="h-8 text-xs font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                    >
                      Save Crop
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {value && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-[#10B981] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Custom image linked
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-[10px] font-bold text-[#EF4444] hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Remove image
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
