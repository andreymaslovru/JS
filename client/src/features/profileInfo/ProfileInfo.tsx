'use client'
import React, { FC, useEffect } from 'react'
import { Avatar, Button, Flex, Typography } from 'antd'

import { useProfileStore } from '@widgets/profile'

import { useRouter } from '@shared/hooks/useRouter'
import { generateHSLFromStr } from '@shared/helpers/generateHSLFromStr'
import { WrapperMainWindow } from '@shared/ui/templates/WrapperMainWindow'

import { useModalUserStore } from './model'

interface ProfileInfoProps {
  userId: string
}

export const ProfileInfo: FC<ProfileInfoProps> = ({ userId }) => {
  const router = useRouter()
  const { data, fetchData } = useModalUserStore((store) => store)
  const currentProfile = useProfileStore((store) => store.data)

  const firstname = data?.firstname
  const lastname = data?.lastname
  const login = data?.login
  const position = data?.position
  const middlename = data?.middlename
  const email = data?.email

  useEffect(() => {
    if (userId) {
      fetchData(userId)
    }
  }, [userId])

  const handleGoToChat = () => {
    router?.push(`?chat_id=${login}`)
  }

  return (
    <WrapperMainWindow>
      {data?.id && <Flex align='center' vertical style={{ marginBottom: '12px' }}>

        <Avatar
          size={100}
          style={{ marginBottom: '12px', backgroundColor: generateHSLFromStr(`${firstname} ${lastname}`) }}
        >
          {`${firstname} ${lastname}`.slice(0, 1)}
        </Avatar>

        <Flex vertical align='center'>
          <Typography.Title
            level={5}
            style={{ fontWeight: '500', fontSize: '14px' }}
          >
            {firstname} {middlename ? middlename : ''} {lastname}
          </Typography.Title>
          <Typography.Text
            style={{ color: 'grey', fontWeight: '300', fontSize: '12px' }}
          >
            {position}
          </Typography.Text>

          {currentProfile?.login !== userId && <Flex gap={12} style={{ marginTop: '36px' }}>
            <Button type='default' onClick={handleGoToChat}>Написать сообщение</Button>
            {/* <Button type='default' onClick={handleGoToChat}>Написать сообщение</Button> */}
          </Flex>}

          <Flex vertical gap={8} style={{ marginTop: '36px' }}>
            <Typography.Text copyable>{email}</Typography.Text>
          </Flex>
        </Flex>
      </Flex>}
    </WrapperMainWindow>
  )
}
