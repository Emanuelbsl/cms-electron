import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from 'tailwindcss'
import tsconfigPathsPlugin from 'vite-tsconfig-paths'

const tsconfigPaths = tsconfigPathsPlugin({
  projects: [path.resolve('tsconfig.json')],
})

export default defineConfig({
  main: {
    plugins: [tsconfigPaths, externalizeDepsPlugin()],
    publicDir: path.resolve('resources'),
    envPrefix: 'MAIN_',
  },
  preload: {
    plugins: [tsconfigPaths, externalizeDepsPlugin()],
    envPrefix: 'PRELOAD_',
  },
  renderer: {
    envPrefix: 'RENDERER_',
    define: {
      'process.platform': JSON.stringify(process.platform),
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            config: './src/renderer/tailwind.config.js',
          }),
        ],
      },
    },
    resolve: {
      alias: {
        '@renderer': path.resolve('src/renderer'),
      },
    },
    plugins: [tsconfigPaths, react()],
  },
})
