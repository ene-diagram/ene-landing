declare global {
  interface Window {
    ene?: {
      render(el: HTMLElement, source: string, opts?: { lang?: "en" | "ko"; autoplay?: boolean; loop?: boolean }): Promise<unknown>;
    };
  }
  namespace App {}
}
export {};
