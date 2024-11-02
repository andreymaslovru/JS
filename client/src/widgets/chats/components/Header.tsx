import { Radio, Tabs, TabsProps } from 'antd'
import { useTranslations } from 'next-intl'
import React, { Dispatch, SetStateAction, useEffect } from 'react'

import { ChatsFilterType } from '..'

interface HeaderProps {
  selected: ChatsFilterType;
  setSelected: Dispatch<SetStateAction<ChatsFilterType>>;
}

const RedirectComponent: React.FC<{ onHandler: () => void }> = ({ onHandler }) => {
  useEffect(() => {
    onHandler?.()
  }, [])

  return <></>
}

export const Header: React.FC<HeaderProps> = ({ selected, setSelected }) => {
  const t = useTranslations('Index')

  const tabs: TabsProps['items'] = [
    {
      key: '1',
      label: t('personal'),
      children: <RedirectComponent onHandler={() => setSelected(ChatsFilterType.PERSONAL)} />
    },
    {
      key: '2',
      label: t('groups'),
      children: <RedirectComponent onHandler={() => setSelected(ChatsFilterType.GROUPS)} />,
      disabled: true
    },
    {
      key: '3',
      label: t('favourites'),
      children: <RedirectComponent onHandler={() => setSelected(ChatsFilterType.FAVOURITES)} />,
      disabled: true
    }
  ]

  return (
    <Tabs defaultActiveKey='1' items={tabs} size='small' type='line' style={{ paddingLeft: '12px' }} />
  )
}
