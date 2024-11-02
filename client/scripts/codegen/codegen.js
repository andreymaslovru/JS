const { exec } = require('child_process')
const path = require('path')

const insertLine = require('insert-line')

const basePath = path.dirname(path.dirname(__dirname))
const stubPath = path.join(basePath, 'stub')
const stubApiPath = path.join(stubPath, 'api')

const apiDefinitionPath = path.join(stubApiPath, 'definition')
const apiDefinitionFilePath = path.join(apiDefinitionPath, 'main.json')

const generatedTypesPath = 'src/types/generated'

exec(
  `openapi-generator generate --skip-validate-spec -i ${apiDefinitionFilePath} -o ${generatedTypesPath} -g typescript-axios`,
  (error, out, outerr) => {
    console.log(error, out, outerr)
    if (error) {
      return
    }
    // выключаем eslint в сгенерированных файлах
    ['api.ts', 'base.ts'].forEach((fileName) => {
      insertLine(path.join(generatedTypesPath, fileName))
        .prepend('/* eslint-disable */')
        .then((error) => error ? console.log(error) : void 0)
    })
  }
)
