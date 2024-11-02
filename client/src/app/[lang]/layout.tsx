import React from 'react'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { Montserrat } from 'next/font/google'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

import './globals.css'

import { TopLoader } from '@features/topLoader/TopLoader'

import AntdProvider from '@shared/lib/antd/AntdProvider'
import { AxiosProvider } from '@shared/axios/AxiosProvider'

export const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic']
})

type RooLayoutProps = React.PropsWithChildren<{ params: { lang: string }}>

const RootLayout: React.FC<RooLayoutProps> = ({ children, params }) => {
  const messages = useMessages()

  return (
    <html lang={params.lang}>
      <body className={montserrat.className}>
        <React.StrictMode>
          <NextIntlClientProvider locale={params.lang} messages={messages}>
            <AntdProvider>
              <AxiosProvider>
                <TopLoader />
                {children}
              </AxiosProvider>
            </AntdProvider>
          </NextIntlClientProvider>
        </React.StrictMode>
      </body>
    </html>
  )
}

export default RootLayout
