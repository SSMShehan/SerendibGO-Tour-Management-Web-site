import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Calendar, Users, Heart, ArrowRight, ArrowLeft,
  Check, Sparkles, Building, TreePine, Mountain, Waves,
  Utensils, Camera, DollarSign, Send, Globe, Star, Shield,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Assets ---
// Using a rich background image
const BG_IMAGE = "/glassmorphism-bg-5.jpg" // Assuming this exists or using a fallback

const INTERESTS = [
  { id: 'culture', label: 'Culture & Heritage', icon: Building },
  { id: 'nature', label: 'Nature & Wildlife', icon: TreePine },
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'beach', label: 'Beach Life', icon: Waves },
  { id: 'food', label: 'Culinary', icon: Utensils },
  { id: 'photography', label: 'Photography', icon: Camera },
]

const BUDGET_OPTIONS = [
  { value: 'Standard', glow: 'shadow-blue-500/50', border: 'border-blue-500' },
  { value: 'Premier', glow: 'shadow-purple-500/50', border: 'border-purple-500' },
  { value: 'Luxury', glow: 'shadow-[#E59B2C]/50', border: 'border-[#E59B2C]' }
]

// --- Custom Glass Calendar Component ---
const GlassCalendar = ({ value, onChange, onClose, minDate }) => {
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date())

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const handleDayClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    // Adjust for timezone offset to ensure YYYY-MM-DD matches local selection
    const offset = selectedDate.getTimezoneOffset()
    const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000))
    onChange(localDate.toISOString().split('T')[0])
    onClose()
  }

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute top-full left-0 mt-2 z-50 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-80"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-white">
        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
        <span className="font-bold text-lg">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-xs font-bold text-white/40 uppercase py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {blanks.map(x => <div key={`blank-${x}`} className="aspect-square" />)}
        {days.map(day => {
          const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0]
          const isSelected = value === dateStr
          const isToday = dateStr === new Date().toISOString().split('T')[0]
          const isPast = minDate && new Date(dateStr) < new Date(minDate)

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded-lg text-sm font-medium transition-all ${isSelected
                ? 'bg-[#E59B2C] text-black font-bold shadow-lg shadow-[#E59B2C]/30'
                : isToday
                  ? 'bg-white/10 text-white border border-[#E59B2C]/50'
                  : isPast
                    ? 'text-white/20 cursor-not-allowed'
                    : 'text-white hover:bg-white/10'
                }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

const CustomTrip = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Adding calendar visibility state
  const [activeCalendar, setActiveCalendar] = useState(null) // 'start' or 'end' or null

  // Form State
  const [formData, setFormData] = useState({
    destinations: [],
    startDate: '', endDate: '',
    travelers: 2,
    interests: [],
    budget: '',
    contact: { name: '', email: '', phone: '' }
  })

  const [destInput, setDestInput] = useState('')

  // Handlers
  const paginate = (newStep) => {
    setDirection(newStep > step ? 1 : -1)
    setStep(newStep)
  }

  const updateData = (field, value) => {
    setFormData(p => ({ ...p, [field]: value }))
    // Auto-switch calendars logic could go here if desired
  }

  const toggleInterest = (id) => {
    setFormData(p => ({
      ...p,
      interests: p.interests.includes(id) ? p.interests.filter(i => i !== id) : [...p.interests, id]
    }))
  }

  const addDestination = () => {
    if (destInput.trim() && !formData.destinations.includes(destInput.trim())) {
      setFormData(p => ({ ...p, destinations: [...p.destinations, destInput.trim()] }))
      setDestInput('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => navigate('/dashboard'), 2000)
  }

  // Animation Variants
  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 })
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans pt-24">

      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 z-0">
        <img src={BG_IMAGE} className="w-full h-full object-cover scale-110 blur-sm" alt="bg" />
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40" />
      </div>

      {/* --- Main Glass Card --- */}
      <div className="relative z-10 w-full max-w-5xl h-[80vh] mx-4 flex flex-col md:flex-row bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden">

        {/* LEFT NAV PANEL (30%) */}
        <div className="w-full md:w-1/3 bg-white/5 border-r border-white/10 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="bg-gradient-to-br from-[#E59B2C]/20 to-purple-500/20 absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-10 text-white">
              <Sparkles className="w-6 h-6 text-[#E59B2C]" />
              <span className="font-bold tracking-widest uppercase">SerandibGO</span>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`flex items-center gap-4 transition-all duration-300 ${step === s ? 'translate-x-2 opacity-100' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${step === s ? 'bg-[#E59B2C] border-[#E59B2C] text-white shadow-[0_0_20px_rgba(229,155,44,0.4)]' : 'border-white/30 text-white'}`}>
                    {s < step ? <Check className="w-5 h-5" /> : <span className="font-bold">{s}</span>}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm tracking-wide uppercase">
                      {s === 1 && "Start"}
                      {s === 2 && "Vibe"}
                      {s === 3 && "Details"}
                      {s === 4 && "Finish"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-white/50 text-xs leading-relaxed mt-8">
            "Travel is the only thing you buy that makes you richer."
          </div>
        </div>

        {/* RIGHT CONTENT PANEL (70%) */}
        <div className="flex-1 relative p-8 md:p-16 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden" onClick={() => setActiveCalendar(null)}>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="flex-1 flex flex-col"
              onClick={(e) => e.stopPropagation()} // Prevent closing calendar when clicking form area
            >

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-8 my-auto">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Where to?</h1>
                    <p className="text-white/60 text-lg">Start building your Sri Lankan bucket list.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      <input
                        value={destInput}
                        onChange={e => setDestInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addDestination()}
                        placeholder="e.g. Ella, Kandy, Mirissa..."
                        className="w-full bg-white/5 border border-white/20 rounded-2xl p-5 text-xl text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-[#E59B2C] transition-all"
                      />
                      <button onClick={addDestination} className="absolute right-3 top-3 p-2 bg-[#E59B2C] rounded-xl text-white hover:bg-[#d48b25] transition-colors"><ArrowRight className="w-5 h-5" /></button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {formData.destinations.map(d => (
                        <span key={d} className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white flex items-center gap-2 text-sm font-medium animate-in fade-in zoom-in">
                          {d} <button onClick={() => updateData('destinations', formData.destinations.filter(x => x !== d))} className="hover:text-[#E59B2C] transition-colors">x</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="relative bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                      <label className="text-xs uppercase text-[#E59B2C] font-bold tracking-wider mb-2 block">Start Date</label>
                      <div
                        onClick={(e) => { e.stopPropagation(); setActiveCalendar(activeCalendar === 'start' ? null : 'start') }}
                        className="flex items-center justify-between cursor-pointer py-1"
                      >
                        <span className={`text-lg font-medium ${formData.startDate ? 'text-white' : 'text-white/30'}`}>
                          {formData.startDate || 'Select Date'}
                        </span>
                        <Calendar className="w-5 h-5 text-[#E59B2C]" />
                      </div>
                      <AnimatePresence>
                        {activeCalendar === 'start' && (
                          <GlassCalendar
                            value={formData.startDate}
                            onChange={(date) => updateData('startDate', date)}
                            onClose={() => setActiveCalendar(null)}
                            minDate={new Date().toISOString().split('T')[0]}
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* End Date */}
                    <div className="relative bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                      <label className="text-xs uppercase text-[#E59B2C] font-bold tracking-wider mb-2 block">End Date</label>
                      <div
                        onClick={(e) => { e.stopPropagation(); setActiveCalendar(activeCalendar === 'end' ? null : 'end') }}
                        className="flex items-center justify-between cursor-pointer py-1"
                      >
                        <span className={`text-lg font-medium ${formData.endDate ? 'text-white' : 'text-white/30'}`}>
                          {formData.endDate || 'Select Date'}
                        </span>
                        <Calendar className="w-5 h-5 text-[#E59B2C]" />
                      </div>
                      <AnimatePresence>
                        {activeCalendar === 'end' && (
                          <GlassCalendar
                            value={formData.endDate}
                            onChange={(date) => updateData('endDate', date)}
                            onClose={() => setActiveCalendar(null)}
                            minDate={formData.startDate || new Date().toISOString().split('T')[0]}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase text-[#E59B2C] font-bold tracking-wider block">Travel Party</label>
                      <div className="flex items-center gap-6 text-white">
                        <button onClick={() => updateData('travelers', Math.max(1, formData.travelers - 1))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#E59B2C] hover:text-black transition-colors flex items-center justify-center font-bold text-xl">-</button>
                        <span className="text-2xl font-bold min-w-[30px] text-center">{formData.travelers}</span>
                        <button onClick={() => updateData('travelers', formData.travelers + 1)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#E59B2C] hover:text-black transition-colors flex items-center justify-center font-bold text-xl">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-8 my-auto">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Your Style?</h1>
                    <p className="text-white/60 text-lg">Select what sparks your interest.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {INTERESTS.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleInterest(item.id)}
                        className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${formData.interests.includes(item.id)
                          ? 'bg-[#E59B2C] border-[#E59B2C] text-white shadow-[0_0_30px_rgba(229,155,44,0.4)] transform -translate-y-1'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/30 hover:text-white'
                          }`}
                      >
                        <item.icon className="w-8 h-8" />
                        <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4">
                    <label className="text-sm text-white/80 font-bold mb-4 block">Budget Preference</label>
                    <div className="flex gap-4">
                      {BUDGET_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => updateData('budget', opt.value)}
                          className={`flex-1 py-4 rounded-xl border font-bold transition-all ${formData.budget === opt.value
                            ? `${opt.border} bg-white/10 text-white ${opt.glow}`
                            : 'border-white/10 bg-transparent text-white/40 hover:bg-white/5'
                            }`}
                        >
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-8 my-auto">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Extras?</h1>
                    <p className="text-white/60 text-lg">Tell us about special requests or needs.</p>
                  </div>

                  <textarea
                    className="w-full h-40 bg-white/5 border border-white/20 rounded-2xl p-6 text-lg text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-[#E59B2C] resize-none transition-all"
                    placeholder="Honeymoon setup, wheelchair access, vegetarian meals..."
                    value={formData.specialRequests}
                    onChange={e => updateData('specialRequests', e.target.value)}
                  />

                  <div className="flex gap-4 p-4 bg-[#E59B2C]/10 border border-[#E59B2C]/20 rounded-2xl">
                    <Shield className="w-8 h-8 text-[#E59B2C] shrink-0" />
                    <div>
                      <h4 className="text-[#E59B2C] font-bold mb-1">Human Touch Promise</h4>
                      <p className="text-white/60 text-sm">Every trip is personally reviewed by our team to ensure it meets our high standards.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-8 my-auto">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Almost There</h1>
                    <p className="text-white/60 text-lg">Where should we send your plan?</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      placeholder="Full Name"
                      value={formData.contact.name}
                      onChange={e => setFormData(p => ({ ...p, contact: { ...p.contact, name: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/20 p-5 rounded-2xl text-white placeholder-white/30 focus:border-[#E59B2C] focus:bg-white/10 focus:outline-none transition-all"
                    />
                    <input
                      placeholder="Email Address"
                      value={formData.contact.email}
                      onChange={e => setFormData(p => ({ ...p, contact: { ...p.contact, email: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/20 p-5 rounded-2xl text-white placeholder-white/30 focus:border-[#E59B2C] focus:bg-white/10 focus:outline-none transition-all"
                    />
                    <input
                      placeholder="Phone Number"
                      value={formData.contact.phone}
                      onChange={e => setFormData(p => ({ ...p, contact: { ...p.contact, phone: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/20 p-5 rounded-2xl text-white placeholder-white/30 focus:border-[#E59B2C] focus:bg-white/10 focus:outline-none transition-all"
                    />
                  </div>

                  {isSubmitting && <div className="text-[#E59B2C] animate-pulse text-center">Designing your journey...</div>}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ACTIONS */}
          <div className="mt-8 flex justify-between items-center pt-8 border-t border-white/10">
            <button
              onClick={() => paginate(step - 1)}
              disabled={step === 1 || isSubmitting}
              className={`text-white/60 font-bold hover:text-white transition-colors flex items-center gap-2 ${step === 1 ? 'opacity-0' : 'opacity-100'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={() => step === 4 ? handleSubmit() : paginate(step + 1)}
              className="bg-[#E59B2C] text-black px-10 py-4 rounded-full font-bold hover:bg-white hover:scale-105 transition-all shadow-lg shadow-[#E59B2C]/20 flex items-center gap-2"
            >
              {step === 4 ? "Send Request" : "Next Step"}
              {step < 4 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default CustomTrip
