'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Flex, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { Fade } from 'react-awesome-reveal'

import { Chats } from '@widgets/chats'

import { PeopleSearch } from '@features/peopleSearch'

import { Employee } from '@entities/employee'
import { usePeopleStore } from '@entities/employee/model'

import { ThemeModeContext } from '@shared/lib/antd/AntdProvider'

import styles from './People.module.css'

export const People: React.FC = () => {
  const t = useTranslations('Index')
  const { isDarkTheme } = useContext(ThemeModeContext)
  const [focus, setFocus] = useState(false)
  const { searchList, data: dataPeople } = usePeopleStore((store) => store)
  const [height, setHeight] = useState(54)
  const ref = useRef(null)

  useEffect(() => {
    const refCurrent = ref?.current ? ref?.current as { offsetHeight: number } : null

    if (!refCurrent) {
      setHeight(54)

      return
    }

    const resizeObserver = new ResizeObserver(() => {
      if (refCurrent?.offsetHeight) {
        setHeight(refCurrent?.offsetHeight + 12 || 54)
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resizeObserver.observe(refCurrent as any)

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref?.current, searchList, searchList?.length])

  return (
    <>
      <div onBlur={() => setFocus(false)} style={{ height: '100%' }}>
        <div style={{ paddingLeft: '8px' }}>
          <PeopleSearch onFocus={setFocus} />
        </div>

        <div style={{ marginBottom: '4px' }} />

        {(focus || searchList?.length) ? <div className={styles.focus}>
          {searchList === null
            ? <div className={styles.mapper}>
              {dataPeople?.slice(0, 20)
                ?.map((employee, index) => <Employee key={index} employee={employee} />)}
            </div>
            : searchList?.length
              ? <div className={styles.mapper} ref={ref}>{searchList?.map((employee, index) => <Employee key={index} employee={employee} />)}</div>
              : (
                <div className={styles.focus_wrapper_content}>
                  <Image style={{ filter: isDarkTheme ? 'invert(100%)' : undefined }} src={'/usersGroup.svg'} alt='' width={24} height={24} />
                  <Typography.Text style={{ fontSize: '12px' }}>{t('userNotFound')}</Typography.Text>
                </div>
              ) }
        </div> : <></>}

        {!focus && !searchList?.length ? <div
          style={focus || searchList?.length ? { transform: `translate(0, ${height}px)`, maxHeight: `calc(100vh - ${height}px - 143px)` } : undefined}
          className={styles.list}
        >
          <Chats />
        </div> : <></>}
        {(focus || searchList?.length) ? <div style={{ height: `${height}px` }} /> : <></>}
      </div>

      <div className={focus ? styles.bg_focus : undefined} />
    </>
  )
}
