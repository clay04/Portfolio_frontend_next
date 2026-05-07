export default function Button({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <button className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition">
      {children}
    </button>
  )
}
