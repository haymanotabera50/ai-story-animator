'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  Play,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Send,
  Zap,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { FullStoryScript } from '@/types/director';

interface McpConsoleProps {
  onVideoGeneratedByMcp: (script: FullStoryScript) => void;
}

export const McpConsole: React.FC<McpConsoleProps> = ({ onVideoGeneratedByMcp }) => {
  const [selectedTool, setSelectedTool] = useState<string>('ahadu_generate_video');
  const [promptInput, setPromptInput] = useState<string>(
    'A brave little girl in Lalibela discovers ancient glowing rock carvings that come alive at midnight.'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('habesha-3d');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [mcpLog, setMcpLog] = useState<{
    request: any;
    response: any;
    timestamp: string;
  } | null>(null);

  const handleExecuteTool = async () => {
    setIsRunning(true);
    const jsonRpcPayload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: selectedTool,
        arguments: {
          prompt: promptInput,
          style: selectedStyle,
          sceneCount: 4,
          aspectRatio: '16:9',
          musicMode: 'tizita',
        },
      },
    };

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonRpcPayload),
      });

      const data = await res.json();
      setMcpLog({
        request: jsonRpcPayload,
        response: data,
        timestamp: new Date().toLocaleTimeString(),
      });

      // If video/script was generated, pass it to player
      const scriptData = data?.result?.content?.find((c: any) => c.type === 'json')?.json?.script;
      if (scriptData) {
        onVideoGeneratedByMcp(scriptData);
      }
    } catch (err: any) {
      setMcpLog({
        request: jsonRpcPayload,
        response: { error: err?.message || 'Failed to execute MCP tool' },
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsRunning(false);
    }
  };

  const claudeDesktopConfig = JSON.stringify(
    {
      mcpServers: {
        ahadu_animation_studio: {
          url: typeof window !== 'undefined' ? `${window.location.origin}/api/mcp` : 'https://ai-story-animator.vercel.app/api/mcp',
          protocol: 'mcp-jsonrpc-2.0',
        },
      },
    },
    null,
    2
  );

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(claudeDesktopConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-xl shadow-pink-500/5 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-purple-950 sm:text-xl">
                  Model Context Protocol (MCP) Integration
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Active (JSON-RPC 2.0)
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-purple-700/80">
                Connect external AI agents, Claude Desktop, Antigravity, or Cursor to Ahadu via standard MCP tools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
            <span>Endpoint: /api/mcp</span>
          </div>
        </div>
      </div>

      {/* Interactive MCP Tool Executor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Tool Parameters */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-3xl border border-pink-200/90 bg-white/90 p-6 shadow-lg shadow-pink-500/5 backdrop-blur-xl space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-purple-950 block mb-1">
                Select MCP Tool (የመሳሪያ ምርጫ)
              </label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full rounded-xl border border-pink-200 bg-white p-2.5 text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="ahadu_generate_video">ahadu_generate_video (Master Animation Maker)</option>
                <option value="ahadu_brainstorm_ideas">ahadu_brainstorm_ideas (3 Story Pitches)</option>
                <option value="ahadu_write_script">ahadu_write_script (Scene Scriptwriter)</option>
                <option value="ahadu_enhance_prompt">ahadu_enhance_prompt (Cinematic Prompt Expander)</option>
                <option value="ahadu_list_ethiopian_qenet">ahadu_list_ethiopian_qenet (Music Scales)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-purple-950 block mb-1">
                Input Prompt Argument
              </label>
              <textarea
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Enter animation prompt..."
                className="w-full resize-none rounded-xl border border-pink-200 bg-purple-50/40 p-3 text-xs font-medium text-purple-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-purple-950 block mb-1">
                Art Style Parameter
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full rounded-xl border border-pink-200 bg-white p-2.5 text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="habesha-3d">Habesha 3D Pixar Animation</option>
                <option value="ethiopian-manuscript">Ancient Biranna Parchment (ብራና)</option>
                <option value="simien-folktale">Simien Highlands Anime (Ghibli)</option>
                <option value="pixar-3d">Classic 3D Disney/Pixar</option>
                <option value="watercolor">Storybook Watercolor</option>
                <option value="comic-book">Dynamic Pop Comic</option>
              </select>
            </div>

            <button
              onClick={handleExecuteTool}
              disabled={isRunning || !promptInput.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 py-3 text-xs font-black text-white shadow-lg shadow-purple-500/25 transition-all hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Executing MCP JSON-RPC Call...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Execute MCP Tool Call (tools/call)</span>
                </>
              )}
            </button>
          </div>

          {/* Claude Desktop & Cursor Config Box */}
          <div className="rounded-3xl border border-purple-200 bg-white/90 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-950">Claude Desktop MCP Config</span>
              <button
                onClick={handleCopyConfig}
                className="flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700"
              >
                {copied ? <Check className="h-3 w-3 stroke-[3]" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-purple-950 p-3 text-[11px] font-mono text-pink-200">
              {claudeDesktopConfig}
            </pre>
          </div>
        </div>

        {/* Right: Live MCP JSON-RPC Inspector Terminal */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-purple-900 bg-zinc-950 p-5 shadow-xl text-zinc-100 flex flex-col h-full min-h-[460px]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-zinc-300">
                  MCP Protocol Stream (JSON-RPC 2.0 Live Inspector)
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                {mcpLog ? mcpLog.timestamp : 'Listening on /api/mcp'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs">
              {mcpLog ? (
                <>
                  <div>
                    <span className="text-purple-400 font-bold">▶ REQUEST (Client ➔ MCP Server):</span>
                    <pre className="mt-1 overflow-x-auto rounded-xl bg-zinc-900/90 p-3 text-[11px] text-pink-300 border border-zinc-800">
                      {JSON.stringify(mcpLog.request, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-bold">◀ RESPONSE (MCP Server ➔ Client):</span>
                    <pre className="mt-1 overflow-x-auto rounded-xl bg-zinc-900/90 p-3 text-[11px] text-emerald-300 border border-zinc-800">
                      {JSON.stringify(mcpLog.response, null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-600 text-center space-y-2">
                  <Code2 className="h-8 w-8 text-zinc-700" />
                  <p className="text-xs">Select a tool on the left and click "Execute MCP Tool Call".</p>
                  <p className="text-[11px] text-zinc-500">
                    Or query <code className="text-pink-400">POST /api/mcp</code> from any external AI agent!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
