import { describe, expect, it } from 'vitest'
import { Psd } from '../src'

describe('index', () => {
  describe('revideo-psdtool', () => {
    it('should export Psd', () => {
      expect(Psd).toBeDefined()
    })
  })
})
