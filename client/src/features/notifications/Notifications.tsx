import React, { useState } from 'react'
import { Badge, Drawer } from 'antd'
import { NotificationOutlined } from '@ant-design/icons'

import { NotificationCardView } from '@shared/ui/molecules'

export const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
        <Badge count={5} size='small'>
          <svg className='w-6 h-6 text-gray-800 dark:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24'>
            <path stroke='var(--antd-color-primary)' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1' d='M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.193-.538 1.193H5.538c-.538 0-.538-.6-.538-1.193 0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365Zm-8.134 5.368a8.458 8.458 0 0 1 2.252-5.714m14.016 5.714a8.458 8.458 0 0 0-2.252-5.714M8.54 17.901a3.48 3.48 0 0 0 6.92 0H8.54Z'/>
          </svg>

        </Badge>
      </div>

      <Drawer
        title='Notifications'
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <NotificationCardView isNotReading />
          <NotificationCardView isNotReading />
          <NotificationCardView />
          <NotificationCardView />
          <NotificationCardView />
          <NotificationCardView />
          <NotificationCardView />
        </div>
      </Drawer>
    </>
  )
}
