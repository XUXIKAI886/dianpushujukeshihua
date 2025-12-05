/**
 * Tauri 环境兼容工具函数
 * 支持浏览器和 Tauri 桌面应用双环境
 */

// Tauri Window 类型定义
interface TauriWindow extends Window {
  __TAURI__: {
    core: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      invoke: (command: string, ...args: any[]) => Promise<any>;
    };
  };
}

/**
 * 检测是否在 Tauri 环境中运行
 * @returns {boolean} true=Tauri环境, false=浏览器环境
 */
export function isTauriEnvironment(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as Partial<TauriWindow>).__TAURI__ !== 'undefined' &&
    typeof (window as Partial<TauriWindow>).__TAURI__?.core !== 'undefined' &&
    typeof (window as Partial<TauriWindow>).__TAURI__?.core?.invoke === 'function'
  );
}

/**
 * 通用复制到剪贴板函数 - 支持浏览器和Tauri
 *
 * 策略说明：
 * 1. 优先使用 execCommand('copy') - 兼容性最好，在 Tauri webview 中可用
 * 2. 降级使用 navigator.clipboard.writeText - 现代浏览器首选
 * 3. Tauri 环境下不使用 clipboard-manager 插件（远程 URL 会被拒绝）
 *
 * @param {string} text - 要复制的文本内容
 * @returns {Promise<boolean>} 复制是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  const isTauri = isTauriEnvironment();

  // 方法1: 使用 execCommand (兼容性最好，Tauri webview 支持)
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);

    // 选中文本
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    // 执行复制
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (success) {
      console.log(`✅ [${isTauri ? 'Tauri-execCommand' : '浏览器-execCommand'}] 复制成功`);
      return true;
    }
  } catch (error) {
    console.error('❌ [execCommand] 复制失败:', error);
  }

  // 方法2: 降级使用 Clipboard API (仅在非 Tauri 或 HTTPS 环境下可用)
  if (!isTauri) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('✅ [浏览器-Clipboard API] 复制成功');
      return true;
    } catch (error) {
      console.error('❌ [浏览器-Clipboard API] 复制失败:', error);
    }
  }

  console.error('❌ 所有复制方法都失败');
  return false;
}

/**
 * 通用图片复制到剪贴板函数 - 支持浏览器和Tauri
 *
 * 策略说明：
 * 1. Tauri 环境：先保存为临时文件，再提示用户手动复制（Tauri webview 不支持 Clipboard API 的 write）
 * 2. 浏览器环境：使用 navigator.clipboard.write() API
 *
 * @param {string} imageDataUrl - 图片Data URL (data:image/png;base64,...)
 * @returns {Promise<boolean>} 复制是否成功
 */
export async function copyImageToClipboard(imageDataUrl: string): Promise<boolean> {
  const isTauri = isTauriEnvironment();

  // Tauri 环境 - Clipboard API 被权限策略阻止，使用替代方案
  if (isTauri) {
    try {
      console.log('🖼️ [Tauri] 尝试复制图片到剪贴板...');

      // 尝试使用 Tauri clipboard 插件（如果可用）
      try {
        // 转换 base64 为字节数组
        const base64Data = imageDataUrl.includes(',')
          ? imageDataUrl.split(',')[1]
          : imageDataUrl;

        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 尝试调用 Tauri 的剪贴板图片复制功能
        await (window as unknown as TauriWindow).__TAURI__.core.invoke(
          'plugin:clipboard-manager|write_image',
          { image: Array.from(bytes) }
        );

        console.log('✅ [Tauri-clipboard-manager] 图片复制成功');
        return true;
      } catch (clipboardError) {
        console.warn('⚠️ [Tauri] clipboard-manager 插件不可用或调用失败:', clipboardError);
      }

      // 降级方案：在 Tauri 中无法直接复制图片，提示用户使用下载功能
      console.log('ℹ️ [Tauri] 桌面应用暂不支持直接复制图片，请使用下载功能');
      return false;
    } catch (error) {
      console.error('❌ [Tauri] 图片复制失败:', error);
      return false;
    }
  }

  // 浏览器环境 - 使用标准 Clipboard API
  try {
    // 将 base64 图片转换为 Blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    // 确保是 PNG 格式以获得最佳兼容性
    let pngBlob: Blob;
    if (blob.type === 'image/png') {
      pngBlob = blob;
    } else {
      // 转换为 PNG
      pngBlob = await new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法获取 canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((newBlob) => {
            if (newBlob) {
              resolve(newBlob);
            } else {
              reject(new Error('转换 PNG 失败'));
            }
          }, 'image/png');
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
      });
    }

    // 使用 Clipboard API 复制图片
    if (navigator.clipboard && 'write' in navigator.clipboard) {
      const item = new ClipboardItem({ 'image/png': pngBlob });
      await navigator.clipboard.write([item]);
      console.log('✅ [浏览器-Clipboard API] 图片复制成功');
      return true;
    } else {
      console.error('❌ [浏览器] Clipboard API 不可用');
      return false;
    }
  } catch (error) {
    console.error('❌ [浏览器] 图片复制失败:', error);
    return false;
  }
}

