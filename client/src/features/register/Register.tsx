import React, { useState } from 'react'
import { Form, Steps } from 'antd'
import * as yup from 'yup'
import { useTranslations } from 'next-intl'

import { Roles } from '@shared/ui/atoms/roleCard'

import { RegisterFormBasic } from './RegisterFormBasic'
import { RegisterConfirm } from './RegisterConfirm'
import { RegisterFormFooter } from './RegisterFormFooter'
import styles from './Register.module.css'

export enum RegisterStep {
  INFORMATION = 'information',
  CONFIRM = 'confirm',
}

export const Register: React.FC = () => {
  const t = useTranslations('Form')
  const tIndex = useTranslations('Index')
  const [form] = Form.useForm()

  const schema = yup.object().shape({
    email: yup.string().email(t('email')).required(t('required')),
    password: yup.string().required(t('required')),
    phone: yup.string().required(t('required')),
    code: yup.string().required(t('required')),
    firstname: yup.string().required(t('required')),
    surname: yup.string().required(t('required')),
    middlename: yup.string(),
    position: yup.string()
  })

  const yupSync = {
    async validator({ field }: { field: string }, value: string) {
      await schema.validateSyncAt(field, { [field]: value })
    }
  }

  const [step, setStep] = useState<RegisterStep>(RegisterStep.INFORMATION)

  const getIsVisibble = (cur: RegisterStep, target: RegisterStep) => cur === target

  const steps = Object.values(RegisterStep)

  const initialValues = {
    email: '',
    password: '',
    role: Roles.EMPLOYEE
  }

  return (
    <>
      <Steps
        size='small'
        className={styles.steps}
        current={steps.indexOf(step)}
        items={[
          {
            title: tIndex('information')
          },
          {
            title: tIndex('verify')
          }
        ]}
      />

      <Form className={styles.form} layout='vertical' form={form} initialValues={initialValues} validateTrigger={'onBlur'}>
        <>
          <div style={!getIsVisibble(step, RegisterStep.INFORMATION) ? { display: 'none' } : undefined }>
            <RegisterFormBasic yupSync={yupSync} />
          </div>

          <div style={!getIsVisibble(step, RegisterStep.CONFIRM) ? { display: 'none' } : undefined }>
            <RegisterConfirm />
          </div>
        </>

        <RegisterFormFooter
          setStep={setStep}
          step={step}
          steps={steps}
          form={form}
        />
      </Form>
    </>
  )
}
