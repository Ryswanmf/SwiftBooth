'use client';

import React, { useState } from 'react';
import CameraView from "@/components/CameraView";
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { Check, Layout, Sparkles, ChevronRight, Zap, Image as ImageIcon } from "lucide-react";

const FRAMES = [
  { id: 'swift-pink', name: 'Swift Pink Arch', color: '#ffb6c1', textColor: '#FFFFFF', imagePath: '/frames/swift-pink.png', slots: 6, tag: 'SPECIAL' },
  { id: 'swift-pink-2', name: 'Swift Pink Polaroid', color: '#db7093', textColor: '#FFFFFF', imagePath: '/frames/swift-pink-2.png', slots: 4, tag: 'SPECIAL' },
];

export default function Home() {
  const { selectedFrame, setSelectedFrame } = usePhotoStore();
  const [isStarted, setIsStarted] = useState(false);

  return (
    <main className="min-h-screen p-4 md:p-10 flex flex-col items-center">
      <header className="w-full max-w-5xl glass rounded-[2rem] px-8 py-4 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-pink-600 to-rose-400 p-2 rounded-xl">
            <Zap className="text-white fill-white w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter italic text-[#4a2c3a]">SWIFTBOTH</h1>
            <p className="text-[8px] text-pink-500 font-bold uppercase tracking-[0.4em]">Digital Studio</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-pink-900/70">
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Frames</span>
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Gallery</span>
          </div>
          <div className="h-4 w-px bg-pink-300 hidden md:block" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isStarted ? 'bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.4)]' : 'bg-pink-500'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-pink-900/60">{isStarted ? 'Live' : 'Ready'}</span>
          </div>
        </div>
      </header>

      {!isStarted ? (
        <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-[9px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 fill-pink-600" />
              Cryswann Studio.
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-gradient">
              Capture <br /> Your Moment.
            </h2>
            <p className="text-[#4a2c3a] text-sm max-w-md mx-auto leading-relaxed font-bold">
              Halo Marsha Arum Purnama.
            </p>
          </section>

          <section className="w-full max-w-4xl space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-pink-900/70">Select Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full px-4">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={`group relative flex flex-col p-1.5 md:p-2 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300 ${
                    selectedFrame?.id === frame.id 
                    ? 'glass-card bg-white scale-105 border-pink-500 shadow-xl shadow-pink-300/30' 
                    : 'glass-card hover:scale-[1.02] border-pink-100'
                  }`}
                >
                  <div className={`absolute top-3 right-3 z-20 px-1.5 py-0.5 rounded-full text-[6px] md:text-[7px] font-black tracking-widest uppercase ${selectedFrame?.id === frame.id ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-600'}`}>
                    {frame.tag}
                  </div>

                  <div 
                    className="w-full aspect-[3/4] md:aspect-[4/5] rounded-[1rem] md:rounded-[1.5rem] shadow-lg mb-3 md:mb-4 relative overflow-hidden flex flex-col items-center justify-end pb-3"
                    style={{ backgroundColor: frame.color }}
                  >
                    {frame.imagePath ? (
                      <img src={frame.imagePath} alt={frame.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="w-10 h-10 opacity-5 absolute inset-0 m-auto" />
                    )}
                    <span className="relative z-10 text-[7px] md:text-[8px] font-black tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full text-white backdrop-blur-md border border-white/20">
                      Preview
                    </span>
                  </div>
                  <div className="px-2 md:px-4 pb-1 md:pb-2 flex items-center justify-between w-full">
                    <div className="text-left">
                      <span className="block text-[7px] md:text-[8px] text-pink-900/60 font-black uppercase tracking-widest mb-0.5">{frame.slots} Shots</span>
                      <span className="font-bold text-[10px] md:text-sm tracking-tight text-[#3d202d] truncate max-w-[80px] md:max-w-none">{frame.name}</span>
                    </div>
                    {selectedFrame?.id === frame.id && (
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-pink-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="w-full max-w-xs pt-4">
            <button
              onClick={() => setIsStarted(true)}
              disabled={!selectedFrame}
              className="group relative w-full overflow-hidden bg-[#2d1621] text-white py-5 rounded-[1.8rem] font-black text-lg tracking-tight hover:scale-105 transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-pink-900/30"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                Take Pictures
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-700 via-rose-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl animate-in zoom-in-95 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 glass p-6 rounded-[2rem] border-pink-200">
            <div className="space-y-1">
              <span className="text-pink-600 font-black text-[9px] uppercase tracking-widest">Digital Studio</span>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic text-[#2d1621]">The Booth</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsStarted(false)}
                className="text-pink-900/70 hover:text-pink-600 transition-colors flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"
              >
                <Layout className="w-3.5 h-3.5" /> Change Frame
              </button>
              <div className="h-6 w-px bg-pink-300" />
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-pink-200">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedFrame?.color }} />
                <span className="text-[9px] font-black uppercase tracking-widest text-pink-900/80">{selectedFrame?.name}</span>
              </div>
            </div>
          </div>
          <CameraView />
        </div>
      )}

      <footer className="mt-auto py-10 flex flex-col items-center gap-4 text-pink-900/60">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em]">
          <span className="hover:text-pink-600 cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-pink-600 cursor-pointer transition-colors">Twitter</span>
        </div>
        <p className="text-[8px] font-black tracking-widest uppercase">SWIFTBOTH STUDIO © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
