const steps = [
  ['01', 'Create your vault', 'Start with a space that is yours.'],
  ['02', 'Bring in what matters', 'Keep your files together without losing the calm.'],
  ['03', 'Find it when you need it', 'Search naturally when a file slips your mind.'],
] as const

export function HowItWorks() {
  return (
    <section id="how-it-works" className="rounded-2xl bg-card-muted p-6 md:p-8" aria-labelledby="how-it-works-heading">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-primary">How it works</p>
        <h2 id="how-it-works-heading" className="text-balance font-display text-3xl font-bold text-foreground">
          Make room for the files that follow you everywhere.
        </h2>
      </div>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map(([number, title, description]) => (
          <li key={number} className="flex min-w-0 flex-col gap-3 border-t border-border pt-4">
            <span className="font-mono text-sm font-semibold tabular-nums text-primary">{number}</span>
            <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
            <p className="text-pretty text-sm text-muted-foreground">{description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
