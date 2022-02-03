import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'

import Navbar from 'components/Navbar'
import SwitchNetworkModal from 'components/shared/SwitchNetworkModal'

import Router from './Router'

function App() {
  return (
    <>
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'transparent',
        }}
      >
        <Navbar />
        <Content>
          <Router />
        </Content>
      </Layout>

      <SwitchNetworkModal />
    </>
  )
}

export default App
