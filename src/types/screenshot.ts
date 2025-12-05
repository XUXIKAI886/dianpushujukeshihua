/**
 * 截图生成数据分析图工具 - 类型定义
 */

// 生成状态
export type GenerateStatus = 'idle' | 'uploading' | 'generating' | 'success' | 'error';

// 上传的截图信息
export interface ScreenshotInfo {
  file: File;
  preview: string; // base64 预览
  name: string;
}

// 生成结果
export interface GeneratedResult {
  imageUrl: string; // 生成的图片 URL 或 base64
  storeName: string;
  generatedAt: Date;
}

// 页面状态
export interface ScreenshotAnalysisState {
  storeName: string;
  screenshot: ScreenshotInfo | null;
  status: GenerateStatus;
  result: GeneratedResult | null;
  error: string | null;
}

// Gemini API 响应
export interface GeminiImageResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }[];
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
}

// 预设话术配置
export const ANALYSIS_COPY_TEXT = `老板，我们看了您店铺这30天的数据，整体走势是符合预期的。现在这个阶段其实是在给店铺打地基，平台算法需要一段时间来重新识别您店铺的品类定位和用户画像，这个过程中权重在慢慢积累。从数据曲线上看，虽然现在单量和曝光还没有明显爆发，但基础指标已经在往好的方向走了，店铺的搜索权重和推荐权重都在稳步提升。外卖运营就是这样，前期要把地基打牢，后面才能稳定增长。根据我们的经验和您店铺目前的数据表现，接下来会开始进入一个阶梯式递增的阶段，单量和曝光都会逐步往上走。我们会继续盯着数据，配合这个上升趋势做好优化调整。`;

// API 配置
export const GEMINI_API_CONFIG = {
  model: 'gemini-3-pro-image-preview',
  endpoint: 'https://yunwu.ai/v1beta/models/gemini-3-pro-image-preview:generateContent',
  apiKey: 'sk-HmiefdcbEJlZ8ecp3XyJBJtniWu7lLaYSo0BISzB5fzHvQRx',
  referenceImagePath: '/reference/data-analysis-template.jpg',
};
