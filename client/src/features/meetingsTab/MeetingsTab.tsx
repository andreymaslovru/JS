import React, { useEffect, useState } from 'react'
import { Typography } from 'antd'
import { meetingApi } from '@api/ump/api'
import { useTranslations } from 'next-intl'

import { CreateMeeting } from '@features/createMeeting'
import { MeetingCard } from '@features/meetingCard'

import styles from './MeetingsTab.module.css'
import { Meeting } from '../../../open-api/ump/api'

export const MeetingsTab: React.FC = () => {
  const t = useTranslations('Index')
  const [meetings, setMeetings] = useState<Meeting[] | null>(null)

  useEffect(() => {
    meetingApi.getMeetingsUserMeetingGetMeetingsGet().then((data) => {
      if (data?.status === 200) {
        setMeetings(data?.data)
      }
    })
  }, [])

  return (
    <div className={styles.container}>
      <div>
        {meetings?.[0] && <div style={{ marginBottom: '24px' }}>
          <Typography.Title
            level={5}
            style={{
              color: 'var(--antd-color-text)',
              fontWeight: '500',
              fontSize: '14px',
              marginBottom: '8px'
            }}
          >
            {t('nextMeeting')}
          </Typography.Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <MeetingCard {...meetings[0]} isNext />
          </div>
        </div>}

        {meetings && meetings?.length > 0 ? <div>
          <Typography.Title
            level={5}
            style={{
              color: 'var(--antd-color-text)',
              fontWeight: '500',
              fontSize: '14px',
              marginBottom: '8px'
            }}
          >
            {t('otherMeetings')}
          </Typography.Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {meetings?.map((el, key) => {
              if (key === 0) return <React.Fragment key={key} />

              return (
                <MeetingCard {...el} key={key} />
              )
            })}
          </div>
        </div> : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography.Text
              style={{ color: 'grey', fontWeight: '300', fontSize: '14px', marginRight: '24px' }}
            >
            Запланированных встреч нет
            </Typography.Text>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 0, right: 24, left: 24 }}>
        <CreateMeeting />
      </div>
    </div>
  )
}
