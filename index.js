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

console.info('read manifest.json')
let fileManifest = jsonConfig.targetBasePath + '/' + 'manifest.json'
let fileManifestContent = fs.readFileSync(fileManifest)
let jsonManifest = JSON.parse(fileManifestContent)
console.info('read manifest.json', jsonManifest)

let fileUx = jsonConfig.basePath + '/base.ux'
let fileLess = jsonConfig.basePath + '/base.less'

let fileContentUx = fs.readFileSync(fileUx) + ''
let fileContentLess= fs.readFileSync(fileLess) + ''
fileContentUx = fileContentUx.replace(/\(\(pageName\)\)/g, res['n'])

console.info(res)

let targetPath = jsonConfig.targetBasePath + '/' + res.t
let nowExistDir = ''

console.info('targetPath', targetPath)
targetPath.split('/').forEach((item, i) => {
  nowExistDir +=  item + "/"
  console.info('for ',nowExistDir)
  if (!fs.existsSync(nowExistDir)) {
    console.info('is not exist: ', nowExistDir)
     fs.mkdirSync(nowExistDir);
     console.info('craete ', nowExistDir)
 }
});


console.info('write file to ' + targetPath)

let prePath = targetPath.split('/').filter(i => {
  return i != '.' && i != 'src' && i != ''
}).map(i => {
  console.info('tarns ', i , 'to ..', )
  return '..'
}).join('/')

targetPath +=  "/" + res.n

fileContentUx = fileContentUx.replace(/'@\//g,"'" + prePath +"/")
fileContentLess = fileContentLess.replace(/'@\//g,"'" + prePath +"/")

fs.writeFileSync(targetPath + '.ux',fileContentUx)
fs.writeFileSync(targetPath + '.less', fileContentLess)
console.info('write file finished')

console.info('update manifest')

jsonManifest.router.pages[res.t] = {
  "component" : res.n
}
jsonManifest.display.pages[res.t] = {
  "Demo": {
    "titleBarText": "示例页",
    "menu": false
  },
}

fileManifestContent = JSON.stringify(jsonManifest, null, 4)

fs.writeFileSync(fileManifest, fileManifestContent)
