import React from 'react'
import { Flex, Form, FormInstance, Input, Typography } from 'antd'
import { useTranslations } from 'next-intl'

import { InputMask } from '@shared/ui/molecules/inputMask/InputMask'

import styles from './Register.module.css'

export const RegisterConfirm: React.FC = () => {
  const t = useTranslations('Index')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <Flex gap={48}>
          <div className={styles.wrapperBlockForm}>
            <Form.Item label={t('email')} name='email' isList className={styles.wrapperBlockFormItem}>
              <Input size='large' placeholder='example@domain.org' disabled />
            </Form.Item>

            <Form.Item label={t('password')} name='password' className={styles.wrapperBlockFormItem}>
              <Input size='large' placeholder='*******' disabled/>
            </Form.Item>

            <Form.Item label={t('phone')} name='phone' className={styles.wrapperBlockFormItem}>
              <InputMask
                mask='+7 (000) 000 00-00'
                submitOptions={{ unmask: true, fixedChars: '5' }}
                size='large'
                placeholder='+7 (000) 000 00-00'
                disabled
              />
            </Form.Item>

            <Form.Item label={t('inviteCode')} name='code' className={styles.wrapperBlockFormItem}>
              <Input size='large' placeholder='****' disabled/>
            </Form.Item>
          </div>

          <div className={styles.wrapperBlockForm}>
            <Form.Item label={t('firstname')} name='firstname' className={styles.wrapperBlockFormItem}>
              <Input size='large' placeholder='Ivan' disabled/>
            </Form.Item>

            <Form.Item label={t('lastname')} name='surname' className={styles.wrapperBlockFormItem}>
              <Input size='large' placeholder='Ivanov' disabled/>
            </Form.Item>

            <Form.Item label={t('middlename')} name='middlename' className={styles.wrapperBlockFormItem}>
              <Input size='large' placeholder='Ivanovich' disabled/>
            </Form.Item>

            <Form.Item label={t('position')} name='position' className={styles.wrapperBlockFormItem}>
              <Input size='large' placeholder='Team Lead' disabled/>
            </Form.Item>
          </div>
        </Flex>
      </div>
    </div>
  )
}
