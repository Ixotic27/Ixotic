export class GroundLayer {
  private groundLevel: number;

  constructor(height: number) {
    this.groundLevel = height * 0.85; // Ground sits at 85% of screen height
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, scrollOffset: number) {
    // Parallax speed 0.7x
    const parallaxOff = scrollOffset * 0.7;

    ctx.save();
    
    // Draw base ground
    ctx.fillStyle = "#0d1117"; // Very dark/navy
    ctx.fillRect(0, this.groundLevel, width, height - this.groundLevel);
    
    // Top border (Neon line)
    ctx.strokeStyle = "#4d4d4d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, this.groundLevel);
    ctx.lineTo(width, this.groundLevel);
    ctx.stroke();

    // Draw scrolling grid/tiles on ground
    ctx.strokeStyle = "rgba(0, 245, 255, 0.2)"; // Neon cyan faint grid
    ctx.lineWidth = 1;
    const tileSize = 60;
    
    const startX = -(parallaxOff % tileSize);
    
    ctx.beginPath();
    for (let x = startX; x < width; x += tileSize) {
      ctx.moveTo(x, this.groundLevel);
      ctx.lineTo(x, height);
    }
    ctx.stroke();

    ctx.restore();
  }

  getGroundLevel(): number {
    return this.groundLevel;
  }
}
