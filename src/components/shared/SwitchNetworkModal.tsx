import { Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useContext, useEffect, useState } from 'react'

import { NetworkContext } from 'contexts/networkContext'
import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'

export default function SwitchNetworkModal() {
  const [switchNetworkModalVisible, setSwitchNetworkModalVisible] =
    useState<boolean>()

  const supportedNetworks: NetworkName[] = [
    NetworkName.mainnet,
    NetworkName.rinkeby,
  ]

  const networkName = readNetwork.name

  const { signerNetwork } = useContext(NetworkContext)

  useEffect(() => {
    if (!signerNetwork) return
    console.log('signernetwork: ', signerNetwork)
    setSwitchNetworkModalVisible(signerNetwork !== networkName)
  }, [networkName, signerNetwork])

  console.log('switchNetworkModalVisible: ', switchNetworkModalVisible)

  return (
    <Modal
      visible={switchNetworkModalVisible}
      centered
      // closable={false}
      onCancel={() => setSwitchNetworkModalVisible(false)}
      footer={null}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <Space direction="vertical">
          <h2>Connect wallet to {networkName}</h2>
          {signerNetwork && supportedNetworks.includes(signerNetwork) ? (
            <React.Fragment>
              <div>Or, go to:</div>
              {supportedNetworks
                .filter(n => process.env.REACT_APP_INFURA_NETWORK !== n)
                .map(_n => {
                  const subDomain = _n === NetworkName.mainnet ? '' : _n + '.'

                  return (
                    <a key={_n} href={`https://${subDomain}juicebox.money`}>
                      {subDomain}juicebox.money
                    </a>
                  )
                })}
            </React.Fragment>
          ) : null}
        </Space>
      </div>
    </Modal>
  )
}
