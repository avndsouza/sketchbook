

import React from 'react';
import HTMLFlipBook from 'react-pageflip';

// 1. Create a template for what a single paper page looks like
const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode, number: string }>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-[#fdfbf7] shadow-inner border-r border-gray-300 p-8 flex flex-col items-center relative overflow-hidden"
    >
      {props.children}
      {/* Page number at the bottom */}
      <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
        {props.number}
      </div>
    </div>
  );
});

// Add display name for React DevTools (good practice when using forwardRef)
Page.displayName = "Page";

export default function SketchBook() {
  return (
    <div className="flex justify-center items-center py-10 w-full max-w-4xl">
      {/* @ts-ignore - The library's typescript definitions are slightly older, this bypasses the warning */}
      <HTMLFlipBook 
        width={400} 
        height={500} 
        showCover={true}
        className="shadow-2xl"
      > 
        {/* Page 1: The Cover */}
        <Page number="">
          <div className="h-full w-full flex flex-col justify-center items-center bg-[#2c3e50] text-white -m-8 p-8">
            <h1 className="text-4xl font-serif font-bold text-center mb-4">Travel Sketchbook</h1>
            <p className="text-lg italic text-gray-300">Summer 2026</p>
          </div>
        </Page>

        {/* Page 2: Inside Cover */}
        <Page number="">
          <p className="italic text-gray-500 mt-10">This book belongs to...</p>
        </Page>

        {/* Page 3: First Entry */}
        <Page number="1">
          <h2 className="text-2xl font-bold mb-4 text-black">Madrid, Spain</h2>
          <p className="text-gray-700 leading-relaxed">
            Just arrived! The architecture here is incredible. I'm going to sketch the Royal Palace later today.
          </p>
        </Page>

        {/* Page 4: A sketch page */}
        <Page number="2">
          <div className="w-full h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            [Your sketches will go here]
          </div>
        </Page>

      </HTMLFlipBook>
    </div>
  );
}