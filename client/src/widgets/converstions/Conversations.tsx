import { Button, Flex, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { RightOutlined, SearchOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import * as yup from 'yup'
import { Rule } from 'antd/lib/form'
import { messengerApi } from '@api/ump/api'
import { useRouter } from '@navigation'

import { Header } from '@widgets/chatApp/components/Header'

import { usePeopleStore } from '@entities/employee/model'

import { UserItem } from './components/userItem/UserItem'

interface ConversationsProps {
    step: string
}

export const Conversations: React.FC<ConversationsProps> = ({ step }) => {
  const [form] = Form.useForm()

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [query, setQuery] = useState<string>('')
  const { data, getPeople } = usePeopleStore((store) => store)

  const [name, setName] = useState<string>('')

  const t = useTranslations('Index')
  const tForm = useTranslations('Form')
  const router = useRouter()

  const handleSelect = (id: string, type: 'ADD' | 'DELETE') => {
    setSelectedUsers((prev) => {
      return type === 'ADD' ? [...prev, id] : [...prev.filter((i) => i !== id)]
    })
  }

  const schema = yup.object().shape({
    name: yup.string().required(tForm('required'))
  })

  const yupSync = {
    async validator({ field }: { field: string }, value: string) {
      await schema.validateSyncAt(field, { [field]: value })
    }
  }

  const handleCreate = () => {
    messengerApi.createNewConversationMessengerCreateConversationPost({ participants: selectedUsers, name })
      .then((res) => {
        if (res.status === 200) {
          router.push(`/?chat_id=${res.data.chat_id}` as '/')
        }
      })
  }

  return (
    <>
      <Header
        title={'Создать беседу'}
        subtitle={step === '1' ? `Выберите пользователей [${selectedUsers.length}]` : 'Укажите название беседы'}
        action={
          <Link style={{ gap: '2px', color: 'var(--antd-color-primary)', display: 'flex', alignItems: 'center' }} href={`?create_groups=${+step + 1}`}>
            {step === '1' ? 'Далее' : 'Создать'}
            <RightOutlined style={{ color: 'var(--antd-color-primary)' }} />
          </Link>}
      />
      <div
        style={{
          minWidth: '500px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          background: 'var(--antd-color-bg-layout)',
          padding: '0 12px'
        }}
      >
        {
          {
            ['1']: <Flex vertical style={{ position: 'relative' }}>
              <Flex align='center' gap={12} style={{ position: 'sticky', padding: '8px', top: 0, background: 'var(--antd-color-bg-layout)', zIndex: 9999 }}>
                <Flex align='flex-end'>
                  {<Link href={`?create_groups=${+step + 1}`}>
                Далее
                  </Link>}
                </Flex>
                <Input
                  placeholder={t('findThePerson')}
                  prefix={<SearchOutlined />} suffix='⌘K'
                  onChange={(e) => setQuery(e.currentTarget?.value)}
                />
              </Flex>

              <Flex vertical style={{ maxHeight: '100%', overflow: 'auto' }} gap={2}>
                {data
                  ?.filter((i) => i.firstname.includes(query) || i?.middlename?.includes(query) || i.lastname.includes(query))
                  ?.map((item) => <UserItem onClick={handleSelect} employee={item} isChecked={selectedUsers.includes(item?.id)} />)}
              </Flex>
            </Flex>,
            ['2']: (
              <div>
                <Form style={{ width: '100%', paddingBottom: '24px', paddingTop: '12px' }} layout='vertical' form={form} validateTrigger={'onBlur'}>
                  <Form.Item label='Name' name='name' rules={[yupSync as Partial<Rule>]}>
                    <Input size='middle' placeholder='Name conversation...' value={name} onChange={(e) => setName(e.currentTarget.value)} />
                  </Form.Item>

                  <Link onClick={handleCreate} href='' passHref>
                  Создать беседу
                  </Link>
                </Form>
              </div>
            )
          }[step]
        }
      </div>
    </>
  )
}
