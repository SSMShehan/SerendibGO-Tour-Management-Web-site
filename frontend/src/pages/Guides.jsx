import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Star,
  Search,
  Filter,
  X,
  Zap,
  Globe,
  Award,
  Languages,
  BadgeCheck,
  Phone,
  Mail,
  ArrowUpRight,
  BookOpen,
  User,
  Shield,
  Briefcase
} from 'lucide-react'
import { guideService } from '../services/guideService'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence, LayoutGroup, useMotionTemplate, useMotionValue } from 'framer-motion'

// --- Constants ---
const SPECIALTIES_LIST = ['All', 'History', 'Culture', 'Wildlife', 'Architecture', 'Food', 'City Tours', 'Photography']
const LOCATIONS_LIST = ['All', 'Colombo', 'Kandy', 'Galle', 'Sigiriya', 'Ella']

const DEMO_GUIDES = [
  {
    id: 'g1',
    name: 'Kamal Perera',
    location: 'Kandy',
    specialties: ['History', 'Culture'],
    languages: ['English', 'German'],
    rating: 4.9,
    reviewCount: 128,
    price: 45,
    image: null,
    experience: '12 Years'
  },
  {
    id: 'g2',
    name: 'Sarah Jenkins',
    location: 'Galle',
    specialties: ['Architecture', 'Food'],
    languages: ['English', 'French'],
    rating: 4.8,
    reviewCount: 94,
    price: 55,
    image: null,
    experience: '8 Years'
  },
  {
    id: 'g3',
    name: 'Rajeev Kumar',
    location: 'Colombo',
    specialties: ['City Tours', 'Shopping'],
    languages: ['English', 'Hindi', 'Tamil'],
    rating: 4.7,
    reviewCount: 210,
    price: 40,
    image: null,
    experience: '15 Years'
  },
  {
    id: 'g4',
    name: 'Nimali Silva',
    location: 'Sigiriya',
    specialties: ['Wildlife', 'Photography'],
    languages: ['English', 'Japanese'],
    rating: 5.0,
    reviewCount: 56,
    price: 60,
    image: null,
    experience: '5 Years'
  }
]

// --- Shared Components ---

// Spotlight Card
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

// Holographic Card 
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

// Filter Dock Component (Moved Outside)
const FilterDock = ({
  searchTerm, setSearchTerm,
  selectedSpecialty, setSelectedSpecialty,
  isFilterOpen, setIsFilterOpen,
  selectedLocation, setSelectedLocation
}) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none"
  >
    <div className="pointer-events-auto bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-2xl p-2 pl-4 flex items-center justify-between gap-3 w-full max-w-3xl ring-1 ring-black/5">

      <div className="flex items-center flex-1 min-w-[200px] border-r border-slate-200 pr-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Find guides by name or language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm font-medium ml-2"
          autoFocus
        />
      </div>

      <div className="flex-[2] flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden mask-gradient-x py-1">
        {SPECIALTIES_LIST.map(spec => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedSpecialty === spec
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            {spec}
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
            <MapPin className="w-4 h-4 text-[#E59B2C] mr-2" />
            Filter by Location
          </h4>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS_LIST.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedLocation === loc
                  ? 'bg-[#E59B2C] border-[#E59B2C] text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#E59B2C]'
                  }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

const Guides = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  // State
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch Guides
  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true)
      try {
        const response = await guideService.getGuides({ limit: 50 })
        if (response.data && response.data.length > 0) {
          setGuides(response.data)
        } else {
          setGuides(DEMO_GUIDES)
        }
      } catch (err) {
        console.error('Error fetching guides:', err)
        setGuides(DEMO_GUIDES)
      } finally {
        setLoading(false)
      }
    }
    fetchGuides()
  }, [])

  // Filtering Logic
  const filteredGuides = guides.filter(guide => {
    const matchSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchLoc = selectedLocation === 'All' || guide.location.includes(selectedLocation)
    const matchSpec = selectedSpecialty === 'All' || guide.specialties.some(s => s === selectedSpecialty)
    return matchSearch && matchLoc && matchSpec
  })

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32">

      {/* --- Massive Typographic Hero (Pointer Events None) --- */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center bg-slate-900 pointer-events-none">
        <img
          src="/glassmorphism-bg-2.jpg"
          alt="Guides Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 via-80% to-white"></div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter mb-6 drop-shadow-2xl">
              MEET OUR<br />GUIDES
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/80 font-mono text-sm md:text-base tracking-[0.3em] uppercase">
              <span>Expert</span>
              <span className="w-1 h-1 bg-[#E59B2C] rounded-full"></span>
              <span>Local</span>
              <span className="w-1 h-1 bg-[#E59B2C] rounded-full"></span>
              <span>Trusted</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 mt-4 relative z-20 pointer-events-auto">

        {/* --- Spotlight Collections Section --- */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-bold text-slate-800">Specialized Experts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SpotlightCard
              title="Master Historians"
              subtitle="Culture & Heritage"
              icon={BookOpen}
              image="/glassmorphism-bg-1.jpg"
              delay={0}
            />
            <SpotlightCard
              title="Wildlife Rangers"
              subtitle="Nature & Safari"
              icon={Globe}
              image="/glassmorphism-bg-3.jpg"
              delay={0.1}
            />
            <SpotlightCard
              title="Local Insiders"
              subtitle="City & Food"
              icon={MapPin}
              image="/glassmorphism-bg-4.jpg"
              delay={0.2}
            />
          </div>
        </div>

        {/* Guides Grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredGuides.map((guide) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={guide.id}
                >
                  <HolographicCard className="h-full flex flex-col p-4">
                    {/* Avatar & Badge */}
                    <div className="relative mx-auto mb-6">
                      <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-[#E59B2C] to-[#B87A1E]">
                        <img
                          src={guide.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80'}
                          alt={guide.name}
                          className="w-full h-full rounded-full object-cover border-4 border-white"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-[#E59B2C] text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                        <BadgeCheck className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="text-center flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{guide.name}</h3>
                      <div className="flex items-center justify-center text-sm text-slate-500 mb-4">
                        <MapPin className="w-3 h-3 mr-1 text-[#E59B2C]" />
                        {guide.location}
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {guide.specialties.slice(0, 3).map((spec, i) => (
                          <span key={i} className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-slate-100">
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center text-[#E59B2C] font-bold text-lg">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            {guide.rating}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating</div>
                        </div>
                        <div className="text-center border-l border-slate-100">
                          <div className="text-slate-900 font-bold text-lg">
                            {guide.experience}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 mb-3">
                        <div className="text-xs font-bold text-slate-500">Daily Rate</div>
                        <div className="text-lg font-bold text-slate-900">${guide.price}</div>
                      </div>
                      <button
                        onClick={() => navigate(`/guides/${guide.id}`)}
                        className="w-full py-3 bg-slate-900 hover:bg-[#E59B2C] text-white rounded-xl font-bold transition-colors shadow-lg shadow-slate-900/20 hover:shadow-orange-500/30 flex items-center justify-center gap-2"
                      >
                        View Profile <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                  </HolographicCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {filteredGuides.length === 0 && (
          <div className="text-center py-32">
            <User className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400 font-medium">No guides match your search.</h3>
            <button
              onClick={() => { setSearchTerm(''); setSelectedSpecialty('All'); setSelectedLocation('All'); }}
              className="mt-4 text-[#E59B2C] font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <FilterDock
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
    </div>
  )
}

export default Guides
