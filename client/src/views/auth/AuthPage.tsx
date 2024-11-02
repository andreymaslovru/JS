'use client'

import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { Typography, Input, Button, Form, Flex, Switch } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { authApi } from '@api/ump/api'
import * as yup from 'yup'
import { Rule } from 'antd/es/form'
import { useTranslations } from 'next-intl'

import { useRouter } from '@shared/hooks/useRouter'
import { useAuthStore } from '@shared/axios/model'
import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import styles from './styles.module.css'

const { Text, Title } = Typography

const AuthPage: React.FC = () => {
  const t = useTranslations('Form')
  const tIndex = useTranslations('Index')
  const [form] = Form.useForm()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLOading] = useState(false)

  const router = useRouter()

  const { login: loginStore } = useAuthStore((state) => state)

  const { isDarkTheme, setIsDarkTheme, openNotificationWithIcon } = useContext(ThemeModeContext)

  const schema = yup.object().shape({
    login: yup.string().email(t('email')).required(t('required')),
    password: yup.string().required(t('required'))
  })

  const yupSync = {
    async validator({ field }: { field: string }, value: string) {
      await schema.validateSyncAt(field, { [field]: value })
    }
  }

  const goRegister = () => {
    router.push('/register')
  }

  const goReset = () => {
    router.push('/client/restore')
  }

  const handleSubmit = async () => {
    form.validateFields()
    if (form.getFieldsError().some((item) => item.errors.length > 0)) return

    if (login && password) {
      setIsLOading(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await authApi.loginForAccessTokenClientTokenPost(login, password).then(async (res) => {
        if (res.status === 200) {
          await window.localStorage.setItem('access_token', res.data?.access_token)

          loginStore(res.data.access_token)

          router.push('/')
        }
      }).finally(() => {
        setIsLOading(false)
      }).catch(() => {
        openNotificationWithIcon('error')
      })
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles.formContainer}>
        <div className={styles.bg_logo}>
          <Image src={'/bg_auth.png'} alt={''} width={275} height={123} />
        </div>

        <div className={styles.logo}>
          <Image src='/logo.svg' alt={'logo'} width={32} height={32} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ marginBottom: '8px' }}>{tIndex('welcomeBack')}</Title>
          <Text style={{ fontSize: '14px', color: '#9BA2AE' }}>
            {tIndex('pleaseEnterDetailsSignIn')}
          </Text>
        </div>

        <Form style={{ width: '100%' }} layout='vertical' form={form} validateTrigger={'onBlur'}>
          <Form.Item label={tIndex('emailAddress')} name='login' rules={[yupSync as Partial<Rule>]}>
            <Input size='large' placeholder='example@domain.org' value={login} onChange={(e) => setLogin(e.currentTarget.value)} />
          </Form.Item>

          <Form.Item label={tIndex('password')} name='password' rules={[yupSync as Partial<Rule>]}>
            <Input.Password value={password} onChange={(e) => setPassword(e.currentTarget.value)} size='large' placeholder='*******' type='password' iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)} />
          </Form.Item>
        </Form>

        <Button
          className={styles.submit}
          type='primary'
          size='large'
          onClick={handleSubmit}
          loading={isLoading}
          style={isDarkTheme ? undefined : { backgroundColor: '#000' }}
        >
          {tIndex('signIn')}
        </Button>

        <Flex align='center' gap={4}>
          <Text>{tIndex('dontHaveAcc')}</Text>
          <Button onClick={goRegister} type='link' style={{ padding: 0, color: 'var(--antd-color-primary)' }}>{tIndex('signUp')}</Button>
        </Flex>

        <Flex align='center' gap={4}>
          <Button onClick={goReset} type='link' style={{ padding: 0, color: 'var(--antd-color-primary)', textDecoration: 'underline' }}>{tIndex('forgotPassword')}</Button>
        </Flex>
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

export default AuthPage
