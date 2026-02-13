
export interface SecurityReport {
  psnr: number;
  mse: number;
  accuracy: number;
  securityIndex: number;
  analysisText?: string;
}

export interface StegoResult {
  stegoImageUrl: string;
  report: SecurityReport;
  originalFileName: string;
}

export enum AppTab {
  ENCODER = 'encoder',
  DECODER = 'decoder',
  METRICS = 'metrics'
}

export interface MetricData {
  name: string;
  value: number;
}
