import { LeftOutlined } from '@ant-design/icons'
import { useRouter } from '@navigation'
import { Flex, Typography } from 'antd'
import Link from 'next/link'
import { ReactNode } from 'react'

interface HeaderProps {
    title?: string
    subtitle?: string
    action?: ReactNode
}
export const Header: React.FC<HeaderProps> = ({ title, subtitle, action }) => {
  const router = useRouter()

  return (
    <div style={{
      display: 'flex',
      flexShrink: 0,
      height: '60px',
      width: '100%',
      borderBottom: '1px solid var(--antd-color-border)',
      background: 'var(--antd-color-bg-layout)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <Link
        style={{
          color: 'var(--antd-color-text)',
          paddingLeft: '12px',
          display: 'flex',
          gap: '2px',
          alignItems: 'center',
          position: 'absolute',
          left: 0
        }}
        href={'/'}
        passHref
        onClick={() => router.back()}
      >
        <LeftOutlined style={{ color: 'var(--antd-color-text)' }} />
        <Typography.Text
          style={{
            fontWeight: '300'
          }}
        >
          {'Назад'}
        </Typography.Text>
      </Link>

      <Flex align='center' justify='center' gap={0} vertical>
        <Typography.Text
          style={{
            fontWeight: '500'
          }}
        >
          {title}
        </Typography.Text>
        <Typography.Text
          style={{
            fontSize: '12px',
            fontWeight: '300',
            color: 'grey'
          }}
        >
          {subtitle}
        </Typography.Text>
      </Flex>

      {action && <div style={{ position: 'absolute', right: '28px' }}>
        {action}
      </div>}
    </div>
  )
}
