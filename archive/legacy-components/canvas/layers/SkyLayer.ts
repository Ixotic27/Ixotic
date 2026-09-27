export class SkyLayer {
  private starData: { x: number; y: number; r: number; opacity: number; blinkSpeed: number }[] = [];

  constructor(width: number, height: number) {
    this.initStars(width, height);
  }

  initStars(width: number, height: number) {
    this.starData = [];
    for (let i = 0; i < 150; i++) {
      this.starData.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.7), // Stars mostly in top 70%
        r: Math.random() * 1.5,
        opacity: Math.random(),
        blinkSpeed: 0.005 + Math.random() * 0.01,
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, scrollOffset: number, time: number) {
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#0a0a0f"); // Dark sky
    grad.addColorStop(1, "#1a1a2e"); // Lighter near horizon
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw stars (with parallax)
    const parallaxOff = scrollOffset * 0.1;
    
    this.starData.forEach((star) => {
      star.opacity += star.blinkSpeed;
      if (star.opacity > 1 || star.opacity < 0.2) {
        star.blinkSpeed *= -1;
      }
      
      const drawX = (star.x - parallaxOff) % width;
      const finalX = drawX < 0 ? drawX + width : drawX;

      ctx.beginPath();
      ctx.arc(finalX, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
      ctx.fill();
    });

    // Draw moon
    ctx.beginPath();
    const moonX = (width * 0.8 - parallaxOff * 0.5) % width;
    const finalMoonX = moonX < -100 ? moonX + width + 100 : moonX;
    ctx.arc(finalMoonX, height * 0.2, 40, 0, Math.PI * 2);
    ctx.fillStyle = "#facc15"; // Yellow/amber moon
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#facc15";
    ctx.fill();
    ctx.shadowBlur = 0; // Reset
  }
}
