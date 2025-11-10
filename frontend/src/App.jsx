import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Mail, Twitter, MessageCircle } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  // Cursor reactive light
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 })

  const onMouseMove = (e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  // Waitlist
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const submit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus({ state: 'loading', message: 'Joining…' })
    try {
      const res = await fetch(`${BACKEND_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus({ state: 'success', message: data.message || 'You\'re in.' })
        setEmail('')
      } else {
        setStatus({ state: 'error', message: data.detail || 'Something went wrong.' })
      }
    } catch (err) {
      setStatus({ state: 'error', message: 'Network error. Try again.' })
    }
  }

  return (
    <div
      onMouseMove={onMouseMove}
      className="min-h-screen w-full bg-[#0B0B0C] text-white overflow-x-hidden selection:bg-blue-500/20 selection:text-white"
    >
      {/* Ambient cursor glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(800px 400px at 50% 50%, rgba(0,166,255,0.08), transparent 60%)',
          translateX: smoothX.to((v) => v - window.innerWidth / 2),
          translateY: smoothY.to((v) => v - window.innerHeight / 2),
        }}
      />

      {/* Subtle backdrop gradient + bloom lines */}
      <div className="fixed inset-0 -z-0">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,#10131B_0%,#0B0B0C_60%)]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-[120%] blur-3xl opacity-30 bg-gradient-to-r from-[#1B4EFF] via-[#00A6FF] to-transparent" />
        </div>
      </div>

      {/* HERO */}
      <section className="relative h-[90vh] md:h-[92vh] flex items-center">
        {/* Spline 3D */}
        <div className="absolute inset-0">
          <Spline
            scene="https://prod.spline.design/Ao-qpnKUMOxV2eTA/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {/* Dark glass overlay to deepen contrast */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.65),rgba(11,11,12,0.85))]" />
        {/* Light streaks */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 right-16 h-px w-56 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[1px]" />
          <div className="absolute bottom-24 left-10 h-px w-80 bg-gradient-to-r from-transparent via-[#00A6FF]/40 to-transparent blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs/relaxed backdrop-blur-md bg-white/5 border border-white/10 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A6FF] shadow-[0_0_12px_2px_rgba(0,166,255,0.8)]" />
              <span className="text-white/70">Aurakode</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
              Build at the speed of thought.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl">
              An AI-native companion that makes creation seamless, from idea to execution.
            </p>

            {/* Waitlist CTA */}
            <form onSubmit={submit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email"
                  className="w-full h-12 rounded-xl px-4 bg-white/5 border border-white/10 outline-none text-white placeholder-white/40 backdrop-blur-md focus:border-[#1B4EFF]/50 focus:ring-2 focus:ring-[#1B4EFF]/20"
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5" />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[linear-gradient(180deg,#1B4EFF,#00A6FF)] text-white font-medium shadow-[0_0_30px_rgba(0,166,255,0.35)] hover:brightness-110 transition will-change-transform"
                disabled={status.state === 'loading'}
              >
                {status.state === 'loading' ? 'Joining…' : 'Join the Waitlist →'}
              </button>
            </form>
            {status.state !== 'idle' && (
              <p className={
                'mt-3 text-sm ' +
                (status.state === 'success' ? 'text-emerald-300' : status.state === 'error' ? 'text-red-300' : 'text-white/60')
              }>
                {status.message}
              </p>
            )}

            {/* Micro copy under hero */}
            <p className="mt-10 text-sm text-white/50">
              Less noise. More build.
            </p>
          </div>
        </div>
      </section>

      {/* BELIEF */}
      <section className="relative py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-30 bg-[radial-gradient(circle,#1B4EFF_0%,transparent_60%)]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-semibold text-white/90">
            Building software shouldn’t feel like breaking it down.
          </h2>
          <p className="mt-6 text-lg text-white/70 max-w-3xl">
            Most tools demand precision before imagination. Aurakode does the opposite — it understands what you mean, not just what you type.
          </p>
        </div>
      </section>

      {/* BRIDGE */}
      <section className="relative py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-10 backdrop-blur-xl bg-white/5 border border-white/10">
            <h3 className="text-2xl md:text-3xl font-semibold">For the ones who code.</h3>
            <p className="mt-6 text-white/70">Precision. Control. Acceleration.</p>
          </div>
          <div className="rounded-2xl p-10 backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10">
            <h3 className="text-2xl md:text-3xl font-semibold">For the ones who create.</h3>
            <p className="mt-6 text-white/70">Clarity. Flow. Simplicity.</p>
          </div>
        </div>
        <p className="mt-10 text-center text-white/60">Aurakode connects them.</p>
      </section>

      {/* EXPERIENCE */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-40" style={{
            background:
              'radial-gradient(60%_40%_at_50%_50%, rgba(27,78,255,0.25), transparent 60%)'
          }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-semibold text-white/90 max-w-4xl">
            It feels less like using software, and more like conversing with intelligence.
          </h2>

          {/* Abstract animation: text particles morphing into waves */}
          <ParticleWave />
        </div>
      </section>

      {/* PROMISE */}
      <section className="relative py-28">
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-semibold">You’ll never build the same way again.</h2>
          <form onSubmit={submit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email"
                className="w-full h-12 rounded-xl px-4 bg-white/5 border border-white/10 outline-none text-white placeholder-white/40 backdrop-blur-md focus:border-[#1B4EFF]/50 focus:ring-2 focus:ring-[#1B4EFF]/20"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5" />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[linear-gradient(180deg,#1B4EFF,#00A6FF)] text-white font-medium shadow-[0_0_30px_rgba(0,166,255,0.35)] hover:brightness-110 transition"
              disabled={status.state === 'loading'}
            >
              {status.state === 'loading' ? 'Joining…' : 'Join the Waitlist'}
            </button>
          </form>
          {status.state !== 'idle' && (
            <p className={'mt-3 text-sm ' + (status.state === 'success' ? 'text-emerald-300' : status.state === 'error' ? 'text-red-300' : 'text-white/60')}>
              {status.message}
            </p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center gap-4 text-white/70">
            <a href="https://twitter.com" className="hover:text-white transition" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="https://discord.com" className="hover:text-white transition" aria-label="Discord">
              <MessageCircle size={20} />
            </a>
            <a href="mailto:hello@aurakode.ai" className="hover:text-white transition" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
          <p className="text-xs text-white/50">© 2025 Aurakode. A new layer of creation.</p>
        </div>
      </footer>
    </div>
  )
}

function ParticleWave() {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let animationId
    let w, h
    let time = 0

    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * DPR)
      canvas.height = Math.floor(h * DPR)
      ctx.scale(DPR, DPR)
    }

    const noise = (x) => Math.sin(x) * 0.5 + Math.sin(x * 0.27) * 0.25 + Math.sin(x * 1.73) * 0.2

    const render = () => {
      time += 0.006
      ctx.clearRect(0, 0, w, h)

      // background faint
      const grd = ctx.createLinearGradient(0, 0, w, h)
      grd.addColorStop(0, 'rgba(27,78,255,0.06)')
      grd.addColorStop(1, 'rgba(0,166,255,0.04)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      // blue waves
      ctx.lineWidth = 1.2
      for (let i = 0; i < 26; i++) {
        const yBase = (h * (i + 1)) / 28
        ctx.beginPath()
        for (let x = 0; x <= w; x += 6) {
          const y = yBase + noise(x * 0.01 + time + i * 0.2) * 16 * (1 + i * 0.03)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const alpha = 0.028 + i * 0.004
        ctx.strokeStyle = `rgba(0,166,255,${alpha})`
        ctx.stroke()
      }

      // floating text particles morphing
      ctx.font = '500 12px ui-sans-serif, system-ui, -apple-system, Inter, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      const words = ['clarity', 'flow', 'signal', 'intent', 'context', 'precision']
      for (let i = 0; i < 36; i++) {
        const x = (i * 97.3 + time * 200) % (w + 120) - 60
        const y = 40 + ((i * 53.1) % (h - 80))
        const t = (Math.sin(time * 2 + i) + 1) / 2
        ctx.save()
        ctx.globalAlpha = 0.15 + t * 0.4
        ctx.translate(x, y)
        ctx.fillText(words[i % words.length], 0, 0)
        ctx.restore()
      }

      animationId = requestAnimationFrame(render)
    }

    const onResize = () => {
      resize()
    }

    resize()
    render()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="mt-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
      <canvas ref={ref} className="block w-full h-[320px] md:h-[420px]" />
    </div>
  )
}
