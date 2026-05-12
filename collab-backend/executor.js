const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

// Map language to docker image and file extension
const LANGUAGE_CONFIG = {
  javascript: {
    image: 'node:18-alpine',
    filename: 'solution.js',
    command: 'node solution.js'
  },
//   typescript: {
//     image: 'node:18-alpine',
//     filename: 'solution.ts',
//     command: 'npm install -g ts-node typescript 2>/dev/null && ts-node solution.ts'
//   },
  python: {
    image: 'python:3.11-alpine',
    filename: 'solution.py',
    command: 'python solution.py'
  },
  java: {
    image: 'openjdk:17-alpine',
    filename: 'Main.java',
    command: 'javac Main.java && java Main'
  },
  cpp: {
    image: 'gcc:latest',
    filename: 'solution.cpp',
    command: 'g++ solution.cpp -o solution && ./solution'
  }
}

function runCode(language, code) {
  return new Promise((resolve) => {
    const config = LANGUAGE_CONFIG[language]

    if (!config) {
      resolve({ output: '❌ Language not supported', error: true })
      return
    }

    // Create a temp folder for this execution
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'collab-'))
    const filePath = path.join(tmpDir, config.filename)

    // Write code to file
    fs.writeFileSync(filePath, code)

    // Build docker command
    const dockerCmd = [
      'docker run',
      '--rm',                          // auto delete container after run
      '--memory=128m',                 // max 128MB memory
      '--cpus=0.5',                    // max 50% CPU
      '--network=none',                // no internet access
      `--volume="${tmpDir}:/code"`,    // mount code folder
      '--workdir=/code',               // set working directory
      config.image,                    // which docker image
      'sh', '-c',                      // run shell command
      `"${config.command}"`           // the actual run command
    ].join(' ')

    console.log(`Running: ${dockerCmd}`)

    // Execute with 10 second timeout
    exec(dockerCmd, { timeout: 30000 }, (error, stdout, stderr) => {
      // Clean up temp folder
      try { fs.rmSync(tmpDir, { recursive: true }) } catch (e) {}

      if (error && error.killed) {
        resolve({ output: '⏱️ Time limit exceeded (10 seconds)', error: true })
        return
      }

      if (stderr && !stdout) {
        resolve({ output: '❌ Error:\n' + stderr, error: true })
        return
      }

      resolve({ 
        output: stdout || '✅ Ran successfully (no output)',
        error: false 
      })
    })
  })
}

module.exports = { runCode }