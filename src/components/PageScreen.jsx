function PageScreen({ title, description, children }) {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[#2D2D2D] sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base text-[#666666] sm:text-lg">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  )
}

export default PageScreen
