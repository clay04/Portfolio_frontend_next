import Container from "../ui/container"

export default function Contact() {
  return (
    <section id="contact" className="py-24 scroll-mt-24">
      <Container>
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold">Let's work together</h2>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Feel free to reach out for collaborations or just a friendly hello 👋
          </p>

          <a
            href="mailto:youremail@gmail.com"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black"
          >
            Say Hello
          </a>
        </div>
      </Container>
    </section>
  )
}