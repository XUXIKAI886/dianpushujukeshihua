/**
 * Gemini 图片生成服务
 * 使用 Gemini 3 Pro Image Preview 模型生成数据分析图
 */

import {
  GeminiImageResponse,
  GEMINI_API_CONFIG,
} from '@/types/screenshot';

// Gemini 原生 API 请求体类型
interface GeminiNativeRequest {
  contents: {
    role: string;
    parts: Array<
      | { text: string }
      | { inline_data: { mime_type: string; data: string } }
    >;
  }[];
  generationConfig: {
    responseModalities: string[];
    imageConfig?: {
      aspectRatio?: string;
    };
  };
}

/**
 * 将文件转换为 base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 移除 data:image/xxx;base64, 前缀
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 获取图片的 MIME 类型
 */
export function getImageMimeType(file: File): string {
  const type = file.type;
  if (type.startsWith('image/')) {
    return type;
  }
  // 根据扩展名推断
  const ext = file.name.toLowerCase().split('.').pop();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

/**
 * 从 URL 加载图片并转换为 base64
 */
async function loadImageAsBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({
        base64,
        mimeType: blob.type || 'image/jpeg',
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * 构建生成图片的 Prompt
 */
function buildPrompt(storeName: string): string {
  return `请仔细读取图1的店铺数据图，这个店铺的名称是："${storeName}"
请参考图2的风格和排版，生成一张关于这个店铺的数据分析图，4K高清，尺寸4:3

要求：
1. 保持图2的专业设计风格，包括渐变背景、漏斗图、折线图等元素
2. 根据图1中的实际数据生成对应的图表和数字
3. 标题使用店铺名称
4. 包含曝光人数、进店人数、下单人数等核心指标
5. 添加增长趋势分析和未来预测
6. 整体色调保持蓝橙渐变的专业商务风格`;
}

/**
 * 调用 Gemini API 生成图片
 */
export async function generateAnalysisImage(
  screenshotFile: File,
  storeName: string
): Promise<string> {
  // 1. 将用户上传的截图转换为 base64
  const screenshotBase64 = await fileToBase64(screenshotFile);
  const screenshotMimeType = getImageMimeType(screenshotFile);

  // 2. 加载参考图片
  const referenceImage = await loadImageAsBase64(GEMINI_API_CONFIG.referenceImagePath);

  // 3. 构建请求体 - 使用 Gemini 原生格式
  const requestBody: GeminiNativeRequest = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: buildPrompt(storeName) },
          {
            inline_data: {
              mime_type: screenshotMimeType,
              data: screenshotBase64,
            },
          },
          {
            inline_data: {
              mime_type: referenceImage.mimeType,
              data: referenceImage.base64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['image'],
      imageConfig: {
        aspectRatio: '4:3',
      },
    },
  };

  // 4. 调用 API
  const response = await fetch(`${GEMINI_API_CONFIG.endpoint}?key=${GEMINI_API_CONFIG.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
  }

  const data: GeminiImageResponse = await response.json();

  // 5. 处理响应
  if (data.error) {
    throw new Error(`API 错误: ${data.error.message}`);
  }

  const candidate = data.candidates?.[0];
  const parts_response = candidate?.content?.parts;

  if (!parts_response || parts_response.length === 0) {
    throw new Error('API 未返回有效内容');
  }

  // 查找图片数据
  for (const part of parts_response) {
    if (part.inlineData) {
      const { mimeType, data: imageData } = part.inlineData;
      return `data:${mimeType};base64,${imageData}`;
    }
  }

  throw new Error('API 未返回图片数据');
}

/**
 * 验证图片文件
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
      return { valid: false, error: '请上传 JPG、PNG、WebP 或 GIF 格式的图片' };
    }
  }

  // 检查文件大小 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: '图片大小不能超过 10MB' };
  }

  return { valid: true };
}
