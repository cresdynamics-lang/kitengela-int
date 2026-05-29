import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 15 
  },
  in: { 
    opacity: 1, 
    y: 0 
  },
  out: { 
    opacity: 0, 
    y: -15,
    pointerEvents: 'none' as const,
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
}

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  )
}
