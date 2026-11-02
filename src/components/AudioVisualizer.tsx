import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
  color?: 'amber' | 'emerald' | 'cyan';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 28,
  className = '',
  color = 'amber'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  const colorPalettes = {
    amber: {
      from: '#f59e0b',
      to: '#d97706',
      glow: 'rgba(245, 158, 11, 0.4)'
    },
    emerald: {
      from: '#10b981',
      to: '#059669',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
    cyan: {
      from: '#06b6d4',
      to: '#0891b2',
      glow: 'rgba(6, 182, 212, 0.4)'
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Height values array
    const heights = new Array(barCount).fill(4);
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const spacing = 3;
      const totalSpacing = (barCount - 1) * spacing;
      const barWidth = Math.max(2, (width - totalSpacing) / barCount);

      const pal = colorPalettes[color];

      phase += 0.08;

      for (let i = 0; i < barCount; i++) {
        let targetHeight = 4;
        if (isPlaying) {
          // Dynamic simulated organic frequency curve
          const wave1 = Math.sin(phase + i * 0.35);
          const wave2 = Math.cos(phase * 0.7 - i * 0.2);
          const wave3 = Math.sin(phase * 1.3 + i * 0.15);
          const combined = (wave1 + wave2 + wave3 + 3) / 6; // normalized 0..1
          // Bell curve distribution
          const bell = Math.sin((i / (barCount - 1)) * Math.PI);
          targetHeight = 6 + combined * (height - 12) * (0.4 + 0.6 * bell);
        }

        // Smooth transition
        heights[i] += (targetHeight - heights[i]) * 0.25;
        const currentH = Math.max(4, heights[i]);
        const x = i * (barWidth + spacing);
        const y = height - currentH;

        // Gradient bar
        const grad = ctx.createLinearGradient(0, y, 0, height);
        grad.addColorStop(0, pal.from);
        grad.addColorStop(1, pal.to);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, currentH, [2, 2, 0, 0]);
        ctx.fill();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPlaying, barCount, color]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={240}
        height={48}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
};
