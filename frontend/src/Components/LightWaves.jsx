import React, { useEffect, useRef } from 'react';

const LightWaves = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configuração do canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configuração das ondas
    const waves = [];
    const waveCount = 3;

    class Wave {
      constructor(y, amplitude, frequency, speed, color) {
        this.y = y;
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.speed = speed;
        this.color = color;
        this.offset = 0;
        this.opacity = 0.1;
      }

      update() {
        this.offset += this.speed;
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(0, this.y);

        for (let x = 0; x <= canvas.width; x += 2) {
          const y = this.y + Math.sin((x + this.offset) * this.frequency) * this.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // Criar gradiente
        const gradient = ctx.createLinearGradient(0, this.y - this.amplitude, 0, this.y + this.amplitude);
        gradient.addColorStop(0, `${this.color}00`);
        gradient.addColorStop(0.5, `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${this.color}00`);

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Criar ondas
    waves.push(new Wave(canvas.height * 0.3, 30, 0.02, 0.5, '#ffffff'));
    waves.push(new Wave(canvas.height * 0.6, 40, 0.015, 0.3, '#ffffff'));
    waves.push(new Wave(canvas.height * 0.8, 25, 0.025, 0.7, '#ffffff'));

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenhar ondas
      waves.forEach(wave => {
        wave.update();
        wave.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 animation-initial animate-fade-in-scale animation-delay-600"
      style={{ background: 'transparent' }}
    />
  );
};

export default LightWaves;
