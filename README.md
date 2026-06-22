# @Chris-C-Brine/mrt-csv-export
[![npm version](https://img.shields.io/npm/v/@chris-c-brine/mrt-csv-export.svg)](https://www.npmjs.com/package/@chris-c-brine/mrt-csv-export)
[![License: AAL](https://img.shields.io/badge/License-AAL-blue.svg)](https://github.com/Chris-C-Brine/mrt-csv-export/blob/main/LICENSE)


# MRT CSV Export

A React hook for exporting Material React Table (MRT) data to CSV format using the `export-to-csv` library.

## Features

- 🚀 Simple integration with Material React Table
- 📊 Respects MRT column definitions including `accessorFn`
- 🎯 Export all rows or only selected rows
- 👁️ Control visibility of hidden columns in exports
- ⚙️ Configurable CSV export options
- 📦 TypeScript support

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

### Basic Example

```tsx
import { useMaterialReactTable } from 'material-react-table'
import { useMrtCsvExport } from '@chris-c-brine/mrt-csv-export'

function MyTable() {
  const table = useMaterialReactTable({
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
    ],
    data: myData,
  })

  const { exportToCsv } = useMrtCsvExport(table)

  return (
    <>
      <button onClick={() => exportToCsv()}>Export All</button>
      <MaterialReactTable table={table} />
    </>
  )
}
```

### Handling Complex Data Types

When working with arrays or objects, use `accessorFn` to transform the data for CSV export:

```tsx
type Person = {
  name: string
  tags: Array<{ id: number; name: string }>
}

const columns = [
  { accessorKey: 'name', header: 'Name' },
  {
    // Transform array of objects to comma-separated string
    accessorFn: (row) => row.tags.map((t) => t.name).join(', '),
    id: 'tags',
    header: 'Tags',
    // Custom Cell component for display
    Cell: ({ cell }) => (
      <div>
        {cell.row.original.tags.map((tag) => (
          <span key={tag.id}>{tag.name}</span>
        ))}
      </div>
    ),
  },
]
```

## Export Options

```tsx
exportToCsv({
  filename: 'my-export',           // Default: 'export'
  onlySelected: true,               // Export only selected rows
  includeHiddenColumns: true,       // Include hidden columns
  fieldSeparator: ',',              // Default: ','
  quoteStrings: true,               // Default: true
  decimalSeparator: '.',            // Default: '.'
  showLabels: true,                 // Show column headers
  fileExtension: 'csv',             // Default: 'csv'
  useBom: true,                     // UTF-8 BOM for Excel compatibility
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