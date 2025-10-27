import type { ImgProps } from '@revideo/2d/lib/components'
import type { SimpleSignal } from '@revideo/core/lib/signals'
import { Img } from '@revideo/2d/lib/components'
import { signal } from '@revideo/2d/lib/decorators'
import { DependencyContext } from '@revideo/core/lib/signals'
import PSD from '@webtoon/psd'
import Client from 'voicevox-client'

const client = new Client('http://127.0.0.1:50021')

export interface PsdProps extends ImgProps {
  psdsrc: string
}

export class Psd extends Img {
  private static blobContentsPool: Record<string, string> = {}

  private readonly imageElement = document.createElement('img')

  @signal()
  public declare readonly psdsrc: SimpleSignal<string, this>

  public constructor(props: PsdProps) {
    super({ ...props, src: null })
  }

  protected override image(): HTMLImageElement {
    const src = `${this.psdsrc()}`
    if (Psd.blobContentsPool[src]) {
      this.imageElement.src = Psd.blobContentsPool[src]
      if (!this.imageElement.complete) {
        DependencyContext.collectPromise(
          new Promise((resolve, reject) => {
            this.imageElement.addEventListener('load', resolve)
            this.imageElement.addEventListener('error', reject)
          }),
        )
      }
      return this.imageElement
    }

    const psdsrc = this.psdsrc()
    const image = document.createElement('img')
    DependencyContext.collectPromise(
      new Promise<void>(async (resolve, reject) => {
        const request = await fetch(psdsrc)
        const buffer = await request.arrayBuffer()
        // const psd = readPsd(buffer);
        const psd = PSD.parse(buffer)
        console.log(psd)
        for (const layer of psd.children) {
          layer.hidden = false
        }
        psd.children[4].hidden = true
        const blob = psd.canvas.toDataURL('image/png')
        image.src = blob
        image.src = blob
        console.log(blob)
        if (!image.complete) {
          DependencyContext.collectPromise(
            new Promise((resolve, reject) => {
              image.addEventListener('load', resolve)
              image.addEventListener('error', reject)
            }),
          )
        }
        Psd.blobContentsPool[src] = image.src
        resolve()
      }),
    )
    return image
    // DependencyContext.collectPromise(
    //   new Promise<void>(async (resolve) => {
    //     const request = await fetch("https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png");
    //     const blob = URL.createObjectURL(await request.blob());
    //     this.add(
    //       <Img
    //         src={blob}
    //         width={1920}
    //       />
    //     )
    //     resolve();
    //   })
    // );
  }
};
