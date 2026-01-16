/**
 * Tauri 全局类型声明
 * 兼容 Tauri 1.x 与 2.x
 */

declare global {
  interface Window {
    /**
     * Tauri 注入的全局对象
     */
    __TAURI__?: {
      /**
       * Tauri 2.x 核心模块
       */
      core?: {
        invoke: <T>(cmd: string, ...args: unknown[]) => Promise<T>;
      };

      /**
       * Tauri 1.x 直接 invoke
       */
      invoke?: <T>(cmd: string, ...args: unknown[]) => Promise<T>;

      /**
       * Tauri 1.x tauri 模块
       */
      tauri?: {
        invoke: <T>(cmd: string, ...args: unknown[]) => Promise<T>;
      };
    };

    /**
     * Tauri 1.x 内部标记
     */
    __TAURI_INTERNALS__?: unknown;
  }
}

export {};
