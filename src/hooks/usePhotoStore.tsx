'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PhotoContextType {
  photos: string[];
  setPhotos: (photos: string[]) => void;
  clearPhotos: () => void;
  selectedFrame: any;
  setSelectedFrame: (frame: any) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');

  const clearPhotos = () => {
    setPhotos([]);
    setSelectedFrame(null);
    setSelectedFilter('none');
  };

  return (
    <PhotoContext.Provider value={{ 
      photos, setPhotos, clearPhotos, selectedFrame, setSelectedFrame,
      selectedFilter, setSelectedFilter 
    }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotoStore() {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotoStore must be used within a PhotoProvider');
  }
  return context;
}
