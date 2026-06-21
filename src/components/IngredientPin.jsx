import { motion } from 'framer-motion'
import FoodImage from './FoodImage.jsx'

/**
 * A map marker (white bubble + pointer) for one ingredient drop.
 * Tapping it opens the select sheet (Pick up / Pass). The first pin shows a
 * "X min walk" pill and a green highlight ring, matching the mockup.
 */
export default function IngredientPin({ drop, onSelect, highlight, walk }) {
  return (
    <motion.button
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${drop.pos.x}%`, top: `${drop.pos.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      whileTap={{ scale: 0.9 }}
      onClick={onSelect}
    >
      {highlight && walk && (
        <div className="mb-1 whitespace-nowrap rounded-full bg-[#06C167] px-2 py-0.5 text-[10px] font-semibold text-white shadow">
          {walk}
        </div>
      )}
      <div className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ${highlight ? 'ring-[3px] ring-[#06C167]' : 'ring-1 ring-black/5'}`}>
        <FoodImage src={drop.image} emoji={drop.emoji} alt={drop.name} rounded="rounded-full" className="h-11 w-11" emojiClass="text-3xl" />
      </div>
      {/* pointer */}
      <div className="-mt-1 h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-white drop-shadow" />
    </motion.button>
  )
}
