import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await login(data)
      const user = response.data?.user || response.user

      const roleRedirects = {
        hotel_owner: '/hotel-owner/dashboard',
        admin: '/admin',
        guide: '/guide/dashboard',
        driver: '/driver/dashboard',
        staff: '/staff',
        default: '/dashboard'
      }

      const redirectPath = roleRedirects[user?.role] || roleRedirects.default
      navigate(redirectPath, { replace: true })
    } catch (error) {
      // Error handled in auth context
    }
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Signing you in..." />
  }

  return (
    <div className="min-h-screen flex text-slate-900 bg-white selection:bg-[#E59B2C] selection:text-white">

      {/* LEFT: Cinematic Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden justify-center items-center">
        <img
          src="/traditional-stilt-fishermen-sri-lanka.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Login Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        <div className="relative z-10 p-16 text-white max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#E59B2C]" />
            <span className="font-bold tracking-[0.2em] text-xs uppercase text-[#E59B2C]">Experience Serandib</span>
          </div>
          <h1 className="text-5xl font-serif mb-6 leading-tight">Your Journey Begins Here.</h1>
          <p className="text-lg text-white/70 font-light leading-relaxed">
            "The gladdest moment in human life is a departure into unknown lands." – Sir Richard Burton
          </p>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-10"
        >
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 group-focus-within:text-[#E59B2C] transition-colors">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all pl-12 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="name@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
              </div>

              <div className="group">
                <div className="flex justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-[#E59B2C] transition-colors">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#E59B2C] font-semibold hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-[#E59B2C] focus:ring-1 focus:ring-[#E59B2C] transition-all pl-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:bg-[#E59B2C] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="relative border-t border-slate-200 my-8">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-slate-400 text-sm">Or continue with</div>
            </div>

            <button type="button" className="w-full border border-slate-200 bg-white text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Google
            </button>

          </form>

          <div className="text-center pt-8">
            <p className="text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#E59B2C] font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
