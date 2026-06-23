export type ExportErrorType = 'NO_ROWS' | 'NO_COLUMNS' | 'INVALID_CONFIG' | 'GENERATION_FAILED';

export class ExportError extends Error {
  code: ExportErrorType;
  context?: Record<string, unknown>;

  constructor(code: ExportErrorType, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'ExportError';
    this.code = code;
    this.context = context;
  }
}

export interface ExportSuccessInfo {
  rowCount: number;
  columnCount: number;
  filename: string;
  respectFilters: boolean;
  respectSorting: boolean;
  onlySelected: boolean;
}

export interface CsvExportOptions {
  filename?: string;
  fieldSeparator?: string;
  quoteStrings?: boolean;
  decimalSeparator?: string;
  showLabels?: boolean;
  fileExtension?: string;
  useBom?: boolean;
  includeHiddenColumns?: boolean;
  onlySelected?: boolean;
  respectFilters?: boolean;
  respectSorting?: boolean;
  onSuccess?: (info: ExportSuccessInfo) => void;
  onError?: (error: ExportError) => void;
}
