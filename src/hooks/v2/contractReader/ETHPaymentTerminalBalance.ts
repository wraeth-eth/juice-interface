import { BigNumber } from '@ethersproject/bignumber'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext, useEffect, useState } from 'react'

export function useETHPaymentTerminalBalance({
  projectId,
}: {
  projectId?: BigNumber
}) {
  const [balance, setBalance] = useState<BigNumber>()
  const { contracts } = useContext(V2UserContext)

  useEffect(() => {
    async function fetchData() {
      if (!projectId) return
      const res =
        await contracts?.JBETHPaymentTerminalStore.functions.balanceOf(
          projectId,
        )
      if (!res) return
      setBalance(res[0])
    }
    fetchData()
  }, [contracts, projectId])

  return { data: balance, loading: false }
}