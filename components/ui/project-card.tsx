'use client'

import { motion } from "framer-motion"

export default function ProjectCard({ project }: any) {
  return (
    <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="p-6 rounded-2xl border backdrop-blur bg-white/60 dark:bg-zinc-900/60 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition"
    >
      <h3 className="font-semibold text-lg">{project.title}</h3>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.tech.map((t: string) => (
          <span
            key={t}
            className="text-xs px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  )
}