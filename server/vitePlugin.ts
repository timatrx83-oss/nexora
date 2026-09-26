import type { Plugin, PreviewServer, ViteDevServer } from 'vite'
import { handleMentorApi } from './handleMentor.ts'
import type { MentorEnv } from './openai.ts'

function attach(server: ViteDevServer | PreviewServer, env: MentorEnv) {
  server.middlewares.use((req, res, next) => {
    const path = req.url?.split('?')[0]
    if (path !== '/api/mentor') {
      next()
      return
    }
    void handleMentorApi(req, res, env).catch(() => {
      if (!res.headersSent) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'unavailable' }))
      }
    })
  })
}

export function mentorApiPlugin(env: MentorEnv): Plugin {
  return {
    name: 'nexora-mentor-api',
    configureServer(server) {
      attach(server, env)
    },
    configurePreviewServer(server) {
      attach(server, env)
    },
  }
}
