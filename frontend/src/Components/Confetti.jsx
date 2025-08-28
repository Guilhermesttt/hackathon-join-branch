import React, { useEffect, useRef } from 'react';

const Confetti = ({ trigger, duration = 3000 }) => {
  const canvasRef = useRef(null);
  const confettiRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Configuração do canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configuração do confete
    const confettiCount = 150;
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];

    class ConfettiPiece {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.w = Math.random() * 10 + 5;
        this.h = Math.random() * 5 + 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 3 + 2;
        this.gravity = 0.1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 1;
        this.fadeSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.rotation += this.rotationSpeed;
        this.opacity -= this.fadeSpeed;

        // Bounce off walls
        if (this.x > canvas.width || this.x < 0) {
          this.speedX *= -0.8;
        }

        // Bounce off floor
        if (this.y > canvas.height) {
          this.speedY *= -0.6;
          this.y = canvas.height;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        
        ctx.restore();
      }

      isDead() {
        return this.opacity <= 0 || this.y > canvas.height + 50;
      }
    }

    // Criar confete
    confettiRef.current = [];
    for (let i = 0; i < confettiCount; i++) {
      confettiRef.current.push(new ConfettiPiece());
    }

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atualizar e desenhar confete
      confettiRef.current = confettiRef.current.filter(piece => {
        piece.update();
        piece.draw();
        return !piece.isDead();
      });

      // Continuar animação se ainda há confete
      if (confettiRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    // Parar animação após duração especificada
    const stopTimer = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }, duration);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(stopTimer);
    };
  }, [trigger, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
};

export default Confetti;
