import { hash, compare } from 'bcryptjs'

export const getHash = async (content: string, saltRounds = 10) => {
  return await hash(content, saltRounds)
}
export const compareHash = async (content: string, hash: string) => {
  return await compare(content, hash)
}
