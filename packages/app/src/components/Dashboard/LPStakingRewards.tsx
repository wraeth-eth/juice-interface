import { CaretRightOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import ReconfigureFCModal from 'components/modals/ReconfigureFCModal'
import { CardSection } from 'components/shared/CardSection'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'
import { JsxAttribute } from 'typescript'
import { Descriptions } from 'antd'
import TooltipLabel from '../shared/TooltipLabel'

import CurrentFundingCycle from '../FundingCycle/CurrentFundingCycle'
import QueuedFundingCycle from '../FundingCycle/QueuedFundingCycle'
import FundingHistory from './FundingHistory'
import SectionHeader from './SectionHeader'
import { smallHeaderStyle } from './styles'

type TabOption = 'current' | 'upcoming' | 'history'

const stakingRewardsPrograms = [
  {
    stakingToken: 'jJBX',
    end: '2-1-22 3:00pm',
    amount: 1400,
    rate: 0.04,
  },
  {
    stakingToken: 'yvJBX',
    end: '12-25-21 12:00am',
    amount: 5943,
    rate: 0.83,
  },
  {
    stakingToken: 'yJBX',
    end: '3 days ago',
    amount: 32,
    rate: 3.293,
  },
]

export default function LPStakingRewards({
  marginTop,
}: {
  marginTop?: number
}) {
  const {
    projectId,
    currentFC,
    isOwner,
    queuedFC,
    queuedPayoutMods,
    queuedTicketMods,
    currentPayoutMods,
    currentTicketMods,
  } = useContext(ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!projectId) return null

  return (
    <div style={{ marginTop: marginTop }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <SectionHeader
          text="LP Staking Rewards"
          tip="Coming soon!"
          style={{
            marginBottom: 12,
          }}
        />
      </div>
      <CardSection>
        <Button type="ghost" size="small">
          Deploy
        </Button>
      </CardSection>
      <CardSection>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {stakingRewardsPrograms.length ? (
            stakingRewardsPrograms.map((stakingRewardsProgram, i) => (
              <div
                key={i}
                style={{
                  cursor: 'pointer',
                  ...(i < stakingRewardsPrograms.length - 1
                    ? {
                        paddingBottom: 20,
                        borderBottom: '1px solid ' + colors.stroke.tertiary,
                      }
                    : {}),
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <Space align="baseline">
                    <h3>{stakingRewardsProgram.stakingToken}</h3>
                  </Space>

                  <Space align="baseline" style={smallHeaderStyle(colors)}>
                    Ends: {stakingRewardsProgram.end}
                    <CaretRightOutlined />
                  </Space>
                </div>
                <Descriptions
                  labelStyle={{ fontWeight: 600 }}
                  size="small"
                  column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
                >
                  <Descriptions.Item label="Total staked">
                    {stakingRewardsProgram.amount}{' '}
                    {stakingRewardsProgram.stakingToken}
                  </Descriptions.Item>
                  <Descriptions.Item label="Reward rate">
                    {stakingRewardsProgram.rate}{' JBX / '}
                    {stakingRewardsProgram.stakingToken}
                  </Descriptions.Item>                  
                </Descriptions>
              </div>
            ))
          ) : (
            <div>No staking rewards programs yet</div>
          )}
        </Space>
      </CardSection>
    </div>
  )
}
