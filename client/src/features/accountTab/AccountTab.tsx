import { Form, Radio, Switch } from 'antd'
import React, { useContext } from 'react'
import { useTranslations } from 'next-intl'

import { ReactionTypes, ThemeModeContext, ViewMessageTypes } from '@shared/lib/antd/AntdProvider'
import { WrapperMainWindow } from '@shared/ui/templates/WrapperMainWindow'

export const AccountTab: React.FC = () => {
  const { isDarkTheme, setIsDarkTheme, viewMessageType, setViewMessageType, reactionDefault, setReactionDefault } = useContext(ThemeModeContext)

  const t = useTranslations('Index')

  return (
    <WrapperMainWindow>
      <Form.Item label={t('turnDarkTheme')}>
        <Switch checked={isDarkTheme} onChange={(chk) => setIsDarkTheme(chk)} />
      </Form.Item>

      <Form.Item label={'Вид отображения сообщений'}>
        <Radio.Group value={viewMessageType} onChange={(e) => setViewMessageType(e.target.value)}>
          <Radio value={ViewMessageTypes.default}>По одну сторону</Radio>
          <Radio value={ViewMessageTypes.leftRight}>По разные стороны</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={'Реакция по умолчанию'}>
        <Radio.Group value={reactionDefault} onChange={(e) => setReactionDefault(e.target.value)}>
          <Radio.Button value={ReactionTypes.like}>👍</Radio.Button>
          <Radio.Button value={ReactionTypes.hearth}>❤️</Radio.Button>
          <Radio.Button value={ReactionTypes.fire}>🔥</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </WrapperMainWindow>
  )
}
