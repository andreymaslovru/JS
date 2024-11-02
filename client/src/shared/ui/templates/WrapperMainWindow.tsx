import { PropsWithChildren } from 'react'

import styled from './WrapperMainWindow.module.css'

export const WrapperMainWindow: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styled.container}>
      {children}
    </div>
  )
}
