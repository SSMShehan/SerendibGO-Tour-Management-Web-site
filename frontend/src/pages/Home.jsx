import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Heart,
  Globe,
  Award
} from 'lucide-react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'

// --- 3D Tilt Card Component ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 500, damping: 30 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 30 })

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXFromCenter = e.clientX - rect.left - width / 2
    const mouseYFromCenter = e.clientY - rect.top - height / 2
    x.set(mouseXFromCenter / width)
    y.set(mouseYFromCenter / height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  )
}

const Home = () => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Explore Sri Lanka",
      description: "Discover breathtaking destinations across the Pearl of the Indian Ocean"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Booking",
      description: "Book your perfect tour with just a few clicks"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Guides",
      description: "Travel with knowledgeable local guides"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "Your safety and security are our top priorities"
    }
  ]

  const stats = [
    { number: "500+", label: "Tours Available" },
    { number: "10K+", label: "Happy Travelers" },
    { number: "50+", label: "Destinations" },
    { number: "4.9", label: "Average Rating" }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "Amazing experience! The guides were knowledgeable and the scenery was breathtaking. Highly recommended!"
    },
    {
      name: "Ahmed Hassan",
      location: "Dubai, UAE",
      rating: 5,
      text: "SerendibGo made our Sri Lankan adventure unforgettable. Everything was perfectly organized."
    },
    {
      name: "Maria Garcia",
      location: "Madrid, Spain",
      rating: 5,
      text: "The cultural tours were incredible. We learned so much about Sri Lankan history and traditions."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#E59B2C] selection:text-white overflow-hidden">

      {/* --- Dynamic Background Elements (Parallax) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          style={{ y: y1, x: -50 }}
          className="absolute top-20 left-10 w-96 h-96 bg-[#E59B2C]/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2, x: 50 }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover scale-105"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/homepage-background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Video Overlay - Cinematic Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-50"></div>
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-10">
          <motion.div
            style={{ opacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl sm:text-7xl lg:text-9xl font-bold mb-6 tracking-tighter drop-shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
            >
              <span className="text-white drop-shadow-lg block sm:inline">
                Discover
              </span>
              <span className="text-[#E59B2C] font-serif italic relative inline-block ml-4 drop-shadow-lg">
                <motion.span
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                >
                  Sri Lanka
                </motion.span>
                <motion.svg
                  className="absolute w-[110%] h-6 -bottom-2 -left-[5%] text-[#E59B2C]"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <path d="M0 10 Q 50 20, 100 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Experience the Pearl of the Indian Ocean with curated tours, expert guides, and luxury comfort.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link
                to="/tours"
                className="group relative px-8 py-4 bg-[#E59B2C] text-white text-lg font-bold rounded-full overflow-hidden shadow-[0_10px_20px_rgba(229,155,44,0.3)] transition-all hover:scale-105 active:scale-95 border border-[#E59B2C]"
              >
                <span className="relative z-10 flex items-center">
                  Explore Tours
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>

              <Link
                to="/custom-trip"
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg font-semibold rounded-full hover:bg-white/20 transition-all hover:scale-105 active:scale-95 flex items-center shadow-lg"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Plan Custom Trip
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1 backdrop-blur-sm bg-black/10">
            <div className="w-1.5 h-3 bg-white rounded-full animate-scroll"></div>
          </div>
        </motion.div>
      </section>

      {/* --- Stats Section with 3D Float --- */}
      <section className="relative -mt-24 z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-white/60 p-10 grid grid-cols-2 lg:grid-cols-4 gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center group relative overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[#E59B2C] mb-2 font-serif bg-clip-text text-transparent bg-gradient-to-br from-[#E59B2C] to-[#B87A1E]">
                  {stat.number}
                </div>
                <div className="text-slate-500 font-bold tracking-wide uppercase text-xs">
                  {stat.label}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* --- Features Section (Why Choose Us) --- */}
      <section className="py-24 relative overflow-visible z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#E59B2C] font-extrabold tracking-wider uppercase text-sm mb-4 block">Why Choose Us</span>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-serif">
              Experience the Extraordinary
            </h2>
            <motion.div
              className="w-24 h-1.5 bg-[#E59B2C] mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto font-light">
              We curate exceptional journeys that blend luxury, adventure, and authentic cultural immersion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TiltCard className="h-full bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 relative group overflow-hidden">
                  {/* Decorative circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-[#E59B2C]/5"></div>

                  <div className="relative z-10 transform-style-3d">
                    <div className="w-16 h-16 bg-[#E59B2C]/10 rounded-2xl flex items-center justify-center mb-6 text-[#E59B2C] group-hover:bg-[#E59B2C] group-hover:text-white transition-colors duration-300 shadow-sm translate-z-10">
                      {React.cloneElement(feature.icon, { className: "w-8 h-8" })}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif translate-z-5">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed translate-z-5">
                      {feature.description}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Featured Tours with 3D Tilt Cards --- */}
      <section className="py-24 relative bg-white/50 backdrop-blur-sm -skew-y-2 my-12">
        {/* Fix skew for content */}
        <div className="skew-y-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-left">
                <span className="text-[#E59B2C] font-extrabold tracking-wider uppercase text-sm mb-2 block">Featured Collections</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif">
                  Popular Tours
                </h2>
              </div>
              <Link to="/tours" className="group flex items-center text-slate-600 hover:text-[#E59B2C] transition-colors font-medium">
                View All Tours
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((tour, idx) => (
                <motion.div
                  key={tour}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <TiltCard className="group h-full bg-white rounded-3xl overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col">
                    <div className="h-80 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                      <div className="w-full h-full bg-slate-200 transform group-hover:scale-110 transition-transform duration-700 flex items-center justify-center">
                        <MapPin className="w-16 h-16 text-slate-300" />
                      </div>

                      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center translate-z-20">
                        <Star className="w-4 h-4 text-[#E59B2C] fill-current mr-1" />
                        <span className="text-slate-900 font-bold text-sm">4.9</span>
                      </div>

                      <div className="absolute bottom-6 left-6 z-20 translate-z-10">
                        <span className="px-3 py-1 bg-[#E59B2C] text-white text-xs font-bold rounded-lg uppercase tracking-wider mb-2 inline-block shadow-md">Bestseller</span>
                        <h3 className="text-2xl font-bold text-white mb-1 font-serif group-hover:text-[#E59B2C] transition-colors">
                          Sri Lanka Explorer {tour}
                        </h3>
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col relative z-20 bg-white">
                      <div className="flex items-center text-slate-500 mb-6 text-sm font-medium">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>7 Days</span>
                        <span className="mx-3 text-slate-300">•</span>
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>5 Destinations</span>
                      </div>

                      <p className="text-slate-600 mb-8 line-clamp-2 leading-relaxed flex-1">
                        Experience the beauty of Sri Lanka with this incredible tour package, featuring ancient temples, tea plantations, and pristine beaches.
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Starting from</span>
                          <span className="text-2xl font-bold text-[#E59B2C]">$850</span>
                        </div>
                        <Link to="/tours" className="px-6 py-3 bg-slate-50 hover:bg-[#E59B2C] text-slate-900 hover:text-white rounded-xl transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-md transform hover:-translate-y-1">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">
              Traveler Stories
            </h2>
            <div className="w-24 h-1.5 bg-[#E59B2C] mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-10 rounded-[2rem] relative mt-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-50"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-6 left-8">
                  <div className="w-14 h-14 bg-[#E59B2C] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E59B2C]/30 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                    <span className="text-5xl text-white font-serif leading-none mt-4">"</span>
                  </div>
                </div>

                <div className="pt-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#E59B2C] fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-8 italic leading-relaxed text-lg font-light">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center border-t border-slate-100 pt-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-xl font-bold text-gray-500">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg font-serif">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-[#E59B2C] font-medium flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/bg1.png" alt="Background" className="w-full h-full object-cover grayscale opacity-20" />
          <div className="absolute inset-0 bg-[#272C2F]/90 mix-blend-multiply"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 font-serif">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied travelers who have discovered the magic of Sri Lanka with SerendibGo.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="px-12 py-5 bg-[#E59B2C] hover:bg-[#d48c25] text-white text-lg font-bold rounded-full shadow-[0_10px_30px_rgba(229,155,44,0.4)] hover:shadow-[0_20px_50px_rgba(229,155,44,0.5)] transition-all transform hover:scale-105 active:scale-95"
              >
                Get Started Now
              </Link>
              <Link
                to="/contact"
                className="px-12 py-5 bg-transparent border border-white/30 text-white text-lg font-bold rounded-full hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
