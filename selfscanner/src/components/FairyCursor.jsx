import { useEffect, useRef } from "react";

export default function FairyCursor() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let particles = [];
    let mouse     = { x: 0, y: 0 };

    // Hide default cursor
    document.body.style.cursor = "none";

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Load fairy image
    const fairyImg = new Image();
    fairyImg.src   = "/fairy/fairy-cursor.png";

    window.addEventListener("mousemove", e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Spawn sparkles behind fairy
      for (let i = 0; i < 6; i++) {
        particles.push({
          x:      mouse.x + (Math.random() - 0.5) * 15,
          y:      mouse.y + (Math.random() - 0.5) * 15,
          size:   Math.random() * 5 + 2,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2 - 0.5,
          life:   1,
          decay:  Math.random() * 0.04 + 0.02,
          color:  ["#FFD700", "#FFB6C1", "#98FF98", "#E6E6FA", "#FFFACD"][
            Math.floor(Math.random() * 5)
          ],
          type: Math.random() > 0.5 ? "star" : "circle",
        });
      }
    });

    const drawStar = (x, y, size, color, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = color;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle  = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const angle2 = angle + Math.PI / 5;
        i === 0
          ? ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size)
          : ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        ctx.lineTo(
          x + Math.cos(angle2) * size * 0.4,
          y + Math.sin(angle2) * size * 0.4
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sparkles
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x    += p.speedX;
        p.y    += p.speedY;
        p.life -= p.decay;
        p.size *= 0.96;

        if (p.type === "star") {
          drawStar(p.x, p.y, p.size, p.color, p.life);
        } else {
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle   = p.color;
          ctx.shadowBlur  = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Draw fairy at cursor
      // Draw fairy at cursor
      if (fairyImg.complete && fairyImg.naturalWidth > 0) {
        ctx.drawImage(fairyImg, mouse.x - 20, mouse.y - 20, 45, 45);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}