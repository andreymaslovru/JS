import { SocketApi } from '@api/socket'
import { FC, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSearchParams } from 'next/navigation'
import { Button, Flex, Input, Modal, Typography } from 'antd'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { uuid } from 'uuidv4'
import { userApi } from '@api/ump/api'

import { useProfileStore } from '@widgets/profile'
import { UserItem } from '@widgets/converstions/components/userItem/UserItem'
import { useChatsStore } from '@widgets/chats/model'

import { useChatStore } from '@entities/chat/model'
import { useReadingStore } from '@entities/reads/model'
import { usePeopleStore } from '@entities/employee/model'

import { useAuthStore } from '@shared/axios/model'
import { ThemeModeContext, ViewMessageTypes } from '@shared/lib/antd/AntdProvider'
import { formatToHumanizeLastMessage, formatToHumanizeListMessage } from '@shared/helpers/formattedDate'

import { MessageItem } from './MessageItem'
import { MessageItemLeft } from './MessageItemLeft'
import { MessageItemRight } from './MessageItemRight'
import { EmojiMessage } from './EmojiMessage'
import { GetMessageResponse } from '../../../../open-api/ump/api'

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messagesEndRef: any
    setIsScrollable: React.Dispatch<React.SetStateAction<boolean>>
}

export const MessagesList: FC<Props> = ({ setIsScrollable, messagesEndRef }) => {
  const token = useAuthStore((store) => store.token)
  const addReaction = useChatStore((store) => store.addReaction)
  const companion = useChatStore((store) => store.companion)
  const messages = useChatStore((store) => store.messages)
  const getChat = useChatStore((store) => store.getChat)
  const resetChat = useChatStore((store) => store.reset)
  const settings = useChatStore((store) => store.settings)
  const setAnswer = useChatStore((store) => store.setAnswer)
  const addChat = useChatsStore((store) => store.addChat)
  const addMessage = useChatStore((store) => store.addMessage)
  const profile = useProfileStore((store) => store.data)
  const data = useReadingStore((store) => store.data)
  const addIsReadMessage = useReadingStore((store) => store.addIsReadMessage)
  const { data: dataPeople } = usePeopleStore((store) => store)

  const params = useSearchParams()
  const chatId = params?.get('chat_id') || ''

  const [modalOpen, setOpenModal] = useState(false)
  const [resendMessage, setResendMessage] = useState<GetMessageResponse[] | undefined>()
  const [hasMore, setHasMore] = useState(true)
  const [points, setPoints] = useState({ x: 0, y: 0 })
  const [isOpenReactionsIdMes, setIsOpenReactionsIdMes] = useState<GetMessageResponse | null>(null)
  const initialized = useRef(false)
  const isMount = useRef(false)
  const curPage = useRef(0)
  const [query, setQuery] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedMessages, setSelectedMessages] = useState<GetMessageResponse[]>([])

  const handleSelect = (id: string, type: 'ADD' | 'DELETE') => {
    setSelectedUsers((prev) => {
      return type === 'ADD' ? [...prev, id] : [...prev.filter((i) => i !== id)]
    })
  }

  const onResend = (messages: GetMessageResponse[]) => {
    setResendMessage(messages)
    setOpenModal(true)
  }

  const handleResendMessage = async () => {
    const currentCompanion = await userApi.findUserIdUserFindUserIdGet(chatId || '')
    const responseCompanion = await userApi.findUserIdUserFindUserIdGet(resendMessage?.[0].from_id || '')

    const messagesForResend = [
      `Переслано от: 
        ${responseCompanion.data.data?.[0]?.firstname} 
        ${responseCompanion.data.data?.[0]?.lastname}`,

      ...selectedMessages.map((mes) => mes.text)
    ]

    messagesForResend.forEach((message) => {
      selectedUsers.forEach((userId) => {
        SocketApi.socket?.emit('send_message', {
          content: message,
          message_type: 'text',
          to_id: userId,
          message_id: uuid()
        })

        const mes = {
          text: message,
          from_id: profile?.id || '',
          id: uuid(),
          is_read: false
        } as GetMessageResponse

        userId === currentCompanion?.data?.data?.[0]?.id && addMessage(mes)

        addChat(userId)
      })
    })

    setAnswer(null)
    setSelectedMessages([])
    setSelectedUsers([])

    setTimeout(() => {
      setOpenModal(false)
    }, 200)
  }

  const { viewMessageType, reactionDefault, isDarkTheme } = useContext(ThemeModeContext)

  const handleIsReadMessage = (message: GetMessageResponse) => {
    if ((message?.from_id !== profile?.id) && !message?.is_read) {
      SocketApi?.socket?.emit('read_message', { token, to_id: companion?.id, message_id: message?.id })
    }
  }

  useEffect(() => {
    setTimeout(() => {
      isMount.current = true
    }, 10)

    return () => {
      if (isMount.current) {
        isMount.current = false
        initialized.current = false
        curPage.current = 0
        setHasMore(true)
        resetChat()
      }
    }
  }, [chatId])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      if (curPage.current === 0) {
        getChat(chatId, 20 * curPage.current + (Number(messages?.length) - 20 * curPage.current || 0), 20, (res) => {
          if (res?.length && res.length >= 20) {
            curPage.current = curPage.current + 1
          } else {
            setHasMore(false)
          }
        })
      }
    }
  }, [chatId])

  useEffect(() => {
    messages?.forEach((mes) => mes?.is_read
      ? addIsReadMessage(mes?.id)
      : profile?.id !== mes.from_id
        ? handleIsReadMessage(mes) : undefined)
  }, [messages?.length])

  const handleSetReactions = (message_id: string, reaction: string) => {
    if (profile) addReaction(message_id, reaction, profile)
    SocketApi?.socket?.emit('set_reaction', { token, message_id, reaction, to_id: companion?.login })
  }

  const handleSetAnswer = (message: GetMessageResponse | null) => {
    setAnswer(message)
  }

  const handleSetSelectedMessages = (mes: GetMessageResponse, type: 'ADD' | 'DELETE') => {
    setSelectedMessages((prev) => type === 'ADD' ? [...prev, mes] : prev.filter((i) => i?.id !== mes?.id))
  }

  useEffect(() => {
    const handleClickOuter = () => setIsOpenReactionsIdMes(null)
    window.addEventListener('click', handleClickOuter)
    return () => window.removeEventListener('click', handleClickOuter)
  }, [])

  const handleClick = (e: { preventDefault: () => void, pageX: number, pageY: number }, message: GetMessageResponse) => {
    e.preventDefault()

    setPoints({ x: e.pageX, y: e.pageY >= window.innerHeight * 0.7 ? e.pageY - 140 : e.pageY })

    setIsOpenReactionsIdMes(message)
  }

  return (
    <>
      <div
        id='scrollableDiv'
        style={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
          justifyContent: 'space-between',
          height: '100%',
          maxHeight: 'calc(100vh - 130px)',
          background: 'inherit'
        }}
        onScroll={(e) => {
          if (e.currentTarget?.scrollTop < -80) {
            setIsScrollable(true)
          } else {
            setIsScrollable(false)
          }
        }}
      >
        <InfiniteScroll
          dataLength={messages?.length || 0}
          next={() => getChat(chatId, 20 * curPage.current + (Number(messages?.length) - 20 * curPage.current || 0), 20, (res) => {
            if (res?.length && (res.length >= 20)) {
              curPage.current = curPage.current + 1
            } else {
              setHasMore(false)
            }
          })}
          style={{
            display: 'flex',
            marginTop: '12px',
            borderRadius: '0',
            marginBottom: settings?.answer ? '50px' : '12px',
            flexDirection: 'column-reverse'
          }}
          scrollableTarget={'scrollableDiv'}
          hasMore={hasMore}
          inverse={true}
          loader={<></>}
          scrollThreshold={0.5}
        >
          <div ref={messagesEndRef} style={{ height: '1px' }} key={messages?.length} />
          {messages?.map((mes, i, arr) => {
            const isRead = !!data.find((id) => id === mes.id)
            const timeDividerCurrent = mes?.timestamp ? formatToHumanizeListMessage(mes?.timestamp) : ''
            const timeDividerNext = arr?.[i + 1]?.timestamp ? formatToHumanizeListMessage(arr?.[i + 1]?.timestamp) : ''

            return (
              <>
                {mes?.from_id === profile?.id ? (
                  viewMessageType === ViewMessageTypes.default
                    ? <MessageItem
                      isRead={isRead}
                      message={mes}
                      key={i}
                      user={profile}
                      prevMessageUserId={arr?.[i + 1]?.from_id}
                      handleClick={handleClick}
                      idMessHoverReactions={isOpenReactionsIdMes}
                      handleAddReaction={(id) => handleSetReactions(id, reactionDefault)}
                      checked={!!selectedMessages.find((i) => i.id === mes.id)}
                      selectable={!!selectedMessages?.length}
                      onClick={handleSetSelectedMessages}
                    />
                    : <MessageItemRight
                      isRead={isRead}
                      key={i}
                      message={mes}
                      handleClick={handleClick}
                      idMessHoverReactions={isOpenReactionsIdMes}
                      handleAddReaction={(id) => handleSetReactions(id, reactionDefault)}
                    />
                ) : (
                  viewMessageType === ViewMessageTypes.default
                    ? <MessageItem
                      isRead={isRead}
                      message={mes}
                      key={i}
                      user={companion}
                      prevMessageUserId={arr?.[i + 1]?.from_id}
                      handleClick={handleClick}
                      idMessHoverReactions={isOpenReactionsIdMes}
                      handleAddReaction={(id) => handleSetReactions(id, reactionDefault)}
                      checked={!!selectedMessages.find((i) => i.id === mes.id)}
                      selectable={!!selectedMessages?.length}
                      onClick={handleSetSelectedMessages}
                    />
                    : <MessageItemLeft
                      key={i}
                      message={mes}
                      handleClick={handleClick}
                      idMessHoverReactions={isOpenReactionsIdMes}
                      handleAddReaction={(id) => handleSetReactions(id, reactionDefault)}
                    />
                )}
                {timeDividerCurrent === timeDividerNext
                  ? <></>
                  : <Flex align='center' justify='center'>
                    <div style={{
                      borderRadius: '8px',
                      padding: '0px 8px',
                      marginTop: '8px',
                      background: isDarkTheme ? 'var(--antd-color-border)' : '#ada5a8' }}
                    >
                      <Typography.Text style={{ color: 'white', fontSize: '12px' }}>
                        {timeDividerCurrent}
                      </Typography.Text>
                    </div>
                  </Flex>}
              </>
            )
          })}
        </InfiniteScroll>
      </div>
      {isOpenReactionsIdMes && (
        <EmojiMessage
          isOpenReactionsIdMes={isOpenReactionsIdMes}
          points={points}
          handleSetReactions={handleSetReactions}
          handleSetAnswer={handleSetAnswer}
          onResend={(mes) => onResend([mes])}
          onSelect={(mes) => handleSetSelectedMessages(mes, 'ADD')}
        />
      )}

      {settings?.answer && <div style={{ padding: '4px 4px 4px 30px', zIndex: 9999, backgroundColor: 'var(--antd-color-bg-layout)', width: '100%', position: 'absolute', bottom: 70, paddingLeft: 12, borderLeft: '3px solid var(--antd-color-primary)' }}>
        <Flex vertical gap={0}>
          <Flex gap={12}>
            <Typography.Text style={{ color: 'var(--antd-color-primary)', fontWeight: 500, fontSize: 14 }}>{settings?.answer?.from_id !== profile?.id ? `${companion?.firstname} ${companion?.lastname}` : `${profile?.firstname} ${profile?.lastname}`}</Typography.Text>
            <CloseOutlined style={{ color: 'var(--antd-color-primary)' }} onClick={() => handleSetAnswer(null)} />
          </Flex>
          <Typography.Text>{settings?.answer?.text}</Typography.Text>
        </Flex>
      </div>}

      {selectedMessages?.length ? <div style={{
        width: '100%',
        background: 'var(--antd-color-bg-layout)',
        position: 'absolute',
        bottom: 0,
        zIndex: 999999,
        height: '69px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '56px'
      }}>
        <Button onClick={() => onResend(selectedMessages)} disabled={!selectedMessages?.length} type='link' icon={IconResend} iconPosition='end'>
                Переслать
        </Button>
      </div> : <></>}

      <Modal
        open={modalOpen}
        footer={null}
        onCancel={() => setOpenModal(false)}
      >
        <Flex vertical style={{ position: 'relative', height: `${window.screen.height / 2}px`, marginTop: '-16px' }}>
          <Flex align='center' gap={12} style={{ position: 'sticky', marginRight: '24px', padding: '8px', top: 0, zIndex: 9999 }}>
            <Input
              placeholder={'Find ...'}
              prefix={<SearchOutlined />} suffix='⌘K'
              onChange={(e) => setQuery(e.currentTarget?.value)}
            />
          </Flex>

          <Flex vertical style={{ maxHeight: '100%', overflow: 'auto' }} gap={2}>
            {dataPeople
              ?.filter((i) => i.firstname.includes(query) || i?.middlename?.includes(query) || i.lastname.includes(query))
              ?.map((item) => <UserItem onClick={handleSelect} employee={item} isChecked={selectedUsers.includes(item?.id)} />)}
          </Flex>

          <div style={{ width: '100%' }}>
            <Flex align='flex-end' justify='flex-end'>
              <Button onClick={handleResendMessage} disabled={!selectedUsers?.length} type='link' icon={IconResend} iconPosition='end'>
                Переслать
              </Button>
            </Flex>
          </div>
        </Flex>
      </Modal>
    </>
  )
}

const IconResend: ReactNode = <svg className='w-6 h-6 text-gray-800 dark:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
  <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2M12 4v12m0-12 4 4m-4-4L8 8'/>
</svg>
