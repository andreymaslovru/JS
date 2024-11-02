import { Button, Form, Input, Radio, Switch } from 'antd'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { registerApi } from '@api/ump/api'

import { useProfileStore } from '@widgets/profile'

import { InputMask } from '@shared/ui/molecules/inputMask/InputMask'
import { WrapperMainWindow } from '@shared/ui/templates/WrapperMainWindow'

import { UserWithoutPassword } from '../../../open-api/ump/api'

export const SettingsTab: React.FC = () => {
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const getProfile = useProfileStore((store) => store.getProfile)
  const data = useProfileStore((store) => store.data)
  const [user, setUser] = useState<Partial<UserWithoutPassword> | null>(data)

  const t = useTranslations('Index')

  const firstname = Form.useWatch('firstname', form)
  const lastname = Form.useWatch('lastname', form)
  const middlename = Form.useWatch('middlename', form)
  const position = Form.useWatch('position', form)
  const phoneNumber = Form.useWatch('phoneNumber', form)
  const login = Form.useWatch('login', form)

  const settingsValidate = () => {
    if (!firstname || !lastname || !middlename || !position || !phoneNumber) {
      if (!firstname) {
        form.setFields([
          { name: 'firstname', value: firstname, errors: ['Field is required'] }
        ])
      }

      if (!lastname) {
        form.setFields([
          { name: 'lastname', value: lastname, errors: ['Field is required'] }
        ])
      }

      if (!middlename) {
        form.setFields([
          { name: 'middlename', value: middlename, errors: ['Field is required'] }
        ])
      }

      if (!position) {
        form.setFields([
          { name: 'position', value: position, errors: ['Field is required'] }
        ])
      }

      if (!phoneNumber) {
        form.setFields([
          { name: 'phoneNumber', value: phoneNumber, errors: ['Field is required'] }
        ])
      }

      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!settingsValidate()) return

    if (data?.id) {
      const res = await registerApi.updateUserClientUpdateUserPatch(
        position, undefined, firstname, middlename, lastname, phoneNumber, undefined, login
      )

      if (res?.status === 200) {
        setUser({
          position,
          firstname,
          middlename,
          lastname,
          phone: phoneNumber,
          login
        })

        getProfile()

        setIsEdit(false)
      }
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setUser(data)
    setIsEdit(false)
  }

  return (
    <WrapperMainWindow>
      <Form layout='vertical' form={form} validateTrigger='blur'>
        <Form.Item label={t('firstname')} name='firstname' required initialValue={user?.firstname}>
          <Input disabled={!isEdit} />
        </Form.Item>

        <Form.Item label={t('lastname')} name='lastname' required initialValue={user?.lastname}>
          <Input disabled={!isEdit} />
        </Form.Item>

        <Form.Item label={t('middlename')} name='middlename' initialValue={user?.middlename}>
          <Input disabled={!isEdit} />
        </Form.Item>

        <Form.Item label={t('position')} name='position' initialValue={user?.position}>
          <Input disabled={!isEdit} />
        </Form.Item>

        <Form.Item label={t('phoneNumber')} name='phoneNumber' required initialValue={user?.phone}>
          <InputMask
            mask='+7 (000) 000 00-00'
            submitOptions={{ unmask: true, fixedChars: '5' }}
            disabled={!isEdit}
          />
        </Form.Item>

        <Form.Item label={t('login')} name='login' required initialValue={user?.login}>
          <Input disabled={!isEdit} />
        </Form.Item>
      </Form>

      <div style={{ width: '100%', display: 'flex', gap: '12px' }}>
        {isEdit ? (
          <>
            <Button type='default' style={{ width: '50%' }} onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button type='primary' style={{ width: '50%' }} onClick={handleSave}>
              {t('save')}
            </Button>
          </>
        ) : (
          <Button type='primary' style={{ width: '100%' }} onClick={() => setIsEdit(true)}>
            {t('edit')}
          </Button>
        )}
      </div>
    </WrapperMainWindow>
  )
}
