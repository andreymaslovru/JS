'use client'

import { FC } from 'react'

import ConfirmRegisterPage from '@views/register/confirm/ConfirmRegisterPage'

import styles from './layout.module.css'

const Page: FC = () => {
  return (
    <main className={styles.main}>
      <ConfirmRegisterPage />
    </main>)
}

export default Page
