import React from 'react';
import { motion } from 'framer-motion';

export const ColorMixer = ({ step }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
      <h3 className="text-xl font-semibold text-white mb-4">Аналогия с красками</h3>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <motion.div className="w-12 h-12 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          <span className="text-xs text-gray-300 mt-2">Общие p, g</span>
        </div>
        
        {step >= 2 && (
          <>
            <span className="text-2xl text-white">+</span>
            <div className="flex flex-col items-center">
               <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }}
                 className="w-12 h-12 rounded-full bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
               />
               <span className="text-xs text-gray-300 mt-2">Секрет (Алиса)</span>
            </div>
          </>
        )}

        {step >= 3 && (
          <>
            <span className="text-2xl text-white">=</span>
            <div className="flex flex-col items-center">
               <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }}
                 className="w-12 h-12 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" 
               />
               <span className="text-xs text-gray-300 mt-2">Публичный ключ</span>
            </div>
          </>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-4 text-center">
        {step < 2 ? "Желтая краска — это публичные параметры, они известны всем." : 
         step === 2 ? "У каждого своя секретная краска, которую они никому не показывают." :
         "Смешав общую и секретную краску, получаем публичный ключ. Разделить этот цвет обратно на компоненты почти невозможно!"}
      </p>
    </div>
  );
};