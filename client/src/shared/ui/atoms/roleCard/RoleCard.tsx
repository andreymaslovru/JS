import React from 'react'
import Image from 'next/image'
import classNames from 'classnames'

import styles from './RoleCard.module.css'

export enum Roles {
  EMPLOYEE = 'employee',
  EMPLOYER = 'employer',
}

interface RoleCardProps {
  role: Roles;
  isActive?: boolean;
  onClick?: (role: Roles) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, isActive, onClick }) => {
  return (
    <div className={classNames(styles.container, isActive && styles.active)} onClick={() => onClick?.(role)}>
      {role === Roles.EMPLOYEE ? (
        <Image src={'/employeeCard.svg'} alt={Roles.EMPLOYEE} width={44} height={44} />
      ) : (
        <Image src={'/officeCard.svg'} alt={Roles.EMPLOYER} width={44} height={44} />
      )}
    </div>
  )
}
