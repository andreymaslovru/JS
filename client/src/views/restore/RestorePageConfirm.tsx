import { FC, useContext, useState } from 'react'
import Image from 'next/image'
import { Button, Flex, Form, Input, Switch, Typography } from 'antd'
import * as yup from 'yup'
import { useTranslations } from 'next-intl'
import { Rule } from 'antd/es/form'
import { authApi } from '@api/ump/api'

import { useRouter } from '@shared/hooks/useRouter'
import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import styles from './styles.module.css'

const { Text, Title } = Typography

interface Props {
    code: string
}

const RestorePageConfirm: FC<Props> = ({ code }) => {
  const t = useTranslations('Form')
  const [form] = Form.useForm()
  const { isDarkTheme, setIsDarkTheme, openNotificationWithIcon } = useContext(ThemeModeContext)
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const schema = yup.object().shape({
    password: yup.string().required(t('required')),
    confirmPassword: yup.string().required(t('required'))
  })

  const yupSync = {
    async validator({ field }: { field: string }, value: string) {
      await schema.validateSyncAt(field, { [field]: value })
    }
  }

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      form.setFields([
        { name: 'password', errors: ['Пароли не совпадают'] },
        { name: 'confirmPassword', errors: ['Пароли не совпадают'] }
      ])

      return
    }

    form.validateFields()
    if (form.getFieldsError().some((item) => item.errors.length > 0)) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await authApi.setNewPwdClientSetNewPwdPost(code, password as any).then((data) => {
      if (data?.status === 200) {
        openNotificationWithIcon('success', 'Password changed successfully')
        handleGoAuth()
      } else {
        openNotificationWithIcon('error')
      }
    }).catch(() => {
      openNotificationWithIcon('error')
    })
  }

  const handleGoAuth = () => {
    router.push('/auth')
  }

  const handleGoRegister = () => {
    router.push('/register')
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
          <Title level={4} style={{ marginBottom: '8px' }}>New Password</Title>
          <Text style={{ fontSize: '14px', color: '#9BA2AE' }}>
            Create and confirm a new password for your account
          </Text>
        </div>

        <Form style={{ width: '100%' }} layout='vertical' form={form} validateTrigger={'onBlur'}>
          <Form.Item label='New Password' name='password' rules={[yupSync as Partial<Rule>]}>
            <Input.Password size='large' placeholder='*********' value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
          </Form.Item>

          <Form.Item label='Confirm New Password' name='confirmPassword' rules={[yupSync as Partial<Rule>]}>
            <Input.Password visibilityToggle={false} size='large' placeholder='*********' value={confirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} />
          </Form.Item>
        </Form>

        <Button
          className={styles.submit}
          type='primary'
          size='large'
          onClick={handleSubmit}
          style={isDarkTheme ? undefined : { backgroundColor: '#000' }}
        >
            Set Password
        </Button>
        <Button
          type='dashed'
          size='large'
          onClick={handleGoAuth}
          style={{ width: '100%', marginBottom: '12px' }}
        >
            Back to Sign In
        </Button>

        <Flex align='center' gap={4}>
          <Text>Don’t have an account yet?</Text>
          <Button onClick={handleGoRegister} type='link' style={{ padding: 0, color: 'var(--antd-color-primary)' }}>Sign Up</Button>
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

export default RestorePageConfirm
