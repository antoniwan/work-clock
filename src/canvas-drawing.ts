export function drawFestiveCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size to match container
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw confetti
  const confettiCount = 50;
  for (let i = 0; i < confettiCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 10 + 5;
    const hue = Math.random() * 360;
    
    ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw stars
  const starCount = 20;
  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 15 + 10;
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    drawStar(ctx, x, y, 5, size, size / 2);
    ctx.fill();
  }

  // Draw balloons
  const balloonCount = 8;
  for (let i = 0; i < balloonCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * (height * 0.6) + height * 0.2;
    const size = Math.random() * 30 + 20;
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Balloon
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // String
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + size * 1.2);
    ctx.lineTo(x, y + size * 2);
    ctx.stroke();
  }
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
): void {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

