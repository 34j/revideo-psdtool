import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        // node test config
        test: {
          name: 'node',
          include: ['./test/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        },
      },
    ],
  },
})
