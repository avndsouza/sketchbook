import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Point to the public/sketches folder
  const sketchesDirectory = path.join(process.cwd(), 'public/sketches');
  
  try {
    // If the folder doesn't exist yet, return an empty array
    if (!fs.existsSync(sketchesDirectory)) {
      return NextResponse.json([]);
    }

    // Read all files in the folder
    const filenames = fs.readdirSync(sketchesDirectory);
    
    // Filter out anything that isn't an image (like hidden system files)
    const images = filenames.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
    
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}