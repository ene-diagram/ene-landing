declare global {
  /** Deploy base path from BASE_PATH, injected by vite.config.ts. */
  const __BASE_PATH__: string;
  interface Window {
    ene?: {
      render(el: HTMLElement, source: string, opts?: EneRenderOptions): Promise<EnePlayerApi | undefined>;
    };
    /** ene-export.js, loaded on demand by the playground */
    eneExport?: {
      exportVideo(svg: string, opts: { format: "gif" | "mp4" | "webm"; fps?: number; scale?: number; theme?: EneTheme; onProgress?: (done: number, total: number) => void; signal?: AbortSignal }):
        Promise<{ blob: Blob; format: "gif" | "mp4" | "webm"; frames: number; width: number; height: number }>;
      videoSupport(): Promise<{ mp4: boolean; webm: boolean }>;
      themedSvg(svg: string, theme?: EneTheme): string;
    };
  }
  type EneTheme = "auto" | "light" | "dark";
  interface EneRenderOptions { lang?: "en" | "ko"; autoplay?: boolean; loop?: boolean; choices?: number[]; onChoicesChange?: (choices: number[]) => void }
  interface EnePlayerApi { readonly choices: number[]; setChoices(choices: number[]): void; toSvg(): string; destroy(): void }
  namespace App {}
}
export {};
