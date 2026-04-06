'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { Camera, RefreshCw, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

export default function CameraView() {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [tempPhotos, setTempPhotos] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const { setPhotos, clearPhotos, selectedFrame } = usePhotoStore();
  const router = useRouter();

  const maxSlots = selectedFrame?.slots || 4;

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user"
  };

  const takeSnapshot = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setTempPhotos((prev) => {
        const newPhotos = [...prev];
        if (selectedSlot !== null) {
          newPhotos[selectedSlot] = imageSrc;
        } else {
          newPhotos.push(imageSrc);
        }
        return newPhotos;
      });
    }
    setIsCapturing(false);
    setCountdown(0);
    setSelectedSlot(null);
  }, [webcamRef, selectedSlot]);

  const startCountdown = () => {
    if (tempPhotos.length >= maxSlots && selectedSlot === null) return;
    setIsCapturing(true);
    setCountdown(3);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCapturing && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isCapturing && countdown === 0) {
      takeSnapshot();
    }
    return () => clearTimeout(timer);
  }, [isCapturing, countdown, takeSnapshot]);

  const handleDone = () => {
    if (tempPhotos.length < maxSlots) return;
    setPhotos(tempPhotos);
    router.push('/preview');
  };

  const handleResetAll = () => {
    if(confirm("Clear all photos and start over?")) {
      setTempPhotos([]);
      clearPhotos();
      setSelectedSlot(null);
    }
  };

  const nextSlot = tempPhotos.length < maxSlots ? tempPhotos.length : null;
  const activeSlot = selectedSlot !== null ? selectedSlot : nextSlot;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 items-start justify-center">
      {/* Camera Section */}
      <div className="flex-1 w-full flex flex-col items-center gap-6 lg:gap-10">
        <div className="relative w-full aspect-[4/3] md:aspect-video rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-2 md:border-4 border-white/5 shadow-2xl bg-slate-900 group">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover mirror"
            mirrored={true}
          />
          
          {/* Viewfinder Corners - Smaller on mobile */}
          <div className="absolute top-4 left-4 w-6 h-6 md:top-6 md:left-6 md:w-10 md:h-10 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-6 h-6 md:top-6 md:right-6 md:w-10 md:h-10 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-6 h-6 md:bottom-6 md:left-6 md:w-10 md:h-10 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-6 h-6 md:bottom-6 md:right-6 md:w-10 md:h-10 border-b-2 border-r-2 border-white/30 rounded-br-lg" />

          {/* Countdown Overlay */}
          {countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20 backdrop-blur-sm z-10">
              <span className="text-8xl md:text-[10rem] font-black italic text-white animate-pulse">
                {countdown}
              </span>
            </div>
          )}

          {isCapturing && countdown === 0 && (
            <div className="absolute inset-0 bg-white animate-flash pointer-events-none z-20" />
          )}
        </div>

        {/* Primary Action Button */}
        <div className="w-full flex flex-col items-center gap-4 px-4 md:px-0">
          {activeSlot !== null ? (
            <button
              onClick={startCountdown}
              disabled={isCapturing}
              className={`w-full md:w-auto group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl md:rounded-full text-lg font-black transition-all transform active:scale-95 ${
                isCapturing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-white text-slate-950 shadow-2xl shadow-white/10'
              }`}
            >
              {isCapturing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              {isCapturing 
                ? `READY...` 
                : selectedSlot !== null 
                  ? `RETAKE SHOT ${selectedSlot + 1}` 
                  : `TAKE SHOT ${tempPhotos.length + 1}`}
            </button>
          ) : (
            <button
              onClick={handleDone}
              className="w-full md:w-auto group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl md:rounded-full text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              FINALIZE SESSION
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {tempPhotos.length > 0 && !isCapturing && (
            <button
              onClick={handleResetAll}
              className="px-6 py-2 font-black text-slate-500 hover:text-red-400 transition-colors uppercase tracking-[0.2em] text-[9px]"
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      {/* Strip Buffer - Scrollable on mobile, Vertical on Desktop */}
      <div className="w-full lg:w-60 flex flex-col gap-3 px-4 md:px-0">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 italic">Strip Buffer</h3>
          <span className="text-[8px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{tempPhotos.length}/{maxSlots}</span>
        </div>
        
        {/* Responsive Grid Container */}
        <div className="flex lg:grid lg:grid-cols-1 overflow-x-auto lg:overflow-visible gap-3 pb-4 lg:pb-0 scrollbar-hide">
          {Array.from({ length: maxSlots }).map((_, index) => (
            <div 
              key={index} 
              onClick={() => !isCapturing && tempPhotos[index] && setSelectedSlot(index === selectedSlot ? null : index)}
              className={`relative flex-shrink-0 w-32 md:w-40 lg:w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${
                selectedSlot === index 
                ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105 z-10' 
                : tempPhotos[index] 
                  ? 'border-white/10 bg-slate-900' 
                  : 'border-dashed border-white/5 bg-white/[0.02]'
              }`}
            >
              {tempPhotos[index] ? (
                <>
                  <img src={tempPhotos[index]} alt="" className="w-full h-full object-cover mirror" />
                  <div className={`absolute inset-0 bg-blue-600/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all ${selectedSlot === index ? 'opacity-100' : ''}`}>
                    <RotateCcw className="w-5 h-5 text-white mb-1" />
                    <span className="text-[6px] font-black uppercase text-white tracking-widest">Retake</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-800 uppercase italic">
                  Slot {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
