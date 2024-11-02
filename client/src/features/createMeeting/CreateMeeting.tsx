import { Button, Drawer, Modal, Tabs, TabsProps } from 'antd'
import React, { useState } from 'react'

import { CreateOnlineMeeting } from './CreateOnlineMeeting'
import { CreateOfflineMeeting } from './CreateOfflineMeeting'
import { useTranslations } from 'next-intl'

export const CreateMeeting: React.FC = () => {
  const t = useTranslations('Index')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: 'on-line',
      children: <CreateOnlineMeeting handleClose={() => setIsOpen(false)} />
    }
    // {
    //   key: '2',
    //   label: 'off-line',
    //   children: <CreateOfflineMeeting />
    // }
  ]

  return (
    <>
      <Button style={{ width: '100%' }} type='primary' onClick={() => setIsOpen(true)}>
        {t('createmeeting')}
      </Button>

      <Drawer open={isOpen} onClose={() => setIsOpen(false)} title='Create meeting'>
        <Tabs defaultActiveKey='1' items={tabs} />
      </Drawer>
    </>
  )
}
