import { create } from 'zustand'


interface Confetti {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}


const useConfetti = create<Confetti>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))
export default useConfetti;