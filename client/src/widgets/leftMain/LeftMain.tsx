import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'

import { NavigationBar } from '@widgets/navigationBar/NavigationBar'
import { People } from '@widgets/people'
import { Profile, useProfileStore } from '@widgets/profile'

import { MeetingsTab } from '@features/meetingsTab'

import styles from './LeftMain.module.css'

export enum ViewsSidebar {
    PROFILE='profile',
    SETTINGS='settings',
    CHATS='chats',
    MEETINGS='meetings'
  }

export const LeftMain = () => {
  const getProfile = useProfileStore((state) => state.getProfile)

  const [view, setView] = useState<ViewsSidebar>(localStorage.getItem('view') as ViewsSidebar || ViewsSidebar.CHATS)

  useEffect(() => {
    getProfile()
  }, [])

  const handleChangeView = (val: ViewsSidebar) => {
    setView(val)
    localStorage.setItem('view', val)
  }

  const renderView = useCallback((val: ViewsSidebar) => {
    switch (val) {
      case ViewsSidebar.CHATS:
        return <People />
      case ViewsSidebar.SETTINGS:
        return <Profile />
      case ViewsSidebar.MEETINGS:
        return <MeetingsTab />
    }
  }, [view])

  return (
    <div className={classNames(styles.hideOnMobile, styles.sidebar)}>
      <div className={styles.viewWrapper}>{renderView(view)}</div>
      <NavigationBar view={view} onChange={handleChangeView} />
    </div>
  )
}
