import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'

const generatedDirectory = 'src/api/generated'
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'brifo-api-generated-'))
const snapshotDirectory = join(temporaryDirectory, 'generated')
const pnpmExecutable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

function listFiles(directory) {
  if (!existsSync(directory)) return []

  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .sort()
}

function compareDirectories(before, after) {
  const beforeFiles = listFiles(before)
  const afterFiles = listFiles(after)
  const beforeRelative = beforeFiles.map((file) => relative(before, file))
  const afterRelative = afterFiles.map((file) => relative(after, file))

  if (JSON.stringify(beforeRelative) !== JSON.stringify(afterRelative)) return false

  return beforeFiles.every((file, index) =>
    readFileSync(file).equals(readFileSync(afterFiles[index])),
  )
}

try {
  if (existsSync(generatedDirectory)) {
    cpSync(generatedDirectory, snapshotDirectory, { recursive: true })
  }

  const generation = spawnSync(pnpmExecutable, ['exec', 'orval', '--config', './orval.config.ts'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (generation.status !== 0) {
    if (generation.error) console.error(generation.error)

    // Orval은 생성 전에 출력 폴더를 비우므로, 실패하면 작업 트리에 삭제만 남는다.
    // 스냅샷을 되돌려 체크 실패가 생성 파일을 날리지 않게 한다.
    if (existsSync(snapshotDirectory)) {
      rmSync(generatedDirectory, { recursive: true, force: true })
      cpSync(snapshotDirectory, generatedDirectory, { recursive: true })
    }

    console.error(
      'API generation failed before the synchronization check. Check the live OpenAPI network response and Orval diagnostics above.',
    )
    rmSync(temporaryDirectory, { recursive: true, force: true })
    process.exit(generation.status ?? 1)
  }

  if (existsSync(snapshotDirectory) && !compareDirectories(snapshotDirectory, generatedDirectory)) {
    console.error(
      'src/api/generated changed after regeneration. Run pnpm api:generate and include the updated generated files.',
    )
    process.exit(1)
  }

  const gitStatus = execFileSync(
    'git',
    ['status', '--porcelain', '--untracked-files=all', '--', generatedDirectory],
    { encoding: 'utf8' },
  ).trim()

  if (process.env.CI === 'true' && gitStatus) {
    console.error('src/api/generated has a Git diff after regeneration:')
    console.error(gitStatus)
    process.exit(1)
  }

  if (gitStatus) {
    console.log(
      'Generated output matches the pre-check working tree. Git changes are present because this implementation is not committed yet.',
    )
  } else {
    console.log('Generated output is synchronized with the live OpenAPI contract.')
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}
