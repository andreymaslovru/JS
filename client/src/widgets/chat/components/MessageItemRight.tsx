import React, { FC, useContext } from 'react'
import { Avatar, Flex, Typography } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Bounce } from 'react-awesome-reveal'

import { useProfileStore } from '@widgets/profile'

import { useChatStore } from '@entities/chat/model'

import { generateHSLFromStr } from '@shared/helpers/generateHSLFromStr'
import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import styles from './styled.module.css'
import { GetMessageResponse } from '../../../../open-api/ump/api'

interface MessageItemRightProps {
  isRead: boolean
  message: GetMessageResponse;
  idMessHoverReactions: GetMessageResponse | null
  handleClick: (e: { preventDefault: () => void; pageX: number; pageY: number;}, message: GetMessageResponse) => void
  handleAddReaction: (message_id: string) => void
}

export const MessageItemRight: FC<MessageItemRightProps> = ({
  isRead,
  message,
  idMessHoverReactions,
  handleClick,
  handleAddReaction
}) => {
  const { isDarkTheme } = useContext(ThemeModeContext)
  const profile = useProfileStore((store) => store.data)
  const companion = useChatStore((store) => store.companion)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '6px 24px',
        marginBottom: '12px',
        backgroundColor: idMessHoverReactions?.id === message?.id ? 'var(--antd-color-border)' : undefined
      }}
      onContextMenu={(e) => handleClick(e, message)}
      onDoubleClick={() => handleAddReaction(message?.id)}
    >
      <>
        <div style={{ position: 'relative' }}>
          {isRead && <CheckOutlined style={{ color: '#10B880', position: 'absolute', top: '0px', right: '40px' }} />}
          <CheckOutlined style={{ color: '#10B880', position: 'absolute', top: '0px', right: '46px' }} />
        </div>
        <Typography.Text
          style={{
            width: '100%',
            fontSize: '12px',
            textAlign: 'right',
            paddingRight: '4px',
            color: '#9BA2AE'
          }}
        >
          {dayjs(message?.timestamp).format('hh:mm')}
        </Typography.Text>
      </>

      <div
        className={styles.containerMessage}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: 'var(--antd-color-bg-spotlight)',
          alignSelf: 'flex-end',
          color: 'white',
          flexDirection: 'column',
          gap: 4
        }}
      >
        {message?.answer && (
          <div style={{ paddingLeft: '12px', borderLeft: isDarkTheme ? '3px solid white' : '3px solid var(--antd-color-primary)' }}>
            <Flex vertical gap={0}>
              <Flex gap={12}>
                <Typography.Text
                  style={{ fontWeight: 500, fontSize: 14, color: 'white' }}
                >
                  {message?.answer?.from_id !== profile?.id
                    ? `${companion?.firstname} ${companion?.lastname}`
                    : `${profile?.firstname} ${profile?.lastname}`}
                </Typography.Text>
              </Flex>
              <Typography.Text style={{ color: 'white' }}>{message?.answer?.text}</Typography.Text>
            </Flex>
          </div>
        )}
        <Typography.Text style={{ color: 'white' }}>{message?.text}</Typography.Text>
      </div>

      <Flex gap={6} style={{ paddingTop: '6px', paddingRight: '4px' }} justify='end'>
        {message?.reactions?.map((reaction, i) => {
          return (
            <Bounce triggerOnce>
              <Flex
                key={i}
                className={styles.reaction}
                style={{
                  boxShadow: !isDarkTheme ? '2px 2px 2px 2px rgba(198, 198, 198, 0.2)' : undefined,
                  backgroundColor: isDarkTheme ? 'var(--antd-color-fill-content)' : 'var(--antd-color-bg-layout)' }}
                align='center' gap={6}
              >
                {reaction?.reaction}

                <Avatar
                  size={'small'}
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: generateHSLFromStr(`${reaction?.from_user?.firstname} ${reaction?.from_user?.lastname}`)
                  }}
                >
                  {reaction?.from_user?.firstname?.slice(0, 1)}
                </Avatar>
              </Flex>
            </Bounce>
          )
        })}
      </Flex>
    </div>
  )
}
