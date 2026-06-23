export type ExportErrorType = 'NO_ROWS' | 'NO_COLUMNS' | 'INVALID_CONFIG' | 'GENERATION_FAILED';

/**
 * Custom error class for export operations
 */
export class ExportError extends Error {
  code: ExportErrorType;
  context?: Record<string, unknown>;

  constructor(code: ExportErrorType, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'ExportError';
    this.code = code;
    this.context = context;

    // Maintains proper prototype chain for instanceof checks when transpiled to ES5
    Object.setPrototypeOf(this, ExportError.prototype);
  }
}

/**
 * Constants for MRT internal column IDs to exclude from exports
 */
export const MRT_INTERNAL_COLUMN_IDS = {
  SELECT: 'mrt-row-select',
  ACTIONS: 'mrt-row-actions',
  EXPAND: 'mrt-row-expand',
  DRAG: 'mrt-row-drag',
  NUMBERS: 'mrt-row-numbers',
  SPACER: 'mrt-row-spacer',
} as const;

/**
 * Information provided to the success callback after a successful export
 */
export interface ExportSuccessInfo {
  /** Number of rows exported */
  rowCount: number;
  /** Number of columns exported */
  columnCount: number;
  /** Full filename including extension */
  filename: string;
  /** Whether filters were respected during export */
  respectFilters: boolean;
  /** Whether sorting was respected during export */
  respectSorting: boolean;
  /** Whether only selected rows were exported */
  onlySelected: boolean;
}

/**
 * Configuration options for CSV export
 */
export interface CsvExportOptions {
  /** Base filename for the export (without extension). Default: 'export' */
  filename?: string;
  /** Field separator character. Default: ',' */
  fieldSeparator?: string;
  /** Whether to wrap strings in quotes. Default: true */
  quoteStrings?: boolean;
  /** Decimal separator character. Default: '.' */
  decimalSeparator?: string;
  /** Whether to include column headers. Default: true */
  showLabels?: boolean;
  /** File extension. Default: 'csv' */
  fileExtension?: string;
  /** Include UTF-8 BOM for Excel compatibility. Default: true */
  useBom?: boolean;
  /** Include hidden columns in export. Default: false */
  includeHiddenColumns?: boolean;
  /** Export only selected rows. Default: false */
  onlySelected?: boolean;
  /** Respect active table filters. Default: true */
  respectFilters?: boolean;
  /** Respect active table sorting. Default: true */
  respectSorting?: boolean;
  /** Callback invoked after successful export */
  onSuccess?: (info: ExportSuccessInfo) => void;
  /** Callback invoked if export fails */
  onError?: (error: ExportError) => void;
}
