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

const priorityEndings = ['Maths.js']
const excludedEndings = ['index.js', '.map']

readPath('./build').then(() => {
  const template = fs.readFileSync('./web/index.html.template', 'utf8')
  const priority = []
  const scripts = paths.filter(path => {
    for (let ending of excludedEndings) {
      if (path.endsWith(ending)) return false
    }
    for (let ending of priorityEndings) {
      if (path.endsWith(ending)) {
        priority.push(path)
        return false
      }
    }
    return true
  })
    .map(script => `<script src='.${script}'></script>`)
  priority.forEach((script, i) => priority[i] = `<script src='.${script}'></script>`)
  const filledFile = template.replace('SCRIPT', priority.concat(scripts).join('\n'))
  fs.writeFile('./web/index.html', filledFile, 'utf8', err => {
    if (err) throw err
  })
})