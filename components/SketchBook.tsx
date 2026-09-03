"use client";

import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

interface PageProps {
  children?: React.ReactNode;
  isCover?: boolean;
  coverImage?: string | null;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div ref={ref} data-density="hard">
      <div 
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundColor: props.isCover ? '#1e293b' : '#f4f1ea',
          color: props.isCover ? 'white' : '#111',
        }}
      >
        {props.coverImage ? (
          <img 
            src={props.coverImage} 
            className="w-full h-full object-cover" 
            alt="Page Art" 
          />
        ) : (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-0">
            {props.children}
          </div>
        )}
      </div>
    </div>
  );
});
Page.displayName = "Page";

export default function SketchBook() {
  const bookRef = useRef<any>(null);
  
  const [pages, setPages] = useState<string[]>([]);
  const [covers, setCovers] = useState<{
    front: string | null, 
    back: string | null, 
    insideFront: string | null, 
    insideBack: string | null
  }>({ front: null, back: null, insideFront: null, insideBack: null });
  
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRotated, setIsRotated] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      const targetWidth = dimensions.width * 2;
      const widthScale = (screenWidth * 0.9) / targetWidth;
      const heightScale = (screenHeight * 0.8) / dimensions.height;
      
      const currentScale = Math.min(widthScale, heightScale, 1);
      setScale(Math.max(currentScale, 0.4));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coverRes = await fetch('/api/covers');
        const coverData = await coverRes.json();
        setCovers(coverData);

        const sketchRes = await fetch('/api/sketches');
        const filenames = await sketchRes.json();
        const loadedPages = filenames.map((file: string) => `/sketches/${file}`);
        setPages(loadedPages);

        if (loadedPages.length > 0) {
          const img = new window.Image();
          img.src = loadedPages[0];
          img.onload = () => {
            const ratio = img.naturalWidth / img.naturalHeight;
            setDimensions({ width: 700 * ratio, height: 700 }); 
            setIsLoading(false);
          };
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const handlePrev = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  if (isLoading) {
    return <div className="text-white text-xl font-serif py-20 flex items-center justify-center min-h-screen">Opening book...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 w-full gap-4 overflow-hidden select-none">
      
      <button 
        onClick={() => setIsRotated(!isRotated)}
        className="z-50 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-serif border border-white/20 transition-all active:scale-95 shadow-lg backdrop-blur-sm text-sm"
      >
        ↻ Rotate Book
      </button>

      <div className="flex items-center justify-center gap-4 w-full max-w-7xl px-4">
        
        <button 
          onClick={handlePrev}
          className="z-40 text-white opacity-40 hover:opacity-100 transition text-6xl p-2 active:-translate-x-2 cursor-pointer"
        >
          ‹
        </button>

        <div 
          className="flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ 
            transform: `scale(${scale}) ${isRotated ? 'rotate(90deg)' : 'rotate(0deg)'}`,
            transformOrigin: 'center center',
            touchAction: 'pan-y'
          }}
        >
          {/* @ts-ignore */}
          <HTMLFlipBook 
            ref={bookRef}
            key={pages.length}
            width={dimensions.width} 
            height={dimensions.height} 
            showCover={true}            
            drawShadow={true}           
            maxShadowOpacity={0.5}     
            flippingTime={400}          
            swipeDistance={60}          
            clickEventForward={true}    
            usePortrait={false}        
            startPage={0}
            autoSize={true}
            maxCoverOpacity={1}
            mobileScrollSupport={false}
            className=""               
          >
            
            <Page isCover={true} coverImage={covers.front}>
              {!covers.front && (
                <div className="border-4 border-white/20 p-10 rounded-sm text-center w-full m-8">
                  <h1 className="text-5xl font-serif font-bold mb-4">Journal</h1>
                </div>
              )}
            </Page>

            <Page coverImage={covers.insideFront}>
              {!covers.insideFront && <div className="mt-12 italic text-gray-500 font-serif text-lg">Property of: ____________</div>}
            </Page>

            {pages.length === 0 ? (
               <Page>
                 <p className="text-gray-400 italic font-serif text-center">Drop images into public/sketches folder.</p>
               </Page>
            ) : (
              pages.map((imgUrl, index) => (
                <Page key={index}>
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#f4f1ea]">
                    <img 
                      src={imgUrl} 
                      alt={`Sketch ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Page>
              ))
            )}

            <Page coverImage={covers.insideBack}>
              {!covers.insideBack && <div className="h-full w-full flex items-center justify-center"><p className="text-gray-400 italic">End of entries.</p></div>}
            </Page>

            <Page isCover={true} coverImage={covers.back}>
               {!covers.back && <p className="text-gray-400 text-sm tracking-widest uppercase">Fin</p>}
            </Page>

          </HTMLFlipBook>
        </div>

        <button 
          onClick={handleNext}
          className="z-40 text-white opacity-40 hover:opacity-100 transition text-6xl p-2 active:translate-x-2 cursor-pointer"
        >
          ›
        </button>

      </div>
    </div>
  );
}