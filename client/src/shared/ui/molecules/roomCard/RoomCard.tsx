import React from 'react'
import { Badge, Typography } from 'antd'
import { MoreOutlined } from '@ant-design/icons'

import styles from './RoomCard.module.css'

interface RoomCardProps {
  titleRoom: string;
  isFree: boolean;
  capacity?: number;
  floor?: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  titleRoom = 'Small meeting room',
  isFree = true,
  capacity = 10,
  floor = 2
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography.Title
            level={5}
            style={{ fontSize: '14px', fontWeight: '500', color: '#1890FF' }}
          >
            {titleRoom}
          </Typography.Title>
        </div>

        {isFree ? (
          <Badge
            size='small'
            count={'free'}
            style={{ backgroundColor: '#10B880' }}
          />
        ) : (
          <Badge
            size='small'
            count={'occupied'}
            style={{ backgroundColor: '#FF4D4F' }}
          />
        )}

        {/* <MoreOutlined rotate={90} style={{ fontSize: '18px' }} /> */}
      </div>

      <div className={styles.content}>
        <Typography.Text>Capacity: {capacity}</Typography.Text>
        <Typography.Text>Floor: {floor}</Typography.Text>
      </div>
    </div>
  )
}
