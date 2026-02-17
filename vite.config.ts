import motionCanvas from '@motion-canvas/vite-plugin'

import { motionCanvasCachePlugin } from 'motion-canvas-cache'
import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.psd'],
  plugins: [
    motionCanvas(),
    motionCanvasCachePlugin({
      cachePath: 'motion-canvas-cache', // Optional: default cache directory
      maxFileSize: 50, // Optional: max file size in MB (default: 50)
    }),
  ],
})
