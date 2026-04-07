'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { useRouter } from 'next/navigation';
import { ChevronLeft, RefreshCw, Sparkles, UploadCloud, ArrowDownToLine } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PreviewPage() {
  const { photos, setPhotos, selectedFrame } = usePhotoStore();
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
          const slotWidth = canvas.width * 0.385;
          const slotHeight = canvas.height * 0.205;
          const startX = canvas.width * 0.078;
          const startY = canvas.height * 0.11;
          const gapX = canvas.width * 0.46;
          const gapY = canvas.height * 0.282;

          for (let i = 0; i < photos.length; i++) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const img = new Image();
            img.src = photos[i];
            await new Promise((res) => {
              img.onload = () => {
                ctx.drawImage(img, startX + (col * gapX), startY + (row * gapY), slotWidth, slotHeight);
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
            ctx.drawImage(img, padding, padding + (i * (imgHeight + 20)), imgWidth, imgHeight);
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
    <div className="min-h-screen p-6 md:p-8 flex flex-col items-center bg-[#fff5f7]">
      <header className="w-full max-w-5xl flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-pink-900/60 hover:text-pink-700 text-[10px] font-black uppercase tracking-widest transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-lg font-black italic tracking-tighter text-gradient uppercase">Preview</h1>
        <div className="w-12"></div>
      </header>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-10 items-center justify-center">
        <div className="relative group scale-90 md:scale-100">
          {selectedFrame.imagePath ? (
            <div className="relative w-[280px] md:w-[320px] aspect-[2/3] glass rounded-2xl overflow-hidden shadow-2xl border-pink-200">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-x-[7.5%] gap-y-[7.5%] p-[10%] pt-[14%] pb-[18%]">
                {photos.map((src, i) => (
                  <div key={i} className="w-full h-full overflow-hidden rounded-lg bg-pink-100 shadow-inner">
                    <img src={src} className="w-full h-full object-cover mirror" alt="" />
                  </div>
                ))}
              </div>
              <img src={selectedFrame.imagePath} className="absolute inset-0 z-10 w-full h-full object-fill pointer-events-none" alt="" />
            </div>
          ) : (
            <div className="p-4 shadow-2xl rounded-sm" style={{ backgroundColor: selectedFrame.color }}>
              <div className="flex flex-col gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="w-48 md:w-56 aspect-[4/3] bg-pink-100 overflow-hidden">
                    <img src={src} className="w-full h-full object-cover mirror" alt="" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-sm">
          <div className="glass p-8 rounded-[2.5rem] space-y-6 border-pink-200 shadow-xl shadow-pink-900/5">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-200 text-pink-700 text-[8px] font-black uppercase tracking-widest border border-pink-300">
                <Sparkles className="w-3 h-3 fill-pink-600" /> Processing Ready
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#2d1621]">Final Check</h2>
              <p className="text-[#4a2c3a] text-xs font-bold leading-relaxed">
                Everything looks perfect. Choose your export method below.
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
