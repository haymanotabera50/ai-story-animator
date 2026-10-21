import { NextRequest, NextResponse } from 'next/server';
import { brainstormStoryAngles, generateScriptFromAngle } from '@/lib/director-engine';
import { enhancePromptWithAI } from '@/lib/prompt-enhancer';
import { ART_STYLES, ETHIOPIAN_MUSIC_MODES, CAMERA_MOTIONS } from '@/lib/constants';
import { ArtStyle, AspectRatio, BgMusicMood } from '@/types/animation';

// MCP (Model Context Protocol) Server implementation for Ahadu Animation Studio
// Standard: JSON-RPC 2.0 (Anthropic Model Context Protocol specification)

const MCP_TOOLS = [
  {
    name: 'ahadu_generate_video',
    description: 'Generates a complete multi-scene animated video project from a prompt, including script, voiceover text, camera motions, and visual assets.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The story or animation prompt to bring to life.' },
        style: {
          type: 'string',
          enum: ['habesha-3d', 'ethiopian-manuscript', 'simien-folktale', 'pixar-3d', 'ghibli-anime', 'watercolor', 'comic-book'],
          description: 'Visual animation style for the scenes.',
        },
        sceneCount: { type: 'number', description: 'Number of scenes (3 to 5). Defaults to 4.' },
        aspectRatio: {
          type: 'string',
          enum: ['16:9', '9:16', '1:1'],
          description: 'Video aspect ratio (16:9 for YouTube, 9:16 for TikTok/Shorts, 1:1 for Instagram).',
        },
        musicMode: {
          type: 'string',
          enum: ['tizita', 'bati', 'ambassel', 'whimsical', 'adventure', 'bedtime', 'none'],
          description: 'Authentic Ethiopian pentatonic music scale or global cinematic soundtrack.',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'ahadu_brainstorm_ideas',
    description: 'Takes a raw user concept and returns 3 creative Ethiopian and cinematic story angles with hooks, synopses, and aesthetic recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The raw topic or premise.' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'ahadu_write_script',
    description: 'Drafts a complete scene-by-scene script with voiceover narration, camera motions, visual art directions, and duration cues.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The approved story direction or angle.' },
        style: { type: 'string', description: 'Target visual art style.' },
        sceneCount: { type: 'number', description: 'Number of scenes (default: 4).' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'ahadu_enhance_prompt',
    description: 'Expands a simple user prompt into an elite, highly detailed animation visual direction with cinematic lighting, atmosphere, and textures.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Short prompt to expand.' },
        style: { type: 'string', description: 'Target art style.' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'ahadu_list_ethiopian_qenet',
    description: 'Returns available authentic Ethiopian pentatonic musical scales (Qenet) with their moods, historical context, and synth frequencies.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

const MCP_RESOURCES = [
  {
    uri: 'ahadu://styles',
    name: 'Animation Art Styles',
    description: 'List of all supported Ethiopian and global animation styles.',
    mimeType: 'application/json',
  },
  {
    uri: 'ahadu://qenet-music',
    name: 'Ethiopian Pentatonic Scales',
    description: 'Authentic Qenet scales (Tizita, Bati, Ambassel).',
    mimeType: 'application/json',
  },
  {
    uri: 'ahadu://camera-motions',
    name: 'Camera Motion Catalog',
    description: 'Supported 3D camera pan, zoom, tilt, and drift motions.',
    mimeType: 'application/json',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonrpc = '2.0', id = 1, method, params = {} } = body;

    switch (method) {
      // 1. MCP Handshake / Initialize
      case 'initialize':
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: 'Ahadu AI Animation Studio MCP Server',
              version: '1.2.0',
              description: 'Model Context Protocol (MCP) server for automated Ethiopian and global cartoon animation generation.',
            },
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
              prompts: { listChanged: false },
            },
          },
        });

      // 2. Tools listing
      case 'tools/list':
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS,
          },
        });

      // 3. Tool execution
      case 'tools/call': {
        const { name, arguments: args = {} } = params;

        if (name === 'ahadu_generate_video') {
          const prompt = args.prompt || 'A journey in Ethiopia';
          const style: ArtStyle = args.style || 'habesha-3d';
          const count = Number(args.sceneCount) || 4;
          const aspectRatio: AspectRatio = args.aspectRatio || '16:9';
          const musicMode: BgMusicMood = args.musicMode || 'tizita';

          const brainstorm = brainstormStoryAngles(prompt);
          const script = generateScriptFromAngle(brainstorm.angles[0], prompt, count);
          script.style = style;
          script.aspectRatio = aspectRatio;
          script.musicMode = musicMode;

          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `Successfully generated animation video project "${script.title}" with ${script.scenes.length} scenes.`,
                },
                {
                  type: 'json',
                  json: {
                    status: 'success',
                    script,
                    exportUrl: `/api/export-video`,
                  },
                },
              ],
            },
          });
        }

        if (name === 'ahadu_brainstorm_ideas') {
          const prompt = args.prompt || '';
          const result = brainstormStoryAngles(prompt);
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                { type: 'text', text: result.directorGreeting },
                { type: 'json', json: result.angles },
              ],
            },
          });
        }

        if (name === 'ahadu_write_script') {
          const prompt = args.prompt || '';
          const style: ArtStyle = args.style || 'habesha-3d';
          const count = Number(args.sceneCount) || 4;
          const brainstorm = brainstormStoryAngles(prompt);
          const script = generateScriptFromAngle(brainstorm.angles[0], prompt, count);
          script.style = style;

          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                { type: 'text', text: `Script drafted for "${script.title}" with ${script.scenes.length} acts.` },
                { type: 'json', json: script },
              ],
            },
          });
        }

        if (name === 'ahadu_enhance_prompt') {
          const prompt = args.prompt || '';
          const style: ArtStyle = args.style || 'habesha-3d';
          const enhanced = enhancePromptWithAI(prompt, style);
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                { type: 'text', text: enhanced },
              ],
            },
          });
        }

        if (name === 'ahadu_list_ethiopian_qenet') {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                { type: 'json', json: ETHIOPIAN_MUSIC_MODES },
              ],
            },
          });
        }

        return NextResponse.json(
          { jsonrpc: '2.0', id, error: { code: -32601, message: `Tool not found: ${name}` } },
          { status: 404 }
        );
      }

      // 4. Resources listing
      case 'resources/list':
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            resources: MCP_RESOURCES,
          },
        });

      // 5. Resource reading
      case 'resources/read': {
        const { uri } = params;
        if (uri === 'ahadu://styles') {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(ART_STYLES) }] },
          });
        }
        if (uri === 'ahadu://qenet-music') {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(ETHIOPIAN_MUSIC_MODES) }] },
          });
        }
        if (uri === 'ahadu://camera-motions') {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(CAMERA_MOTIONS) }] },
          });
        }
        return NextResponse.json(
          { jsonrpc: '2.0', id, error: { code: -32602, message: `Resource not found: ${uri}` } },
          { status: 404 }
        );
      }

      default:
        return NextResponse.json(
          { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } },
          { status: 400 }
        );
    }
  } catch (err: any) {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32603, message: err?.message || 'Internal MCP server error' } },
      { status: 500 }
    );
  }
}

// GET endpoint provides MCP Server metadata & discovery
export async function GET() {
  return NextResponse.json({
    status: 'online',
    protocol: 'Model Context Protocol (MCP)',
    version: '1.2.0',
    server: 'Ahadu AI Animation Studio',
    description: 'Connect your AI agents, Claude Desktop, Cursor, or Antigravity to Ahadu Animation Studio via standard JSON-RPC 2.0.',
    endpoints: {
      jsonRpc: '/api/mcp',
      methodsSupported: ['initialize', 'tools/list', 'tools/call', 'resources/list', 'resources/read'],
    },
    toolsCount: MCP_TOOLS.length,
    tools: MCP_TOOLS.map((t) => t.name),
  });
}

