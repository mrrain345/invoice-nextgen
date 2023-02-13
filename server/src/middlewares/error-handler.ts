import express, { NextFunction, Request, Response } from 'express'
import { HTTPError } from '../errors.js'

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err)

  const status = err instanceof HTTPError ? err.status : 500

  res.status(status).json(err)
}