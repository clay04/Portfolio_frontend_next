import Container from "../ui/container"
import ProjectCard from "../ui/project-card"
import { projects } from "@/data/projects"
import Reveal from "../ui/Reveal"

export default function Projects() {
  return (
    <section id="projects" className="py-24 scroll-mt-24">
      <Container>
        <h2 className="text-2xl font-semibold mb-10">Projects</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <Reveal key={i} delay={i * 0.1}>
                <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}