const fs = require('fs')
const paths = []

function readPath(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject()
        throw err
      }
      Promise.all(files.map(file => new Promise((res, rej) => {
        const concat = path + '/' + file
        if (fs.lstatSync(concat).isDirectory()) readPath(concat).then(res, rej)
        else {
          paths.push(concat)
          res()
        }
      }))).then(resolve, reject)
    })
  })
}

const excludedEndings = ['index.js', '.map']

readPath('./build').then(() => {
  const template = fs.readFileSync('./index.html.template', 'utf8')
  const scripts = paths.filter(path => {
    for (let ending of excludedEndings) {
      if (path.endsWith(ending)) return false
    }
    return true
  })
    .map(script => {
      return `<script src='${script}'></script>`
    }).join('\n')
  const filledFile = template.replace('SCRIPT', scripts)
  fs.writeFile('./index.html', filledFile, 'utf8', err => {
    if (err) throw err
  })
})