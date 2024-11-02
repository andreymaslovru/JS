'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './Sidebar.module.css'

export const Sidebar = () => {
  return (
    <div className={styles.container}>
      <Link href={'/'}>
        <Image src={'/logo.svg'} alt={''} width={28} height={28} />
      </Link>
    </div>
  )
}
