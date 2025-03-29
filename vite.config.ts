import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'
import babel from 'vite-plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    babel({
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
        ],
      },
    }),
    react({
      babel: {
        parserOpts: {
          plugins: [
            'decorators',
          ]
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
