import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const dir = dirname(fileURLToPath(import.meta.url))
const child = spawn('npm', ['run', 'dev', '--', '--port', '5180'], {
  cwd: dir,
  stdio: 'inherit',
  shell: true,
})
child.on('exit', code => process.exit(code ?? 0))
