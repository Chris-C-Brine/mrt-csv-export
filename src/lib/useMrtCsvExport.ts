import {useCallback} from 'react';
import {mkConfig, generateCsv, download} from 'export-to-csv';
import type {MRT_Row, MRT_TableInstance} from 'material-react-table';
import type {CsvExportOptions} from './types';

export const useMrtCsvExport = <TData extends Record<string, unknown>>(
  table: MRT_TableInstance<TData>
) => {
  const exportToCsv = useCallback(
    ({
       filename = 'export',
       fieldSeparator = ',',
       quoteStrings = true,
       decimalSeparator = '.',
       showLabels = true,
       fileExtension = 'csv',
       useBom = true,
       includeHiddenColumns = false,
       onlySelected = false,
     }: CsvExportOptions) => {

      // Get rows to export
      const rows: MRT_Row<TData>[] = onlySelected
        ? table.getSelectedRowModel().rows
        : table.getPrePaginationRowModel().rows;

      // Early return if no rows to export
      if (rows.length === 0) {
        console.warn('No rows to export');
        return;
      }

      // Get columns - filter out non-data columns like selection, actions, etc.
      const allColumns = includeHiddenColumns
        ? table.getAllColumns()
        : table.getVisibleLeafColumns();

      const columns = allColumns.filter(
        (col) => col.id !== 'mrt-row-select' && col.id !== 'mrt-row-actions'
      );

      // Check if we have any columns
      if (columns.length === 0) {
        console.warn('No columns to export');
        return;
      }

      // Map rows to exportable data
      const data = rows.map((row) => {
        const rowData: Record<string, string | number | boolean | null | undefined> = {};
        columns.forEach((column) => {
          // For columns with accessorFn, getValue returns the computed value
          // For columns with accessorKey, getValue returns the raw value
          const value = row.getValue(column.id);
          const header = column.columnDef.header;
          const key = typeof header === 'string' ? header : column.id;

          // Convert value to acceptable CSV type
          if (value === null || value === undefined) {
            rowData[key] = value;
          } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            rowData[key] = value;
          } else {
            // Convert objects/arrays to string
            rowData[key] = String(value);
          }
        });
        return rowData;
      });

      // Get column headers
      const columnHeaders = columns.map((column) => {
        const header = column.columnDef.header;
        return typeof header === 'string' ? header : column.id;
      });

      // Configure CSV export
      const csvConfig = mkConfig({
        filename,
        fieldSeparator,
        quoteStrings,
        decimalSeparator,
        showColumnHeaders: showLabels,
        columnHeaders: showLabels ? columnHeaders : undefined,
        fileExtension,
        useBom,
      });

      // Generate and download CSV
      const csv = generateCsv(csvConfig)(data);
      download(csvConfig)(csv);
    },
    [table]
  );

  return {exportToCsv};
};
