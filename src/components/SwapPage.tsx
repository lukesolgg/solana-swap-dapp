"use client";

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { executeSwap } from '../lib/swapUtils'

const SOL_MINT = 'So11111111111111111111111111111111111111112'
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

export default function SwapPage() {
  const { connection } = useConnection()
  const { wallet, publicKey } = useWallet()
  const [inputAmount, setInputAmount] = useState('0.1')
  const [slippage] = useState(0.5) // 0.5%
  const [loading, setLoading] = useState(false)
  const walletContext = useWallet()
  

  const handleSwap = async () => {
    if (!walletContext.wallet || !walletContext.publicKey) return
    
    setLoading(true)
    try {
      // Convert input amount to lamports
      const numericAmount = parseFloat(inputAmount)
      if (isNaN(numericAmount)) throw new Error('Invalid amount')
      
      const amountLamports = Math.floor(numericAmount * 1e9)
      
      const txid = await executeSwap(
        connection,
        walletContext,
        SOL_MINT,
        USDC_MINT,
        amountLamports,
        slippage * 100
      )
  
      console.log(`Swap successful: https://solscan.io/tx/${txid}`)
      alert(`Swap successful! Transaction: ${txid.slice(0, 10)}...`)
  
    } catch (error) {
      console.error('Swap failed:', error)
      alert(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.1"
            className="w-full p-2 rounded"
            step="0.1"
            min="0.1"
          />
          <p className="mt-2 text-sm text-gray-600">SOL → USDC</p>
        </div>

        <button
          onClick={handleSwap}
          disabled={!publicKey || loading}
          className={`w-full py-3 rounded-lg font-semibold ${
            publicKey && !loading 
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {loading ? 'Swapping...' : 'Swap SOL to USDC'}
        </button>
      </div>
    </div>
  )
}
