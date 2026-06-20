import { motion } from 'framer-motion'

/**
 * A map marker for one ingredient drop.
 *  - tap the pin  -> collect (positive signal)
 *  - tap the ✕    -> "not interested" (negative signal; pin disappears)
 */
export default function IngredientPin({ drop, onCollect, onDiscard, disabled }) {
  return (
    <motion.div
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${drop.pos.x}%`, top: `${drop.pos.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
    >
      {/* not-interested */}
      <button
        onClick={onDiscard}
        className="absolute -right-2 -top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-neutral-500 shadow ring-1 ring-neutral-200"
        title="Not interested"
      >
        ✕
      </button>

      <motion.button
        onClick={disabled ? undefined : onCollect}
        whileTap={disabled ? {} : { scale: 0.85 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg ring-2 ring-[#06C167] ${
          disabled ? 'opacity-50' : 'cursor-pointer'
        }`}
      >
        {drop.emoji}
      </motion.button>
      {/* pin stem */}
      <div className="-mt-1 h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-[#06C167]" />
    </motion.div>
  )
}
