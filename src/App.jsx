import { useEffect, useRef, useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL || ''

function Brand() {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="h-2 w-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_18px_rgba(56,189,248,0.65)]" />
      <span className="text-sm tracking-[0.18em] text-white/80 lowercase">aurakode</span>
    </div>
  )
}

function Nav() {
  return (
    <header className="relative z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <Brand />
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#about" className="text-xs text-white/60 hover:text-white/90 transition">about</a>
          <a href="#experience" className="text-xs text-white/60 hover:text-white/90 transition">experience</a>
          <a href="#waitlist" className="text-xs text-white/60 hover:text-white/90 transition">waitlist</a>
        </div>
      </div>
    </header>
  )
}

function GlowCursor() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const move = (e) => {
      const x = e.clientX
      const y = e.clientY
      if (!el) return
      el.style.transform = `translate3d(${x - 240}px, ${y - 240}px, 0)`
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-10" aria-hidden>
      <div className="absolute h-[480px] w-[480px] rounded-full opacity-40 blur-[80px]"
           style={{
             background:
               'radial-gradient(closest-side, rgba(27,78,255,0.38), rgba(0,166,255,0.18), transparent 70%)'
           }}
      />
    </div>
  )
}

function Aurora() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[#0B0B0C]" />
      {/* soft aurora gradient */}
      <div className="absolute inset-0 opacity-70 mix-blend-screen">
        <div className="absolute -top-32 left-1/2 h-[60vh] w-[60vw] -translate-x-1/2 rounded-full blur-[90px]"
             style={{ background: 'conic-gradient(from 180deg, rgba(27,78,255,0.35), rgba(0,166,255,0.22), rgba(255,255,255,0.06), transparent)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50vh] w-[45vw] rounded-full blur-[100px]"
             style={{ background: 'radial-gradient(circle, rgba(27,78,255,0.25), rgba(0,166,255,0.12), transparent 70%)' }} />
      </div>
      {/* faint grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent"
               style={{ top: `${(i + 1) * 6.5}%`, opacity: 0.4 }} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"
               style={{ left: `${(i + 1) * 8.5}%`, opacity: 0.35 }} />
        ))}
      </div>
      {/* film grain */}
      <div className="absolute inset-0 opacity-[0.055] mix-blend-overlay"
           style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\' viewBox=\'0 0 120 120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'120\' height=\'120\' filter=\'url(%23n)\' opacity=\'0.8\'/></svg>")' }} />
    </div>
  )
}

function HaloFrame({ children, className = '' }) {
  return (
    <div className={`relative rounded-[28px] p-[1px] ${className}`}
         style={{
           background:
             'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04))'
         }}>
      <div className="relative rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[0.7]">
          <div className="absolute inset-0 rounded-[28px]"
               style={{ background: 'radial-gradient(120% 120% at 20% 0%, rgba(27,78,255,0.18), transparent 60%)' }} />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
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
        setMessage(data.message || 'added')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.detail || 'something went wrong')
      }
    } catch (err) {
      setStatus('error')
      setMessage('network error')
    }
  }

  return (
    <form onSubmit={submit} id="waitlist" className="mt-8 flex w-full max-w-lg gap-2">
      <input
        type="email"
        required
        placeholder="you@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500/60"
      />
      <button
        disabled={status === 'loading'}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-medium text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110 disabled:opacity-60"
      >
        {status === 'loading' ? 'sending…' : 'join'}
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
      <Aurora />

      <div className="relative z-20 mx-auto grid min-h-[84vh] max-w-6xl grid-cols-1 items-center gap-12 px-6 py-10 sm:px-8 md:grid-cols-2">
        <div>
          <p className="mb-4 text-xs tracking-[0.28em] text-white/55 lowercase">aurakode</p>
          <h1 className="text-5xl font-medium leading-[1.05] text-white sm:text-6xl">
            Build at the speed of thought.
          </h1>
          <p className="mt-5 max-w-lg text-white/70">
            A lucid interface that feels like weather—soft, reactive, inevitable.
          </p>
          <WaitlistForm />
          <p className="mt-3 text-xs text-white/40">no noise. no roadmap. just arrival.</p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-24 -z-10 blur-[90px]"
               style={{ background: 'radial-gradient(circle at 40% 50%, rgba(27,78,255,0.35), rgba(0,166,255,0.15), transparent 70%)' }} />
          <HaloFrame className="p-2">
            <div className="aspect-square w-full overflow-hidden rounded-[24px]">
              <div className="relative h-full w-full">
                {/* Orb placeholder with concentric rings */}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative h-[76%] w-[76%]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i}
                           className="absolute inset-0 rounded-full border border-white/10"
                           style={{ transform: `scale(${1 - i * 0.12})`, boxShadow: 'inset 0 0 50px rgba(255,255,255,0.04)' }} />
                    ))}
                    <div className="absolute inset-0 rounded-full"
                         style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), rgba(16,19,27,1))' }} />
                    <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full"
                         style={{ background: 'conic-gradient(from 0deg, transparent 0 40%, rgba(27,78,255,0.6), transparent 60% 100%)' }} />
                  </div>
                </div>
              </div>
            </div>
          </HaloFrame>
          <p className="mt-4 text-center text-sm text-white/50">It watches from the dark. You move. It learns.</p>
        </div>
      </div>

      <GlowCursor />
    </section>
  )
}

function Section({ title, eyebrow, children, id }) {
  return (
    <section id={id} className="relative z-20 mx-auto max-w-6xl px-6 py-24 sm:px-8">
      {eyebrow && (
        <div className="mb-5 text-xs uppercase tracking-[0.28em] text-white/50">{eyebrow}</div>
      )}
      <h2 className="text-3xl font-medium text-white sm:text-4xl">{title}</h2>
      <div className="mt-6 text-white/70">{children}</div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <Nav />
      <Hero />

      <Section id="about" eyebrow="belief" title="Building shouldn’t feel like breaking it down.">
        <p className="max-w-2xl">Make a shape with intent. Let the system infer the rest. Less explaining, more unfolding. Not effort. Direction. The interface becomes atmosphere.</p>
      </Section>

      <Section eyebrow="bridge" title="From thought to surface.">
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[{h:'code',p:'the deep layer. precise, invisible.'},{h:'creation',p:'the visible layer. clean, inevitable.'},{h:'care',p:'the hidden layer. humane, quiet.'}].map((b, i) => (
            <HaloFrame key={i} className="p-0">
              <div className="rounded-[28px] p-6">
                <h3 className="mb-2 text-lg capitalize text-white">{b.h}</h3>
                <p className="text-white/70">{b.p}</p>
              </div>
            </HaloFrame>
          ))}
        </div>
      </Section>

      <Section id="experience" eyebrow="experience" title="Quiet motion. Bright intent.">
        <HaloFrame className="p-0 overflow-hidden">
          <div className="h-[300px] w-full">
            <div className="h-full w-full animate-[pulse_8s_ease-in-out_infinite] bg-[radial-gradient(80%_100%_at_50%_0%,rgba(27,78,255,0.20),transparent)]" />
          </div>
        </HaloFrame>
      </Section>

      <Section eyebrow="promise" title="You’ll never build the same way again.">
        <div className="max-w-xl">
          <p>Less interface. More intuition. When the fog lifts, the thing you meant is already here.</p>
        </div>
        <div className="mt-6">
          <WaitlistForm />
        </div>
      </Section>

      <footer className="relative z-20 mx-auto max-w-6xl px-6 pb-16 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-white/55 backdrop-blur-xl">
          © {new Date().getFullYear()} aurakode
        </div>
      </footer>
    </div>
  )
}
