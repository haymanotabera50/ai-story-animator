'use client';

import React, { useState } from 'react';
import { Lightbulb, FileText, Sliders, Film, Cpu } from 'lucide-react';
import { FullStoryScript, StoryAngle } from '@/types/director';
import { ArtStyle } from '@/types/animation';
import {
  brainstormStoryAngles,
  generateScriptFromAngle,
  refineScriptWithFeedback,
} from '@/lib/director-engine';
import { Step1Ideation } from './Step1Ideation';
import { Step2Script } from './Step2Script';
import { Step3Customize } from './Step3Customize';
import { Step4Video } from './Step4Video';
import { McpConsole } from './McpConsole';

const INITIAL_PROMPT =
  'A young Ethiopian shepherd boy named Kaldi in ancient Kaffa discovers his lively goats dancing with joy under wild coffee trees with glowing red cherries.';

export const DirectorWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activePrompt, setActivePrompt] = useState<string>(INITIAL_PROMPT);

  // Initialize with initial angle & script
  const [script, setScript] = useState<FullStoryScript>(() => {
    const initialBrainstorm = brainstormStoryAngles(INITIAL_PROMPT);
    return generateScriptFromAngle(initialBrainstorm.angles[0], INITIAL_PROMPT, 4);
  });

  const handleSelectAngle = (angle: StoryAngle, prompt: string) => {
    setActivePrompt(prompt);
    const newScript = generateScriptFromAngle(angle, prompt, 4);
    setScript(newScript);
    setCurrentStep(2);
  };

  const handleInstantGenerateVideo = (prompt: string, style: ArtStyle) => {
    setActivePrompt(prompt);
    const brainstorm = brainstormStoryAngles(prompt);
    const chosenAngle: StoryAngle = {
      ...(brainstorm.angles[0] || {
        id: 'angle-instant',
        title: 'The Animated Tale',
        amharicTitle: 'ተረት ተረት',
        hook: 'A vivid and enchanting animated adventure.',
        recommendedStyle: style,
        recommendedMusic: 'tizita',
        synopsis: prompt,
      }),
      recommendedStyle: style,
    };
    const newScript = generateScriptFromAngle(chosenAngle, prompt, 4);
    setScript(newScript);
    setCurrentStep(4);
  };

  const handlePolishScript = (instruction: string) => {
    const refined = refineScriptWithFeedback(script, instruction);
    setScript(refined);
  };

  const steps = [
    { num: 1, label: 'Ideas & Pitches', amharic: 'ሀሳብ ማመንጨት', icon: Lightbulb },
    { num: 2, label: 'Scene Script', amharic: 'ስክሪፕት ዝግጅት', icon: FileText },
    { num: 3, label: 'Customization', amharic: 'ምርጫዎች', icon: Sliders },
    { num: 4, label: 'Animated Video', amharic: 'የተጠናቀቀ ቪዲዮ', icon: Film },
    { num: 5, label: 'MCP Protocol', amharic: 'ኤም.ሲ.ፒ ኮንሶል', icon: Cpu },
  ];

  return (
    <div className="space-y-8">
      {/* 5-Step Interactive Stepper Tabs */}
      <div className="rounded-3xl border border-pink-200/90 bg-white/80 p-3 shadow-lg shadow-pink-500/5 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {steps.map((st) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num && currentStep !== 5;
            const Icon = st.icon;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-2.5 rounded-2xl p-2.5 sm:p-3 text-left transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-pink-400/50'
                    : isCompleted
                    ? 'bg-pink-50/70 text-purple-950 hover:bg-pink-100/60'
                    : 'bg-transparent text-purple-600/70 hover:bg-pink-50/40'
                }`}
              >
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl font-black text-xs ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isCompleted
                      ? 'bg-pink-200 text-pink-800'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-black truncate">{st.label}</span>
                  <span
                    className={`block text-[10px] font-serif truncate ${
                      isActive ? 'text-pink-100' : 'text-purple-600'
                    }`}
                  >
                    {st.amharic}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Views */}
      {currentStep === 1 && (
        <Step1Ideation
          initialPrompt={activePrompt}
          onSelectAngle={handleSelectAngle}
          onInstantGenerateVideo={handleInstantGenerateVideo}
          onBrainstorm={(p) => brainstormStoryAngles(p)}
        />
      )}

      {currentStep === 2 && (
        <Step2Script
          script={script}
          onUpdateScript={(updated) => setScript(updated)}
          onProceed={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
          onPolishScript={handlePolishScript}
        />
      )}

      {currentStep === 3 && (
        <Step3Customize
          script={script}
          onUpdateScript={(updated) => setScript(updated)}
          onProceed={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <Step4Video
          script={script}
          onBackToCustomize={() => setCurrentStep(3)}
          onNewStory={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 5 && (
        <McpConsole
          onVideoGeneratedByMcp={(mcpScript) => {
            setScript(mcpScript);
            setCurrentStep(4);
          }}
        />
      )}
    </div>
  );
};
