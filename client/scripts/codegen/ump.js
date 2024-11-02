const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const { umpEntities } = require('./umpEntities')
const { cmsEntities } = require('./cmsEntities')
const { removeUnnecessaryParams } = require('./removeUnnecessaryParams')

const entitiesMapping = {
  ump: umpEntities,
  cms: cmsEntities
}

const basePath = path.dirname(path.dirname(__dirname))
const apiType = process.argv[2]
const entitiesForGenerate = process.argv.slice(3)
const apiEntities = entitiesMapping[apiType]

const codeGen = (entities) => {
  entities.forEach((entity) => {
    const openApiPath = path.join(basePath, 'open-api', apiType)
    const generatedApiPath = path.join(openApiPath, entity)
    const definition = path.join(openApiPath, entity, 'definition.json')
    const apiPath = path.join('src', 'api', apiType, `${entity}.ts`)

    // генерация апи
    console.log(`\x1b[32m>>> generation ${apiType}-api of ${entity}\x1b[0m`)
    try {
      removeUnnecessaryParams(definition)

      execSync(
        `openapi-generator generate -i ${definition} -o ${generatedApiPath} -g typescript-axios && 
        rm -rf ${generatedApiPath}/.openapi-generator \
        ${generatedApiPath}/.openapi-generator  \
        ${generatedApiPath}/.gitignore \
        ${generatedApiPath}/.openapi-generator-ignore \
        ${generatedApiPath}/git_push.sh &&
        git add ${generatedApiPath}`
      )

      try {
        const ClassName = `${entity.replaceAll(/^\w|-\w/g, (match) => match.replace('-', '').toUpperCase())}Api`
        const apiName = ClassName.replace(/^\w/, ClassName[0].toLowerCase())

        const template = `
            import {${ClassName}} from '@open-api/${apiType}/${entity}'
      
            export const ${apiName} = new ${ClassName}({basePath: process.env.PRIVATE_UMP_HOST || process.env.NEXT_PUBLIC_UMP_HOST})
      `
        console.log(`\x1b[33m>>> create instance of ${apiType}-api ${entity}\x1b[0m`)

        fs.writeFileSync(apiPath, template)
        execSync(`git add ${apiPath}`)
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  })
}

if (!entitiesForGenerate.length) {
  codeGen(apiEntities)
} else {
  const arrayMatches = apiEntities.filter((val) => entitiesForGenerate.indexOf(val) > -1)
  const errorMessage = '>>> Проверьте названия сущностей для генерации api! <<<'

  arrayMatches.length !== entitiesForGenerate.length ? console.log(errorMessage) : codeGen(arrayMatches)
}
