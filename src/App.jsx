import { useState } from 'react'
import logo from './assets/range-of-motion-logo.jpg'
import { supabase } from './supabaseClient'

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed || !isValidEmail(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([{ email }])

    setLoading(false)

    if (insertError) {
      if (insertError.code === '23505') {
        setError('You\'re already on the list!')
      } else {
        setError('Something went wrong. Please try again.')
      }
      return
    }

    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-[#821d30] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#fff9f4]/70">
            Coming Soon
          </p>
          <img src={logo} alt="Range of Motion" className="mx-auto max-w-xs sm:max-w-sm" />
          <p className="text-lg text-[#fff9f4]/70 max-w-md mx-auto">
            Elevated Strength Training Essentials For Women. 
          </p>
        </div>

        {submitted ? (
          <p className="text-[#fff9f4] font-medium text-lg">
            You're on the list! We'll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-[#fff9f4] placeholder-[#fff9f4]/40 focus:outline-none focus:ring-2 focus:ring-[#fff9f4]/50 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#fff9f4] px-6 py-3 font-semibold text-[#821d30] hover:bg-[#fff9f4]/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Joining waitlist...' : 'Join Waitlist'}
            </button>
          </form>
        )}

        {error && (
          <p className="text-[#fff9f4]/80 text-sm">{error}</p>
        )}

        <p className="text-sm text-[#fff9f4]/70">
          Follow us on Instagram{' '}
          <a href="https://instagram.com/shoprangeofmotion" target="_blank" rel="noopener noreferrer" className="text-[#fff9f4] underline hover:no-underline">
            @shoprangeofmotion
          </a>
        </p>
      </div>
    </div>
  )
}

export default App
