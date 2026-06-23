import { useMemo, useState } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
  type MRT_RowData,
} from 'material-react-table'
import {
  Box,
  Button,
  Chip,
  Container,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Alert,
  Snackbar,
} from '@mui/material'
import { Download } from '@mui/icons-material'
import { useMrtCsvExport } from './lib'
import type { ExportSuccessInfo, ExportError } from './lib'

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

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
})

/**
 * Custom toolbar actions for the table allows proper use of hooks
 * @param table MRT_TableInstance<T extends MRT_RowData>
 * @param onExportSuccess onSuccess callback
 * @param onExportError onError callback
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
        onClick={() =>
          exportToCsv({
            filename: 'filtered-sorted',
            respectFilters: true,
            respectSorting: true,
            onSuccess: onExportSuccess,
            onError: onExportError,
          })
        }
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

function App() {
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
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorFn: (row) => row.tags.map((t) => t.name).join(', '),
        id: 'tags',
        header: 'Tags',
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, width: '100%' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#000' }}>
            useMrtCsvExport Demo
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 2 }}>
            This demo shows how to use <code>accessorFn</code> to properly export complex data types
            (like arrays of objects) to CSV.<br /> Export buttons are in the table toolbar. See code in README.md.
          </Typography>
          <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
            <strong>New Features:</strong>
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>
                <strong>Filtered/Sorted Export:</strong> Try filtering or sorting the table, then
                click "Export Filtered/Sorted" to export only the visible, sorted data.
              </li>
              <li>
                <strong>Success/Error Notifications:</strong> Watch for success messages showing row
                and column counts, or error messages if something goes wrong.
              </li>
              <li>
                <strong>Better Error Handling:</strong> Try selecting no rows and exporting selected
                data to see descriptive error messages.
              </li>
            </ul>
          </Alert>
        </Box>
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
      </Container>
    </ThemeProvider>
  )
}

export default App
