'use client'

import Image from 'next/image'
import React, { useContext } from 'react'
import { Button, Flex, Switch, Typography } from 'antd'
import { useTranslations } from 'next-intl'

import { Register } from '@features/register'

import { useRouter } from '@shared/hooks/useRouter'
import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import styles from './styles.module.css'

const { Text, Title } = Typography

const RegisterPage: React.FC = () => {
  const router = useRouter()
  const goAuth = () => {
    router.push('/auth')
  }

  const t = useTranslations('Index')
  const { isDarkTheme, setIsDarkTheme } = useContext(ThemeModeContext)

  return (
    <div className={styles.container}>
      <div className={styles.formContainer} style={{ position: 'relative' }}>
        <div className={styles.bg_logo}>
          <Image src={'/bg_auth.png'} alt={''} width={275} height={123} />
        </div>

        <div className={styles.logo}>
          <Image src='/logo.svg' alt={'logo'} width={32} height={32} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ marginBottom: '8px' }}>{t('createAccount')}</Title>
          <Flex align='center' gap={4}>
            <Text>{t('alreadyHaveAcc')}</Text>
            <Button onClick={goAuth} type='link' style={{ padding: 0, color: 'var(--antd-color-primary)' }}>{t('signIn')}</Button>
          </Flex>
        </div>

        <Register />
      </div>

      <div className={styles.switch}>
        <Flex align='center' gap={12}>
          <Text style={{ fontSize: '12px' }}>Light/Dark</Text>
          <Switch size='small' checked={isDarkTheme} onChange={(chk) => setIsDarkTheme(chk)} />
        </Flex>
      </div>
    </div>
  )
}

export default RegisterPage
