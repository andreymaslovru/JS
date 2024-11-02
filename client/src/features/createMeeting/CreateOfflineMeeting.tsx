import { Button, Checkbox, Form, Input } from 'antd'
import React from 'react'

export const CreateOfflineMeeting: React.FC = () => {
  return (
    <div style={{ height: '72vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Form layout='vertical'>
        <Form.Item
          label='Title'
          name='title'
          required
        >
          <Input placeholder='Daily meeting' />
        </Form.Item>

        <Form.Item
          label='Room'
          name='room'
          required
        >
          <Input placeholder='Small Meeting room' />
        </Form.Item>

        <Form.Item
          label='Link to the meeting'
          name='link'
        >
          <Input placeholder='https://link.com' />
        </Form.Item>

        <Form.Item
          label='Time'
          name='time'
          required
        >
          <Input placeholder='10:00 am to 11:30 am' />
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
        <Checkbox checked={true} style={{ marginBottom: '12px' }}>Send notifications to participants</Checkbox>
        <Button style={{ width: '100%' }} type='primary'>Create</Button>
      </div>
    </div>
  )
}
