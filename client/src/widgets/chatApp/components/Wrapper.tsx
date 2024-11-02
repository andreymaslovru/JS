import { PropsWithChildren } from 'react'

import { Header } from './Header'
import styled from './Wrapper.module.css'

export const Wrapper: React.FC<PropsWithChildren & {title?: string, subtitle?: string}> = ({ children, title, subtitle }) => {
  return (
    <div className={styled.container}>
      <Header title={title} subtitle={subtitle} />
      {children}
    </div>
  )
}
