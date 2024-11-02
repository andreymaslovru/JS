import React, { useContext } from 'react'
import { Avatar, Badge, Flex, Typography } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import classNames from 'classnames'

import { generateHSLFromStr } from '@shared/helpers/generateHSLFromStr'
import { StatusOnline } from '@shared/ui/atoms/statusOnline/StatusOnline'
import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import styles from './MessageCard.module.css'

interface MessageCardProps {
  name: string;
  date: string;
  message: string;
  toUserLogin: string;
  isNotRead?: boolean;
  avatarURI?: string;
  onClick?: (toUserLogin: string) => void;
  status?: string | null
  isTyping?: boolean
  isLastRead?: boolean | null
  isShowRead?: boolean
  isFavorites?: boolean
  countIsNotReadMessage?: number
  isCurrent?: boolean
}

export const MessageCard: React.FC<MessageCardProps> = ({
  name,
  date,
  message,
  isNotRead,
  toUserLogin,
  onClick,
  status,
  isTyping,
  isLastRead,
  isShowRead,
  isFavorites,
  countIsNotReadMessage,
  isCurrent
}) => {
  const { isDarkTheme } = useContext(ThemeModeContext)

  return (
    <div style={{
      backgroundColor: isCurrent ? `${isDarkTheme ? 'var(--antd-color-bg-base)' : '#f7f7f7'}` : ''
    }} className={classNames(styles.container, isNotRead && styles.isNotRead)} onClick={() => onClick?.(toUserLogin)}>
      <div style={{ position: 'relative' }}>
        {!isFavorites ? <><Avatar style={{ backgroundColor: generateHSLFromStr(name) }}>{name.slice(0, 1)}</Avatar>
          {status === 'online' && <StatusOnline />}</> : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--antd-color-primary)' }}>
            <svg className='w-6 h-6 text-gray-800 dark:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
              <path stroke='white' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z'/>
            </svg>
          </div>
        )}
      </div>

      <div className={styles.wrapperContent}>
        <div className={styles.headerMessage}>
          <Typography.Text style={{ fontSize: '12px', fontWeight: 500 }}>{name}</Typography.Text>
          <Typography.Text style={{ fontSize: '10px', color: '#9BA2AE' }}>{date}</Typography.Text>
        </div>

        <div className={styles.footerMessage}>
          <div className={styles.innerMessage}>
            {isTyping && !isFavorites ? <Typography.Title
              style={{ fontWeight: '300', fontSize: '12px', color: 'var(--antd-color-primary)', marginLeft: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'><circle cx={4} cy={12} r={3} fill='currentColor'><animate id='svgSpinners3DotsBounce0' attributeName='cy' begin='0;svgSpinners3DotsBounce1.end+0.25s' calcMode='spline' dur='0.6s' keySplines='.33,.66,.66,1;.33,0,.66,.33' values='12;6;12' /></circle><circle cx={12} cy={12} r={3} fill='currentColor'><animate attributeName='cy' begin='svgSpinners3DotsBounce0.begin+0.1s' calcMode='spline' dur='0.6s' keySplines='.33,.66,.66,1;.33,0,.66,.33' values='12;6;12' /></circle><circle cx={20} cy={12} r={3} fill='currentColor'><animate id='svgSpinners3DotsBounce1' attributeName='cy' begin='svgSpinners3DotsBounce0.begin+0.2s' calcMode='spline' dur='0.6s' keySplines='.33,.66,.66,1;.33,0,.66,.33' values='12;6;12' /></circle></svg>
          печатает
              </div>
            </Typography.Title> : (
              <span className={styles.threedots}>
                {isShowRead && !isFavorites ? `You: ${message}` : message}
              </span>
            )}
          </div>

          <>
            <div style={{ position: 'relative' }}>
              {countIsNotReadMessage && !isFavorites ? <Badge count={countIsNotReadMessage} style={{ position: 'absolute', right: 0, top: -12 }} /> : <></>}
            </div>

            {isShowRead && !isFavorites && <div style={{ position: 'relative' }}>
              {isLastRead && <CheckOutlined style={{ color: '#10B880', position: 'absolute', top: '0px', right: '8px' }} />}
              {<CheckOutlined style={{ color: '#10B880', position: 'absolute', top: '0px', right: '2px' }} />}
            </div>}
          </>
        </div>
      </div>
    </div>
  )
}
