import { NextFunction, Request, Response } from 'express'
import jwt from '../helpers/jwt.js'
import { UnauthorizedError } from '../errors.js'

/// Authorize user
export default async function auth(req: Request, res: Response, next: NextFunction) {
  const token = jwt.access.token(req)
  if (!token) throw new UnauthorizedError()

  const { id } = await jwt.access.verify(token)


  Object.defineProperty(req, 'userId', {
    get: () => id,
  })

  next()
}

/// Throw error when accessing unauthenticated user
export function unauth(req: Request, res: Response, next: NextFunction) {
  Object.defineProperty(req, 'userId', {
    get() {
      throw new UnauthorizedError({
        message: "Accessing unauthenticated user. Use 'auth' middleware first."
      })
    },
    set() {
      throw new Error("Cannot set 'userId' property.")
    },
    configurable: true,
  })

  next()
}