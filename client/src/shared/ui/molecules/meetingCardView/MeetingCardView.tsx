import React from 'react'
import { Avatar, Badge, Typography } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'

import { generateHSLFromStr } from '@shared/helpers/generateHSLFromStr'

import styles from './MeetingCardView.module.css'
import { Meeting, UserMeeting } from '../../../../../open-api/ump/api'

export interface MeetingCardViewProps {
  meeting: Meeting;
  creator: UserMeeting | undefined
  isNext?: boolean;
  onClick?: () => void;
}

export const MeetingCardView: React.FC<MeetingCardViewProps> = ({ creator, meeting, isNext, onClick }) => {
  return (
    <div className={classNames(styles.container, isNext && styles.next)} onClick={onClick}>
      <div className={styles.header}>
        <Typography.Text
          style={{ color: 'var(--antd-border-color)', fontWeight: '300', fontSize: '10px' }}
        >
          {dayjs(meeting?.start_time).format('DD/MM/YYYY')}
        </Typography.Text>
        <Typography.Text
          style={{ color: 'var(--antd-border-color)', fontWeight: '300', fontSize: '10px' }}
        >
          {`${dayjs(meeting?.start_time).format('hh:mm')} - ${dayjs(meeting?.end_time).format('hh:mm')}`}
        </Typography.Text>
      </div>

      <div className={styles.title}>
        <Typography.Title
          level={5}
          style={{
            color: 'var(--antd-color-text)',
            fontWeight: '500',
            fontSize: '14px',
            marginBottom: '8px'
          }}
        >
          {meeting?.title}
        </Typography.Title>
      </div>

      <div className={styles.footer}>
        <div className={styles.organizer}>
          <div style={{ position: 'relative' }}>
            <Avatar size={'small'} style={{ backgroundColor: generateHSLFromStr(creator?.firstname || '') }}>{creator?.firstname?.slice(0, 1)}</Avatar>
          </div>

          <div>
            <Typography.Title
              level={5}
              style={{ fontWeight: '300', fontSize: '12px' }}
            >
              {`${creator?.firstname} ${creator?.lastname}`}
            </Typography.Title>
            <Typography.Text
              style={{ color: 'var(--antd-border-color)', fontWeight: '300', fontSize: '10px' }}
            >
              Organizer
            </Typography.Text>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px'
          }}
        >
          {meeting?.room && <Badge
            count={
              <Typography.Text
                style={{
                  color: '#6293AC',
                  fontWeight: '300',
                  fontSize: '8px',
                  padding: '1px 4px',
                  borderRadius: '8px'
                }}
              >
                conference
              </Typography.Text>
            }
            size={'small'}
            style={{ backgroundColor: '#e1f7ee' }}
          />}
          {meeting?.link && <Badge
            count={
              <Typography.Text
                style={{
                  color: '#62ac83',
                  fontWeight: '300',
                  fontSize: '8px',
                  padding: '1px 4px',
                  borderRadius: '8px'
                }}
              >
                online
              </Typography.Text>
            }
            size={'small'}
            style={{ backgroundColor: '#E1F0F7' }}
          />}
        </div>
      </div>
    </div>
  )
}
