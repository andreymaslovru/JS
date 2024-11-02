/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { FC, memo } from 'react'
import { Flex, Typography } from 'antd'
import { FormatPainterOutlined, GlobalOutlined, InteractionOutlined, LockOutlined, RightOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { useSearchParams } from 'next/navigation'
import classNames from 'classnames'

import { EmployeeBar } from '@entities/employee/ui'

import { useRouter } from '@shared/hooks/useRouter'
import { generateHSLFromStr } from '@shared/helpers/generateHSLFromStr'

import styles from './Profile.module.css'
import { useProfileStore } from './model'

const listSettings = [
  { title: 'Общие', params: 'main', icon: <SettingOutlined style={{ color: 'inherit' }} />, bg: generateHSLFromStr('Общие') },
  { title: 'Аккаунт', params: 'account', icon: <GlobalOutlined style={{ color: 'inherit' }} />, bg: generateHSLFromStr('Аккаунт') },
  { title: 'Оформление', params: 'paint', icon: <FormatPainterOutlined style={{ color: 'inherit' }} />, bg: generateHSLFromStr('paint') },
  { title: 'Язык', params: 'lang', icon: (
    <svg className='w-6 h-6 text-gray-800 dark:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24'>
      <path stroke='#333' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m13 19 3.5-9 3.5 9m-6.125-2h5.25M3 7h7m0 0h2m-2 0c0 1.63-.793 3.926-2.239 5.655M7.5 6.818V5m.261 7.655C6.79 13.82 5.521 14.725 4 15m3.761-2.345L5 10m2.761 2.655L10.2 15'/>
    </svg>
  ), bg: '#edf0ef' },
  { title: 'Безопасность', params: 'safety', icon: <LockOutlined style={{ color: 'inherit' }} />, bg: generateHSLFromStr('Безопасность') },
  { title: 'Выход', params: 'leave', icon: <InteractionOutlined style={{ color: 'inherit' }} />, bg: generateHSLFromStr('Выход'), newBlock: true }
]

export const Profile: FC = memo(() => {
  const data = useProfileStore((state) => state.data)

  const router = useRouter()

  const handleSettingClick = (param: string) => {
    const newParams = new URLSearchParams()
    newParams.set('settings', param)

    router.push(`?${newParams.toString()}`)
  }

  const handleGoUserProfile = (login: string) => {
    const newParams = new URLSearchParams()
    newParams.set('user', login)

    router.push(`?${newParams.toString()}`)
  }

  const params = useSearchParams()
  const settings = params?.get('settings')

  return (
    <Flex vertical justify='space-between'>
      <div className={styles.header}>
        <div style={{ cursor: 'pointer', width: '100%' }} onClick={() => {
          if (data?.login) {
            // TODO удалить стор
            // setUserId(data?.id)
            // openModal()
            handleGoUserProfile(data?.login)
          }
        }}>
          {data && <EmployeeBar phone={data?.phone} status='offline' name={`${data?.firstname} ${data?.lastname}`} userId={data?.login ? `@${data?.login}` : ''}/>}
        </div>
      </div>

      <div className={styles.listWrapper}>
        {listSettings.map((item) => {
          const isActive = settings === item.params

          return (
            <div
              style={{ marginTop: item?.newBlock ? '14px' : undefined }}
              className={classNames(styles.listItemWrapper, isActive ? styles.isActive : undefined)}
              onClick={() => handleSettingClick(item?.params)}
            >
              <Flex gap={12} align='center'>
                <div style={{ color: isActive ? 'black' : 'white', background: isActive ? 'white' : item.bg, width: 24, height: 24, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <Typography.Text style={{ color: isActive ? 'white' : undefined }}>
                  {item.title}
                </Typography.Text>
              </Flex>
              {!isActive ? <RightOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} /> : undefined}
            </div>
          )
        })}
      </div>
    </Flex>
  )
})
