import { FC } from 'react'

import styles from './StatusOnline.module.css'

export const StatusOnline: FC = () => {
  return (
    <div className={styles.statusContainer}>
      <div className={styles.status} />
    </div>
  )
}
