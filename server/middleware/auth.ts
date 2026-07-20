import { jwtVerify } from 'jose'
import { createError } from 'h3'

const PROTECTED_PATHS = [
  '/api/projects',
  '/api/skills',
  '/api/experiences',
  '/api/education',
  '/api/certifications'
]

const PROTECTED_METHODS = ['POST', 'PUT', 'DELETE']

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const method = event.method

  // Only protect specific paths and methods
  const isProtectedPath = PROTECTED_PATHS.some(path => url.pathname.startsWith(path))
  const isProtectedMethod = PROTECTED_METHODS.includes(method)

  if (!isProtectedPath || !isProtectedMethod) return

  const config = useRuntimeConfig()

  if (!config.jwtSecret) {
    throw createError({
      statusCode: 500,
      message: 'JWT secret is not configured'
    })
  }

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Missing or invalid authorization header'
    })
  }

  const token = authHeader.slice(7)
  const secret = new TextEncoder().encode(config.jwtSecret)

  try {
    await jwtVerify(token, secret)
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token'
    })
  }
})
