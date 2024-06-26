'use client'

import React from 'react'
import ReactConfetti from 'react-confetti'

import useConfetti from '@/hooks/use-confetti-store'


const ConfettiProvider = () => {
    const confetti = useConfetti()

    if (!confetti.isOpen) return null;
    return (
        <ReactConfetti
            className='pointer-events-none z-[100] w-full'
            numberOfPieces={500}
            recycle={false}
            onConfettiComplete={() => {
                confetti.onClose()
            }}
        />
    )
}

export default ConfettiProvider