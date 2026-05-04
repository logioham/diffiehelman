import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';

export const UserCard = ({ name, role, colorClass, privateKey, publicKey, finalSecret, step }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: role === 'Alice' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl ${colorClass}`}
    >
      <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
      <div className="space-y-4">
        
        {/* Шаг 2: Приватный ключ */}
        {step >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-black/20 rounded-lg">
            <p className="text-sm text-gray-300 mb-1">Секретный ключ:</p>
            <div className="text-xl font-mono text-green-400">
              <Tooltip text={`a = ${privateKey}`} explanation="Случайное число, которое участник держит в строгом секрете." />
            </div>
          </motion.div>
        )}

        {/* Шаг 3: Публичный ключ */}
        {step >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-black/20 rounded-lg">
            <p className="text-sm text-gray-300 mb-1">Публичный ключ:</p>
            <div className="text-xl font-mono text-orange-400">
              <Tooltip text={`A = ${publicKey}`} explanation="Вычисляется как (g^a mod p). Это значение можно смело передавать по открытому каналу." />
            </div>
          </motion.div>
        )}

        {/* Шаг 5: Общий секрет */}
        {step >= 5 && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg mt-4">
            <p className="text-sm text-green-200 mb-1">Финальный общий секрет (K):</p>
            <div className="text-3xl font-bold font-mono text-white">
              {finalSecret.toString()}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};