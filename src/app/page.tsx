'use client';

import React, { useState } from 'react';
import CameraView from "@/components/CameraView";
import { usePhotoStore } from '@/hooks/usePhotoStore';
import { Camera, Check, Layout, Sparkles, ChevronRight, Zap, Image as ImageIcon } from "lucide-react";

const FRAMES = [
  { id: 'pink-swift', name: 'Swiftboth Pink', color: '#db7093', textColor: '#FFFFFF', imagePath: '/frames/pink.png', slots: 6, tag: 'SPECIAL' },
  { id: 'white', name: 'Classic White', color: '#F8FAFC', textColor: '#0F172A', slots: 4, tag: 'STRETCH' },
  { id: 'navy', name: 'Deep Midnight', color: '#1E293B', textColor: '#F1F5F9', slots: 4, tag: 'PREMIUM' },
];

export default function Home() {
  const { selectedFrame, setSelectedFrame } = usePhotoStore();
  const [isStarted, setIsStarted] = useState(false);

  return (
    <main className="min-h-screen p-4 md:p-12 flex flex-col items-center">
      {/* Dynamic Header */}
      <header className="w-full max-w-6xl glass rounded-[2.5rem] px-10 py-6 mb-12 flex items-center justify-between z-50">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-gradient-to-tr from-blue-600 to-pink-500 p-3 rounded-2xl shadow-xl shadow-blue-500/10 group-hover:scale-110 transition-transform">
            <Zap className="text-white fill-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic">SWIFTBOTH</h1>
            <p className="text-[9px] text-pink-400 font-bold uppercase tracking-[0.4em] mt-0.5">Studio Digital Experience</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-500">
            <span className="hover:text-white transition-colors">How it works</span>
            <span className="hover:text-white transition-colors">Frames</span>
            <span className="hover:text-white transition-colors">Community</span>
          </nav>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isStarted ? 'bg-green-500' : 'bg-blue-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isStarted ? 'Live Session' : 'Ready'}</span>
          </div>
        </div>
      </header>

      {!isStarted ? (
        <div className="w-full max-w-5xl flex flex-col items-center text-center space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Hero Section */}
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-pink-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Sparkles className="w-3.5 h-3.5 fill-pink-400" />
              Revolutionize Your Moments
            </div>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-gradient">
              CAPTURE <br /> BEYOND.
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Experience the next-gen digital photobooth. Professional <br className="hidden md:block" /> lighting, premium frames, and instant digital delivery.
            </p>
          </section>

          {/* Frame Selection Step */}
          <section className="w-full space-y-12">
            <div className="flex flex-col items-center gap-2">
              <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest">Step 01</span>
              <h3 className="text-3xl font-bold tracking-tight">Select Your Template</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 max-w-5xl">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={`group relative flex flex-col p-3 rounded-[3rem] transition-all duration-700 ${
                    selectedFrame?.id === frame.id 
                    ? 'glass-card bg-blue-600/10 scale-105 border-blue-500/50' 
                    : 'glass-card hover:scale-[1.03]'
                  }`}
                >
                  {/* Floating Tag */}
                  <div className={`absolute top-6 right-6 z-20 px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase ${selectedFrame?.id === frame.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                    {frame.tag}
                  </div>

                  <div 
                    className="w-full aspect-[2/3] rounded-[2.5rem] shadow-2xl mb-6 relative overflow-hidden flex flex-col items-center justify-end pb-8"
                    style={{ backgroundColor: frame.color }}
                  >
                    {frame.imagePath ? (
                      <img src={frame.imagePath} alt={frame.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-5">
                        <ImageIcon className="w-20 h-20" />
                      </div>
                    )}
                    <span className="relative z-10 text-[9px] font-black tracking-[0.4em] uppercase bg-black/40 px-5 py-2 rounded-full text-white backdrop-blur-md border border-white/10">
                      Preview Design
                    </span>
                  </div>
                  <div className="px-8 pb-4 flex items-center justify-between w-full">
                    <div className="text-left">
                      <span className="block text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{frame.slots} Shots</span>
                      <span className="font-bold text-lg tracking-tight">{frame.name}</span>
                    </div>
                    {selectedFrame?.id === frame.id && (
                      <div className="bg-blue-600 p-2 rounded-full shadow-lg shadow-blue-600/50">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Action Trigger */}
          <div className="w-full max-w-md pb-20">
            <button
              onClick={() => setIsStarted(true)}
              disabled={!selectedFrame}
              className="group relative w-full overflow-hidden bg-white text-slate-950 py-8 rounded-[3rem] font-black text-2xl tracking-tighter hover:scale-105 transition-all active:scale-95 disabled:opacity-20 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
            >
              <div className="relative z-10 flex items-center justify-center gap-4">
                LAUNCH STUDIO
                <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-white to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <p className="mt-6 text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] italic">Swiftboth Engine v1.0 • Unlimited Fun</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl animate-in zoom-in-95 duration-1000">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 glass p-10 rounded-[3rem]">
            <div className="space-y-2">
              <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest">Step 02</span>
              <h3 className="text-4xl font-black tracking-tighter">THE STUDIO</h3>
              <p className="text-slate-500 text-sm font-medium">Ready when you are. Pose and let Swiftboth handle the magic.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsStarted(false)}
                className="text-slate-500 hover:text-white transition-colors flex items-center gap-3 font-black text-xs uppercase tracking-widest"
              >
                <Layout className="w-4 h-4" /> Switch Theme
              </button>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: selectedFrame?.color }} />
                <span className="text-xs font-black uppercase tracking-widest italic">{selectedFrame?.name}</span>
              </div>
            </div>
          </div>
          <CameraView />
        </div>
      )}

      <footer className="mt-auto py-16 flex flex-col items-center gap-6 text-slate-700">
        <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em]">
          <span className="hover:text-pink-500 cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Twitter</span>
          <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
        </div>
        <div className="flex flex-col items-center gap-1">
           <p className="text-[10px] font-black italic tracking-widest uppercase">SWIFTBOTH STUDIO © {new Date().getFullYear()}</p>
           <div className="h-0.5 w-12 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full" />
        </div>
      </footer>
    </main>
  );
}
