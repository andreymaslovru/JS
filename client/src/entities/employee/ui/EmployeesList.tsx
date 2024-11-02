import React, { FC } from 'react'
import { MoreOutlined } from '@ant-design/icons'
import { Dropdown, MenuProps } from 'antd'
import Link from 'next/link'

import { EmployeeCard } from '@shared/ui/molecules'
import { useRouter } from '@shared/hooks/useRouter'

import styles from './EmployeesList.module.css'
import { usePeopleStore } from '../model'
import { UserFindModel } from '../../../../open-api/ump/api'

export const EmployeesList: React.FC = () => {
  const { data: people } = usePeopleStore((store) => store)

  return (
    <div className={styles.container}>
      {people?.map((employee, idx) => (
        <Employee key={idx} employee={employee} />
      ))}
    </div>
  )
}

export const Employee: FC<{ employee: UserFindModel }> = ({ employee }) => {
  const router = useRouter()

  const handleGoUserProfile = (login: string) => {
    const newParams = new URLSearchParams()
    newParams.set('user', login)

    router.push(`?${newParams.toString()}`)
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link href={`/?chat_id=${employee.login}`} onClick={(e) => e.stopPropagation()}>Сreate a chat</Link>
    }
  ]

  return (
    <div className={styles.item} style={{ cursor: 'pointer' }} onClick={() => {
      if (employee?.id) {
        handleGoUserProfile(employee.id)
      }
    }}>
      <EmployeeCard status={employee?.status} name={`${employee.firstname} ${employee.lastname}`} subtitle={employee?.position || ''} isSmall />
      <Dropdown menu={{ items }} placement='bottom'>
        <MoreOutlined
          rotate={90}
          style={{ fontSize: '18px', color: 'grey' }}
          onMouseMove={(e) => e.stopPropagation()}
        />
      </Dropdown>
    </div>
  )
}
