import { create } from "zustand"

type UpdateState = {
    showBlog: boolean,
    setShowBlog: () => void
}

export const useUpdateCard = create<UpdateState>((set) => ({
    showBlog: true,
    setShowBlog: () => set(() => ({ showBlog: false }))
}))