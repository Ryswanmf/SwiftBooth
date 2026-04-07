'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { useRouter } from 'next/navigation';
import { ChevronLeft, RefreshCw, Sparkles, UploadCloud, ArrowDownToLine } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FILTERS = [
  { id: 'none', name: 'Original', class: '' },
  { id: 'grayscale(100%)', name: 'B&W', class: 'grayscale' },
  { id: 'sepia(100%)', name: 'Vintage', class: 'sepia' },
  { id: 'brightness(1.2) contrast(1.1)', name: 'Bright', class: 'brightness-125' },
  { id: 'saturate(1.5)', name: 'Vibrant', class: 'saturate-150' },
  { id: 'hue-rotate(300deg)', name: 'Pinky', class: 'hue-rotate-[300deg]' },
];

export default function PreviewPage() {
  const { photos, setPhotos, selectedFrame, selectedFilter, setSelectedFilter } = usePhotoStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (photos.length === 0 || !selectedFrame) router.push('/');
  }, [photos, selectedFrame, router]);

  if (!selectedFrame || photos.length === 0) return null;

  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (selectedFrame.imagePath) {
      const frameImg = new Image();
      frameImg.src = selectedFrame.imagePath;
      await new Promise((resolve) => {
        frameImg.onload = async () => {
          canvas.width = frameImg.width;
          canvas.height = frameImg.height;
          
          // Default values (will be overridden per frame)
          let slotWidth = canvas.width * 0.385;
          let slotHeight = canvas.height * 0.205;
          let startX = canvas.width * 0.078;
          let startY = canvas.height * 0.11;
          let gapX = canvas.width * 0.46;
          let gapY = canvas.height * 0.282;

          if (selectedFrame.id === 'swift-pink') {
            // Layout for 6 slots (Pixel Polaroid - swift-pink.png)
            slotWidth = canvas.width * 0.375;
            slotHeight = canvas.height * 0.195;
            startX = canvas.width * 0.085;
            startY = canvas.height * 0.105;
            gapX = canvas.width * 0.455;
            gapY = canvas.height * 0.315;
          }

          for (let i = 0; i < photos.length; i++) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const img = new Image();
            img.src = photos[i];
            await new Promise((res) => {
              img.onload = () => {
                ctx.save();
                
                const dx = startX + (col * gapX);
                const dy = startY + (row * gapY);
                
                // 1. Clipping to the slot area
                ctx.beginPath();
                ctx.rect(dx, dy, slotWidth, slotHeight);
                ctx.clip();

                if (selectedFilter !== 'none') {
                  ctx.filter = selectedFilter;
                }

                // 2. TRUE IMAGE COVER LOGIC (Center-Crop)
                const imgRatio = img.width / img.height;
                const slotRatio = slotWidth / slotHeight;
                
                let sx, sy, sw, sh;
                
                if (imgRatio > slotRatio) {
                  // Image is wider than slot
                  sh = img.height;
                  sw = img.height * slotRatio;
                  sx = (img.width - sw) / 2;
                  sy = 0;
                } else {
                  // Image is taller than slot
                  sw = img.width;
                  sh = img.width / slotRatio;
                  sx = 0;
                  sy = (img.height - sh) / 2;
                }

                // 3. Draw cropped image to slot
                ctx.drawImage(img, sx, sy, sw, sh, dx, dy, slotWidth, slotHeight);
                
                ctx.restore();
                res(true);
              };
            });
          }
          ctx.drawImage(frameImg, 0, 0);
          resolve(true);
        };
      });
    } else {
      const padding = 40;
      const imgWidth = 400;
      const imgHeight = 300;
      canvas.width = imgWidth + (padding * 2);
      canvas.height = (imgHeight * 4) + (20 * 3) + (padding * 2) + 100;
      ctx.fillStyle = selectedFrame.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.src = photos[i];
        await new Promise((res) => {
          img.onload = () => {
            ctx.save();
            if (selectedFilter !== 'none') ctx.filter = selectedFilter;
            ctx.drawImage(img, padding, padding + (i * (imgHeight + 20)), imgWidth, imgHeight);
            ctx.restore();
            res(true);
          };
        });
      }
    }
  };

  const handleExport = async (toCloud: boolean) => {
    setIsProcessing(true);
    try {
      await renderCanvas();
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!toCloud || !supabase) {
        const link = document.createElement('a');
        link.download = `swiftboth-${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
        if (toCloud) alert("Supabase not configured. Downloaded locally.");
        return;
      }

      const blob = await (await fetch(canvas.toDataURL('image/jpeg', 0.9))).blob();
      const fileName = `swiftboth-${Date.now()}.jpg`;
      const { error } = await supabase.storage.from('photobooth-images').upload(fileName, blob, { contentType: 'image/jpeg' });
      if (error) throw error;
      router.push(`/result/${fileName}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-[#fff5f7]">
      <header className="w-full max-w-5xl flex items-center justify-between mb-6 md:mb-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-pink-900/60 hover:text-pink-700 text-[10px] font-black uppercase tracking-widest transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-lg font-black italic tracking-tighter text-gradient uppercase">Preview</h1>
        <div className="w-10 md:w-12"></div>
      </header>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
        {/* Frame Preview Container */}
        <div className="w-full max-w-[320px] md:max-w-none md:w-auto mx-auto lg:mx-0 lg:sticky lg:top-10">
          {selectedFrame.imagePath ? (
            <div className="relative w-full max-w-[300px] md:w-[320px] aspect-[2/3] glass rounded-2xl overflow-hidden shadow-2xl border-pink-200 mx-auto">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-x-[7.5%] gap-y-[7.5%] p-[10%] pt-[14%] pb-[18%]">
                {photos.map((src, i) => (
                  <div key={i} className="w-full h-full overflow-hidden rounded-lg bg-pink-100 shadow-inner">
                    <img 
                      src={src} 
                      className="w-full h-full object-cover transition-all duration-300" 
                      style={{ filter: selectedFilter !== 'none' ? selectedFilter : 'none' }}
                      alt="" 
                    />
                  </div>
                ))}
              </div>
              <img src={selectedFrame.imagePath} className="absolute inset-0 z-10 w-full h-full object-fill pointer-events-none" alt="" />
            </div>
          ) : (
            <div className="p-4 shadow-2xl rounded-sm mx-auto" style={{ backgroundColor: selectedFrame.color }}>
              <div className="flex flex-col gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="w-48 md:w-56 aspect-[4/3] bg-pink-100 overflow-hidden">
                    <img 
                      src={src} 
                      className="w-full h-full object-cover" 
                      style={{ filter: selectedFilter !== 'none' ? selectedFilter : 'none' }}
                      alt="" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls Container */}
        <div className="w-full max-w-sm mx-auto space-y-6 md:space-y-8">
          {/* Filter Selector */}
          <div className="glass p-5 md:p-6 rounded-[2rem] border-pink-200 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-pink-900/60 italic">Select Filter</h3>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`flex flex-col items-center gap-2 p-1.5 md:p-2 rounded-2xl transition-all border-2 ${
                    selectedFilter === f.id ? 'border-pink-500 bg-pink-100 shadow-sm' : 'border-transparent bg-pink-50/50 hover:bg-pink-50'
                  }`}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-pink-200 overflow-hidden ${f.class}`}>
                    <img src={photos[0]} className="w-full h-full object-cover scale-150" alt="" />
                  </div>
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-pink-900/80">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="glass p-6 md:p-8 rounded-[2.5rem] space-y-6 border-pink-200 shadow-xl shadow-pink-900/5">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-200 text-pink-700 text-[8px] font-black uppercase tracking-widest border border-pink-300">
                <Sparkles className="w-3 h-3 fill-pink-600" /> Final Step
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#2d1621]">Looks Great!</h2>
              <p className="text-[#4a2c3a] text-xs font-bold leading-relaxed">
                Choose your export method below.
              </p>
            </div>

            <div className="space-y-3">
              <button onClick={() => handleExport(true)} disabled={isProcessing} className="w-full bg-[#2d1621] text-white py-4 rounded-2xl font-black text-sm tracking-tight hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-pink-900/20">
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                SAVE TO CLOUD
              </button>
              <button onClick={() => handleExport(false)} disabled={isProcessing} className="w-full bg-white border-2 border-pink-200 text-pink-700 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-pink-50 transition-all flex items-center justify-center gap-3 shadow-sm">
                <ArrowDownToLine className="w-4 h-4" /> DOWNLOAD LOCALLY
              </button>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
