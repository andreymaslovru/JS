import { meetingApi } from '@api/ump/api'
import { Button, Checkbox, Form, Input } from 'antd'
import en from 'antd/es/date-picker/locale/en_US'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import { DatePicker, DatePickerProps } from 'antd/lib'

import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import { Format } from '../../../open-api/ump/api'

const currTime = new Date()
const defaultValue1 = dayjs(currTime)
const defaultValue2 = dayjs(currTime.setMinutes(currTime.getMinutes() + 30))

const buddhistLocale: typeof en = {
  ...en,
  lang: {
    ...en?.lang
  }
}

export const CreateOnlineMeeting: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const [startTime, setStartTime] = useState<string | null>(defaultValue1.format('YYYY-MM-DD HH:mm'))
  const [endTime, setEndTime] = useState<string | null>(defaultValue2.format('YYYY-MM-DD HH:mm'))
  const [isSendNotify, setIsSendNotify] = useState<boolean>(false)
  const { openNotificationWithIcon } = useContext(ThemeModeContext)

  const [form] = useForm()

  const handleCreatemeeting = () => {
    form.validateFields()
    if (form.getFieldsError().some((item) => item.errors.length > 0)) {
      openNotificationWithIcon('error', 'Не все поля заполнены')
      return
    }

    if (endTime && startTime) {
      const { participants, link, title } = form.getFieldsValue()

      meetingApi.createMeetingMeetingCreateMeetingPost(startTime, endTime, Format.Online, participants, title, undefined, link, undefined, true)
        .then((data) => {
          if (data?.status === 200) {
            openNotificationWithIcon('success', 'Встреча успешно создана')
            handleClose()
          } else {
            openNotificationWithIcon('error')
          }
        })
        .catch(() => openNotificationWithIcon('error'))
    } else {
      openNotificationWithIcon('error', 'Не все поля заполнены')
    }
  }

  const onChangeStart: DatePickerProps['onChange'] = (_, dateString) => {
    setStartTime(dateString as string)
  }

  const onChangeEnd: DatePickerProps['onChange'] = (_, dateString) => {
    setEndTime(dateString as string)
  }

  return (
    <div style={{ height: '72vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Form layout='vertical' form={form}>
        <Form.Item
          label='Title'
          name='title'
          required
        >
          <Input placeholder='Daily meeting' />
        </Form.Item>

        <Form.Item
          label='Link to the meeting'
          name='link'
          required
        >
          <Input placeholder='https://link.com' />
        </Form.Item>

        <Form.Item
          label='From'
          name='from_time'
          required
        >
          <DatePicker
            defaultValue={defaultValue1}
            showTime
            locale={buddhistLocale}
            onChange={onChangeStart}
            format='YYYY-MM-DD HH:mm'
          />
        </Form.Item>

        <Form.Item
          label='To'
          name='to_time'
          required
        >
          <DatePicker
            defaultValue={defaultValue2}
            showTime
            locale={buddhistLocale}
            onChange={onChangeEnd}
            format='YYYY-MM-DD HH:mm'
          />
        </Form.Item>

        <Form.Item
          label='Participants or groups'
          name='participants'
          required
        >
          <Input placeholder='a.maslov@email.org' />
        </Form.Item>
      </Form>

      <div>
        <Checkbox onChange={() => setIsSendNotify((prev) => !prev)} checked={isSendNotify} style={{ marginBottom: '12px' }}>Send notifications to participants</Checkbox>
        <Button style={{ width: '100%' }} onClick={handleCreatemeeting} type='primary'>Create</Button>
      </div>
    </div>
  )
}
