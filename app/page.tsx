import ChatBox from "@/components/chat/ChatBox";
import Contact from "@/components/Section/contact";
import Hero from "@/components/Section/Hero";
import Projects from "@/components/Section/projects";
import Skills from "@/components/Section/skills";


export default function Home() {
  return (
    <main className="pt-20">

      <Hero />
      <Projects />
      <Skills />
      <Contact />

      <ChatBox />
      
    </main>
  )
}
