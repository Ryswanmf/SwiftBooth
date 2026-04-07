'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Download, Home, CheckCircle2, Copy, Loader2, Sparkles } from 'lucide-react';

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id && supabase) {
      const { data } = supabase.storage.from('photobooth-images').getPublicUrl(id as string);
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
      alert("Download failed. Please right-click the image to save.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
      <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-8 flex flex-col items-center justify-center bg-[#fff5f7]">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 relative group">
          <div className="absolute -inset-10 bg-pink-600/5 blur-[80px] rounded-full" />
          {imageUrl && (
            <img src={imageUrl} alt="" className="relative w-[260px] md:w-[300px] shadow-2xl rounded-sm border-8 border-white mx-auto" />
          )}
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-[8px] font-black uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3 fill-pink-600 text-white" /> Digital Asset Ready
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-[#2d1621]">Masterpiece <br /> Delivered.</h1>
            <p className="text-[#4a2c3a] text-xs font-bold leading-relaxed max-w-xs">
              Your session is complete. Download your photostrip or share the link with your friends.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 max-w-xs">
            <button onClick={downloadImage} className="flex items-center justify-center gap-3 bg-[#2d1621] text-white py-4 rounded-2xl font-black text-sm tracking-tight hover:scale-[1.02] transition-all shadow-lg shadow-pink-900/30">
              <Download className="w-4 h-4" /> DOWNLOAD JPG
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(imageUrl || '');
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }} className="flex items-center justify-center gap-3 bg-white border-2 border-pink-100 text-pink-700 py-4 rounded-2xl font-black text-sm tracking-tight hover:bg-pink-50 transition-all shadow-sm">
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'LINK COPIED' : 'COPY SHARE LINK'}
            </button>
            <button onClick={() => router.push('/')} className="pt-4 text-pink-900/60 hover:text-pink-700 text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2">
              <Home className="w-3 h-3" /> BACK TO STUDIO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
