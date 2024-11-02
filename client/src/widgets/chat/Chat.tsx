'use client'

import React, { useRef, useState } from 'react'

import styles from './Chat.module.css'
import { Header } from './components/Header'
import { TextField } from './components/TextField'
import { MessagesList } from './components/MessagesList'

export const Chat: React.FC = () => {
  const [isScrollable, setIsScrollable] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messagesEndRef: any = useRef(null)

  return (
    <div className={styles.container}>
      <Header />

      <MessagesList setIsScrollable={setIsScrollable} messagesEndRef={messagesEndRef} />

      <TextField isScrollable={isScrollable} messagesEndRef={messagesEndRef} />
    </div>
  )
}
