import Container from "../ui/container"

const skills = ["Next.js", "React", "TypeScript", "Tailwind", "Node.js"]

export default function Skills() {
  return (
    <section id="skills" className="py-24 scroll-mt-24">
      <Container>
        <h2 className="text-2xl font-semibold mb-10">Skills</h2>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill}
              className="px-4 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-900"
            >
              {skill}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}