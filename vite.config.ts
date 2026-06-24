import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'library') {
    return {
      plugins: [
        react(),
        dts({
          tsconfigPath: './tsconfig.lib.json',
          insertTypesEntry: true,
        }),
      ],
      build: {
        // Disable public folder copy only when --mode library is passed
        copyPublicDir: mode !== 'library',

        // Empties the dist folder before building
        emptyOutDir: true,

        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'MrtCsvExport',
          formats: ['es'],
          fileName: () => 'index.js',
        },
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            'material-react-table',
            'export-to-csv',
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'material-react-table': 'MaterialReactTable',
              'export-to-csv': 'ExportToCsv',
            },
          },
        },
      },
    }
  }

  return {
    plugins: [react()],
  }
})
