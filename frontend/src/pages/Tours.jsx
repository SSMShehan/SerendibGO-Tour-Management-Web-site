import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Star,
  Search,
  Filter,
  X,
  Zap,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react'
import { useTour } from '../context/TourContext'
import api from '../services/api'
import { motion, AnimatePresence, LayoutGroup, useMotionTemplate, useMotionValue } from 'framer-motion'

// --- Demo Data (Fallback) ---
const DEMO_TOURS = [
  {
    _id: 'demo1',
    title: 'Ancient Sigiriya Expedition',
    shortDescription: 'Climb the Lion Rock and explore ancient ruins in this guided historical adventure.',
    price: 150,
    duration: 1,
    rating: { average: 4.8, count: 124 },
    category: 'Historical',
    location: { name: 'Sigiriya' },
    images: ['/glassmorphism-bg-1.jpg'],
    isFeatured: true
  },
  {
    _id: 'demo2',
    title: 'Ella Scenic Train & Hike',
    shortDescription: 'Experience the world-famous train ride and hike Little Adam\'s Peak.',
    price: 85,
    duration: 2,
    rating: { average: 4.9, count: 89 },
    category: 'Adventure',
    location: { name: 'Ella' },
    images: ['/glassmorphism-bg-2.jpg'],
    isFeatured: false
  },
  {
    _id: 'demo3',
    title: 'Yala Safari Adventure',
    shortDescription: 'Spot leopards and elephants in their natural habitat.',
    price: 220,
    duration: 1,
    rating: { average: 4.7, count: 210 },
    category: 'Wildlife',
    location: { name: 'Yala' },
    images: ['/glassmorphism-bg-3.jpg'],
    isFeatured: true
  },
  {
    _id: 'demo4',
    title: 'Mirissa Whale Watching',
    shortDescription: 'Set sail to observe blue whales in the Indian Ocean.',
    price: 120,
    duration: 1,
    rating: { average: 4.6, count: 150 },
    category: 'Nature',
    location: { name: 'Mirissa' },
    images: ['/glassmorphism-bg-4.jpg'],
    isFeatured: false
  }
]

// --- Spotlight Card ---
const SpotlightCard = ({ title, subtitle, image, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group pointer-events-auto"
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

    <div className="absolute bottom-0 left-0 p-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[#E59B2C] mb-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <Icon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{subtitle}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#E59B2C] transition-colors">{title}</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#E59B2C] transition-colors">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  </motion.div>
)

// --- Holographic Card ---
const HolographicCard = ({ children, className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(229, 155, 44, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
}

const Tours = () => {
  const {
    tours,
    isLoading,
    setTours,
    setLoading,
  } = useTour()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [displayTours, setDisplayTours] = useState([])

  const categories = ['All', 'Adventure', 'Cultural', 'Nature', 'Wildlife', 'Historical', 'Beach']

  // FIXED: Empty dependency array to prevent infinite loop
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await api.get('/tours')
        if (response.data.success && response.data.data.length > 0) {
          setTours(response.data.data)
        } else {
          setTours(DEMO_TOURS)
        }
      } catch (err) {
        setTours(DEMO_TOURS)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, []) // Run only once on mount

  useEffect(() => {
    let result = tours
    if (tours.length === 0) result = DEMO_TOURS

    result = result.filter(tour => {
      const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'All' || (tour.category && tour.category.toLowerCase() === activeCategory.toLowerCase())
      const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
    setDisplayTours(result)
  }, [tours, searchQuery, activeCategory, priceRange])


  // --- Floating Filter Dock ---
  const FilterDock = () => (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-2xl p-2 pl-4 flex items-center justify-between gap-3 w-full max-w-3xl ring-1 ring-black/5">

        <div className="flex items-center flex-1 min-w-[120px] border-r border-slate-200 pr-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm font-medium ml-2"
          />
        </div>

        <div className="flex-[2] flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden mask-gradient-x py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-2.5 rounded-xl transition-colors shrink-0 ${isFilterOpen ? 'bg-[#E59B2C] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          {isFilterOpen ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: -16, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-full mb-4 p-6 bg-white rounded-2xl shadow-xl border border-slate-100 w-72 pointer-events-auto"
          >
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              <Zap className="w-4 h-4 text-[#E59B2C] mr-2" />
              Price Range
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between text-base-content text-xs font-bold">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1] === 10000 ? '10k+' : priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#E59B2C]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32">
      {/* --- Hero Section with pointer-events-none to allow header clicks --- */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center bg-slate-900 pointer-events-none">
        <img
          src="/glassmorphism-bg-4.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-[#F8F9FA]"></div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter mb-4 drop-shadow-2xl">
              WANDER
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/80 font-mono text-sm md:text-base tracking-[0.3em] uppercase">
              <span>Explore</span>
              <span className="w-1 h-1 bg-[#E59B2C] rounded-full"></span>
              <span>Discover</span>
              <span className="w-1 h-1 bg-[#E59B2C] rounded-full"></span>
              <span>Experience</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 -mt-10 relative z-20 pointer-events-auto">

        {/* --- Spotlight Collections Section (with pointer-events-auto) --- */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-bold text-slate-800">Trending Collections</h3>
            <button className="text-[#E59B2C] font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SpotlightCard
              title="Coastal Bliss"
              subtitle="Relaxation"
              icon={Compass}
              image="/glassmorphism-bg-3.jpg"
              delay={0}
            />
            <SpotlightCard
              title="Ancient Wonders"
              subtitle="Heritage"
              icon={Award}
              image="/glassmorphism-bg-1.jpg"
              delay={0.1}
            />
            <SpotlightCard
              title="Wild Safaris"
              subtitle="Adventure"
              icon={TrendingUp}
              image="/glassmorphism-bg-2.jpg"
              delay={0.2}
            />
          </div>
        </div>

        {/* Tours Grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {displayTours.map((tour) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={tour._id}
                >
                  <Link to={`/tours/${tour._id}`}>
                    <HolographicCard className="h-full flex flex-col">
                      <div className="relative aspect-[4/5] m-2 rounded-2xl overflow-hidden bg-slate-100">
                        <img
                          src={tour.images?.[0]?.url || tour.images?.[0] || '/glassmorphism-bg-1.jpg'}
                          alt={tour.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => { e.target.src = '/glassmorphism-bg-1.jpg' }}
                        />
                        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                          {tour.duration} Days
                        </div>
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                          {tour.category}
                        </div>
                      </div>

                      <div className="p-5 pt-2 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold font-serif leading-tight group-hover:text-[#E59B2C] transition-colors line-clamp-2">
                            {tour.title}
                          </h3>
                          <div className="flex items-center text-[#E59B2C] text-xs font-bold bg-[#E59B2C]/5 px-2 py-1 rounded-lg">
                            <Star className="w-3 h-3 fill-current mr-1" />
                            {tour.rating?.average || 4.5}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                          {tour.shortDescription}
                        </p>

                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                          <div className="flex items-center text-slate-400 text-xs font-medium">
                            <MapPin className="w-3 h-3 mr-1" />
                            {tour.location?.name || 'Sri Lanka'}
                          </div>
                          <div className="text-slate-900 font-bold">
                            ${tour.price}
                          </div>
                        </div>
                      </div>
                    </HolographicCard>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {displayTours.length === 0 && (
          <div className="text-center py-32">
            <Compass className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400 font-medium">No results found.</h3>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); setPriceRange([0, 10000]); }}
              className="mt-4 text-[#E59B2C] font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <FilterDock />
    </div>
  )
}

export default Tours
