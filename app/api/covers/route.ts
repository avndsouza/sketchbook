import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const coversDir = path.join(process.cwd(), 'public/covers');
  
  try {
    if (!fs.existsSync(coversDir)) {
      return NextResponse.json({ front: null, back: null, insideFront: null, insideBack: null });
    }
    
    const files = fs.readdirSync(coversDir);
    const imgFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
    
    const front = imgFiles.find(f => f.toLowerCase().includes('front') && !f.toLowerCase().includes('inside'));
    const back = imgFiles.find(f => f.toLowerCase().includes('back') && !f.toLowerCase().includes('inside'));
    const insideFront = imgFiles.find(f => f.toLowerCase().includes('inside-front'));
    const insideBack = imgFiles.find(f => f.toLowerCase().includes('inside-back'));
    
    return NextResponse.json({
      front: front ? `/covers/${front}` : null,
      back: back ? `/covers/${back}` : null,
      insideFront: insideFront ? `/covers/${insideFront}` : null,
      insideBack: insideBack ? `/covers/${insideBack}` : null
    });
  } catch (error) {
    return NextResponse.json({ front: null, back: null, insideFront: null, insideBack: null });
  }
}