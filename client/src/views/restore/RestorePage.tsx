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

const RestorePage: FC = () => {
  const t = useTranslations('Form')
  const [form] = Form.useForm()
  const { isDarkTheme, setIsDarkTheme, openNotificationWithIcon } = useContext(ThemeModeContext)
  const router = useRouter()

  const [login, setLogin] = useState('')
  const [success, isSuccess] = useState(false)

  const schema = yup.object().shape({
    login: yup.string().email(t('email')).required(t('required'))
  })

  const yupSync = {
    async validator({ field }: { field: string }, value: string) {
      await schema.validateSyncAt(field, { [field]: value })
    }
  }

  const handleSubmit = async () => {
    form.validateFields()
    if (form.getFieldsError().some((item) => item.errors.length > 0)) return

    await authApi.sendRestorePwdClientForgotPwdPost(login).then((data) => {
      if (data?.status === 200) {
        isSuccess(true)
        setLogin('')
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
          <Title level={4} style={{ marginBottom: '8px' }}>Forgot Password?</Title>
          <Text style={{ fontSize: '14px', color: '#9BA2AE' }}>
            No worries, well send you reset instructions
          </Text>
        </div>

        <Form style={{ width: '100%' }} layout='vertical' form={form} validateTrigger={'onBlur'}>
          <Form.Item label='E-Mail Address' name='login' rules={[yupSync as Partial<Rule>]}>
            <Input size='large' placeholder='Enter your email...' value={login} onChange={(e) => setLogin(e.currentTarget.value)} />
          </Form.Item>
        </Form>

        {success && <div className={styles.focus_wrapper_content}>
          <Typography.Text style={{ fontSize: '12px' }}>Password reset successfully. Instructions for restoring access to your account have been sent to your email.</Typography.Text>
        </div>}

        <Button
          className={styles.submit}
          type='primary'
          size='large'
          onClick={handleSubmit}
          style={isDarkTheme ? undefined : { backgroundColor: '#000' }}
        >
          Reset Password
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

export default RestorePage
