import Loading from 'components/Loading'
import NewDeployNotAvailable from 'components/NewDeployNotAvailable'
import ScrollToTopButton from 'components/ScrollToTopButton'

import {
  V2ProjectContext,
  V2ProjectContextType,
} from 'contexts/v2/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { usePageTitle } from 'hooks/PageTitle'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import { useBallotState } from 'hooks/v2/contractReader/BallotState'
import { usePaymentTerminalBalance } from 'hooks/v2/contractReader/PaymentTerminalBalance'
import useProjectCurrentFundingCycle from 'hooks/v2/contractReader/ProjectCurrentFundingCycle'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectHandle from 'hooks/v2/contractReader/ProjectHandle'
import useProjectMetadataContent from 'hooks/v2/contractReader/ProjectMetadataContent'
import useProjectOwner from 'hooks/v2/contractReader/ProjectOwner'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import useProjectTerminals from 'hooks/v2/contractReader/ProjectTerminals'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import useProjectTokenTotalSupply from 'hooks/v2/contractReader/ProjectTokenTotalSupply'
import useTerminalCurrentOverflow from 'hooks/v2/contractReader/TerminalCurrentOverflow'
import useUsedDistributionLimit from 'hooks/v2/contractReader/UsedDistributionLimit'
import { first } from 'lodash'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { NO_CURRENCY, V2_CURRENCY_ETH, V2CurrencyName } from 'utils/v2/currency'

import useNftRewards from 'hooks/v2/nftRewards/IPFSToNftRewards'
import { useNftCidOf } from 'hooks/v2/contractReader/NftCidOf'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'
import { V2ArchivedProjectIds } from 'constants/v2/archivedProjects'
import { layouts } from 'constants/styles/layouts'

import Project404 from '../../../../components/Project404'
import V2Project from '../../../../components/v2/V2Project'

export default function V2Dashboard({ projectId }: { projectId: number }) {
  const router = useRouter()
  const { data: metadataCID, loading: metadataURILoading } =
    useProjectMetadataContent(projectId)

  const {
    data: projectMetadata,
    error: metadataError,
    isLoading: metadataLoading,
  } = useProjectMetadata(metadataCID)

  usePageTitle({
    title: projectMetadata?.name
      ? `${projectMetadata.name} | Juicebox`
      : undefined,
  })

  const { data: projects } = useProjectsQuery({
    projectId,
    keys: ['createdAt', 'totalPaid'],
    cv: ['2'],
  })
  const createdAt = first(projects)?.createdAt
  const totalVolume = first(projects)?.totalPaid

  const { data: fundingCycleResponse, loading: fundingCycleLoading } =
    useProjectCurrentFundingCycle({
      projectId,
    })
  const [fundingCycle, fundingCycleMetadata] = fundingCycleResponse ?? []

  const { data: payoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })

  const { data: terminals } = useProjectTerminals({
    projectId,
  })

  const isNewDeploy = Boolean(router.query.newDeploy)

  const primaryTerminal = terminals?.[0] // TODO: make primaryTerminalOf hook and use it

  const { data: distributionLimitData, loading: distributionLimitLoading } =
    useProjectDistributionLimit({
      projectId,
      configuration: fundingCycle?.configuration?.toString(),
      terminal: primaryTerminal,
    })

  const { data: usedDistributionLimit, loading: usedDistributionLimitLoading } =
    useUsedDistributionLimit({
      projectId,
      terminal: primaryTerminal,
      fundingCycleNumber: fundingCycle?.number,
    })

  const [distributionLimit, distributionLimitCurrency] =
    distributionLimitData ?? []

  const { data: reservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })

  const { data: ETHBalance, loading: ETHBalanceLoading } =
    usePaymentTerminalBalance({
      terminal: primaryTerminal,
      projectId,
    })

  const { data: tokenAddress } = useProjectToken({
    projectId,
  })

  const { data: handle } = useProjectHandle({
    projectId,
  })

  const tokenSymbol = useSymbolOfERC20(tokenAddress)

  const { data: primaryTerminalCurrentOverflow } = useTerminalCurrentOverflow({
    projectId,
    terminal: primaryTerminal,
  })

  const converter = useCurrencyConverter()
  const {
    data: balanceInDistributionLimitCurrency,
    loading: balanceInDistributionLimitCurrencyLoading,
  } = useMemo(() => {
    if (ETHBalanceLoading) return { loading: true }

    // if ETH, no conversion necessary
    if (
      distributionLimitCurrency?.eq(V2_CURRENCY_ETH) ||
      distributionLimitCurrency?.eq(NO_CURRENCY)
    ) {
      return { data: ETHBalance, loading: false }
    }

    return {
      data: converter.wadToCurrency(
        ETHBalance,
        V2CurrencyName(
          distributionLimitCurrency?.toNumber() as V2CurrencyOption,
        ),
        V2CurrencyName(V2_CURRENCY_ETH),
      ),
      loading: false,
    }
  }, [ETHBalance, ETHBalanceLoading, converter, distributionLimitCurrency])

  const { data: projectOwnerAddress } = useProjectOwner(projectId)

  const { data: totalTokenSupply } = useProjectTokenTotalSupply(projectId)

  const { data: ballotState } = useBallotState(projectId)

  const { data: nftRewardsCid } = useNftCidOf(projectId)
  const { data: nftRewardTiers } = useNftRewards(nftRewardsCid)

  const isArchived = projectId
    ? V2ArchivedProjectIds.includes(projectId) || projectMetadata?.archived
    : false

  if (metadataLoading || metadataURILoading) {
    return <Loading />
  }
  if (isNewDeploy && !metadataCID) {
    return <NewDeployNotAvailable handleOrId={projectId} />
  }
  if (metadataError || !metadataCID) {
    return <Project404 projectId={projectId} />
  }

  const project: V2ProjectContextType = {
    cv: '2',
    handle,
    projectId,
    createdAt,
    projectMetadata,
    fundingCycle,
    fundingCycleMetadata,
    distributionLimit,
    usedDistributionLimit,
    payoutSplits,
    reservedTokensSplits,
    tokenAddress,
    terminals,
    primaryTerminal,
    ETHBalance,
    totalVolume,
    distributionLimitCurrency,
    balanceInDistributionLimitCurrency,
    tokenSymbol,
    projectOwnerAddress,
    primaryTerminalCurrentOverflow,
    totalTokenSupply,
    ballotState,
    isArchived,

    nftRewards: {
      cid: nftRewardsCid,
      rewardTiers: nftRewardTiers ?? [],
    },

    loading: {
      ETHBalanceLoading,
      balanceInDistributionLimitCurrencyLoading,
      distributionLimitLoading,
      fundingCycleLoading,
      usedDistributionLimitLoading,
    },
  }

  return (
    <V2ProjectContext.Provider value={project}>
      <div style={layouts.maxWidth}>
        <V2Project />
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <ScrollToTopButton />
        </div>
      </div>
    </V2ProjectContext.Provider>
  )
}
