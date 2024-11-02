import { getLocale } from '@i18n'
import { Link } from '@navigation'
import { List, Modal } from 'antd'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import React, { FC, useState } from 'react'

import { WrapperMainWindow } from '@shared/ui/templates/WrapperMainWindow'

type LangItem = {title: string, value: string}
const langs: LangItem[] = [{ title: 'Русский', value: 'ru' }, { title: 'English', value: 'en' }]

export const LangsChoice: FC = () => {
  const locale = getLocale()

  const t = useTranslations('Index')
  const params = useSearchParams()

  return (
    <WrapperMainWindow>
      <List<LangItem>
        header={t('languageSelections')}
        footer={null}
        bordered
        dataSource={langs}
        renderItem={(item) => (
          <List.Item style={{ cursor: 'pointer' }}>
            <Link
              style={{
                fontWeight: '500',
                color:
                    item.value === locale
                      ? 'var(--antd-color-primary)'
                      : 'var(--antd-color-secondary)'
              }}
              href={`/?${params.toString()}` as '/'}
              locale={item.value as unknown as never}
            >
              {item.title}
            </Link>
          </List.Item>
        )}
      />
    </WrapperMainWindow>
  )
}
