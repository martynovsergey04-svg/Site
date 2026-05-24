import { useEffect, useRef } from "react";
import { motion } from "motion/react";

export default function NetworkBackground({ animationState = 0, isMobile = false }: { animationState?: number, isMobile?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(animationState);
  const isMobileRef = useRef(isMobile);

  useEffect(() => {
    stateRef.current = animationState;
    isMobileRef.current = isMobile;
  }, [animationState, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const numParticles = isMobileRef.current ? 40 : 120;
    
    // Track mouse position
    let mouse = { x: -1000, y: -1000 };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      color: string;
      density: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.color = `rgba(34, 211, 238, ${Math.random() * 0.8 + 0.2})`;
        this.density = (Math.random() * 30) + 1;
      }

      update() {
        if (!canvas) return;
        
        const state = stateRef.current;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        if (state === 1 || state === 2) { // Sucking or holding inside
          let dx = centerX - this.x;
          let dy = centerY - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            let angle = Math.atan2(dy, dx);
            angle += 0.2; // Vortex spin
            let speed = 10 + (250 / Math.max(distance, 1));
            this.x += Math.cos(angle) * speed;
            this.y += Math.sin(angle) * speed;
          }
          this.draw();
          return;
        } else if (state === 3) { // Rewinding
          let dx = this.baseX - this.x;
          let dy = this.baseY - this.y;
          this.x += dx * 0.05;
          this.y += dy * 0.05;
          this.size = this.size + (this.baseSize - this.size) * 0.05;
          this.draw();
          return;
        }

        // State 0 (or default): Slow natural movement
        this.size = this.baseSize;
        this.baseX += this.vx;
        this.baseY += this.vy;

        if (this.baseX < 0 || this.baseX > canvas.width) this.vx *= -1;
        if (this.baseY < 0 || this.baseY > canvas.height) this.vy *= -1;

        // Mouse interaction
        let dx = mouse.x - this.baseX;
        let dy = mouse.y - this.baseY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        const maxDistance = 250;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.x = this.baseX - directionX;
          this.y = this.baseY - directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 15;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 15;
          }
        }
        
        this.draw();
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(this.size, 0), 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const connect = () => {
      let opacityValue = 1;
      const state = stateRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDist = (canvas.width / 8) * (canvas.height / 8);
      const limitCenterDist = (canvas.width * canvas.height * 0.5);

      for (let a = 0; a < particles.length; a++) {
        const pA = particles[a];
        // Draw normal inter-particle connections
        for (let b = a + 1; b < particles.length; b++) {
          const pB = particles[b];
          let dx = pA.x - pB.x;
          let dy = pA.y - pB.y;
          let distance = dx * dx + dy * dy;

          if (distance < maxDist) {
            opacityValue = 1 - (distance / 25000);
            if (opacityValue > 0.05) {
              ctx!.strokeStyle = `rgba(34, 211, 238, ${opacityValue * 0.2})`;
              ctx!.lineWidth = 1;
              ctx!.beginPath();
              ctx!.moveTo(pA.x, pA.y);
              ctx!.lineTo(pB.x, pB.y);
              ctx!.stroke();
            }
          }
        }
        
        // When sucking, also draw neural connections trailing into the black hole
        if (state === 1 || state === 2) {
          let cxDist = pA.x - centerX;
          let cyDist = pA.y - centerY;
          let distToCenter = cxDist * cxDist + cyDist * cyDist;
             
          if (distToCenter > 100 && distToCenter < (canvas.width * canvas.height)) {
            opacityValue = 1 - (distToCenter / limitCenterDist);
            if (opacityValue > 0.05) {
              ctx!.strokeStyle = `rgba(34, 211, 238, ${opacityValue * 0.4})`;
              ctx!.lineWidth = 1.5;
              ctx!.beginPath();
              ctx!.moveTo(pA.x, pA.y);
              // Draw line towards the center
              ctx!.lineTo(centerX, centerY);
              ctx!.stroke();
            }
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#050810] overflow-hidden flex flex-col items-center justify-center">
      <motion.div 
        className="absolute inset-0 border-0"
        animate={
          animationState === 1 || animationState === 2 
            ? { opacity: 0 } 
            : animationState === 3 
            ? { opacity: [0, 1] }
            : { opacity: 1 }
        }
        transition={{ 
          duration: animationState === 1 ? 2.5 : animationState === 3 ? 2 : 0, 
          ease: "easeInOut" 
        }}
      >
        {/* Tech Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-40 w-px h-64 bg-cyan-500"></div>
          <div className="absolute top-20 left-40 w-64 h-px bg-cyan-500"></div>
          <div className="absolute bottom-40 right-20 w-px h-96 bg-blue-600"></div>
          <div className="absolute bottom-40 right-0 w-20 h-px bg-blue-600"></div>
          <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <div className="absolute top-1/4 right-1/4 w-4 h-4 border border-cyan-500 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]"></div>
        </div>

        {/* Atmospheric Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Circuit Grid */}
        <div
          className="absolute inset-0 opacity-100 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            backgroundPosition: 'center center'
          }}
        />

        {/* Interactive Particles Layer */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80" />
      </motion.div>
    </div>
  );
}
