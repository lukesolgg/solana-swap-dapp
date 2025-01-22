export async function getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number
  ) {
    const url = new URL('https://quote-api.jup.ag/v6/quote')
    url.searchParams.append('inputMint', inputMint)
    url.searchParams.append('outputMint', outputMint)
    url.searchParams.append('amount', amount.toString())
    url.searchParams.append('slippageBps', slippageBps.toString())
  
    const response = await fetch(url.toString())
    return response.json()
  }
  
  export async function getSwapTransaction(
    quoteResponse: any,
    userPublicKey: string
  ) {
    const response = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true
      })
    })
  
    const { swapTransaction } = await response.json()
    return swapTransaction
  }