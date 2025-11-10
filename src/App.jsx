import { useEffect, useMemo, useRef, useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL || ''

function GlowCursor() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const move = (e) => {
      const x = e.clientX
      const y = e.clientY
      el.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-10"
      aria-hidden
    >
      <div className="absolute h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
           style={{
             background: 'radial-gradient(closest-side, rgba(27,78,255,0.35), rgba(0,166,255,0.12), transparent 70%)'
           }}
      />
    </div>
  )
}

function LightStreaks() {
  const lines = new Array(6).fill(0)
  return (
    <div className="absolute inset-0 overflow-hidden">
      {lines.map((_, i) => (
        <div
          key={i}
          className="absolute h-px w-[140%] -left-20 opacity-[0.07]"
          style={{
            top: `${(i + 1) * 14}%`,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
          }}
        />
      ))}
    </div>
  )
}

function Glass({ children, className = '' }) {
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/6 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch(`${backend}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('success')
        setMessage(data.message || 'Added')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.detail || 'Something went wrong')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error')
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 flex w-full max-w-md gap-2">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500/60"
      />
      <button
        disabled={status === 'loading'}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium text-white shadow-lg shadow-blue-600/20 transition hover:brightness-110 disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Join waitlist'}
      </button>
      {message && (
        <div className="sr-only" aria-live="polite">{message}</div>
      )}
    </form>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-[#0B0B0C]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(27,78,255,0.25),transparent_70%)]" />
      <LightStreaks />

      <div className="relative z-10 mx-auto grid min-h-[84vh] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 sm:px-8 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/60">A U R A K O D E</p>
          <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
            Build at the speed of thought.
          </h1>
          <p className="mt-4 max-w-lg text-white/70">
            Not an app. A presence. Quietly folding the work around you.
          </p>
          <WaitlistForm />
          <p className="mt-3 text-xs text-white/40">No noise. No roadmap. Just arrival.</p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-20 -z-10 blur-3xl"
               style={{ background: 'radial-gradient(circle at 40% 50%, rgba(27,78,255,0.35), rgba(0,166,255,0.15), transparent 70%)' }} />
          <div className="aspect-square w-full rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            <div className="h-full w-full rounded-2xl bg-[radial-gradient(70%_70%_at_50%_50%,rgba(255,255,255,0.08),rgba(20,20,24,1))]" />
          </div>
          <p className="mt-4 text-center text-sm text-white/40">A black orb watches from the dark. You move. It learns.</p>
        </div>
      </div>

      <GlowCursor />
    </section>
  )
}

function Section({ title, eyebrow, children }) {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 sm:px-8">
      {eyebrow && (
        <div className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50">{eyebrow}</div>
      )}
      <h2 className="text-3xl font-medium text-white sm:text-4xl">{title}</h2>
      <div className="mt-6 text-white/70">{children}</div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <Hero />

      <Section eyebrow="Belief" title="Building shouldn’t feel like breaking it down.">
        <div className="grid gap-6 md:grid-cols-2">
          <Glass className="p-6">
            <p className="text-white/80">Make a shape with intent. Let the system infer the rest. Less explaining, more unfolding.</p>
          </Glass>
          <Glass className="p-6">
            <p className="text-white/80">Not effort. Direction. Not tools. Texture. The interface becomes atmosphere.</p>
          </Glass>
        </div>
      </Section>

      <Section eyebrow="Bridge" title="From thought to surface.">
        <div className="grid gap-6 md:grid-cols-2">
          <Glass className="p-6">
            <h3 className="mb-2 text-lg font-medium text-white">Code</h3>
            <p className="text-white/70">The deep layer. Precise, invisible.</p>
          </Glass>
          <Glass className="p-6">
            <h3 className="mb-2 text-lg font-medium text-white">Creation</h3>
            <p className="text-white/70">The visible layer. Clean, inevitable.</p>
          </Glass>
        </div>
      </Section>

      <Section eyebrow="Experience" title="Quiet motion. Bright intent.">
        <Glass className="p-0 overflow-hidden">
          <div className="h-[280px] w-full bg-[radial-gradient(80%_100%_at_50%_0%,rgba(27,78,255,0.2),transparent)]">
            <div className="h-full w-full animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,0.06),transparent_30%,transparent_70%,rgba(255,255,255,0.06))] bg-[length:200%_100%]" style={{animationDuration:'6s'}} />
          </div>
        </Glass>
      </Section>

      <Section eyebrow="Promise" title="You’ll never build the same way again.">
        <p className="max-w-xl">Less interface. More intuition. When the fog lifts, the thing you meant is already here.</p>
        <div className="mt-6">
          <WaitlistForm />
        </div>
      </Section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-16 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-white/50 backdrop-blur-xl">
          © {new Date().getFullYear()} Aurakode
        </div>
      </footer>
    </div>
  )
}
