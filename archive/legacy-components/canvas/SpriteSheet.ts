export class SpriteSheet {
  private image: HTMLImageElement;
  private isLoaded: boolean = false;
  private frameWidth: number;
  private frameHeight: number;
  private totalFrames: number;

  constructor(src: string, frameWidth: number, frameHeight: number, totalFrames: number) {
    this.image = new Image();
    this.image.src = src;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.totalFrames = totalFrames;
    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  draw(ctx: CanvasRenderingContext2D, frameIndex: number, x: number, y: number, scale: number = 1) {
    if (!this.isLoaded) return;
    const safeFrame = frameIndex % this.totalFrames;
    const columns = Math.floor(this.image.width / this.frameWidth) || 1;
    const col = safeFrame % columns;
    const row = Math.floor(safeFrame / columns);

    ctx.drawImage(
      this.image,
      col * this.frameWidth, // source x
      row * this.frameHeight, // source y
      this.frameWidth, // source width
      this.frameHeight, // source height
      x,
      y,
      this.frameWidth * scale,
      this.frameHeight * scale
    );
  }
}
