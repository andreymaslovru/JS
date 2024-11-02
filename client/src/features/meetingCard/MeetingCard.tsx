import { Avatar, Badge, Flex, Modal, Typography } from 'antd'
import React, { useState } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

import {
  MeetingCardView
} from '@shared/ui/molecules/meetingCardView'
import { generateHSLFromStr } from '@shared/helpers/generateHSLFromStr'

import styles from './MeetingCard.module.css'
import { Meeting } from '../../../open-api/ump/api'

export const MeetingCard: React.FC<Meeting & { isNext?: boolean }> = (data) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const creator = data?.participants?.find((el) => el.id === data?.creator_id)

  return (
    <>
      <MeetingCardView creator={creator} meeting={data} onClick={() => setIsOpen(true)} isNext={data?.isNext} />

      <Modal
        style={{ top: 20 }}
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <div className={styles.header}>
          <Typography.Text
            style={{ color: 'grey', fontWeight: '300', fontSize: '14px' }}
          >
            {dayjs(data?.start_time).format('DD/MM/YYYY')}
          </Typography.Text>
          <Typography.Text
            style={{ color: 'grey', fontWeight: '300', fontSize: '14px', marginRight: '24px' }}
          >
            {`${dayjs(data?.start_time).format('hh:mm')} - ${dayjs(data?.end_time).format('hh:mm')}`}
          </Typography.Text>
        </div>

        <div className={styles.title}>
          <Typography.Title
            level={5}
            style={{
              color: 'var(--antd-color-text-label)',
              fontWeight: '500',
              fontSize: '18px',
              marginBottom: '8px'
            }}
          >
            {data?.title}
          </Typography.Title>
        </div>

        <div className={styles.footer} style={{ marginBottom: '12px' }}>
          <div className={styles.organizer}>
            <div style={{ position: 'relative' }}>
              <Avatar size={'small'} style={{ backgroundColor: generateHSLFromStr(creator?.firstname || '') }}>{creator?.firstname?.slice(0, 1)}</Avatar>
            </div>

            <div>
              <Typography.Title
                level={5}
                style={{ fontWeight: '500', fontSize: '14px' }}
              >
                {`${creator?.firstname} ${creator?.lastname}`}
              </Typography.Title>
              <Typography.Text
                style={{ color: 'grey', fontWeight: '300', fontSize: '12px' }}
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
            {data?.room && <Badge
              count={
                <Typography.Text
                  style={{
                    color: '#6293AC',
                    fontWeight: '300',
                    fontSize: '12px',
                    padding: '1px 4px',
                    borderRadius: '8px'
                  }}
                >
                  conference
                </Typography.Text>
              }
              size={'small'}
              style={{ backgroundColor: '#E1F0F7' }}
            />}
            {data?.link && <Badge
              count={
                <Typography.Text
                  style={{
                    color: '#6293AC',
                    fontWeight: '300',
                    fontSize: '12px',
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

        <Flex vertical gap={12}>
          {data?.link && <Typography.Text copyable style={{ fontWeight: '500', color: '#113870' }}>Link: {data?.link}</Typography.Text>}
          {data?.description && <div>
            <Typography.Text copyable>{data?.description}</Typography.Text>
          </div>}

          <div>
            {data?.link && <Typography.Text style={{ fontWeight: '500', color: '#113870' }}>Участники:</Typography.Text>}
            {data?.participants?.map((participiant, i) => (
              <div key={i}>
                {participiant?.email} - {participiant?.firstname} {participiant?.lastname}
              </div>
            ))}
          </div>
        </Flex>
      </Modal>
    </>
  )
}
