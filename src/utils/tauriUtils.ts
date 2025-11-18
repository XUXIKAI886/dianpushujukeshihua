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
 * @param {string} text - 要复制的文本内容
 * @returns {Promise<boolean>} 复制是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  const isTauri = isTauriEnvironment();

  // 浏览器环境
  if (!isTauri) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('✅ [浏览器] 复制成功');
      return true;
    } catch (error) {
      console.error('❌ [浏览器] 复制失败:', error);
      // 降级方案：使用 execCommand
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (success) {
          console.log('✅ [浏览器-降级] 复制成功');
          return true;
        }
      } catch (fallbackError) {
        console.error('❌ [浏览器-降级] 复制失败:', fallbackError);
      }
      return false;
    }
  }

  // Tauri 环境
  try {
    console.log('📋 [Tauri] 开始复制到剪贴板');

    await (window as unknown as TauriWindow).__TAURI__.core.invoke('plugin:clipboard-manager|write_text', {
      data: {
        text: text
      }
    });

    console.log('✅ [Tauri] 复制成功');
    return true;
  } catch (error) {
    console.error('❌ [Tauri] 复制失败:', error);
    console.error('错误详情:', error instanceof Error ? error.message : String(error));

    // 降级方案：尝试使用浏览器 API
    try {
      await navigator.clipboard.writeText(text);
      console.log('✅ [Tauri-降级] 使用浏览器 API 复制成功');
      return true;
    } catch (fallbackError) {
      console.error('❌ [Tauri-降级] 复制失败:', fallbackError);
      return false;
    }
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
