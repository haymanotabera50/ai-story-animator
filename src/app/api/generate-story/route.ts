import { NextRequest, NextResponse } from 'next/server';
import { generateStoryScenes } from '@/lib/story-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, style = 'pixar-3d', sceneCount = 4, apiKey } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'A valid story prompt is required.' }, { status: 400 });
    }

    const story = await generateStoryScenes({
      prompt,
      style,
      sceneCount: Number(sceneCount) || 4,
      apiKey,
    });

    return NextResponse.json({ success: true, story });
  } catch (error: any) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate animated story' },
      { status: 500 }
    );
  }
}

