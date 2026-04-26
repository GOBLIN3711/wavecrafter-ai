'use client';

import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
  color?: string;
}

export function WaveformVisualizer({
  isPlaying,
  barCount = 40,
  className = '',
  color = '#D4AF37',
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const barsRef = useRef<number[]>([]);

  useEffect(() => {
    // Initialize bar heights
    if (barsRef.current.length !== barCount) {
      barsRef.current = Array.from({ length: barCount }, () => Math.random() * 0.3);
    }
  }, [barCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const barWidth = Math.max(2, (w / barCount) * 0.6);
      const gap = (w / barCount) * 0.4;

      barsRef.current = barsRef.current.map((current, i) => {
        if (isPlaying) {
          const center = barCount / 2;
          const distFromCenter = Math.abs(i - center) / center;
          const maxH = h * (0.3 + (1 - distFromCenter) * 0.7);
          const target = Math.random() * maxH;
          const smoothing = 0.08 + distFromCenter * 0.04;
          return current + (target - current) * smoothing;
        }
        return current + (0.05 - current) * 0.03;
      });

      barsRef.current.forEach((barHeight, i) => {
        const x = i * (barWidth + gap) + gap / 2;
        const barH = Math.max(2, barHeight);
        const y = (h - barH) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barH);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color + 'aa');
        gradient.addColorStop(1, color);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, barWidth / 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}

export function EqualizerBars({ isPlaying, barCount = 24, className = '' }: { isPlaying: boolean; barCount?: number; className?: string }) {
  return (
    <div className={`flex items-end justify-center gap-[2px] h-16 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-amber-400 rounded-full transition-all duration-100"
          style={{
            height: isPlaying
              ? `${Math.max(8, Math.random() * 100)}%`
              : '8px',
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}
