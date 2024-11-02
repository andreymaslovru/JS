import { CommentOutlined, MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Badge } from 'antd'

import { ViewsSidebar } from '@widgets/leftMain/LeftMain'
import { useChatsStore } from '@widgets/chats/model'

import styles from './NavigationBar.module.css'

interface NavigationBarProps {
    view: ViewsSidebar
    onChange: (val: ViewsSidebar) => void
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ view, onChange }) => {
  const chats = useChatsStore((store) => store.chats)

  const [counterUnread, setCounterUnread] = useState(0)

  useEffect(() => {
    setCounterUnread(0)

    chats?.forEach((item) => {
      if (item?.unread_messages) {
        setCounterUnread((prev) => prev + Number(item!.unread_messages))
      }
    })
  }, [chats?.length])

  return (
    <div className={styles.container}>
      <CommentOutlined onClick={() => onChange(ViewsSidebar.MEETINGS)} style={{ fontSize: '22px', color: view === ViewsSidebar.MEETINGS ? 'var(--antd-color-primary)' : '#bfbfbf', cursor: 'pointer' }} />
      <SettingOutlined onClick={() => onChange(ViewsSidebar.SETTINGS)} style={{ fontSize: '22px', color: view === ViewsSidebar.SETTINGS ? 'var(--antd-color-primary)' : '#bfbfbf', cursor: 'pointer' }} />
      <div style={{ position: 'relative' }}>
        <MessageOutlined onClick={() => onChange(ViewsSidebar.CHATS)} style={{ fontSize: '22px', color: view === ViewsSidebar.CHATS ? 'var(--antd-color-primary)' : '#bfbfbf', cursor: 'pointer' }} />
        {counterUnread ? <Badge size='small' style={{ position: 'absolute', top: -20, right: -4 }} count={counterUnread} /> : null}
      </div>
    </div>
  )
}
