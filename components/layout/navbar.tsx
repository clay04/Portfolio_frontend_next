'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X } from "lucide-react"

export default function Navbar() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 w-full z-50 backdrop-blur bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800"
        >
            <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X /> : <Menu />}
                </button>

                <h1 className="font-bold">portfolio</h1>

                <div className="flex items-center gap-6">
                    {['home', 'projects', 'skills', 'contact'].map((item) => (
                        <Link key={item} href={`#${item}`} className="text-sm hover:opacity-70">
                            {item}
                        </Link>
                    ))}

                    {/* 🔥 FIX HYDRATION */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}
                </div>
            </div>

            {open && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-t flex flex-col items-center gap-4 py-6 md:hidden">
                    {['home', 'projects', 'skills', 'contact'].map((item) => (
                    <Link key={item} href={`#${item}`}>
                        {item}
                    </Link>
                    ))}
                </div>
            )}
        </motion.nav>
    )
}