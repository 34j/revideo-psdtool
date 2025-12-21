import { Img, makeScene2D } from '@revideo/2d'

import { all, chain, createRef, makeProject, waitFor } from '@revideo/core'
import { Psd } from '../src/Psd'
import psdUrl from './ccchu.psd'

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {
  const logoRef = createRef<Img>()
  yield view.add(
    <>
      <Psd
        psdsrc={psdUrl}
        width={800}
      />
    </>,
  )

  yield* waitFor(1)

  view.add(
    <Img
      width="1%"
      ref={logoRef}
      src="https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png"
    />,
  )

  yield* chain(
    all(logoRef().scale(40, 2), logoRef().rotation(360, 2)),
    logoRef().scale(60, 1),
  )
})

/**
 * The final revideo project
 */
export default makeProject({
  scenes: [scene],
  settings: {
    // Example settings:
    shared: {
      size: { x: 1920, y: 1080 },
    },
  },
})
