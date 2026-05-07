'use client'

import { motion } from "framer-motion"
import Container from "../ui/container"

export default function Hero() {
  return (
    <section id="home" className="py-32 md:py-40 scroll-mt-24">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
          >
            Welcome{" "}
            <span className="bg-gradient-to-r from-black to-zinc-400 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
                Clay Aiken Mangeber jr
            </span>{" "}
            Portfolio
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-zinc-600 dark:text-zinc-400"
          >
            Informatics graduate from Universitas Klabat with a strong focus on AI and Full StackDevelopment. Experienced in building web and mobile applications using Python (Flask),React, and React Native. Passionate about AI Integrations, including NLP, speechprocessing, and automation systems to deliver impactful technology solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black text-sm hover:opacity-90 transition"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="px-6 py-3 rounded-xl border text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Contact Me
            </a>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}