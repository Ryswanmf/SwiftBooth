'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { useRouter } from 'next/navigation';
import { Check, Download, UploadCloud, ChevronLeft, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PreviewPage() {
  const { photos, setPhotos, selectedFrame } = usePhotoStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (photos.length === 0 || !selectedFrame) {
      router.push('/');
    }
  }, [photos, selectedFrame, router]);

  if (!selectedFrame || photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Reconfiguring...</span>
        </div>
      </div>
    );
  }

  const generateFinalImage = async () => {
    const maxSlots = selectedFrame.slots || 4;
    if (!canvasRef.current || photos.length < maxSlots) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      if (selectedFrame.imagePath) {
        const frameImg = new Image();
        frameImg.src = selectedFrame.imagePath;
        
        await new Promise((resolve, reject) => {
          frameImg.onload = async () => {
            canvas.width = frameImg.width;
            canvas.height = frameImg.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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
              await new Promise((imgRes) => {
                img.onload = () => {
                  ctx.drawImage(img, startX + (col * gapX), startY + (row * gapY), slotWidth, slotHeight);
                  imgRes(true);
                };
              });
            }
            ctx.drawImage(frameImg, 0, 0);
            resolve(true);
          };
          frameImg.onerror = reject;
        });
      } else {
        const padding = 60;
        const imgWidth = 800;
        const imgHeight = 600;
        const spacing = 30;
        const footerHeight = 200;
        canvas.width = imgWidth + (padding * 2);
        canvas.height = (imgHeight * 4) + (spacing * 3) + (padding * 2) + footerHeight;
        
        ctx.fillStyle = selectedFrame.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < photos.length; i++) {
          const img = new Image();
          img.src = photos[i];
          await new Promise((imgRes) => {
            img.onload = () => {
              ctx.drawImage(img, padding, padding + (i * (imgHeight + spacing)), imgWidth, imgHeight);
              imgRes(true);
            };
          });
        }
        ctx.fillStyle = selectedFrame.textColor;
        ctx.font = "bold 48px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SWIFTBOTH STUDIO", canvas.width / 2, canvas.height - 80);
      }

      const finalImage = canvas.toDataURL('image/jpeg', 0.95);
      if (!supabase) throw new Error("Supabase is not configured.");
      
      const fileName = `swiftboth-${Date.now()}.jpg`;
      const blob = await (await fetch(finalImage)).blob();
      const { error: uploadError } = await supabase.storage.from('photobooth-images').upload(fileName, blob, { contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;
      
      router.push(`/result/${fileName}`);
    } catch (err: any) {
      console.error("Export failed:", err);
      alert(err.message || "An unexpected error occurred during export.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center bg-[#020617] animate-in fade-in duration-700">
      {/* Header */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="group flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Studio</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black italic tracking-tighter">PREVIEW MODE</h1>
          <div className="h-0.5 w-10 bg-blue-600 rounded-full" />
        </div>
        <div className="w-24 hidden md:block"></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-16 items-center justify-center">
        {/* Dynamic Frame Preview */}
        <div className="relative group perspective-1000">
          <div className="relative transition-transform duration-700 transform-gpu group-hover:rotate-1 group-hover:scale-[1.02]">
            {selectedFrame.imagePath ? (
              <div className="relative w-[340px] md:w-[400px] aspect-[2/3] glass rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                {/* Photos Layer */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-x-[7.5%] gap-y-[7.5%] p-[10%] pt-[14%] pb-[18%] bg-pink-50/5">
                  {photos.map((src, i) => (
                    <div key={i} className="w-full h-full overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                      <img src={src} className="w-full h-full object-cover mirror" alt="" />
                    </div>
                  ))}
                </div>
                {/* Frame Layer */}
                <img src={selectedFrame.imagePath} className="absolute inset-0 z-10 w-full h-full object-fill pointer-events-none" alt="" />
              </div>
            ) : (
              <div className="p-6 md:p-10 shadow-2xl rounded-sm" style={{ backgroundColor: selectedFrame.color }}>
                <div className="flex flex-col gap-4">
                  {photos.map((src, i) => (
                    <div key={i} className="w-64 md:w-80 aspect-[4/3] bg-slate-900 overflow-hidden rounded-sm shadow-xl">
                      <img src={src} className="w-full h-full object-cover mirror" alt="" />
                    </div>
                  ))}
                </div>
                <div className="mt-10 text-center font-black text-xs tracking-[0.5em] uppercase" style={{ color: selectedFrame.textColor }}>
                  SWIFTBOTH STUDIO
                </div>
              </div>
            )}
          </div>
          {/* Decorative Glow */}
          <div className="absolute -inset-10 bg-blue-600/10 blur-[100px] -z-10 rounded-full" />
        </div>

        {/* Action Panel */}
        <div className="flex-1 w-full max-w-lg">
          <div className="glass p-12 rounded-[3.5rem] space-y-10 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Wand2 className="w-24 h-24" />
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 fill-blue-400" />
                Magical Processing
              </div>
              <h2 className="text-4xl font-black tracking-tighter leading-tight">Masterpiece <br /> Confirmed.</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                We've synchronized your shots with the <b>{selectedFrame.name}</b> template. Your digital photostrip is ready for global delivery.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <button
                onClick={generateFinalImage}
                disabled={isProcessing}
                className="w-full bg-white text-slate-950 py-7 rounded-[2rem] font-black text-2xl tracking-tighter hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-7 h-7 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-7 h-7" />
                    FINISH & EXPORT
                  </>
                )}
              </button>
              <p className="text-[9px] text-center text-slate-600 font-black uppercase tracking-[0.4em]">
                High-Resolution JPEG • 300 DPI Rendering
              </p>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
