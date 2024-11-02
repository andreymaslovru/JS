'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button, Flex, Typography } from 'antd'
import { useSearchParams } from 'next/navigation'
import { registerApi } from '@api/ump/api'

import { useRouter } from '@shared/hooks/useRouter'

import styles from './styles.module.css'

const { Text, Title } = Typography

const ConfirmRegisterPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const initialized = useRef(false)

  const params = useSearchParams()
  const router = useRouter()

  const code = params?.get('code')

  useEffect(() => {
    if (code) {
      if (!initialized.current) {
        initialized.current = true

        registerApi.confirmRegistrationClientConfirmPost(code).then((data) => {
          if (data?.status !== 200) {
            setError(true)
          }
        }).catch(() => {
          setError(true)
        }).finally(() => {
          setIsLoading(false)
        })
      }
    }
  }, [code])

  const handleGoLogin = () => {
    router.push('/auth')
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer} style={{ position: 'relative' }}>
        <div className={styles.bg_logo}>
          <Image src={'/bg_auth.png'} alt={''} width={275} height={123} />
        </div>

        <div className={styles.logo}>
          {!code ? <svg className='w-[48px] h-[48px] text-gray-800 dark:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='none' viewBox='0 0 24 24'>
            <path stroke='var(--antd-color-primary)' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1' d='M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1'/>
          </svg> : <Image src='/logo.svg' alt={'logo'} width={32} height={32} />}
        </div>

        {!code ? (
          <Flex gap={16} vertical align='center'>
            <Title level={4}>Check your email</Title>
            <Text>To complete registration, we have sent instructions to you by email.</Text>
          </Flex>
        ) : (
          <Flex vertical align='center'>
            {isLoading && (
              <>
                <Title level={4}>Wait</Title>
                <Text>Please wait, loading...</Text>
              </>
            )}
            {error && (
              <>
                <Title level={4}>Fail</Title>
                <Text>Something went wrong. Try refreshing the page or registering again.</Text>
              </>
            )}
            {!isLoading && !error && <Title level={4}>Success</Title>}

            {!isLoading && !error && <Text>The account has been successfully registered, you can go to the login screen</Text>}

            {!isLoading && !error && <Button type='primary' onClick={handleGoLogin} style={{ marginTop: '24px' }}>Sign in</Button>}
          </Flex>
        )}
      </div>
    </div>
  )
}

export default ConfirmRegisterPage
