const withNextIntl = require('next-intl/plugin')()

const path = require('path')

const resolveAlias = {
  antd$: path.resolve(__dirname, './node_modules/antd/lib'),
  '@ant-design/icons$': path.resolve(
    __dirname,
    './node_modules/@ant-design/icons/lib'
  )
}

module.exports = withNextIntl({
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...resolveAlias
    }
    return config
  }
})
