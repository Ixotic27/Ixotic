export type RoomId = "overview" | "study" | "library" | "kitchen" | "sports";
export type HouseAction = "imac" | "gameboy" | "books" | "coffee" | "tennis" | "lamp" | "cat" | "plant";
export type PanelId = "imac" | "gameboy" | "books" | "tennis" | null;
export interface HouseSceneProps {
  /** Continuous camera tour: 0 overview, 1 study, 2 library, 3 kitchen, 4 sports. */
  progress: number;
  night: boolean;
  reducedMotion: boolean;
  paused: boolean;
  coffeeTrigger: number;
  lampOn: boolean;
  watered: boolean;
  onAction: (action: HouseAction) => void;
  onReady: () => void;
  onError: () => void;
}
