# @Chris-C-Brine/mrt-csv-export

[![npm version](https://img.shields.io/npm/v/@chris-c-brine/mrt-csv-export.svg)](https://www.npmjs.com/package/@chris-c-brine/mrt-csv-export)
[![License: AAL](https://img.shields.io/badge/License-AAL-blue.svg)](https://github.com/Chris-C-Brine/mrt-csv-export/blob/main/LICENSE)

# MRT CSV Export

A React hook for exporting Material React Table (MRT) data to CSV format using the `export-to-csv` library.

## Features

- Simple integration with Material React Table
- Respects MRT column definitions including `accessorFn`
- Export all rows or only selected rows
- Control the visibility of hidden columns in exports
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
// noinspection JSAnnotator

import {useMemo} from 'react'
import {MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef} from 'material-react-table'
import {Box, Button, Chip} from '@mui/material'
import {Download} from '@mui/icons-material'
import {useMrtCsvExport} from '@chris-c-brine/mrt-csv-export'

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

// Extract toolbar to a component so we can use hooks
function TopToolbarActions({table}: { table: any }) {
  const {exportToCsv} = useMrtCsvExport(table)

  return (
    <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
      <Button
        startIcon={<Download/>}
        variant="contained"
        onClick={() => exportToCsv({filename: 'all-people'})}
      >
        Export All
      </Button>
      <Button
        startIcon={<Download/>}
        variant="outlined"
        onClick={() => exportToCsv({filename: 'selected-people', onlySelected: true})}
        disabled={!table.getIsSomeRowsSelected()}
      >
        Export Selected
      </Button>
      <Button
        startIcon={<Download/>}
        variant="outlined"
        onClick={() => exportToCsv({filename: 'people-with-hidden', includeHiddenColumns: true})}
      >
        Export with Hidden
      </Button>
    </Box>
  )
}

function MyTable() {
  const data: Person[] = useMemo(
    () => [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        tags: [
          {id: 1, name: 'React'},
          {id: 2, name: 'TypeScript'},
        ],
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25,
        tags: [
          {id: 3, name: 'Vue'},
          {id: 4, name: 'JavaScript'},
        ],
      },
    ],
    []
  )

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {accessorKey: 'id', header: 'ID'},
      {accessorKey: 'name', header: 'Name'},
      {accessorKey: 'email', header: 'Email'},
      {accessorKey: 'age', header: 'Age'},
      {
        // Transform array of objects to comma-separated string for CSV
        accessorFn: (row) => row.tags.map((t) => t.name).join(', '),
        id: 'tags',
        header: 'Tags',
        // Custom Cell component for visual display
        Cell: ({cell}) => (
          <Box sx={{display: 'flex', gap: 0.5, flexWrap: 'wrap'}}>
            {cell.row.original.tags.map((tag) => (
              <Chip key={tag.id} label={tag.name} size="small" color="primary" variant="outlined"/>
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
    renderTopToolbarCustomActions: ({table}) => <TopToolbarActions table={table}/>,
  })

  return <MaterialReactTable table={table}/>
}
```

### Key Points

1. **Extract toolbar to a component**: Because hooks can't be called inside render prop functions, create a separate component like `TopToolbarActions`
2. **Use `accessorFn` for complex data**: When exporting arrays or objects, use `accessorFn` to transform them into CSV-friendly strings
3. **Separate display from export**: The `Cell` component handles visual display (e.g., styled chips), while `accessorFn` handles CSV export format

## Export Options

```tsx
exportToCsv({
  filename: 'my-export', // Default: 'export'
  onlySelected: true, // Export only selected rows
  includeHiddenColumns: true, // Include hidden columns
  fieldSeparator: ',', // Default: ','
  quoteStrings: true, // Default: true
  decimalSeparator: '.', // Default: '.'
  showLabels: true, // Show column headers
  fileExtension: 'csv', // Default: 'csv'
  useBom: true, // UTF-8 BOM for Excel compatibility
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
