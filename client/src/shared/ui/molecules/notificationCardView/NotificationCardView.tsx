import React from 'react'
import { Typography } from 'antd'
import classNames from 'classnames'

import styles from './NotificationCardView.module.css'

interface NotificationCardViewProps {
  isNotReading?: boolean;
}

export const NotificationCardView: React.FC<NotificationCardViewProps> = ({ isNotReading }) => {
  return (
    <div className={classNames(styles.container, isNotReading && styles.active)}>
      <div className={styles.header}>
        <Typography.Title style={{ fontWeight: isNotReading ? undefined : '300' }} level={5}>New event</Typography.Title>
        <Typography.Text style={{ color: isNotReading ? 'var(--antd-color-primary)' : '#B0B0B0' }}>10:23 AM</Typography.Text>
      </div>

      <div className={styles.content}>
        <Typography.Text style={{ color: 'inherit' }}>
          Andrey Maslov invited you to the “daily planning” event
        </Typography.Text>
      </div>
    </div>
  )
}
