import React, { FC, useContext } from 'react'
import { Avatar, Checkbox, Flex, Typography } from 'antd'
import dayjs from 'dayjs'
import { CheckOutlined } from '@ant-design/icons'
import { Bounce } from 'react-awesome-reveal'
import { SocketApi } from '@api/socket'

import { useProfileStore } from '@widgets/profile'

import { useChatStore } from '@entities/chat/model'

import { generateHSLFromStr } from '@shared/helpers/generateHSLFromStr'
import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'
import { useAuthStore } from '@shared/axios/model'

import styles from './styled.module.css'
import { GetMessageResponse, Reaction, UserFindModel } from '../../../../open-api/ump/api'

interface MessageItemProps {
  isRead: boolean
  user: (UserFindModel & {
    isTyping?: boolean | undefined;
  }) | null
  prevMessageUserId?: string | null
  nextMessageUserId?: string | null
  message: GetMessageResponse;
  idMessHoverReactions: GetMessageResponse | null
  checked?: boolean
  selectable?: boolean

  onClick: (mes: GetMessageResponse, type: 'ADD' | 'DELETE') => void
  handleClick: (e: { preventDefault: () => void; pageX: number; pageY: number;}, message: GetMessageResponse) => void
  handleAddReaction: (message_id: string) => void
}

export const MessageItem: FC<MessageItemProps> = ({
  user,
  prevMessageUserId,
  isRead,
  message,
  handleClick,
  handleAddReaction,
  idMessHoverReactions,
  selectable,
  checked,
  onClick
}) => {
  const { isDarkTheme } = useContext(ThemeModeContext)

  const token = useAuthStore((store) => store.token)
  const profile = useProfileStore((store) => store.data)
  const deleteReaction = useChatStore((store) => store.deleteReaction)
  const batchMessages = prevMessageUserId === user?.id

  const handleDeleteReaction = (reaction: Reaction) => {
    if (profile?.id === reaction?.from_user?.id) {
      deleteReaction(message?.id, reaction?.from_user?.id)
      SocketApi.socket?.emit('delete_reaction', { token, message_id: message?.id })
    }
  }

  return (
    <Flex
      justify='space-between'
      onContextMenu={(e) => handleClick(e, message)}
      style={{
        cursor: 'pointer',
        marginTop: !batchMessages ? '24px' : undefined,
        backgroundColor: idMessHoverReactions?.id === message?.id || checked ? 'var(--antd-color-border)' : undefined,
        padding: '6px 6%'
      }}
      onDoubleClick={() => handleAddReaction(message?.id)}
      onClick={selectable ? () => onClick(message, checked ? 'DELETE' : 'ADD') : undefined}
    >
      <Flex gap={8}>
        {!batchMessages && <div><Avatar size={'small'} style={{ backgroundColor: generateHSLFromStr(`${user?.firstname} ${user?.lastname}`) }}>{user?.firstname?.slice(0, 1)}</Avatar></div>}

        {batchMessages && <div style={{ paddingLeft: '24px' }} />}
        <Flex vertical gap={8}>
          {!batchMessages && <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>
            {`${user?.firstname} ${user?.lastname}`}
          </Typography.Text>}

          {message?.answer && (
            <div style={{ paddingLeft: '12px', borderLeft: '3px solid var(--antd-color-primary)' }}>
              <Flex vertical gap={0}>
                <Flex gap={12}>
                  <Typography.Text style={{ color: 'var(--antd-color-primary)', fontWeight: 500, fontSize: 14 }}>{message?.answer?.from_id !== profile?.id ? `${user?.firstname} ${user?.lastname}` : `${profile?.firstname} ${profile?.lastname}`}</Typography.Text>
                </Flex>
                <Typography.Text>{message?.answer?.text}</Typography.Text>
              </Flex>
            </div>
          )}

          <Typography.Text style={{ fontSize: '14px', color: 'white !important' }}>
            {message?.text}
          </Typography.Text>

          <Flex gap={6}>
            {message?.reactions?.map((reaction, i) => {
              return (
                <Bounce triggerOnce>
                  <Flex
                    key={i}
                    onClick={() => handleDeleteReaction(reaction)}
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
        </Flex>
      </Flex>

      <Flex gap={6} style={{ flexShrink: 0 }}>
        {profile?.id === message.from_id ? (<div style={{ position: 'relative' }}>
          {isRead && <CheckOutlined style={{ fontSize: '14px', color: '#10B880', position: 'absolute', top: '3px', right: '5px' }} />}
          <CheckOutlined style={{ fontSize: '14px', color: '#10B880' }} />
        </div>) : <></>}
        <div>
          <Typography.Text
            style={{
              width: '100%',
              fontSize: '12px',
              textAlign: 'left',
              paddingLeft: '4px',
              color: '#9BA2AE'
            }}
          >
            {dayjs(message?.timestamp).format('hh:mm')}
          </Typography.Text>
        </div>
        {selectable && <div>
          <Checkbox checked={checked} />
        </div>}
      </Flex>
    </Flex>
  )
}
