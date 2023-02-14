import { Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export type Payload = JwtPayload & { id: string }

const { JWT_ACCES_SECRET, JWT_REFRESH_SECRET, NODE_ENV } = process.env

if (!JWT_ACCES_SECRET || !JWT_REFRESH_SECRET) {
  console.error('JWT environment variables are not set.')
  process.exit(-1)
}

function sign(data: Payload, options: jwt.SignOptions, secret: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(data, secret, options, (err, token) => {
      if (err) return reject(err)
      resolve(token!)
    })
  })
}

function verify(token: string, secret: string) {
  return new Promise<Payload>((resolve, reject) => {
    jwt.verify(token, secret, (err, data) => {
      if (err) return reject(err)
      resolve(data as Payload)
    })
  })
}

function decode(token: string) {
  return jwt.decode(token) as Payload
}

const access = {
  sign: (id: string) => sign({ id }, { expiresIn: '10m' }, JWT_ACCES_SECRET),
  verify: (token: string) => verify(token, JWT_ACCES_SECRET),
  token: (req: Request) => req.headers.authorization?.split(' ')[1],
  decode,
}

const refresh = {
  sign: (id: string) => sign({ id }, { expiresIn: '7d' }, JWT_REFRESH_SECRET),
  verify: (token: string) => verify(token, JWT_REFRESH_SECRET),
  token: (req: Request) => req.cookies.JWT_REFRESH_TOKEN as string | undefined,
  decode,
  setCookie: (res: Response, token: string) => res.cookie('JWT_REFRESH_TOKEN', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }),
  clearCookie: (res: Response) => res.clearCookie('JWT_REFRESH_TOKEN', {
    httpOnly: true,
    sameSite: 'strict',
    secure: NODE_ENV === 'production',
  }),
}

export default { access, refresh }