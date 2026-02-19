import { makeScene2D, Video } from '@revideo/2d'

import { createRef, makeProject, waitFor } from '@revideo/core'
import { Psd } from '../src'

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
  const psdRef = createRef<Psd>()
  const videoRef = createRef<Video>()
  view.add(
    <>
      <Video
        src="/demo/ToHYNSkgZww.mkv"
        height="100%"
        ref={videoRef}
      />
      <Psd
        psdSrc="/demo/ccchu.psd"
        psdToolData={{}}
        width={300}
        x={-100}
        y={120}
        ref={psdRef}
      />
    </>,
  )
  videoRef().play()
  yield* waitFor(1)
  // See https://34j.github.io/react-ag-psd-psdtool/
  // for options of psdToolData for your PSD file
  psdRef().psdToolData({ right_eye: 'wink' }, 1)
  yield* waitFor(1)
  psdRef().psdToolData({}).psdToolRenderOptions({ flipx: true })
  yield* waitFor(1)
  psdRef().psdToolData({ logo: false, mouth: 'dot' })
  yield* waitFor(1)
  psdRef().psdToolData({ logo: false })
  yield* waitFor(1)
})

/**
 * The final revideo project
 */
export default makeProject({
  scenes: [scene],
  settings: {
    // Example settings:
    shared: {
      size: { x: 640, y: 480 },
    },
  },
})
