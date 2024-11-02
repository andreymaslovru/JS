import { useSearchParams } from 'next/navigation'
import { FC } from 'react'
import { Button, Flex } from 'antd'

import { Chat } from '@widgets/chat/Chat'
import { useProfileStore } from '@widgets/profile'
import { Conversations } from '@widgets/converstions/Conversations'

import { SettingsTab } from '@features/settingsTab'
import { AccountTab } from '@features/accountTab/AccountTab'
import { LangsChoice } from '@features/langsChoise'
import { ProfileInfo } from '@features/profileInfo'

import { useAuthStore } from '@shared/axios/model'

import { Header } from './components/Header'
import { Wrapper } from './components/Wrapper'

export const ChatApp: FC = () => {
  const params = useSearchParams()

  const chatId = params?.get('chat_id')
  const settings = params?.get('settings')
  const userLogin = params?.get('user')
  const groups = params?.get('create_groups')

  const logoutStore = useAuthStore((state) => state.logout)
  const resetUserProfile = useProfileStore((state) => state.reset)

  const handleLogout = () => {
    resetUserProfile()
    logoutStore()
  }

  const renderSettings = () => {
    switch (settings) {
      case ('main'):
        return ['Главное', <div>В разработке...</div>]
      case ('paint'):
        return ['Оформление', <AccountTab />]
      case ('lang'):
        return ['Язык', <LangsChoice />]
      case ('account'):
        return ['Аккаунт', <SettingsTab />]
      case ('safety'):
        return ['Безопасность', <div>В разработке...</div>]
      case ('leave'):
        return ['Выход', <Button type='primary' onClick={handleLogout}>Выйти из аккаунта</Button>]
    }
  }

  if (!chatId && !settings && !userLogin && !groups) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--antd-color-fill-content)', height: '100vh', width: '100%' }}
    >
      <div style={{ backgroundColor: 'var(--antd-color-bg-layout)', padding: '6px 12px', borderRadius: '12px', color: '#9BA2AE', fontSize: '14px' }}>
        Выберите, кому хотели бы написать
      </div>
    </div>
  }

  if (userLogin && !groups) {
    return (
      <Wrapper title={'Профиль'} subtitle={userLogin}>
        <ProfileInfo userId={userLogin} />
      </Wrapper>
    )
  }

  if (settings) {
    const render = renderSettings()
    return (
      <Wrapper title={render?.[0] as string}>
        {render?.[1]}
      </Wrapper>
    )
  }

  if (groups) {
    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      backgroundColor: 'var(--antd-color-fill-content)', height: '100vh', width: '100%' }}
    >
      <Conversations step={groups} />
    </div>
  }

  return (
    <Chat />
  )
}
