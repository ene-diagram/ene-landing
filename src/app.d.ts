declare global {
  /** Deploy base path from BASE_PATH, injected by vite.config.ts. */
  const __BASE_PATH__: string;
  interface Window {
    ene?: {
      render(el: HTMLElement, source: string, opts?: { lang?: "en" | "ko"; autoplay?: boolean; loop?: boolean }): Promise<unknown>;
    };
  }
  namespace App {}
}
export {};
