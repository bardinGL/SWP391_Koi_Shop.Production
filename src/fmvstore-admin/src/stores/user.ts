import { User } from '@/types'
import { atomWithStorage } from 'jotai/utils'

const userAtom = atomWithStorage<User | null>('user', null)

export { userAtom }
