# @Chris-C-Brine/mrt-csv-export

[![npm version](https://img.shields.io/npm/v/@chris-c-brine/mrt-csv-export.svg)](https://www.npmjs.com/package/@chris-c-brine/mrt-csv-export)
[![License: AAL](https://img.shields.io/badge/License-AAL-blue.svg)](https://github.com/Chris-C-Brine/mrt-csv-export/blob/main/LICENSE)

# MRT CSV Export

A React hook for exporting Material React Table (MRT) data to CSV format using the `export-to-csv` library.

## Features

- Simple integration with Material React Table
- Respects MRT column definitions including `accessorFn`
- Export all rows or only selected rows
- **Export filtered and sorted data** - Respects active filters and sorting
- Control the visibility of hidden columns in exports
- **Success/Error callbacks** – Get notified with export statistics or detailed errors
- **Comprehensive error handling** - Descriptive error messages with context
- Configurable CSV export options
- TypeScript support

## Installation

```bash
npm install @chris-c-brine/mrt-csv-export
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom material-react-table export-to-csv @mui/material @emotion/react @emotion/styled
```

## Usage

### Complete Example with Toolbar Integration

The recommended way to use `useMrtCsvExport` is to create a separate component for your toolbar actions, which allows proper hook usage:

```tsx
import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
  type MRT_RowData,
} from 'material-react-table'
import { Box, Button, Chip, Alert, Snackbar, Checkbox } from '@mui/material'
import { Download } from '@mui/icons-material'
import { useMrtCsvExport } from '@chris-c-brine/mrt-csv-export'
import type { ExportSuccessInfo, ExportError } from '@chris-c-brine/mrt-csv-export'

type Tag = {
  id: number
  name: string
}

type Person = {
  id: number
  name: string
  email: string
  age: number
  tags: Tag[]
}

/**
 * Custom toolbar actions for the table allows proper use of hooks
 * @param table MRT_TableInstance<T extends MRT_RowData>
 * @param onExportSuccess onSuccess callback
 * @param onExportError onError callback
 * @constructor
 */
function TopToolbarActions<T extends MRT_RowData>({
  table,
  onExportSuccess,
  onExportError,
}: {
  table: MRT_TableInstance<T>
  onExportSuccess: (info: ExportSuccessInfo) => void
  onExportError: (error: ExportError) => void
}) {
  const [isChecked, setIsChecked] = useState(false)
  const isDisabled = !isChecked && !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())
  
  const { exportToCsv } = useMrtCsvExport(table)
  
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      <Button
        size="small"
        startIcon={<Download />}
        variant="contained"
        onClick={() =>
          exportToCsv({
            filename: 'all-people',
            onSuccess: onExportSuccess,
            onError: onExportError,
          })
        }
      >
        All
      </Button>
      <Button
        size="small"
        startIcon={<Download />}
        variant="outlined"
        onClick={() =>
          exportToCsv({
            filename: 'selected-people',
            onlySelected: true,
            onSuccess: onExportSuccess,
            onError: onExportError,
          })
        }
        disabled={!table.getIsSomeRowsSelected()}
      >
        Selected
      </Button>
      <Button
        size="small"
        startIcon={<Download />}
        variant="outlined"
        aria-disabled={isDisabled}
        sx={{ opacity: isDisabled ? 0.5 : 1 }}
        endIcon={
          <Checkbox
            checked={isChecked}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation() // Prevents bubbling to button
              setIsChecked(e.target.checked)
            }}
            title={'Enable Selected'}
          />
        }
        onClick={() => {
          if (isDisabled) return
          return exportToCsv({
            filename: 'selected-people',
            onlySelected: true,
            onSuccess: onExportSuccess,
            onError: onExportError,
          })
        }}
      >
        Filtered/Sorted
      </Button>
      <Button
        size="small"
        startIcon={<Download />}
        variant="outlined"
        onClick={() =>
          exportToCsv({
            filename: 'people-with-hidden',
            includeHiddenColumns: true,
            onSuccess: onExportSuccess,
            onError: onExportError,
          })
        }
      >
        +Hidden
      </Button>
    </Box>
  )
}

function MyTable() {
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleExportSuccess = (info: ExportSuccessInfo) => {
    setSnackbar({
      open: true,
      message: `Successfully exported ${info.rowCount} row(s) and ${info.columnCount} column(s) to ${info.filename}`,
      severity: 'success',
    })
  }

  const handleExportError = (error: ExportError) => {
    setSnackbar({
      open: true,
      message: `Export failed: ${error.message}`,
      severity: 'error',
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const data: Person[] = useMemo(
    () => [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        tags: [
          { id: 1, name: 'React' },
          { id: 2, name: 'TypeScript' },
        ],
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25,
        tags: [
          { id: 3, name: 'Vue' },
          { id: 4, name: 'JavaScript' },
        ],
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        age: 35,
        tags: [{ id: 5, name: 'Angular' }],
      },
      {
        id: 4,
        name: 'Alice Williams',
        email: 'alice@example.com',
        age: 28,
        tags: [
          { id: 6, name: 'React' },
          { id: 7, name: 'Node.js' },
        ],
      },
      {
        id: 5,
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        age: 32,
        tags: [{ id: 8, name: 'Python' }],
      },
    ],
    []
  )

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'age', header: 'Age' },
      {
        // Transform array of objects to comma-separated string for CSV
        accessorFn: (row) => row.tags.map((t) => t.name).join(', '),
        id: 'tags',
        header: 'Tags',
        // Custom Cell component for visual display
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {cell.row.original.tags.map((tag) => (
              <Chip key={tag.id} label={tag.name} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        ),
      },
    ],
    []
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    renderTopToolbarCustomActions: ({ table }) => (
      <TopToolbarActions
        table={table}
        onExportSuccess={handleExportSuccess}
        onExportError={handleExportError}
      />
    ),
  })

  return (
    <>
      <MaterialReactTable table={table} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
```

### Key Points

1. **Extract toolbar to a component**: Because hooks can't be called inside render prop functions, create a separate component like `TopToolbarActions`
2. **Use `accessorFn` for complex data**: When exporting arrays or objects, use `accessorFn` to transform them into CSV-friendly strings
3. **Separate display from export**: The `Cell` component handles visual display (e.g., styled chips), while `accessorFn` handles CSV export format

## Export Options

```tsx
exportToCsv({
  // File Options
  filename: 'my-export', // Default: 'export'
  fileExtension: 'csv', // Default: 'csv'

  // Data Selection
  onlySelected: true, // Export only selected rows (default: false)
  respectFilters: true, // Export filtered data (default: true)
  respectSorting: true, // Export sorted data (default: true)
  includeHiddenColumns: true, // Include hidden columns (default: false)

  // CSV Format Options
  fieldSeparator: ',', // Default: ','
  quoteStrings: true, // Default: true
  decimalSeparator: '.', // Default: '.'
  showLabels: true, // Show column headers (default: true)
  useBom: true, // UTF-8 BOM for Excel compatibility (default: true)

  // Callbacks
  onSuccess: (info) => {
    console.log(`Exported ${info.rowCount} rows and ${info.columnCount} columns`)
  },
  onError: (error) => {
    console.error(`Export failed: ${error.message}`)
  }
})
```

### Export Options Details

#### New Options

- **`respectFilters`** (default: `true`): When enabled, exports only the rows that match active column filters and global search. If no filters are active, all rows are exported.

- **`respectSorting`** (default: `true`): When enabled, exports rows in the current sorted order. If no sorting is active, it uses the default order.

- **`onSuccess`**: Callback function invoked after successful export. Receives an `ExportSuccessInfo` object:
  ```tsx
  {
    rowCount: number        // Number of rows exported
    columnCount: number     // Number of columns exported
    filename: string        // Full filename (including extension)
    respectFilters: boolean // Whether filters were applied
    respectSorting: boolean // Whether sorting was applied
    onlySelected: boolean   // Whether only selected rows were exported
  }
  ```

- **`onError`**: Callback function invoked when export fails. Receives an `ExportError` object:
  ```tsx
  {
    name: 'ExportError'
    code: 'NO_ROWS' | 'NO_COLUMNS' | 'INVALID_CONFIG' | 'GENERATION_FAILED'
    message: string              // Descriptive error message
    context?: Record<string, any> // Additional error context
  }
  ```

### Common Use Cases

#### Export Filtered Data
```tsx
// User applies filters to the table
// Click export to get only the filtered results
exportToCsv({
  filename: 'filtered-data',
  respectFilters: true, // default
})
```

#### Export All Data (Ignore Filters)
```tsx
// Export complete dataset even if filters are active
exportToCsv({
  filename: 'complete-data',
  respectFilters: false,
})
```

#### Export with Notifications
```tsx
exportToCsv({
  filename: 'my-export',
  onSuccess: (info) => {
    alert(`Successfully exported ${info.rowCount} rows!`)
  },
  onError: (error) => {
    alert(`Export failed: ${error.message}`)
  }
})
```

## Development

```bash
# Install dependencies
npm install

# Run demo
npm run dev

# Build library
npm run build:lib

# Lint
npm run lint
```

## License

[AAL](LICENSE) © Christopher C. Brine
