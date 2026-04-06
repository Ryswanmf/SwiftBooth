'use client';

import React, { useState } from 'react';
import CameraView from "@/components/CameraView";
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { Check, Layout, Sparkles, ChevronRight, Zap, Image as ImageIcon } from "lucide-react";

const FRAMES = [
  { id: 'pink-swift', name: 'Swiftboth Pink', color: '#db7093', textColor: '#FFFFFF', imagePath: '/frames/pink.png', slots: 6, tag: 'SPECIAL' },
  { id: 'white', name: 'Classic White', color: '#F8FAFC', textColor: '#0F172A', slots: 4, tag: 'BASIC' },
  { id: 'navy', name: 'Deep Midnight', color: '#1E293B', textColor: '#F1F5F9', slots: 4, tag: 'PREMIUM' },
];

export default function Home() {
  const { selectedFrame, setSelectedFrame } = usePhotoStore();
  const [isStarted, setIsStarted] = useState(false);

  return (
    <main className="min-h-screen p-4 md:p-10 flex flex-col items-center">
      <header className="w-full max-w-5xl glass rounded-[2rem] px-8 py-4 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-pink-500 p-2 rounded-xl">
            <Zap className="text-white fill-white w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter italic">SWIFTBOTH</h1>
            <p className="text-[8px] text-pink-500 font-bold uppercase tracking-[0.4em]">Digital Studio</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span className="hover:text-white transition-colors cursor-pointer">Frames</span>
            <span className="hover:text-white transition-colors cursor-pointer">Gallery</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isStarted ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-blue-500'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{isStarted ? 'Live' : 'Ready'}</span>
          </div>
        </div>
      </header>

      {!isStarted ? (
        <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-pink-400 text-[9px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 fill-pink-400" />
              Swith Studio.
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-gradient">
              Capture <br /> Your Moment.
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Halo Marsha Arum Purnama.
            </p>
          </section>

          <section className="w-full max-w-4xl space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">Select Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={`group relative flex flex-col p-2 rounded-[2rem] transition-all duration-300 ${
                    selectedFrame?.id === frame.id 
                    ? 'glass-card bg-blue-600/5 scale-105 border-blue-500/30' 
                    : 'glass-card hover:scale-[1.02]'
                  }`}
                >
                  <div className={`absolute top-4 right-4 z-20 px-2 py-0.5 rounded-full text-[7px] font-black tracking-widest uppercase ${selectedFrame?.id === frame.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                    {frame.tag}
                  </div>

                  <div 
                    className="w-full aspect-[4/5] rounded-[1.5rem] shadow-xl mb-4 relative overflow-hidden flex flex-col items-center justify-end pb-4"
                    style={{ backgroundColor: frame.color }}
                  >
                    {frame.imagePath ? (
                      <img src={frame.imagePath} alt={frame.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="w-12 h-12 opacity-5 absolute inset-0 m-auto" />
                    )}
                    <span className="relative z-10 text-[8px] font-black tracking-widest uppercase bg-black/40 px-4 py-1.5 rounded-full text-white backdrop-blur-md">
                      Preview
                    </span>
                  </div>
                  <div className="px-4 pb-2 flex items-center justify-between w-full">
                    <div className="text-left">
                      <span className="block text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">{frame.slots} Shots</span>
                      <span className="font-bold text-sm tracking-tight">{frame.name}</span>
                    </div>
                    {selectedFrame?.id === frame.id && (
                      <Check className="w-4 h-4 text-blue-500" />
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
              className="group relative w-full overflow-hidden bg-white text-slate-950 py-5 rounded-[1.8rem] font-black text-lg tracking-tight hover:scale-105 transition-all active:scale-95 disabled:opacity-20 shadow-xl"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                LAUNCH STUDIO
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-white to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl animate-in zoom-in-95 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 glass p-6 rounded-[2rem]">
            <div className="space-y-1">
              <span className="text-blue-500 font-black text-[9px] uppercase tracking-widest">Digital Studio</span>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic">The Booth</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsStarted(false)}
                className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"
              >
                <Layout className="w-3.5 h-3.5" /> Change Frame
              </button>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedFrame?.color }} />
                <span className="text-[9px] font-black uppercase tracking-widest">{selectedFrame?.name}</span>
              </div>
            </div>
          </div>
          <CameraView />
        </div>
      )}

      <footer className="mt-auto py-10 flex flex-col items-center gap-4 text-slate-700">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em]">
          <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
        </div>
        <p className="text-[8px] font-black tracking-widest uppercase">SWIFTBOTH STUDIO © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
