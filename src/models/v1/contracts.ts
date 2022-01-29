// import { Contract } from '@ethersproject/contracts'

import type {
  OperatorStore,
  // OperatorStoreInterface,
} from '../../../types/contracts/mainnet/OperatorStore'
import type {
  Projects,
  // ProjectsInterface,
} from '../../../types/contracts/mainnet/Projects'

export enum JuiceboxV1ContractName {
  FundingCycles = 'FundingCycles',
  TerminalV1 = 'TerminalV1',
  TerminalV1_1 = 'TerminalV1_1',
  TerminalDirectory = 'TerminalDirectory',
  ModStore = 'ModStore',
  OperatorStore = 'OperatorStore',
  Prices = 'Prices',
  Projects = 'Projects',
  TicketBooth = 'TicketBooth',
}

type JuiceboxV1Contract = OperatorStore | Projects

export type JuiceboxV1Contracts = Record<
  JuiceboxV1ContractName,
  JuiceboxV1Contract
>
