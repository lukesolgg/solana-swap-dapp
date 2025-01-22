import { Providers } from './providers'
import ConnectWallet from '../components/ConnectWallet'
import SwapPage from '../components/SwapPage'

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen bg-gray-50">
        <ConnectWallet />
        <SwapPage />
      </main>
    </Providers>
  )
}
