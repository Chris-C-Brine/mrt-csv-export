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
}
