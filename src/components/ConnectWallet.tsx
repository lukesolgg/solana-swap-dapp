'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function ConnectWallet() {
  return (
    <div className="flex justify-end p-4">
      <WalletMultiButton className="!bg-solana-purple hover:!bg-purple-700 !rounded-lg !px-4 !py-2 !text-white">
        Connect Wallet
      </WalletMultiButton>
    </div>
  )
}
