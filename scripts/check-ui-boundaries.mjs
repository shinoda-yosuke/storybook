import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const parser = new Bun.Transpiler({ loader: 'tsx' })
const isBase = (path) => /\/base-[^/]+\.[jt]sx?$/.test(path)
const isStory = (path) => /\.stories\.[jt]sx?$/.test(path)

function sourceTarget(importer, specifier) {
  const target = specifier.startsWith('@/')
    ? resolve(root, 'src', specifier.slice(2))
    : specifier.startsWith('.')
      ? resolve(root, dirname(importer), specifier)
      : null
  if (!target) return null

  const candidates = [target, `${target}.ts`, `${target}.tsx`, `${target}/index.ts`, `${target}/index.tsx`]
  return relative(root, candidates.find((path) => existsSync(path)) ?? target)
}

export function violationsForSource(importer, source) {
  const violations = []
  const { imports, exports } = parser.scan(source)

  if (!isBase(importer) && exports.some((name) => /^Base[A-Z]/.test(name))) {
    violations.push(`${importer}: BaseX は公開用ファイルから再エクスポートできません。`)
  }

  for (const { path: specifier } of imports) {
    const target = sourceTarget(importer, specifier)
    if (!target) continue

    const layer = importer.split('/')[1]
    const targetLayer = target.split('/')[1]
    const componentImplementation = layer === 'components' &&
      importer.endsWith('.tsx') && !isStory(importer) && !/\/index\.tsx$/.test(importer)

    if (isBase(target) && !componentImplementation) {
      violations.push(`${importer}: BaseX は派生コンポーネントの実装からだけ参照できます（${specifier}）。`)
    }
    if (isStory(importer)) continue

    if (
      (layer === 'elements' && ['components', 'layouts'].includes(targetLayer)) ||
      (layer === 'components' && targetLayer === 'layouts') ||
      (layer === 'layouts' && ['elements', 'components'].includes(targetLayer))
    ) {
      violations.push(`${importer}: ${layer} から ${targetLayer} には依存できません（${specifier}）。`)
    }
  }
  return violations
}

function sourceFiles(directory) {
  return readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`
    return entry.isDirectory() ? sourceFiles(path) : /\.[jt]sx?$/.test(path) ? [path] : []
  })
}

if (import.meta.main) {
  const violations = sourceFiles('src').flatMap((file) =>
    violationsForSource(file, readFileSync(resolve(root, file), 'utf8')),
  )
  if (violations.length) {
    console.error(violations.join('\n'))
    process.exitCode = 1
  } else {
    console.log('UI の依存方向と BaseX の参照先を確認しました。')
  }
}
