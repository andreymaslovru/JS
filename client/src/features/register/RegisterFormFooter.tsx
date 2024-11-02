import React, { useContext, useState } from 'react'
import { Button, Form } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { registerApi } from '@api/ump/api'

import { useRouter } from '@shared/hooks/useRouter'
import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import styles from './Register.module.css'

import { RegisterStep } from '.'

interface RegisterFormFooterProps {
  step: RegisterStep;
  steps: RegisterStep[];
  form: FormInstance
  setStep: React.Dispatch<React.SetStateAction<RegisterStep>>;
}

export const RegisterFormFooter: React.FC<RegisterFormFooterProps> = ({
  step,
  steps,
  form,
  setStep
}) => {
  const [loading, setloading] = useState<boolean>(false)
  const { openNotificationWithIcon, isDarkTheme } = useContext(ThemeModeContext)

  const router = useRouter()
  const email = Form.useWatch('email', form)
  const password = Form.useWatch('password', form)
  const firstname = Form.useWatch('firstname', form)
  const surname = Form.useWatch('surname', form)
  const code = Form.useWatch('code', form)
  const phone = Form.useWatch('phone', form)
  const middlename = Form.useWatch('middlename', form)
  const position = Form.useWatch('position', form)

  return (
    <div className={styles.footerContainer}>
      {step !== RegisterStep.INFORMATION && (
        <Button
          type='default'
          onClick={() => setStep((prev) => steps[steps.indexOf(prev) - 1])}
        >
          Back
        </Button>
      )}

      <Button
        className={styles.btn}
        type='primary'
        style={isDarkTheme ? undefined : { backgroundColor: '#000' }}
        loading={loading}
        onClick={async () => {
          if (steps.indexOf(step) === 1) {
            setloading(true)
            await registerApi.registerUserClientRegisterPost(
              email, firstname, surname, phone, code, password, position, undefined, middlename, undefined, undefined
            )
              .then((res) => {
                if (res.status === 200) {
                  router.push('/register/confirm')
                }
              }).catch(() => openNotificationWithIcon('error', 'Что-то пошло не так, уточните данные'))
              .finally(() => setloading(false))
          }

          if (steps.indexOf(step) === 0) {
            await form.validateFields()

            if (form.getFieldsError().some((item) => item.errors.length > 0)) {
              return
            } else {
              setStep((prev) => steps[steps.indexOf(prev) + 1])
            }
          }
        }}
      >
        {steps.indexOf(step) === 1 ? 'Finish' : 'Next'}
      </Button>
    </div>
  )
}
