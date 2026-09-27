export class CityLayer {
  private buildings: { x: number; w: number; h: number; color: string; windows: {x: number, y: number}[] }[] = [];
  
  constructor(width: number, height: number) {
    this.generateBuildings(width, height);
  }

  generateBuildings(width: number, height: number) {
    this.buildings = [];
    let currentX = 0;
    const colors = ["#1a1b26", "#16161e", "#1b1d2b"];
    
    // Generate enough buildings to cover at least 3x screen width for scrolling
    while (currentX < width * 3) {
      const w = 40 + Math.random() * 80;
      const h = height * 0.3 + Math.random() * (height * 0.4);
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const windows: {x: number, y: number}[] = [];
      for(let wy = height - h + 20; wy < height - 20; wy += 30) {
        for(let wx = 10; wx < w - 10; wx += 20) {
          if (Math.random() > 0.3) {
            windows.push({ x: wx, y: wy });
          }
        }
      }
      
      this.buildings.push({ x: currentX, w, h, color, windows });
      currentX += w + (Math.random() * 20); // Small gap sometimes
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, scrollOffset: number) {
    const parallaxOff = scrollOffset * 0.2; // Move at 0.2x speed
    
    ctx.save();
    
    this.buildings.forEach((b) => {
      // Calculate wrapped X position for endless scroll
      const drawX = (b.x - parallaxOff) % (width * 3);
      const finalX = drawX < -b.w ? drawX + width * 3 : drawX;
      
      if (finalX > width) return; // Optimize: don't draw offscreen explicitly 
      
      ctx.fillStyle = b.color;
      // Buildings originate from the bottom
      ctx.fillRect(finalX, height - b.h, b.w, b.h);
      
      // Draw some windows
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      b.windows.forEach(win => {
        ctx.fillRect(finalX + win.x, win.y, 10, 15);
      });
    });

    ctx.restore();
  }
}
