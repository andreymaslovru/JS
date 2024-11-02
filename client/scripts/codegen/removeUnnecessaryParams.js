const fs = require('fs')

// чистим дефинишн от обязательных Authorization && Client-Id
const removeUnnecessaryParams = (definitionPath, headerParams = ['Authorization', 'Client-Id']) => {
  const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'))

  for (const url in definition.paths) {
    const methods = definition.paths[url]

    for (const method in methods) {
      const parameters = methods[method].parameters

      if (parameters) {
        methods[method].parameters = parameters.filter((param) => {
          if (param.in === 'header' && headerParams.includes(param.name)) {
            return false
          }
          return true
        })
      }
    }
  }

  fs.writeFileSync(definitionPath, JSON.stringify(definition))
}

module.exports = { removeUnnecessaryParams }
