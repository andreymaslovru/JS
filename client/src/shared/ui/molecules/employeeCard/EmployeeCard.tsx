'use client'

import React, { FC, ReactNode } from 'react'
import { Avatar, Typography } from 'antd'
import { RightOutlined } from '@ant-design/icons'

import { generateHSLFromStr } from '@shared/helpers/generateHSLFromStr'
import { StatusOnline } from '@shared/ui/atoms/statusOnline/StatusOnline'

import styles from './EmployeeCard.module.css'

interface EmployeeCardProps {
  name: string;
  subtitle: ReactNode;
  avatarURI?: string;
  isSmall?: boolean
  status?: string | null
  isFull?: boolean
  phone?: string
}

export const EmployeeCard: FC<EmployeeCardProps> = ({
  name,
  subtitle,
  status,
  isSmall,
  isFull,
  phone
}) => (
  <div className={styles.container} style={{ justifyContent: isFull ? 'space-between' : undefined }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: isFull ? '14px' : '8px' }}>
      <div style={{ position: 'relative' }}>
        <Avatar size={isSmall ? 'small' : isFull ? 'large' : 'default'} style={{ backgroundColor: generateHSLFromStr(name) }}>{name?.slice(0, 1)}</Avatar>
        {status === 'online'
      && (
        <StatusOnline />
      )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isFull ? '2px' : undefined }}>
        <Typography.Title level={5} style={{ fontWeight: '500', fontSize: isSmall ? '14px' : undefined }}>
          {name}
        </Typography.Title>
        <div>
          <Typography.Title
            style={{ fontWeight: '300', fontSize: '12px', color: '#9BA2AE' }}
          >
            {phone}
          </Typography.Title>
          {typeof subtitle === 'string' ? <Typography.Title
            style={{ fontWeight: '300', fontSize: '12px', color: '#9BA2AE' }}
          >
            {subtitle}
          </Typography.Title> : <>{ subtitle }</>}
        </div>
      </div>
    </div>

    {isFull ? <RightOutlined style={{ color: '#bfbfbf', fontSize: '14px' }} /> : undefined}
  </div>
)
