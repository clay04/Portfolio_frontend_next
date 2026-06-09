'use client'

import Container from "../ui/container"
import { projects } from "@/data/projects"
import Reveal from "../ui/Reveal"
import ProjectContentRow from "../ui/projectContentRow"
import { useState } from "react"

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="projects" className="py-24 scroll-mt-24 w-full">
      <Container>
        <Reveal delay={0.1}>
          <h2 className="text-3xl font-semibold mb-16">Projects</h2>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start relative w-full">
          
          <div className="w-full md:w-1/3 md:sticky md:top-40 h-auto flex flex-col gap-8">
            {projects.map((project, idx) => {
              const isActive = idx === activeIndex
              return (
                <div 
                  key={idx}
                  className="relative pl-4 border-l-2 transition-all duration-300 cursor-pointer"
                  style={{
                    borderColor: isActive ? 'rgb(255,255,255)' : 'rgba(63,63,70,0.2)'
                  }}
                  onClick={() => {
                    document.getElementById(`project-content-${idx}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    })
                  }}
                >
                  <h3 
                    className={`text-xl font-semibold transition-all duration-300 ${
                      isActive 
                        ? "text-white opacity-100 translate-x-1" 
                        : "text-zinc-600 opacity-50"
                    }`}
                  >
                    {project.title.split(" (")[0]}
                  </h3>

                  {isActive && (
                    <Reveal delay={0.1}>
                      <p className="text-sm text-zinc-400 mt-3 leading-relaxed transition-all duration-500">
                        {project.description}
                      </p>
                    </Reveal>
                  )}
                </div>
              )
            })}
          </div>

          <div className="w-full md:w-2/3 flex flex-col">
            {projects.map((project, i) => (
              <div id={`project-content-${i}`} key={i} className="w-full">
                <ProjectContentRow 
                  project={project} 
                  index={i} 
                  setActiveIndex={setActiveIndex} 
                />
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  )
}