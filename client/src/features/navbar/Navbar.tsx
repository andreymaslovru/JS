'use client'

import React from 'react'
import { Typography } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

import styles from './Navbar.module.css'

const { Title, Text } = Typography

export const Navbar: React.FC = () => {
  return (
    <Link href={'/'} className={styles.container}>
      <Image src={'/logo.svg'} alt={''} width={28} height={28} />
      <div style={{ display: 'flex' }}>
        <Title level={4}>Wave.</Title>
        <Text style={{ fontSize: '18px' }}>Chat</Text>
      </div>
    </Link>
  )
}
