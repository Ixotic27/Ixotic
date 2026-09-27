import { SpriteSheet } from "../SpriteSheet";

export class CharacterSprite {
  private x: number;
  private y: number;
  private w: number = 48; // Sprite box width
  private h: number = 48; // Sprite box height
  private scale: number = 2; // Pixel art scaling
  
  private isMoving: boolean = false;
  private lastScroll: number = 0;
  
  private frameTimer: number = 0;
  private frameIndex: number = 0;

  // Placeholder styling if no SpriteSheet provides
  private idleFrames = 4;
  private walkFrames = 6;

  constructor(width: number, groundLevel: number) {
    // Center horizontally, stand on the ground
    this.x = width * 0.2; // Walk from the left side roughly
    this.y = groundLevel - (this.h * this.scale);
  }

  update(scrollOffset: number, deltaRaw: number, width: number, groundLevel: number) {
    // Update ground dynamically on resize
    this.y = groundLevel - (this.h * this.scale);
    
    const deltaScroll = Math.abs(scrollOffset - this.lastScroll);
    
    if (deltaScroll > 0) {
      this.isMoving = true;
      // Animate based on scroll distance (pixels mapped to frames)
      this.frameTimer += deltaScroll;
      if (this.frameTimer > 20) { // Every 20px of scroll, flip frame
        this.frameIndex = (this.frameIndex + 1) % this.walkFrames;
        this.frameTimer = 0;
      }
    } else {
      this.isMoving = false;
      // Time-based idle animation
      this.frameTimer += deltaRaw;
      if (this.frameTimer > 200) { // Every 200ms
        this.frameIndex = (this.frameIndex + 1) % this.idleFrames;
        this.frameTimer = 0;
      }
    }

    this.lastScroll = scrollOffset;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // For now, since we lack an actual image, we will draw a procedural placeholder sprite
    // that mimics an 8-bit character
    
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    // Body
    ctx.fillStyle = "#bf5fff"; // Purple hero
    ctx.fillRect(16, 16, 16, 20); // main body

    // Head
    ctx.fillStyle = "#ffb8b8"; // Skin tone
    ctx.fillRect(14, 4, 20, 12);
    
    // Eyes
    ctx.fillStyle = "#000";
    ctx.fillRect(26, 8, 2, 2);
    ctx.fillRect(30, 8, 2, 2);

    // Movement animation (legs)
    ctx.fillStyle = "#00f5ff"; // Cyan boots
    if (this.isMoving) {
      if (this.frameIndex % 2 === 0) {
        // Leg 1 forward
        ctx.fillRect(16, 36, 6, 8);
        ctx.fillRect(26, 36, 6, 4);
      } else {
        // Leg 2 forward
        ctx.fillRect(16, 36, 6, 4);
        ctx.fillRect(26, 36, 6, 8);
      }
    } else {
      // Idle legs
      ctx.fillRect(16, 36, 6, 6);
      ctx.fillRect(26, 36, 6, 6);
      
      // Idle breathe
      if (this.frameIndex % 2 === 0) {
         ctx.translate(0, -1); // float slightly
      }
    }

    ctx.restore();
  }
}
