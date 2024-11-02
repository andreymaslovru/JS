/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { FC, useContext, useState } from 'react'
import { Flex } from 'antd'
import { SendOutlined, SmileOutlined } from '@ant-design/icons'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useLocale } from 'next-intl'
import { Fade } from 'react-awesome-reveal'

import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import styles from './Chat.module.css'

export const Emoji: FC<{ handleSend: () => void, handleSendEmoji?: (emoji: string) => void }> = ({ handleSendEmoji, handleSend }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkTheme } = useContext(ThemeModeContext)
  const locale = useLocale()

  return (
    <div style={{ paddingTop: '12px' }}>
      {isOpen && <div className={styles.emoji} onMouseLeave={() => setIsOpen(false)}>
        <Fade duration={250} direction='right'>
          <Picker
            data={data}
            locale={locale}
            onEmojiSelect={(emoji: any) => {
              handleSendEmoji?.(emoji?.native)
            }}
            theme={isDarkTheme ? 'dark' : 'light'}
            onClickOutside={() => setIsOpen(false)}
          />
        </Fade>
      </div>}

      <Flex gap={18} style={{ cursor: 'pointer', zIndex: 99999 }}>
        <SmileOutlined onMouseEnter={() => setIsOpen(true)} style={{ color: isOpen ? 'var(--antd-color-primary)' : 'grey', fontSize: '20px' }} />

        <SendOutlined onClick={handleSend} style={{ color: 'grey', fontSize: '20px' }} />
      </Flex>
    </div>
  )
}
