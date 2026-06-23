import { useCallback } from 'react'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import type { MRT_RowData, MRT_TableInstance } from 'material-react-table'
import { ExportError, MRT_INTERNAL_COLUMN_IDS, type CsvExportOptions } from './types'

/**
 * Custom React hook for exporting Material React Table data to CSV format
 *
 * @template TData - The type of data in the table rows
 * @param table - The Material React Table instance
 * @returns An object containing the exportToCsv function
 *
 * @example
 * ```tsx
 * const { exportToCsv } = useMrtCsvExport(table);
 *
 * exportToCsv({
 *   filename: 'my-data',
 *   respectFilters: true,
 *   onSuccess: (info) => console.log(`Exported ${info.rowCount} rows`),
 *   onError: (error) => console.error(error.message)
 * });
 * ```
 */
export const useMrtCsvExport = <TData extends MRT_RowData>(table: MRT_TableInstance<TData>) => {
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
      respectFilters = true,
      respectSorting = true,
      onSuccess,
      onError,
    }: CsvExportOptions = {}) => {
      try {
        // Get rows to export with proper filtering and sorting
        const rows = onlySelected
          ? table.getSelectedRowModel().rows
          : respectFilters && table.getState().columnFilters.length > 0
            ? respectSorting && table.getState().sorting.length > 0
              ? table.getSortedRowModel().rows
              : table.getFilteredRowModel().rows
            : respectSorting && table.getState().sorting.length > 0
              ? table.getSortedRowModel().rows
              : table.getPrePaginationRowModel().rows

        // Validate we have rows to export
        if (rows.length === 0) {
          const errorMessage = onlySelected
            ? 'No rows selected for export. Please select at least one row.'
            : respectFilters && table.getState().columnFilters.length > 0
              ? 'No rows to export. Applied filters may have excluded all data.'
              : 'No rows available to export. The table is empty.'

          const error = new ExportError('NO_ROWS', errorMessage, {
            onlySelected,
            respectFilters,
            filterCount: table.getState().columnFilters.length,
            totalRows: table.getPrePaginationRowModel().rows.length,
          })

          if (onError) {
            onError(error)
          }
          throw error
        }

        // Get columns - filter out MRT internal columns
        const allColumns = includeHiddenColumns
          ? table.getAllColumns()
          : table.getVisibleLeafColumns()

        const columns = allColumns.filter(
          (col) => !Object.values(MRT_INTERNAL_COLUMN_IDS).includes(col.id as any)
        )

        // Validate we have columns to export
        if (columns.length === 0) {
          const error = new ExportError(
            'NO_COLUMNS',
            'No columns available to export. All columns may be hidden.',
            {
              includeHiddenColumns,
              totalColumns: table.getAllColumns().length,
            }
          )

          if (onError) {
            onError(error)
          }
          throw error
        }

        // Map rows to exportable data
        const data = rows.map((row) => {
          const rowData: Record<string, string | number | boolean | null | undefined> = {}
          columns.forEach((column) => {
            // For columns with accessorFn, getValue returns the computed value
            // For columns with accessorKey, getValue returns the raw value
            const value = row.getValue(column.id)
            const header = column.columnDef.header
            const key = typeof header === 'string' ? header : column.id

            // Convert value to acceptable CSV type
            if (value === null || value === undefined) {
              rowData[key] = value
            } else if (
              typeof value === 'string' ||
              typeof value === 'number' ||
              typeof value === 'boolean'
            ) {
              rowData[key] = value
            } else {
              // Convert objects/arrays to string
              rowData[key] = String(value)
            }
          })
          return rowData
        })

        // Get column headers
        const columnHeaders = columns.map((column) => {
          const header = column.columnDef.header
          return typeof header === 'string' ? header : column.id
        })

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
        })

        // Generate and download CSV
        try {
          const csv = generateCsv(csvConfig)(data)
          download(csvConfig)(csv)

          // Call success callback with export statistics
          if (onSuccess) {
            onSuccess({
              rowCount: rows.length,
              columnCount: columns.length,
              filename: `${filename}.${fileExtension}`,
              respectFilters,
              respectSorting,
              onlySelected,
            })
          }
        } catch (error) {
          const exportError = new ExportError(
            'GENERATION_FAILED',
            `Failed to generate or download CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
            {
              originalError: error,
              rowCount: rows.length,
              columnCount: columns.length,
            }
          )

          if (onError) {
            onError(exportError)
          }
          throw exportError
        }
      } catch (error) {
        // Re-throw ExportError instances (already handled)
        if (error instanceof ExportError) {
          throw error
        }

        // Wrap unexpected errors
        const exportError = new ExportError(
          'GENERATION_FAILED',
          `Unexpected error during export: ${error instanceof Error ? error.message : 'Unknown error'}`,
          { originalError: error }
        )

        if (onError) {
          onError(exportError)
        }
        throw exportError
      }
    },
    [table]
  )

  return { exportToCsv }
}
