import { Connection, VersionedTransaction } from '@solana/web3.js'
import { SignerWalletAdapter } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import fetch from 'cross-fetch'
import { getQuote, getSwapTransaction } from './jupiter'

export async function executeSwap(
  connection: Connection,
  walletContext: WalletContextState,
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number
) {
  try {
    // Validate wallet state
    if (!walletContext.wallet?.adapter || !walletContext.publicKey) {
      throw new Error('Wallet not properly connected')
    }
    
    // Type assertion for signer capabilities
    const wallet = walletContext.wallet.adapter as SignerWalletAdapter
    
    // 1. Get quote
    const quoteResponse = await getQuote(
      inputMint,
      outputMint,
      amount,
      slippageBps
    )

    // 2. Get swap transaction
    const swapTransaction = await getSwapTransaction(
      quoteResponse,
      walletContext.publicKey.toString()
    )

    // 3. Deserialize and sign
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64')
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf)
    const signedTx = await wallet.signTransaction(transaction)

    // 4. Execute transaction
    const rawTransaction = signedTx.serialize()
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2
    })

    await connection.confirmTransaction(txid)
    return txid

  } catch (error) {
    console.error('Swap failed:', error)
    throw error
  }
}
