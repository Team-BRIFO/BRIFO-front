const fs = require('fs')
const file = process.argv[2]
let content = fs.readFileSync(file, 'utf8')
if (file.includes('git-rebase-todo')) {
  content = content.replace(/^pick 7534e99/m, 'reword 7534e99')
} else if (file.includes('COMMIT_EDITMSG')) {
  content = content.replace(/^design:/, 'style:')
}
fs.writeFileSync(file, content)
