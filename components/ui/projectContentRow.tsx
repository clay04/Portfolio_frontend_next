'use client'

import { useInView, motion } from "framer-motion"
import { useEffect, useRef } from "react"

interface ProjectProps {
  project: {
    title: string;
    description: string;
    tech: string[];
    images: string[];
  };
  index: number;
  setActiveIndex: (index: number) => void;
}

export default function ProjectContentRow({ project, index, setActiveIndex }:ProjectProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" })

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index)
    }
  }, [isInView, index, setActiveIndex])

  return (
    <div 
      ref={ref}
      className="w-full min-h-[70vh] flex flex-col justify-center py-16 first:pt-0 last:pb-32"  
    >
      <div className="w-full flex flex-col gap-6">

        <div className="w-full mt-2">
          {project.images
            ?.filter((imgUrl: string) => imgUrl !== "")
            .map((imgUrl: string, idx: number) => (
              <motion.img 
                key={idx} 
                src={imgUrl} 
                alt={`Project image : ${project.title}`}
                
                initial={{ x: 60, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : { x: 60, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 60, 
                  damping: 18,
                  delay: idx * 0.1
                }}
                
                className="w-full h-auto object-cover rounded-2xl shadow-2xl mb-6 last:mb-0"
              />
            ))
          }
        </div>

        <div className="flex flex-wrap gap-2">
          <span>Tech :</span>
          {project.tech.map((t: string) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-medium border border-zinc-700/50"
            >
              {t}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}