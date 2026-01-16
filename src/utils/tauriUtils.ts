import { getTauriInvoke, isTauriEnvironment } from '@/lib/tauriClipboard';

/**
 * Tauri 环境兼容工具函数
 * 支持浏览器和 Tauri 桌面应用双环境
 */

/**
 * 通用图片下载函数 - 支持浏览器和Tauri
 * @param {string} imageDataUrl - 图片数据URL(Data URL) (data:image/png;base64,...)
 * @param {string} filename - 保存的文件名 (如: 'image.png')
 * @returns {Promise<boolean>} 下载是否成功
 */
export async function downloadImage(imageDataUrl: string, filename: string = 'image.png'): Promise<boolean> {
  const isTauri = isTauriEnvironment();
  const invoke = getTauriInvoke();

  // 浏览器环境或无法调用 Tauri 接口(API)
  if (!isTauri || !invoke) {
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
    const filePath = await invoke('plugin:dialog|save', {
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
      console.log('ℹ️ [Tauri] 用户取消了保存');
      return false;
    }

    console.log('📌 [Tauri] 选择的保存路径:', filePath);

    // 转换 Base64 编码(Base64) 为字节数组
    const base64Data = imageDataUrl.includes(',')
      ? imageDataUrl.split(',')[1]
      : imageDataUrl;

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('🧾 [Tauri] 准备写入文件, 大小:', bytes.length, '字节');

    // 写入文件
    await invoke(
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
  const invoke = getTauriInvoke();

  // 浏览器环境或无法调用 Tauri 接口(API)
  if (!isTauri || !invoke) {
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
    console.log('📄 [Tauri] 开始保存表格:', filename);

    // 显示文件保存对话框
    const filePath = await invoke('plugin:dialog|save', {
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
      console.log('ℹ️ [Tauri] 用户取消了保存');
      return false;
    }

    console.log('📌 [Tauri] 选择的保存路径:', filePath);

    // 转换字符串为字节数组
    const encoder = new TextEncoder();
    const bytes = encoder.encode(csvContent);

    console.log('🧾 [Tauri] 准备写入文件, 大小:', bytes.length, '字节');

    // 写入文件
    await invoke(
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
