import { Checkbox, Dropdown } from 'antd'

import { EmployeeCard } from '@shared/ui/molecules'

import { UserFindModel } from '../../../../../open-api/ump/api'
import styles from './UserItem.module.css'

export const UserItem: React.FC<{
    employee: UserFindModel, isChecked: boolean, onClick: (id: string, type: 'ADD' | 'DELETE') => void
}> = ({ employee, isChecked, onClick }) => {
  return (
    <div className={styles.item} style={{ cursor: 'pointer', background: isChecked ? 'var(--antd-color-fill-content)' : undefined, borderRadius: '8px' }} onClick={() => onClick(employee.id, isChecked ? 'DELETE' : 'ADD')}>
      <EmployeeCard status={employee?.status} name={`${employee.firstname} ${employee.lastname}`} subtitle={employee?.position || ''} isSmall />
      <Checkbox checked={isChecked} />
    </div>
  )
}
