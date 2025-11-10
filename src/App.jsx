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
          <a href="#philosophy" className="text-xs text-white/60 hover:text-white/90 transition">philosophy</a>
          <a href="#bridge" className="text-xs text-white/60 hover:text-white/90 transition">bridge</a>
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
    <form onSubmit={submit} id="waitlist" className="mt-8 flex w-full max-w-xl gap-2">
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
        className="rounded-xl bg-white/10 px-5 py-3 font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15 hover:ring-white/25 hover:shadow-[0_0_0_2px_rgba(56,189,248,0.25)_inset]"
      >
        {status === 'loading' ? 'sending…' : 'Join the waitlist →'}
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

      <div className="relative z-20 mx-auto grid min-h-[88vh] max-w-6xl grid-cols-1 items-center gap-12 px-6 py-10 sm:px-8 md:grid-cols-2">
        <div className="reveal in">
          <p className="mb-4 text-xs tracking-[0.28em] text-white/55 lowercase">aurakode</p>
          <h1 className="text-5xl font-semibold leading-[1.02] text-white sm:text-6xl">
            Build at the speed of thought.
          </h1>
          <p className="mt-5 max-w-xl text-white/70">
            A new intelligence that moves with you — from idea to reality, without friction.
          </p>
          <WaitlistForm />
          <p className="mt-3 text-xs text-white/40">Where imagination finally meets precision.</p>
        </div>

        <div className="relative reveal in">
          <div className="pointer-events-none absolute -inset-24 -z-10 blur-[90px]"
               style={{ background: 'radial-gradient(circle at 40% 50%, rgba(27,78,255,0.35), rgba(0,166,255,0.15), transparent 70%)' }} />
          <div className="conic-sweep ripple-light">
            <HaloFrame className="p-2">
              <div className="aspect-square w-full overflow-hidden rounded-[24px] film-grain">
                <div className="relative h-full w-full">
                  {/* refractive glass text */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="pointer-events-none select-none text-center">
                      <div className="mb-2 text-sm tracking-[0.28em] text-white/50 lowercase">artifact</div>
                      <div className="text-3xl font-medium text-white/80 [text-shadow:0_0_30px_rgba(27,78,255,0.25)]">
                        inside the interface
                      </div>
                    </div>
                  </div>
                  {/* subtle ripples */}
                  <div className="absolute inset-0" style={{
                    background: 'radial-gradient(80%_60%_at_50%_40%, rgba(255,255,255,0.06), transparent), radial-gradient(60%_80%_at_40%_60%, rgba(0,166,255,0.10), transparent)'
                  }} />
                  <div className="absolute inset-0 rounded-[24px]" style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))'
                  }} />
                </div>
              </div>
            </HaloFrame>
          </div>
          <p className="mt-4 text-center text-sm text-white/50">Soft blue light ripples through black glass.</p>
        </div>
      </div>

      <GlowCursor />
    </section>
  )
}

function Section({ title, eyebrow, children, id, center=false }) {
  return (
    <section id={id} className="relative z-20 mx-auto max-w-6xl px-6 py-24 sm:px-8">
      {eyebrow && (
        <div className="mb-5 text-xs uppercase tracking-[0.28em] text-white/50">{eyebrow}</div>
      )}
      <h2 className={`${center ? 'text-center' : ''} text-3xl font-semibold text-white sm:text-4xl`}>{title}</h2>
      <div className={`mt-6 text-white/70 ${center ? 'text-center mx-auto' : ''}`}>{children}</div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <Nav />
      <Hero />

      {/* Philosophy */}
      <Section id="philosophy" eyebrow="the philosophy" title="Creation shouldn’t feel mechanical.">
        <div className="max-w-2xl space-y-4">
          <p>For too long, building has been about commands, syntax, and structure. But creativity isn’t linear — it’s fluid, instinctive, alive. Aurakode brings that feeling back to building.</p>
          <p className="text-sm text-white/50">Where imagination finally meets precision.</p>
        </div>
      </Section>

      {/* Bridge */}
      <Section id="bridge" eyebrow="the bridge" title="Two worlds. One flow.">
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <HaloFrame className="p-0">
            <div className="rounded-[28px] p-6">
              <div className="mb-2 text-sm text-white/50">For the ones who code.</div>
              <h3 className="mb-1 text-xl text-white">Precision. Power. Speed.</h3>
            </div>
          </HaloFrame>
          <HaloFrame className="p-0">
            <div className="rounded-[28px] p-6">
              <div className="mb-2 text-sm text-white/50">For the ones who create.</div>
              <h3 className="mb-1 text-xl text-white">Freedom. Simplicity. Flow.</h3>
            </div>
          </HaloFrame>
        </div>
        <div className="relative mx-auto mt-8 h-10 w-full max-w-md">
          <div className="pulse-line" />
          <div className="pulse-dot" />
          <p className="pt-12 text-center text-sm text-white/60">Aurakode connects them.</p>
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" eyebrow="the experience" title={"It doesn’t feel like using software.\nIt feels like intelligence unfolding."}>
        <div className="max-w-2xl space-y-4">
          <p>Every interaction adapts. Every response refines. Every idea gets sharper — almost before you think it.</p>
          <p>You’ll know it when you feel it.</p>
        </div>
        <HaloFrame className="mt-8 p-0 overflow-hidden">
          <div className="relative h-[320px] w-full">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(80%_100%_at_50%_0%, rgba(27,78,255,0.18), transparent)' }} />
            <div className="absolute inset-0 conic-sweep" />
          </div>
        </HaloFrame>
      </Section>

      {/* Belief / Manifesto */}
      <Section id="belief" eyebrow="the belief" title="The future of building isn’t about tools. It’s about rhythm.">
        <div className="max-w-2xl space-y-4">
          <p>A rhythm where you move — and technology moves with you. No lag between thought and creation. No gap between what you imagine and what gets built.</p>
          <p className="text-white/80">Aurakode is that rhythm.</p>
        </div>
      </Section>

      {/* Promise */}
      <Section id="promise" eyebrow="the promise" title="Soon, building won’t feel like building at all." center>
        <div className="mt-6 flex justify-center">
          <WaitlistForm />
        </div>
        <p className="mt-3 text-center text-sm text-white/50">Be among the first to experience a new layer of creation.</p>
      </Section>

      {/* Footer */}
      <footer className="relative z-20 mx-auto max-w-6xl px-6 pb-16 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70 backdrop-blur-xl">
          <div className="mb-1 text-sm tracking-[0.18em] text-white/60 lowercase">aurakode</div>
          <div className="text-xs text-white/50">© {new Date().getFullYear()} Aurakode · A new layer of creation.</div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/60">
            <a className="hover:text-white/90" href="#">Twitter</a>
            <a className="hover:text-white/90" href="#">Discord</a>
            <a className="hover:text-white/90" href="mailto:hello@aurakode.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