/**
 * 通用图片下载函数 - 支持浏览器和Tauri
 * @param {string} imageDataUrl - 图片Data URL (data:image/png;base64,...)
 * @param {string} filename - 保存的文件名 (如: 'image.png')
 * @returns {Promise<boolean>} 下载是否成功
 */
export async function downloadImage(imageDataUrl: string, filename: string = 'image.png'): Promise<boolean> {
  const isTauri = isTauriEnvironment();

  // 浏览器环境
  if (!isTauri) {
    try {
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('✅ [浏览器] 图片下载成功');
      return true;
    } catch (error) {
      console.error('❌ [浏览器] 下载失败:', error);
      return false;
    }
  }

  // Tauri 环境
  try {
    console.log('🖼️ [Tauri] 开始保存图片:', filename);

    // 显示文件保存对话框
    const filePath = await (window as unknown as TauriWindow).__TAURI__.core.invoke('plugin:dialog|save', {
      options: {
        defaultPath: filename,
        title: '保存图片',
        filters: [{
          name: '图片文件',
          extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif']
        }]
      }
    }) as string | null;

    // 用户取消保存
    if (!filePath) {
      console.log('⚠️ [Tauri] 用户取消了保存');
      return false;
    }

    console.log('📁 [Tauri] 选择的保存路径:', filePath);

    // 转换Base64为字节数组
    const base64Data = imageDataUrl.includes(',')
      ? imageDataUrl.split(',')[1]
      : imageDataUrl;

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('💾 [Tauri] 准备写入文件, 大小:', bytes.length, 'bytes');

    // 写入文件
    await (window as unknown as TauriWindow).__TAURI__.core.invoke(
      'plugin:fs|write_file',
      bytes,
      {
        headers: {
          path: encodeURIComponent(filePath),
          options: JSON.stringify({})
        }
      }
    );

    console.log('✅ [Tauri] 图片保存成功!');
    alert('图片保存成功!\n保存位置: ' + filePath);
    return true;
  } catch (error) {
    console.error('❌ [Tauri] 保存失败:', error);
    console.error('错误详情:', error instanceof Error ? error.message : String(error));
    alert('保存失败: ' + (error instanceof Error ? error.message : String(error)));
    return false;
  }
}

/**
 * 通用表格下载函数 - 支持浏览器和Tauri
 * @param {string} csvContent - CSV格式内容
 * @param {string} filename - 保存的文件名 (如: 'data.csv')
 * @returns {Promise<boolean>} 下载是否成功
 */
export async function downloadTable(csvContent: string, filename: string = 'table.csv'): Promise<boolean> {
  const isTauri = isTauriEnvironment();

  // 浏览器环境
  if (!isTauri) {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('✅ [浏览器] 表格下载成功');
      return true;
    } catch (error) {
      console.error('❌ [浏览器] 下载失败:', error);
      return false;
    }
  }

  // Tauri 环境
  try {
    console.log('📊 [Tauri] 开始保存表格:', filename);

    // 显示文件保存对话框
    const filePath = await (window as unknown as TauriWindow).__TAURI__.core.invoke('plugin:dialog|save', {
      options: {
        defaultPath: filename,
        title: '保存表格',
        filters: [{
          name: 'CSV文件',
          extensions: ['csv']
        }, {
          name: 'Excel文件',
          extensions: ['xlsx', 'xls']
        }]
      }
    }) as string | null;

    // 用户取消保存
    if (!filePath) {
      console.log('⚠️ [Tauri] 用户取消了保存');
      return false;
    }

    console.log('📁 [Tauri] 选择的保存路径:', filePath);

    // 转换字符串为字节数组
    const encoder = new TextEncoder();
    const bytes = encoder.encode(csvContent);

    console.log('💾 [Tauri] 准备写入文件, 大小:', bytes.length, 'bytes');

    // 写入文件
    await (window as unknown as TauriWindow).__TAURI__.core.invoke(
      'plugin:fs|write_file',
      bytes,
      {
        headers: {
          path: encodeURIComponent(filePath),
          options: JSON.stringify({})
        }
      }
    );

    console.log('✅ [Tauri] 表格保存成功!');
    alert('表格保存成功!\n保存位置: ' + filePath);
    return true;
  } catch (error) {
    console.error('❌ [Tauri] 保存失败:', error);
    console.error('错误详情:', error instanceof Error ? error.message : String(error));
    alert('保存失败: ' + (error instanceof Error ? error.message : String(error)));
    return false;
  }
}
