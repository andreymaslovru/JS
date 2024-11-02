'use client'

import React from 'react'

import { ChatApp } from '@widgets/chatApp/ChatApp'
import { LeftMain } from '@widgets/leftMain/LeftMain'

const HomePage: React.FC = () => {
  return (
    <div style={{ width: '100vw', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--antd-color-bg-layout)' }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <LeftMain />
        <ChatApp />
      </div>

      {/* <div className={styles.hideOnMobile}>
        <Profile />
      </div> */}
    </div>
  )
}

export default HomePage
