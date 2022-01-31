import { BigNumber, BigNumberish } from 'ethers'
import { TerminalName } from 'models/terminal-name'
import { useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'

/** Returns balance in ETH of project with `projectId`. */
export default function useBalanceOfProject(
  projectId: BigNumberish | undefined,
  terminalName: TerminalName | undefined,
) {
  return useContractReader<BigNumber>({
    contract: terminalName,
    functionName: 'balanceOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], BigNumber.from(projectId).toHexString()],
              },
              {
                contract: terminalName,
                eventName: 'Tap',
                topics: [[], BigNumber.from(projectId).toHexString()],
              },
            ]
          : undefined,
      [projectId, terminalName],
    ),
  })
}