'use client'

import { useSearchParams } from 'next/navigation'
import { FC } from 'react'

import RestorePage from '@views/restore/RestorePage'
import RestorePageConfirm from '@views/restore/RestorePageConfirm'

import styles from './layout.module.css'

const Restore: FC = () => {
  const params = useSearchParams()

  const code = params?.get('code')

  if (!code) {
    return (
      <main className={styles.main}>
        <RestorePage />
      </main>)
  }

  return (
    <main className={styles.main}>
      <RestorePageConfirm code={code} />
    </main>
  )
}

export default Restore
