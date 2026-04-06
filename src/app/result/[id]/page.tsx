'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Download, Share2, Home, CheckCircle2, Copy, Loader2, Sparkles, PartyPopper } from 'lucide-react';

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id && supabase) {
      const { data } = supabase.storage
        .from('photobooth-images')
        .getPublicUrl(id as string);
      
      setImageUrl(data.publicUrl);
      setLoading(false);
    }
  }, [id]);

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `swiftboth-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not download the image. Please try right-clicking and saving it.");
    }
  };

  const copyLink = () => {
    if (!imageUrl) return;
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center justify-center bg-[#020617] animate-in zoom-in-95 duration-700">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-16 items-center">
        
        {/* Visual Showcase */}
        <div className="flex-1 relative group">
          <div className="absolute -inset-10 bg-gradient-to-tr from-blue-600/20 to-pink-500/20 blur-[120px] rounded-full animate-pulse" />
          
          <div className="relative">
            {imageUrl && (
              <div className="relative transform-gpu transition-all duration-700 hover:rotate-2 hover:scale-[1.03]">
                 <img 
                  src={imageUrl} 
                  alt="Final Photostrip" 
                  className="w-[320px] md:w-[380px] shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-sm border-[12px] border-white/5 bg-white/5 backdrop-blur-3xl"
                />
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            )}
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl animate-bounce">
               <PartyPopper className="w-8 h-8 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Content & Actions */}
        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Securely Generated
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Your Memory, <br /> Digitized.</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
              Your Swiftboth session was a success! Download your high-quality photostrip or share the public link with your community.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-md">
            <button
              onClick={downloadImage}
              className="group relative flex items-center justify-center gap-4 bg-white text-slate-950 py-6 rounded-[2rem] font-black text-xl tracking-tighter hover:scale-[1.02] transition-all active:scale-95 shadow-2xl"
            >
              <Download className="w-6 h-6 group-hover:bounce transition-transform" />
              DOWNLOAD ORIGINAL
            </button>
            
            <button
              onClick={copyLink}
              className="flex items-center justify-center gap-4 glass text-white py-6 rounded-[2rem] font-black text-xl tracking-tighter hover:bg-white/10 transition-all active:scale-95"
            >
              {copied ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
              {copied ? 'LINK COPIED' : 'COPY SHARE LINK'}
            </button>

            <div className="py-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Next Step</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <button
              onClick={() => router.push('/')}
              className="group flex items-center justify-center gap-3 text-slate-500 hover:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all"
            >
              <Home className="w-4 h-4" />
              BACK TO STUDIO
            </button>
          </div>
        </div>

      </div>

      <div className="mt-20 flex items-center gap-2 text-slate-800">
         <Sparkles className="w-4 h-4" />
         <span className="text-[10px] font-black uppercase tracking-[0.5em]">Powered by Swiftboth Engine</span>
      </div>
    </div>
  );
}
