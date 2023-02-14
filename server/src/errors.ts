import http from 'http-status-codes'

// Error serialization
(Error as any).prototype.toJSON = function (this: any) {
  const err: any = {}

  for (const key of Object.getOwnPropertyNames(this)) {
    err[key] = this[key]
  }

  return err
}

type HTTPErrorOptions = {
  message?: string
  cause?: Error
}

export class HTTPError extends Error {
  status: number

  constructor(status: number, options?: HTTPErrorOptions) {
    const { message, cause } = options ?? {}

    super(message ?? http.getStatusText(status), { cause })
    this.status = status;
    this.name = new.target.name

  }
}

export class NotFoundError extends HTTPError {
  constructor() {
    super(http.NOT_FOUND)
  }
}

export class BadRequestError extends HTTPError {
  constructor(message: string, cause?: Error) {
    super(http.BAD_REQUEST, { message, cause })
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(options?: HTTPErrorOptions) {
    super(http.UNAUTHORIZED, options)
  }
}

export class ForbiddenError extends HTTPError {
  constructor(options?: HTTPErrorOptions) {
    super(http.FORBIDDEN, options)
  }
}

export class InternalServerError extends HTTPError {
  constructor(options?: HTTPErrorOptions) {
    super(http.INTERNAL_SERVER_ERROR, options)
  }
}