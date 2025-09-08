/**
 * 美团外卖数据可视化系统 - 类型定义
 */

// Excel数据行接口
export interface ExcelDataRow {
  日期: number;
  门店名称: string;
  门店id: number;
  省份: string;
  门店所在城市: string;
  区县市: string;
  营业收入: number;
  曝光人数: number;
  入店人数: number;
  入店转化率: number;
  下单转化率: number;
  下单人数: number;
}

// 处理后的数据接口
export interface ProcessedData {
  date: string; // 格式化后的日期 MM-DD
  revenue: number; // 营业收入
  exposure: number; // 曝光人数
  visits: number; // 入店人数
  visitConversionRate: number; // 入店转化率
  orderConversionRate: number; // 下单转化率
  orders: number; // 下单人数
  originalDate: number; // 原始日期
}

// 统计数据接口
export interface StatsData {
  totalRevenue: number; // 总营业收入
  totalExposure: number; // 总曝光人数
  totalVisits: number; // 总入店人数
  totalOrders: number; // 总下单人数
  avgDailyRevenue: number; // 日均营业收入
  avgDailyExposure: number; // 日均曝光人数
  avgVisitConversionRate: number; // 平均入店转化率
  avgOrderConversionRate: number; // 平均下单转化率
  dataCount: number; // 数据条数
}

// 门店信息接口
export interface StoreInfo {
  name: string; // 门店名称
  id: number; // 门店ID
  province: string; // 省份
  city: string; // 城市
  district: string; // 区县
}

// 文件上传状态
export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

// 错误信息接口
export interface ErrorInfo {
  message: string;
  details?: string;
}

// 应用状态接口
export interface AppState {
  data: ProcessedData[];
  stats: StatsData | null;
  storeInfo: StoreInfo | null;
  uploadStatus: UploadStatus;
  error: ErrorInfo | null;
  fileName: string | null;
}

// 图表数据点接口
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// 图表配置接口
export interface ChartConfig {
  title: string;
  dataKey: string;
  color: string;
  type: 'area' | 'line' | 'bar';
  yAxisFormat?: 'number' | 'percentage' | 'currency';
}
