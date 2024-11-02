import { FC, useContext, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { List, Modal, Typography } from 'antd'

import { ThemeModeContext, ViewMessageTypes } from '@shared/lib/antd/AntdProvider'

import styles from './styled.module.css'
import { GetMessageResponse } from '../../../../open-api/ump/api'

interface Props {
    isOpenReactionsIdMes: GetMessageResponse
    points: {
        x: number;
        y: number;
    }
    handleSetReactions: (message_id: string, reaction: string) => void
    handleSetAnswer: (message: GetMessageResponse) => void
    onResend: (messages: GetMessageResponse) => void
    onSelect: (message: GetMessageResponse) => void
}

export const EmojiMessage: FC<Props> = ({ points, isOpenReactionsIdMes, onSelect, onResend, handleSetReactions, handleSetAnswer }) => {
  const { viewMessageType, isDarkTheme } = useContext(ThemeModeContext)

  const setAnswer = () => {
    handleSetAnswer(isOpenReactionsIdMes)
  }

  return (
    <>
      <div style={{ zIndex: 99999, position: 'absolute', top: points.y, left: viewMessageType !== ViewMessageTypes.default ? points.x : '30%' }}>
        <Fade duration={250} direction='right'>
          <div style={{
            width: '120px',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            backgroundColor: isDarkTheme ? 'var(--antd-color-fill-content)' : 'var(--antd-color-bg-layout)',
            border: '1px solid var(--antd-color-border-secondary)',
            gap: 8,
            marginBottom: '12px'
          }}>
            <List
              style={{ width: '100%' }}
              dataSource={[
                { text: 'Copy', onClick: () => null },
                { text: 'Ответить', onClick: setAnswer },
                { text: 'Переслать', onClick: onResend },
                { text: 'Выбрать', onClick: onSelect }
              ]}
              renderItem={(item) => (
                <div
                  className={styles.itemContextMenu}
                  style={{ cursor: 'pointer', width: '100%' }}
                  onClick={() => item?.onClick(isOpenReactionsIdMes)}
                >
                  <Typography.Text>{item.text}</Typography.Text>
                </div>
              )}
            />
          </div>
        </Fade>
        <Fade duration={250} direction='up'>
          <div style={{
            padding: '6px 12px',
            borderRadius: '24px',
            display: 'flex',
            backgroundColor: isDarkTheme ? 'var(--antd-color-fill-content)' : 'var(--antd-color-bg-layout)',
            border: '1px solid var(--antd-color-border-secondary)',
            gap: 8
          }}>
            {['👍', '👎', '😂', '😁', '🙏', '😡'].map((item) => {
              return (
                <span
                  className={styles.reactionAdding}
                  style={{ fontSize: '22px', width: '100%', height: '100%', cursor: 'pointer', padding: '2px 6px' }}
                  onClick={() => handleSetReactions(isOpenReactionsIdMes?.id, item)}
                >
                  {item}
                </span>
              )
            })}
          </div>
        </Fade>
      </div>
    </>
  )
}
