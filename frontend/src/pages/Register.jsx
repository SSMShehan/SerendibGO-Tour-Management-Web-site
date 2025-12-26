import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      await registerUser(data)
      const roleRedirects = {
        guide: '/guide/dashboard',
        staff: '/staff',
        driver: '/profile',
        default: '/dashboard'
      }
      navigate(roleRedirects[data.role] || roleRedirects.default)
    } catch (error) {
      // handled by context
    }
  }

  if (isLoading) return <LoadingSpinner size="lg" text="Creating your account..." />

  return (
    <div className="min-h-screen flex text-slate-900 bg-white selection:bg-[#E59B2C] selection:text-white">

      {/* LEFT: Cinematic Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden order-2 justify-center items-center">
        <img
          src="/glassmorphism-bg-4.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Register Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        <div className="relative z-10 p-16 text-white max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#E59B2C]" />
            <span className="font-bold tracking-[0.2em] text-xs uppercase text-[#E59B2C]">Join the Community</span>
          </div>
          <h1 className="text-5xl font-serif mb-6 leading-tight">Unlock the Essential Sri Lanka.</h1>
          <p className="text-lg text-white/70 font-light leading-relaxed">
            Create an account to curate custom trips, book exclusive stays, and explore with verified local guides.
          </p>
        </div>
      </div>

      {/* RIGHT: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg space-y-8 my-auto"
        >
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500">Begin your adventure with SerandibGo.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="John"
                    {...register('firstName', { required: 'Required', minLength: 2 })}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Last Name</label>
                <input
                  type="text"
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Doe"
                  {...register('lastName', { required: 'Required', minLength: 2 })}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="name@example.com"
                  {...register('email', { required: 'Required', pattern: /^\S+@\S+$/i })}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone</label>
                <div className="relative">
                  <input
                    type="tel"
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+123..."
                    {...register('phone', { required: 'Required' })}
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Account Type</label>
                <select
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all ${errors.role ? 'border-red-500' : ''}`}
                  {...register('role', { required: 'Required' })}
                >
                  <option value="tourist">Tourist</option>
                  <option value="hotel_owner">Hotel Owner</option>
                  <option value="guide">Tour Guide</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Required', minLength: 6 })}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('confirmPassword', { required: 'Required', validate: v => v === password || 'Mismatch' })}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 rounded text-[#E59B2C] focus:ring-[#E59B2C]" {...register('agreeTerms', { required: true })} />
              <span className="text-sm text-slate-500">I agree to the <Link to="/terms" className="text-slate-900 font-bold hover:underline">Terms</Link> & <Link to="/privacy" className="text-slate-900 font-bold hover:underline">Privacy Policy</Link></span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:bg-[#E59B2C] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>

          </form>

          <div className="text-center pt-4">
            <p className="text-slate-500">
              Already a member?{' '}
              <Link to="/login" className="text-[#E59B2C] font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
