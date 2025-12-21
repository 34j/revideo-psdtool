import type { ImgProps } from '@revideo/2d/lib/components'
import type { SimpleSignal } from '@revideo/core/lib/signals'
import type { RenderOptions } from 'ag-psd-psdtool'
import { Img } from '@revideo/2d/lib/components'
import { initial, signal } from '@revideo/2d/lib/decorators'
import { DependencyContext } from '@revideo/core/lib/signals'
import { readPsd } from 'ag-psd'
import { renderPsd } from 'ag-psd-psdtool'

export interface PsdProps extends ImgProps {
  psdSrc: string
  psdToolData: Record<string, unknown>
  psdToolRenderOptions?: RenderOptions
}

export class Psd extends Img {
  private static blobContentsPool: Record<string, string> = {}

  private readonly imageElement = document.createElement('img')

  @signal()
  public declare readonly psdSrc: SimpleSignal<string, this>

  @signal()
  public declare readonly psdToolData: SimpleSignal<Record<string, unknown>, this>

  @initial(undefined)
  @signal()
  public declare readonly psdToolRenderOptions: SimpleSignal<RenderOptions | undefined, this>

  public constructor(props: PsdProps) {
    super({ ...props, src: null })
  }

  protected override image(): HTMLImageElement {
    const src = `${this.psdSrc()}|${JSON.stringify(this.psdToolData())}|${JSON.stringify(this.psdToolRenderOptions() ?? {})}`
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

    const psdsrc = this.psdSrc()
    const image = document.createElement('img')
    DependencyContext.collectPromise((async (resolve, reject) => {
      const request = await fetch(psdsrc)
      const buffer = await request.arrayBuffer()
      const psd = readPsd(buffer)
      const blob = renderPsd(psd, this.psdToolData(), this.psdToolRenderOptions(),
      ).toDataURL('image/png')
      image.src = blob
      if (!image.complete) {
        image.addEventListener('load', resolve)
        image.addEventListener('error', reject)
      }
      Psd.blobContentsPool[src] = image.src
    })())
    return image
  }
};
