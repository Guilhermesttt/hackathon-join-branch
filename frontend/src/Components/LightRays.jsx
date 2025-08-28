import React, { useEffect, useRef, useCallback } from 'react';

const LightRays = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Throttle para melhor performance
  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Detectar dispositivo móvel
  const isMobile = useCallback(() => {
    return window.innerWidth <= 768;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Configurar canvas com melhor performance
    const resizeCanvas = throttle(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }, 100);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Partículas otimizadas baseadas no dispositivo
    const particles = [];
    const particleCount = isMobile() ? 25 : 50;
    const maxConnections = isMobile() ? 3 : 5;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; // Reduzido para melhor performance
        this.speedX = (Math.random() * 0.3 - 0.15) * (isMobile() ? 0.5 : 1);
        this.speedY = (Math.random() * 0.3 - 0.15) * (isMobile() ? 0.5 : 1);
        this.opacity = Math.random() * 0.2 + 0.05; // Reduzido para melhor performance
        this.connections = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Função de animação otimizada
    const animate = (currentTime) => {
      // Throttle para 60fps
      if (currentTime - lastTimeRef.current < 16) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradiente de fundo sutil e otimizado
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.015)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Atualizar e desenhar partículas
      particles.forEach(particle => {
        particle.update();
        particle.draw();
        particle.connections = 0; // Reset connections
      });

      // Conectar partículas próximas (limitado para performance)
      particles.forEach((particle, index) => {
        if (particle.connections >= maxConnections) return;
        
        for (let j = index + 1; j < particles.length; j++) {
          if (particles[j].connections >= maxConnections) continue;
          
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < (isMobile() ? 80 : 100)) {
            ctx.save();
            ctx.globalAlpha = ((isMobile() ? 80 : 100) - distance) / (isMobile() ? 80 : 100) * 0.08;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
            
            particle.connections++;
            particles[j].connections++;
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    // Iniciar animação
    animate(0);

    // Cleanup otimizado
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Pausar animação quando não visível para economizar bateria
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        opacity: 0.25,
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};

export default LightRays;
