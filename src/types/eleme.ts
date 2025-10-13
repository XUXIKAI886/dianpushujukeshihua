/**
 * 饿了么数据可视化系统 - 类型定义
 */

// 饿了么 Excel 数据行接口
export interface ElemeExcelDataRow {
  日期: string; // 格式: "2025-10-08"
  门店名称: string;
  门店编号: string;
  收入: number;
  曝光人数: string | number; // 可能是字符串格式
  进店人数: string | number;
  下单人数: string | number;
  进店转化率: number;
  下单转化率: number;
}

// 饿了么处理后的数据接口
export interface ElemeProcessedData {
  date: string; // 格式化后的日期 MM-DD
  revenue: number; // 收入
  exposure: number; // 曝光人数
  visits: number; // 进店人数
  orders: number; // 下单人数
  visitConversionRate: number; // 进店转化率
  orderConversionRate: number; // 下单转化率
  originalDate: string; // 原始日期
}

// 饿了么统计数据接口
export interface ElemeStatsData {
  totalRevenue: number; // 总收入
  totalExposure: number; // 总曝光人数
  totalVisits: number; // 总进店人数
  totalOrders: number; // 总下单人数
  avgDailyRevenue: number; // 日均收入
  avgDailyExposure: number; // 日均曝光人数
  avgVisitConversionRate: number; // 平均进店转化率
  avgOrderConversionRate: number; // 平均下单转化率
  dataCount: number; // 数据条数
}

// 饿了么门店信息接口
export interface ElemeStoreInfo {
  name: string; // 门店名称
  code: string; // 门店编号
}

// 饿了么应用状态接口
export interface ElemeAppState {
  data: ElemeProcessedData[];
  stats: ElemeStatsData | null;
  storeInfo: ElemeStoreInfo | null;
  uploadStatus: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  error: { message: string; details?: string } | null;
  fileName: string | null;
}
