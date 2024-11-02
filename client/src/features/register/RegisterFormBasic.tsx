import React from 'react'
import { Flex, Form, Input } from 'antd'
import { Rule } from 'antd/es/form'
import { useTranslations } from 'next-intl'

import { InputMask } from '@shared/ui/molecules/inputMask/InputMask'

import styles from './Register.module.css'

export const RegisterFormBasic: React.FC<{yupSync: Partial<Rule>}> = ({ yupSync }) => {
  const t = useTranslations('Index')

  return (
    <Flex gap={48} className={styles.containerForm}>
      <div className={styles.wrapperBlockForm}>
        <Form.Item required label={t('email')} name='email' isList rules={[yupSync]} className={styles.wrapperBlockFormItem}>
          <Input size='large' placeholder='example@domain.org' />
        </Form.Item>

        <Form.Item required label={t('password')} name='password' rules={[yupSync]} className={styles.wrapperBlockFormItem}>
          <Input size='large' placeholder='*******' />
        </Form.Item>

        <Form.Item required label={t('phone')} name='phone' rules={[yupSync]} className={styles.wrapperBlockFormItem}>
          <InputMask
            mask='+7 (000) 000 00-00'
            submitOptions={{ unmask: true, fixedChars: '5' }}
            size='large'
            placeholder='+7 (000) 000 00-00'
          />
        </Form.Item>

        <Form.Item required label={t('inviteCode')} name='code' rules={[yupSync]} className={styles.wrapperBlockFormItem}>
          <Input size='large' placeholder='****' />
        </Form.Item>
      </div>

      <div className={styles.wrapperBlockForm}>
        <Form.Item required label={t('firstname')} name='firstname' rules={[yupSync]} className={styles.wrapperBlockFormItem}>
          <Input size='large' placeholder='Ivan' />
        </Form.Item>

        <Form.Item required label={t('lastname')} name='surname' rules={[yupSync]} className={styles.wrapperBlockFormItem}>
          <Input size='large' placeholder='Ivanov' />
        </Form.Item>

        <Form.Item label={t('middlename')} name='middlename' rules={[yupSync]} className={styles.wrapperBlockFormItem}>
          <Input size='large' placeholder='Ivanovich' />
        </Form.Item>

        <Form.Item label={t('position')} name='position' rules={[yupSync]} className={styles.wrapperBlockFormItem}>
          <Input size='large' placeholder='Team Lead' />
        </Form.Item>
      </div>
    </Flex>
  )
}
