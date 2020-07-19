const fs = require('fs')
const arguments = process.argv
let res = fs.readdirSync('./')

console.info('start handle arguments:')

 res= arguments.splice(2)
 let o = {}
 res = res.filter(i=> i.includes('=')).forEach(i => {
  i = i.split('=');
  o[i[0]] = i[1]
})
res = o
console.info('arguments:', res)

const mustArgs = ['n', 't']
let isArgOk = mustArgs.filter(i => {
  return !(res[i] != null && res[i] != '')
}).length
console.info('isArgOk: ' + isArgOk)
console.info('\n\n')

console.info('read config')

let fileConfig = './qbase.config.json'
let fileConfigContent = fs.readFileSync(fileConfig) + ''
let jsonConfig = JSON.parse(fileConfigContent)

console.info('read config :' , jsonConfig)


let fileUx = jsonConfig.basePath + '/base.ux'
let fileLess = jsonConfig.basePath + '/base.less'

let fileContentUx = fs.readFileSync(fileUx) + ''
let fileContentLess= fs.readFileSync(fileLess) + ''
fileContentUx = fileContentUx.replace('\(\(pageName\)\)', res['n'])
console.info(res)

fs.writeFileSync(jsonConfig.targetBasePath + '/' + res.t + res.n + '.ux',fileContentUx)
fs.writeFileSync(jsonConfig.targetBasePath + '/' + res.t + res.n + '.less', fileContentLess)
