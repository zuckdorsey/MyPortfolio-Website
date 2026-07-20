import { SignJWT } from 'jose'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  if (!body.password || body.password !== config.adminPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid password'
    })
  }

  if (!config.jwtSecret) {
    throw createError({
      statusCode: 500,
      message: 'JWT secret is not configured'
    })
  }

  const secret = new TextEncoder().encode(config.jwtSecret)

  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return { token }
})
