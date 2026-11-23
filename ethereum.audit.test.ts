import type { ETHSignTx } from '@shapeshiftoss/hdwallet-core'
import { describe, expect, it, vi } from 'vitest'

import { ethSendTx } from './ethereum'

const account = '0x1111111111111111111111111111111111111111'
const otherAccount = '0x2222222222222222222222222222222222222222'

describe('MetaMask #12881 signing path audit', () => {
  it.each([57073, 42220])('submits native and contract transactions on chain %s when the account is authorized', async chainId => {
    for (const data of ['0x', '0xa9059cbb']) {
      const request = vi.fn().mockResolvedValue('0xfixturehash')
      const msg = { to: otherAccount, value: '0x1', data, chainId, nonce: '0x0', gasLimit: '0x5208', gasPrice: '0x1' } as ETHSignTx
      expect(await ethSendTx(msg, { request }, account)).toEqual({ hash: '0xfixturehash' })
      expect(request.mock.calls[0][0]).toMatchObject({ method: 'eth_sendTransaction', params: [{ from: account, data, chainId }] })
    }
  })

  it('returns null for the recorded provider error 4100 on an unauthorized account', async () => {
    const request = vi.fn().mockRejectedValue({ code: 4100, message: 'The requested account and/or method has not been authorized by the user.' })
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const msg = { to: otherAccount, value: '0x1', data: '0xa9059cbb', chainId: 57073, nonce: '0x0', gasLimit: '0x5208', gasPrice: '0x1' } as ETHSignTx
    expect(await ethSendTx(msg, { request }, account)).toBeNull()
    expect(log).toHaveBeenCalledWith(expect.objectContaining({ code: 4100 }))
    log.mockRestore()
  })
})
