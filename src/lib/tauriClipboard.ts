/**
 * Tauri 剪贴板适配工具
 * 支持浏览器与 Tauri 双环境
 */

type TauriInvoke = <T>(cmd: string, ...args: unknown[]) => Promise<T>;

/**
 * 获取可用的 Tauri 调用方法(invoke)（兼容 1.x 与 2.x）
 */
export function getTauriInvoke(): TauriInvoke | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const tauri = window.__TAURI__;
  if (!tauri) {
    return null;
  }

  if (typeof tauri.core?.invoke === 'function') {
    return tauri.core.invoke;
  }

  if (typeof tauri.invoke === 'function') {
    return tauri.invoke;
  }

  if (typeof tauri.tauri?.invoke === 'function') {
    return tauri.tauri.invoke;
  }

  return null;
}

/**
 * 检测是否处于 Tauri 环境
 */
export function isTauriEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  if (getTauriInvoke()) {
    return true;
  }

  if (typeof window.__TAURI_INTERNALS__ !== 'undefined') {
    return true;
  }

  const userAgent = navigator?.userAgent ?? '';
  return userAgent.includes('Tauri') || userAgent.includes('wry');
}

/**
 * 降级方案：使用 复制命令(execCommand) 复制
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (error) {
    console.warn('降级复制失败:', error);
    return false;
  }
}

/**
 * 通用文本复制函数
 * Tauri 优先使用 剪贴板管理插件(clipboard-manager)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  const invoke = getTauriInvoke();
  const isTauri = isTauriEnvironment();

  if (invoke) {
    try {
      await invoke('plugin:clipboard-manager|write_text', { text });
      return true;
    } catch (error) {
      console.warn('Tauri 剪贴板写入失败，尝试降级方案:', error);
    }
  }

  if (isTauri) {
    return fallbackCopyToClipboard(text);
  }

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('浏览器剪贴板 API(Clipboard API) 复制失败，尝试降级方案:', error);
    }
  }

  return fallbackCopyToClipboard(text);
}

/**
 * 通用图片复制函数
 * Tauri 环境下依赖 剪贴板管理插件(clipboard-manager)
 */
export async function copyImageToClipboard(imageDataUrl: string): Promise<boolean> {
  const invoke = getTauriInvoke();
  const isTauri = isTauriEnvironment();

  if (isTauri && invoke) {
    try {
      const base64Data = imageDataUrl.includes(',')
        ? imageDataUrl.split(',')[1]
        : imageDataUrl;
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      await invoke('plugin:clipboard-manager|write_image', { image: Array.from(bytes) });
      return true;
    } catch (error) {
      console.warn('Tauri 图片复制失败:', error);
      return false;
    }
  }

  if (isTauri) {
    return false;
  }

  try {
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    if (
      !navigator.clipboard ||
      typeof navigator.clipboard.write !== 'function' ||
      typeof ClipboardItem === 'undefined'
    ) {
      return false;
    }

    const mimeType = blob.type || 'image/png';
    const item = new ClipboardItem({ [mimeType]: blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (error) {
    console.warn('浏览器图片复制失败:', error);
    return false;
  }
}
