import { renderVideo } from '@revideo/renderer'

async function render() {
  console.warn('Rendering video...')

  // This is the main function that renders the video
  const file = await renderVideo({
    projectFile: './src/project.tsx',
    settings: {
      logProgress: true,
      viteConfig: {
        assetsInclude: ['**/*.psd'],
        server: {
          port: 3000,
        },
      },
    },
  })

  console.warn(`Rendered video to ${file}`)
}

render()
