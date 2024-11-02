/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import FlipMove from 'react-flip-move'
import { useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { LoadingOutlined } from '@ant-design/icons'
import React from 'react'

import { useProfileStore } from '@widgets/profile'

import { useChatStore } from '@entities/chat/model'

import { MessageCard } from '@shared/ui/molecules'
import { useRouter } from '@shared/hooks/useRouter'
import { formatToHumanizeLastMessage } from '@shared/helpers/formattedDate'

import styles from './Chats.module.css'
import { favouritesMocks, groupsMocks } from './mocks'
import { Header } from './components/Header'
import { useChatsStore } from './model'
import { ChatUser, UserWithoutPassword } from '../../../open-api/ump/api'

export enum ChatsFilterType {
  PERSONAL = 'personal',
  GROUPS = 'groups',
  FAVOURITES = 'favourites',
}

const RefMessageCardWrapper = forwardRef<HTMLDivElement, {
  i: ChatUser & {isTyping?: boolean | undefined},
  currentChatId: string | null,
  profile: UserWithoutPassword | null,
  handleRedirectToChat:(login: string) => void
    }
    >(({ i, profile, currentChatId, handleRedirectToChat }, ref) => (
      <div ref={ref}>
        <MessageCard
          name={i.name || `${i?.companion?.firstname} ${i?.companion?.lastname}`}
          date={formatToHumanizeLastMessage(i?.last_message?.timestamp || '')}
          message={i?.last_message?.text || ''}
          isNotRead={false}
          toUserLogin={i?.companion?.login || i.id}
          onClick={handleRedirectToChat}
          status={i?.companion?.status}
          isTyping={i?.isTyping}
          isLastRead={i?.last_message?.is_read}
          isShowRead={i?.last_message?.from_id === profile?.id}
          isFavorites={i?.companion?.id === profile?.id}
          countIsNotReadMessage={i?.unread_messages || 0}
          isCurrent={currentChatId === i?.companion?.login}
        />
      </div>
    ))

export const Chats = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profile = useProfileStore((store) => store.data)
  const { chats, page, hasMore, setHasMore, setPage, getChats } = useChatsStore((store) => ({
    chats: store.chats,
    page: store.page,
    hasMore: store.hasMore,
    setHasMore: store.setHasMore,
    setPage: store.setPage,
    getChats: store.getChats,
    resetChats: store.reset
  }))
  const resetMessages = useChatStore((store) => store.reset)

  const currentChatId = searchParams?.get('chat_id')

  const [selected, setSelected] = useState<ChatsFilterType>(ChatsFilterType.PERSONAL)

  const handleRedirectToChat = (login: string) => {
    if (login === currentChatId) return

    resetMessages()

    const newParams = new URLSearchParams()
    newParams.set('chat_id', login)

    router.push(`?${newParams.toString()}`)
  }

  return (
    <div className={styles.container}>
      <Header selected={selected} setSelected={setSelected}/>

      <div className={styles.list}>
        {selected === ChatsFilterType.PERSONAL && profile && (
          <InfiniteScroll
            dataLength={chats?.length || 0}
            next={() => getChats(chats?.length || 0, 20, (res) => {
              if (res?.length && (res.length >= 20)) {
                setPage(page + 1)
              } else {
                setHasMore(false)
              }
            })}
            style={{
              display: 'flex',
              borderRadius: '0',
              flexDirection: 'column'
            }}
            hasMore={hasMore}
            loader={<></>}
            height={'calc(100vh - 180px)'}
            scrollThreshold={0.5}
          >
            <FlipMove duration={70} easing='ease-in'>
              {chats?.map((i) =>
                <RefMessageCardWrapper
                  key={i.id}
                  i={i}
                  currentChatId={currentChatId}
                  profile={profile}
                  handleRedirectToChat={handleRedirectToChat}
                />
              )}
            </FlipMove>
          </InfiniteScroll>
        )}

        {selected === ChatsFilterType.GROUPS && groupsMocks.map((i: any, key) => (
          <MessageCard
            key={key}
            name={i.name}
            date={i.date}
            message={i.message}
            isNotRead={i?.isNotRead}
            toUserLogin={i?.login}
            onClick={handleRedirectToChat}
          />
        ))}

        {selected === ChatsFilterType.FAVOURITES && favouritesMocks.map((i: any, key) => (
          <MessageCard
            key={key}
            name={i.name}
            date={i.date}
            message={i.message}
            isNotRead={i?.isNotRead}
            toUserLogin={i?.login}
            onClick={handleRedirectToChat}
          />
        ))}
      </div>
    </div>
  )
}
