import { BigNumber, BigNumberish } from 'ethers'
import { JuiceboxV1ContractName } from 'models/v1/contracts'
import { JuiceboxV1TerminalName } from 'models/v1/terminals'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
  terminalName: JuiceboxV1TerminalName | undefined,
) {
  return useContractReader<BigNumber>({
    contract: JuiceboxV1ContractName.TicketBooth,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
