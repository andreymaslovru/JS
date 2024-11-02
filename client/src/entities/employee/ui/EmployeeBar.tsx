'use client'

import React from 'react'

import { EmployeeCard } from '@shared/ui/molecules'

import styles from './EmployeeBar.module.css'

export const EmployeeBar: React.FC<{name: string, userId: string, status: string, phone: string}> = ({ name, userId, status, phone }) => {
  return (
    <div className={styles.container}>
      <EmployeeCard name={name} subtitle={userId || ''} status={status} isFull phone={phone} />
    </div>
  )
}
