'use client'

import dayjs from 'dayjs'
import locale from 'antd/locale/en_US'
import React, { FC, createContext, useCallback, useState } from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useServerInsertedHTML } from 'next/navigation'
import { ConfigProvider, notification } from 'antd'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'

import getTheme from '@shared/ui/theme'

import { CssTokenBridge } from './CssTokenBridge'

import 'dayjs/locale/en'
dayjs.locale('en')

export enum ViewMessageTypes {
  default = '0', leftRight = '1', leftRightWithContur = '2'
}

export enum ReactionTypes {
  like = '👍', hearth = '❤️', fire = '🔥'
}

export const ThemeModeContext = createContext({
  isDarkTheme: false,
  viewMessageType: ViewMessageTypes.default,
  reactionDefault: ReactionTypes.like,
  setReactionDefault: function(val: ReactionTypes) {},
  setViewMessageType: function(val: ViewMessageTypes) {},
  setIsDarkTheme: function(val: boolean) {},
  openNotificationWithIcon: function(type: NotificationType, title?: string, desc?: string) {}
})

type AntdProviderProps = React.PropsWithChildren
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const AntdProvider: FC<AntdProviderProps> = ({ children }) => {
  const [cache] = useState(() => createCache())
  const [isDarkTheme, setIsDarkTheme] = useState(window?.localStorage?.getItem('isDarkTheme') === 'true')
  const [viewMessageType, setViewMessageType] = useState(window?.localStorage?.getItem('viewMessageType') || ViewMessageTypes.default)
  const [reactionDefault, setReactionDefault] = useState(window?.localStorage?.getItem('reactionDefault') || ReactionTypes.like)

  const handleSwitchTheme = (value: boolean) => {
    window.localStorage.setItem('isDarkTheme', value ? 'true' : 'false')
    setIsDarkTheme(value)
  }

  const handleSwitchViewMessageType = (value: ViewMessageTypes) => {
    if (!value) return
    window.localStorage.setItem('viewMessageType', value)
    setViewMessageType(value)
  }

  const handleSwitchReactionType = (value: ReactionTypes) => {
    if (!value) return
    window.localStorage.setItem('reactionDefault', value)
    setReactionDefault(value)
  }

  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `</script>${extractStyle(cache)}<script>`
        }}
      />
    )
  })

  const theme = useCallback(() => getTheme(isDarkTheme), [isDarkTheme])

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type: NotificationType, title?: string, desc?: string) => {
    api[type]({
      message: title || 'Что-то пошло не так',
      description: desc
    })
  }

  return (
    <AntdRegistry>
      <ThemeModeContext.Provider value={{
        reactionDefault: reactionDefault as ReactionTypes,
        setReactionDefault: (v) => handleSwitchReactionType(v),
        viewMessageType: viewMessageType as ViewMessageTypes,
        setViewMessageType: (v) => handleSwitchViewMessageType(v),
        isDarkTheme,
        setIsDarkTheme: (v: boolean) => handleSwitchTheme(v),
        openNotificationWithIcon
      }}>
        <ConfigProvider locale={locale} theme={{ ...theme(), cssVar: true, hashed: false }}>
          <CssTokenBridge />
          <StyleProvider hashPriority='high' cache={cache} ssrInline>
            {contextHolder}

            <div style={isDarkTheme ? { colorScheme: 'dark' } : undefined}>
              {children}
            </div>
          </StyleProvider>
        </ConfigProvider>
      </ThemeModeContext.Provider>
    </AntdRegistry>
  )
}

export default AntdProvider
