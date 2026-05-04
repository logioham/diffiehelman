import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({ text, explanation }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block cursor-help font-bold text-blue-300 border-b border-dashed border-blue-300"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {text}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-64 p-3 mt-2 -ml-32 text-sm text-white bg-slate-800/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 left-1/2 pointer-events-none"
          >
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};