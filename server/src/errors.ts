import http from 'http-status-codes'

// Error serialization
(Error as any).prototype.toJSON = function (this: any) {
  const err: any = {}

  for (const key of Object.getOwnPropertyNames(this)) {
    // Ommit stack trace on production
    if (key === 'stack' && process.env.NODE_ENV === 'production') return

    err[key] = this[key]
  }

  return err
}


export class HTTPError extends Error {
  status: number

  constructor(status: number) {
    super(http.getStatusText(status))
    this.status = status;
  }
}

export class NotFoundError extends HTTPError { constructor() { super(http.NOT_FOUND) } }
export class UnauthorizedError extends HTTPError { constructor() { super(http.UNAUTHORIZED) } }
export class ForbiddenError extends HTTPError { constructor() { super(http.FORBIDDEN) } }
export class InternalServerError extends HTTPError { constructor() { super(http.INTERNAL_SERVER_ERROR) } }

export class BadRequestError extends HTTPError {
  constructor(message: string, cause?: Error) {
    super(http.BAD_REQUEST)
    this.message = message
    this.cause = cause
  }
} 