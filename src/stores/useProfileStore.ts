import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Profile {
  nickname: string
  companyName: string
  stockIds: string[]
}

interface ProfileStore extends Profile {
  setProfile: (profile: Profile) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      nickname: '',
      companyName: '',
      stockIds: [],
      setProfile: (profile) => set(profile),
    }),
    {
      name: 'brifo-profile',
    },
  ),
)
