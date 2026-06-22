import { useMemo } from 'react'
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
} from '@mui/material'
import { Download } from '@mui/icons-material'
import { useMrtCsvExport } from './lib'

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
 * @constructor
 */
function TopToolbarActions<T extends MRT_RowData>({ table }: { table: MRT_TableInstance<T> }) {
  const { exportToCsv } = useMrtCsvExport(table)

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Button
        startIcon={<Download />}
        variant="contained"
        onClick={() => exportToCsv({ filename: 'all-people' })}
      >
        Export All
      </Button>
      <Button
        startIcon={<Download />}
        variant="outlined"
        onClick={() =>
          exportToCsv({
            filename: 'selected-people',
            onlySelected: true,
          })
        }
        disabled={!table.getIsSomeRowsSelected()}
      >
        Export Selected
      </Button>
      <Button
        startIcon={<Download />}
        variant="outlined"
        onClick={() =>
          exportToCsv({
            filename: 'people-with-hidden',
            includeHiddenColumns: true,
          })
        }
      >
        Export with Hidden
      </Button>
    </Box>
  )
}

function App() {
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
    renderTopToolbarCustomActions: ({ table }) => <TopToolbarActions table={table} />,
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, width: "100%" }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#000' }}>
            useMrtCsvExport Demo
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
            This demo shows how to use <code>accessorFn</code> to properly export complex data
            types (like arrays of objects) to CSV. Export buttons are in the table toolbar.
          </Typography>
        </Box>
        <MaterialReactTable table={table} />
      </Container>
    </ThemeProvider>
  )
}

export default App
