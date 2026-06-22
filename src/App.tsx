import {useMemo} from 'react'
import {MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef} from 'material-react-table'
import {useMrtCsvExport} from './lib'
import './App.css'

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

function App() {
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
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        age: 35,
        tags: [{id: 5, name: 'Angular'}],
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
        Cell: ({cell}) => (
          <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
            {cell.row.original.tags.map((tag) => (
              <span
                key={tag.id}
                style={{
                  background: '#e0e0e0',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        ),
      },
    ],
    []
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
  })

  const {exportToCsv} = useMrtCsvExport(table)

  return (
    <div style={{padding: '20px'}}>
      <h1>useMrtCsvExport Demo</h1>
      <p>
        This demo shows how to use <code>accessorFn</code> to properly export complex data types
        (like arrays of objects) to CSV.
      </p>
      <div style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
        <button onClick={() => exportToCsv({filename: 'all-people'})}>
          Export All Rows
        </button>
        <button
          onClick={() =>
            exportToCsv({
              filename: 'selected-people',
              onlySelected: true,
            })
          }
        >
          Export Selected Rows
        </button>
        <button
          onClick={() =>
            exportToCsv({
              filename: 'people-with-hidden',
              includeHiddenColumns: true,
            })
          }
        >
          Export with Hidden Columns
        </button>
      </div>
      <MaterialReactTable table={table}/>
    </div>
  )
}

export default App
