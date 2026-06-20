import { AnimatePresence, motion } from 'framer-motion'

/** Controlled transient message. Parent owns `message`; null hides it. */
export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="pointer-events-none absolute bottom-20 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/85 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
