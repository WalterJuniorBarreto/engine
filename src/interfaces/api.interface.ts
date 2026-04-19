
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    processingTimeMs?: number;
    timestamp: string;
    rowCount?: number;
  };
}

export interface QueryRequest {
  query: string;
  parameters?: any[];
}