import type { MediaProps } from '@revideo/2d/lib/components'
import type { SimpleSignal } from '@revideo/core/lib/signals'
import { Audio } from '@revideo/2d/lib/components'
import { signal } from '@revideo/2d/lib/decorators'
import { DependencyContext } from '@revideo/core/lib/signals'
import Client from 'voicevox-client'

const client = new Client('http://127.0.0.1:50021')

export interface VoicevoxProps extends MediaProps {
  text: string
}

export class Voicevox extends Audio {
  @signal()
  public declare readonly text: SimpleSignal<string, this>

  public constructor(props: VoicevoxProps) {
    DependencyContext.collectPromise((async (resolve) => {
      const audioquery = await client.createAudioQuery(props.text, 1)
      // console.log(audioquery)
      const buffer = await audioquery.synthesis(1)
      // to base64
      this.src(URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' })))
      resolve()
    })(),
    )
    props.src = 'tmp.wav'
    super(props)
  }

//   protected audio(): HTMLAudioElement {
//   }
};
