import React, { FC, useEffect } from 'react'
import Link from 'next/link'
import { LeftOutlined } from '@ant-design/icons'
import { Flex, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'

import { useProfileStore } from '@widgets/profile'

import { useChatStore } from '@entities/chat/model'

import { EmployeeCard } from '@shared/ui/molecules'
import { useRouter } from '@shared/hooks/useRouter'
import { formatToHumanizeLastMessage } from '@shared/helpers/formattedDate'

import styles from './styled.module.css'

export const Header: FC = () => {
  const params = useSearchParams()

  const userId = params?.get('chat_id')

  const t = useTranslations('Index')

  const getCompanion = useChatStore((store)=> store.getCompanion)
  const companion = useChatStore((store)=> store.companion)
  const profile = useProfileStore((store)=> store.data)

  useEffect(() => {
    userId && getCompanion(userId)
  }, [userId])

  const isFav = profile?.login === userId

  const router = useRouter()

  const handleGoUserProfile = (login: string | null | undefined) => {
    if (!login) return

    const newParams = new URLSearchParams()
    newParams.set('user', login)

    router.push(`?${newParams.toString()}`)
  }

  const getStatus = () => {
    if (isFav) {
      return ''
    }

    if (companion?.status && companion?.status !== 'online') {
      return (<Typography.Title style={{ fontWeight: '300', fontSize: '12px', color: '#9BA2AE' }}>
        Последнее посещение: {formatToHumanizeLastMessage(companion?.status)}
      </Typography.Title>)
    }

    if (companion?.isTyping) {
      return (
        <Typography.Title
          style={{ fontWeight: '300', fontSize: '12px', color: 'var(--antd-color-primary)' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'><circle cx={4} cy={12} r={3} fill='currentColor'><animate id='svgSpinners3DotsBounce0' attributeName='cy' begin='0;svgSpinners3DotsBounce1.end+0.25s' calcMode='spline' dur='0.8s' keySplines='.33,.66,.66,1;.33,0,.66,.33' values='12;6;12' /></circle><circle cx={12} cy={12} r={3} fill='currentColor'><animate attributeName='cy' begin='svgSpinners3DotsBounce0.begin+0.1s' calcMode='spline' dur='0.8s' keySplines='.33,.66,.66,1;.33,0,.66,.33' values='12;6;12' /></circle><circle cx={20} cy={12} r={3} fill='currentColor'><animate id='svgSpinners3DotsBounce1' attributeName='cy' begin='svgSpinners3DotsBounce0.begin+0.2s' calcMode='spline' dur='0.8s' keySplines='.33,.66,.66,1;.33,0,.66,.33' values='12;6;12' /></circle></svg>
          печатает
          </div>
        </Typography.Title>
      )
    }

    if (companion?.status === 'online') {
      return (
        <Typography.Title style={{ fontWeight: '300', fontSize: '12px', color: '#9BA2AE' }}>
          online
        </Typography.Title>
      )
    }
  }

  return (
    <div className={styles.header} onClick={() => handleGoUserProfile(companion?.login)}>
      <div style={{ display: 'flex', flexShrink: 0 }}>
        <Link
          style={{
            color: 'var(--antd-color-text)',
            marginLeft: '12px',
            display: 'flex',
            gap: '2px',
            alignItems: 'center'
          }}
          href={'/'}
        >
          <LeftOutlined style={{ color: 'var(--antd-color-text)' }} />
          <Typography.Title
            level={4}
            style={{
              fontWeight: '300'
            }}
          >
            {t('chat')}
          </Typography.Title>
        </Link>
      </div>

      {isFav && (
        <Flex align='center' gap={12}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--antd-color-primary)' }}>
            <svg className='w-6 h-6 text-gray-800 dark:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
              <path stroke='white' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z'/>
            </svg>

          </div>
          <Typography.Title level={5} style={{ fontWeight: '300' }}>
            {'Избранное'}
          </Typography.Title>
        </Flex>
      )}

      <Flex gap={0} align='center'>
        {companion && !isFav && <EmployeeCard
          status={companion?.status}
          name={`${companion?.firstname} ${companion?.lastname}`}
          subtitle={getStatus()}
          isSmall
        />}
      </Flex>
    </div>
  )
}
