'use client';

import React, { useEffect, useRef } from 'react';

interface VideoParticleCanvasProps {
  isPlaying: boolean;
  styleMode: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
}

export const VideoParticleCanvas: React.FC<VideoParticleCanvasProps> = ({ isPlaying, styleMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors =
      styleMode === 'ethiopian-manuscript'
        ? ['#fef08a', '#fbbf24', '#f59e0b', '#d97706']
        : ['#f472b6', '#c084fc', '#fef08a', '#a78bfa', '#fb7185'];

    // Generate floating sparks / orbs
    const particleCount = 35;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3.5 + 1.2,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -(Math.random() * 0.9 + 0.3),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.3,
      pulseSpeed: Math.random() * 0.04 + 0.02,
    }));

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle cinematic light beam
      const lightGrad = ctx.createRadialGradient(
        width * 0.15,
        0,
        10,
        width * 0.25,
        height * 0.6,
        width * 0.6
      );
      lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.12)');
      lightGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.05)');
      lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw floating magical particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isPlaying) {
          p.x += p.speedX + Math.sin(tick * 0.02 + i) * 0.4;
          p.y += p.speedY;
        }

        // Wrap around borders
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha + Math.sin(tick * p.pulseSpeed) * 0.2;
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw audio equalizer visualizer bars in bottom right if playing
      if (isPlaying) {
        ctx.save();
        const barCount = 7;
        const barWidth = 3;
        const gap = 2.5;
        const startX = width - 40;
        const startY = height - 20;

        for (let b = 0; b < barCount; b++) {
          const barHeight = Math.sin(tick * 0.15 + b * 0.8) * 9 + 12;
          const grad = ctx.createLinearGradient(0, startY - barHeight, 0, startY);
          grad.addColorStop(0, '#f472b6');
          grad.addColorStop(1, '#a855f7');
          ctx.fillStyle = grad;
          ctx.fillRect(startX + b * (barWidth + gap), startY - barHeight, barWidth, barHeight);
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, styleMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
};
