'use client'

import { Typography } from 'antd'

import { RoomCard } from '@shared/ui/molecules'

import styles from './MeetingRooms.module.css'

export const MeetingRooms = () => (
  <div className={styles.container}>
    <Typography.Title
      underline
      level={3}
      style={{ fontWeight: '300', marginLeft: '12px', color: '#113870', marginBottom: '24px' }}
    >
      Meeting rooms
    </Typography.Title>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className={styles.list}>
      <RoomCard titleRoom={'Small meeting room'} isFree={true} />
      <RoomCard titleRoom={'Small meeting room'} isFree={true} />
      <RoomCard titleRoom={'Small meeting room'} isFree={false} />
      <RoomCard titleRoom={'Small meeting room'} isFree={false} />
      <RoomCard titleRoom={'Small meeting room'} isFree={true} />
      <RoomCard titleRoom={'Small meeting room'} isFree={true} />
      <RoomCard titleRoom={'Small meeting room'} isFree={true} /></div>
  </div>
)
