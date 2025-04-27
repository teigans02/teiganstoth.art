'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Adjust stagger delay as needed
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ShortDescription() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-md text-center font-medium text-gray-500">Hi there!</p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-center gap-4 w-full"
      >
        <motion.div
          variants={itemVariants}
          className="text-4xl md:text-6xl font-medium w-full font-instrument text-center"
        >
          <i className="text-gray-500">I&apos;m Teigan</i>, a Marketing grad leveraging psychology to increase brand impact.
        </motion.div>
        <motion.p variants={itemVariants} className="text-md text-center font-medium text-gray-500 pt-2">Currently based in London, UK 🇬🇧</motion.p>
      </motion.div>
    </div>
  )
}