import React, { FC } from 'react'
import { Dropdown, Flex, Input, MenuProps } from 'antd'
import { AppstoreAddOutlined, SearchOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import { debounce } from 'lodash'
import Link from 'next/link'

import { usePeopleStore } from '@entities/employee/model'

interface PeopleSearchProps {
  withoutBar?: boolean
  onFocus?: React.Dispatch<React.SetStateAction<boolean>>
}

export const PeopleSearch: FC<PeopleSearchProps> = ({ withoutBar = false, onFocus }) => {
  const t = useTranslations('Index')

  const { searchPeople } = usePeopleStore((store) => store)

  const handleSearchDebounced = debounce((val: string) => {
    searchPeople(val)
  }, 500)

  const handleSearch = (value: string) => {
    handleSearchDebounced(value)
  }

  return (
    <Flex align='center' gap={18}>
      <Input
        placeholder={t('findThePerson')}
        prefix={<SearchOutlined />}
        suffix='⌘K'
        onChange={(e) => handleSearch(e.currentTarget?.value)}
        onFocus={() => onFocus?.(true)}
        allowClear={true}
      />

      {!withoutBar && <Dropdown menu={{ items }} placement='bottom'>
        <AppstoreAddOutlined
          style={{ fontSize: '22px', color: 'grey', paddingRight: '18px' }}
          onMouseMove={(e) => e.stopPropagation()}
        />
      </Dropdown>}
    </Flex>
  )
}

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <Link href={'/?create_groups=1'} onClick={(e) => e.stopPropagation()}>Сreate a groups</Link>
  }
]
