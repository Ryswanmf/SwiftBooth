'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { Camera, RefreshCw, CheckCircle2, ArrowRight, RotateCcw, Scan } from 'lucide-react';

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
    width: 1280,
    height: 720,
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
    setTempPhotos([]);
    clearPhotos();
    setSelectedSlot(null);
  };

  const nextSlot = tempPhotos.length < maxSlots ? tempPhotos.length : null;
  const activeSlot = selectedSlot !== null ? selectedSlot : nextSlot;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 items-start justify-center animate-in fade-in duration-700">
      {/* Camera Section */}
      <div className="flex-1 w-full flex flex-col items-center gap-10">
        <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden border-[6px] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-slate-900 group">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover mirror"
            mirrored={true}
          />
          
          {/* Viewfinder Corners */}
          <div className="absolute top-10 left-10 w-16 h-16 border-t-4 border-l-4 border-white/20 rounded-tl-2xl" />
          <div className="absolute top-10 right-10 w-16 h-16 border-t-4 border-r-4 border-white/20 rounded-tr-2xl" />
          <div className="absolute bottom-10 left-10 w-16 h-16 border-b-4 border-l-4 border-white/20 rounded-bl-2xl" />
          <div className="absolute bottom-10 right-10 w-16 h-16 border-b-4 border-r-4 border-white/20 rounded-br-2xl" />

          {/* Center Scan UI */}
          {!isCapturing && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Scan className="w-20 h-20 text-white/10 stroke-[1]" />
            </div>
          )}

          {/* Overlay Countdown */}
          {countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20 backdrop-blur-md z-10">
              <span className="text-[14rem] font-black italic text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.5)] animate-pulse">
                {countdown}
              </span>
            </div>
          )}

          {/* Flash Effect */}
          {isCapturing && countdown === 0 && (
            <div className="absolute inset-0 bg-white animate-flash pointer-events-none z-20" />
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {activeSlot !== null ? (
            <button
              onClick={startCountdown}
              disabled={isCapturing}
              className={`group flex items-center gap-4 px-12 py-7 rounded-full text-2xl font-black transition-all transform hover:scale-105 active:scale-95 ${
                isCapturing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-white text-slate-950 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] shadow-2xl'
              }`}
            >
              {isCapturing ? <RefreshCw className="w-7 h-7 animate-spin" /> : <Camera className="w-7 h-7 group-hover:rotate-12 transition-transform" />}
              {isCapturing 
                ? `FOCUSING...` 
                : selectedSlot !== null 
                  ? `RETAKE SHOT ${selectedSlot + 1}` 
                  : `TAKE SHOT ${tempPhotos.length + 1}`}
            </button>
          ) : (
            <button
              onClick={handleDone}
              className="group flex items-center gap-4 px-12 py-7 rounded-full text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              <CheckCircle2 className="w-7 h-7" />
              FINALIZE SESSION
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
          )}

          {tempPhotos.length > 0 && !isCapturing && (
            <button
              onClick={handleResetAll}
              className="px-8 py-7 rounded-full font-black text-slate-500 hover:text-pink-500 transition-colors uppercase tracking-widest text-xs"
            >
              Clear Session
            </button>
          )}
        </div>
      </div>

      {/* Modern Preview Strip Section */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Strip Buffer</h3>
          <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">{tempPhotos.length}/{maxSlots}</span>
        </div>
        
        <div className={`glass p-5 rounded-[2.5rem] grid gap-4 ${maxSlots === 6 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {Array.from({ length: maxSlots }).map((_, index) => (
            <div 
              key={index} 
              onClick={() => !isCapturing && tempPhotos[index] && setSelectedSlot(index === selectedSlot ? null : index)}
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all duration-500 cursor-pointer group ${
                selectedSlot === index 
                ? 'border-blue-500 ring-4 ring-blue-500/20 scale-105 z-10' 
                : tempPhotos[index] 
                  ? 'border-white/10 bg-slate-900 hover:border-white/40' 
                  : 'border-dashed border-white/5 bg-white/5 hover:bg-white/10'
              }`}
            >
              {tempPhotos[index] ? (
                <>
                  <img src={tempPhotos[index]} alt={`Shot ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-blue-600/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all ${selectedSlot === index ? 'opacity-100' : ''}`}>
                    <RotateCcw className="w-8 h-8 text-white mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Retake</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 uppercase italic">
                  Slot {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="glass p-6 rounded-3xl text-center">
            <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-tighter">
              Click any photo to retake. <br /> Press finalize when you're happy.
            </p>
        </div>
      </div>
    </div>
  );
}
