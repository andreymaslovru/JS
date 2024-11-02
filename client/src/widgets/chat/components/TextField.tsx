import { DownCircleOutlined, DownOutlined } from '@ant-design/icons'
import { SocketApi } from '@api/socket'
import { Flex } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { FC, useContext, useRef, useState } from 'react'
import { uuid } from 'uuidv4'
import { useSearchParams } from 'next/navigation'

import { useProfileStore } from '@widgets/profile'
import { useChatsStore } from '@widgets/chats/model'

import { useChatStore } from '@entities/chat/model'

import { useAuthStore } from '@shared/axios/model'
import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import { GetMessageResponse, Message } from '../../../../open-api/ump/api'
import { Emoji } from '../Emoji'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TextField: FC<{isScrollable: boolean, messagesEndRef: any }> = ({ isScrollable, messagesEndRef }) => {
  const [isTyping, setIsTyping] = useState(false)
  const [taValue, setTaValue] = useState('')

  const token = useAuthStore((store) => store.token)
  const addChat = useChatsStore((store) => store.addChat)
  const addMessage = useChatStore((store) => store.addMessage)
  const companion = useChatStore((store) => store.companion)
  const settings = useChatStore((store) => store.settings)
  const setAnswer = useChatStore((store) => store.setAnswer)
  const profile = useProfileStore((store) => store.data)

  const params = useSearchParams()
  const chatId = params?.get('chat_id')

  const { isDarkTheme } = useContext(ThemeModeContext)

  const handleOnTyping = () => {
    console.log('typing_on')
    SocketApi?.socket?.emit('typing_on', { token, to_id: companion?.id })
  }

  const handleOffTyping = () => {
    SocketApi?.socket?.emit('typing_off', { token, to_id: companion?.id })
  }

  const handleSendMes = (val: string) => {
    if (val?.length <= 0) return

    const uuidGen = uuid()

    const mes = {
      text: val,
      from_id: profile?.id || '',
      id: uuidGen,
      is_read: false,
      answer: settings?.answer,
      timestamp: new Date().toISOString()
    } as GetMessageResponse

    SocketApi.socket?.emit('send_message', { content: val, message_type: 'text', to_id: chatId, message_id: uuidGen, to_message_id: settings?.answer?.id || null })
    setTaValue('')
    profile?.login !== chatId && addMessage(mes)

    scrollToBottom()
    setAnswer(null)

    setTimeout(() => {
      addChat(companion!.id)
    }, 200)
  }

  const scrollToBottom = () => {
    setTimeout(
      () =>
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        }),
      100
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSend = (e: any) => {
    e?.preventDefault()
    const text = e?.currentTarget?.value

    if (text?.length <= 0) return

    if (typingTimer?.current) {
      clearTimeout(typingTimer.current)
      setIsTyping(false)
      handleOffTyping()
    }

    handleSendMes(text)
  }

  const typingTimer = useRef<NodeJS.Timeout | null>(null)

  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
      handleOnTyping()
    }

    if (typingTimer?.current) {
      clearTimeout(typingTimer.current)
    }

    typingTimer.current = setTimeout(() => {
      setIsTyping(false)
      handleOffTyping()
    }, 3000)
  }

  return (
    <Flex align='start' style={{ padding: '0px 24px', backgroundColor: 'var(--antd-color-bg-layout)', borderTop: '1px solid var(--antd-color-border)' }}>
      {isScrollable ? <DownOutlined
        onClick={scrollToBottom}
        style={{ position: 'absolute', opacity: 0.5, right: 22, bottom: 80, fontSize: '16px', fontWeight: 300, color: 'white', background: isDarkTheme ? 'var(--antd-color-border)' : '#ada5a8', padding: '8px', borderRadius: '50%' }}
      /> : <></>}
      <TextArea
        autoFocus
        maxLength={350}
        value={taValue}
        onChange={(e) => {
          const val = e.target.value

          setTaValue(val)
          startTyping()
        }}
        onPressEnter={handleSend}
        placeholder='Type your message...'
        autoSize={{ minRows: 2, maxRows: 2 }}
        style={{
          backgroundColor: 'var(--antd-color-bg-layout)',
          border: 'none',
          borderRadius: '4px',
          padding: '12px 8px',
          color: 'var(--antd-color-text-base)'
        }}
      />

      <Emoji handleSend={() => handleSendMes(taValue)} handleSendEmoji={(em) => setTaValue((prev) => `${prev}${em}`)} />
    </Flex>
  )
}
