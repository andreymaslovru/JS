import type { ThemeConfig } from 'antd'
import { AliasToken } from 'antd/es/theme/interface/alias'

import { Montserrat } from '@app/[lang]/layout'

const settings: Partial<AliasToken> = {
  ...Montserrat.style,
  colorPrimary: '#26cfa1',
  colorLink: '#26cfa1'
}

const customColors = {
  light: {
    colorScrollbar: '#c0c0c0'
  },
  dark: {
    colorScrollbar: '#2d3740'
  }
}

const darkSettings: Partial<AliasToken> = {
  ...settings,
  colorTextSecondary: 'white',
  colorTextBase: '#f2faff',
  colorFillContent: '#10171f',
  colorBgLayout: '#171F27',
  colorBorder: '#1a242e',
  colorBgElevated: '#10171f',
  colorTextHeading: 'white',
  colorBgBase: '#10171f',
  colorTextLabel: '#148263',
  colorBgSpotlight: '#26cfa1',
  controlItemBgActive: '#26cfa1',
  colorBorderSecondary: '#2d3740',
  ...customColors.dark
}

const lightSettings: Partial<AliasToken> = {
  ...settings,
  colorTextSecondary: 'grey',
  colorTextBase: 'black',
  colorFillContent: '#F4F7F9',
  colorBgLayout: 'white',
  colorBorder: '#f0f0f0',
  colorTextLabel: '#148263',
  colorBgElevated: 'white',
  colorBgSpotlight: '#3a4a59',
  controlItemBgActive: '#26cfa1',
  colorBorderSecondary: '#f5f5f5',
  ...customColors.light

}

const getTheme = (isDarkTheme: boolean): ThemeConfig => ({
  token: isDarkTheme ? darkSettings : lightSettings,
  components: {
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0
    },
    Drawer: {
      fontSizeLG: 24,
      fontWeightStrong: 400
    },
    Button: {
      primaryShadow: 'none'
    },
    Input: {
      activeShadow: 'none',
      errorActiveShadow: 'none',
      boxShadow: 'none'
    },
    Steps: {},
    Tabs: {
      margin: 0
    }
  }
})

export default getTheme
