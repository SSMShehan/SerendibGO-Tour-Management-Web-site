import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Star,
  Search,
  Filter,
  X,
  Wifi,
  Coffee,
  Car,
  Utensils,
  Wind,
  Waves,
  ArrowUpRight,
  Building,
  Palmtree,
  Mountain
} from 'lucide-react'
import { hotelAPI } from '../services/hotels/hotelService'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence, LayoutGroup, useMotionTemplate, useMotionValue } from 'framer-motion'

// --- Constants ---
const AMENITIES_LIST = ['All', 'Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Beach Access']
const LOCATIONS_LIST = ['All', 'Colombo', 'Kandy', 'Galle', 'Sigiriya', 'Ella', 'Nuwara Eliya']

const DEMO_HOTELS = [
  {
    id: 1,
    name: "The Kingsbury Colombo",
    location: "Colombo",
    rating: 4.8,
    reviews: 1240,
    price: 45000,
    image: null,
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym"],
    description: "Experience luxury living in the heart of the city with breathtaking ocean views.",
    featured: true
  },
  {
    id: 2,
    name: "Heritance Kandalama",
    location: "Sigiriya",
    rating: 4.9,
    reviews: 850,
    price: 65000,
    image: null,
    amenities: ["Free WiFi", "Pool", "Spa", "Eco-Friendly"],
    description: "An architectural masterpiece woven into the natural landscape.",
    featured: true
  },
  {
    id: 3,
    name: "Amangalla",
    location: "Galle",
    rating: 4.7,
    reviews: 500,
    price: 85000,
    image: null,
    amenities: ["Free WiFi", "Spa", "History", "Restaurant"],
    description: "Colonial charm meets modern luxury inside the historic Galle Fort.",
    featured: true
  },
  {
    id: 4,
    name: "98 Acres Resort",
    location: "Ella",
    rating: 4.9,
    reviews: 2100,
    price: 55000,
    image: null,
    amenities: ["Free WiFi", "Pool", "Spa", "Mountain View"],
    description: "Scenic resort surrounded by tea plantations and misty mountains.",
    featured: true
  }
]

// --- Shared Components (Duplicated for independence) ---

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

// Filter Dock Component
const FilterDock = ({
  searchTerm, setSearchTerm,
  selectedAmenity, setSelectedAmenity,
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
          placeholder="Search hotels, resorts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm font-medium ml-2"
        />
      </div>

      <div className="flex-[2] flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden mask-gradient-x py-1">
        {AMENITIES_LIST.map(amenity => (
          <button
            key={amenity}
            onClick={() => setSelectedAmenity(amenity)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedAmenity === amenity
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            {amenity}
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

const Hotels = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // State
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedAmenity, setSelectedAmenity] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch Hotels
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true)
      try {
        const response = await hotelAPI.getHotels()
        if (response && response.length > 0) {
          setHotels(response)
        } else {
          setHotels(DEMO_HOTELS)
        }
      } catch (err) {
        console.error('Error fetching hotels:', err)
        setHotels(DEMO_HOTELS)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  // Filtering
  const filteredHotels = hotels.filter(hotel => {
    const matchSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchLoc = selectedLocation === 'All' || hotel.location.includes(selectedLocation)
    const matchAmenity = selectedAmenity === 'All' || (hotel.amenities && hotel.amenities.some(a => a.toLowerCase().includes(selectedAmenity.toLowerCase())))
    return matchSearch && matchLoc && matchAmenity
  })

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32">

      {/* --- Massive Typographic Hero (Pointer Events None) --- */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center bg-slate-900 pointer-events-none">
        <img
          src="/glassmorphism-bg-5.jpg"
          alt="Hotels Hero"
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
              LUXURY<br />STAYS
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/80 font-mono text-sm md:text-base tracking-[0.3em] uppercase">
              <span>Comfort</span>
              <span className="w-1 h-1 bg-[#E59B2C] rounded-full"></span>
              <span>Class</span>
              <span className="w-1 h-1 bg-[#E59B2C] rounded-full"></span>
              <span>Culture</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 mt-4 relative z-20 pointer-events-auto">

        {/* --- Spotlight Collections Section --- */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-bold text-slate-800">Curated Collections</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SpotlightCard
              title="Boutique Villas"
              subtitle="Private & Exclusive"
              icon={Building}
              image="/glassmorphism-bg-1.jpg"
              delay={0}
            />
            <SpotlightCard
              title="Coastal Resorts"
              subtitle="Sun & Sand"
              icon={Palmtree}
              image="/glassmorphism-bg-2.jpg"
              delay={0.1}
            />
            <SpotlightCard
              title="Hill Country"
              subtitle="Mist & Mountains"
              icon={Mountain}
              image="/glassmorphism-bg-3.jpg"
              delay={0.2}
            />
          </div>
        </div>

        {/* Hotels Grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredHotels.map((hotel) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={hotel.id}
                >
                  <HolographicCard className="h-full flex flex-col p-4">
                    {/* Image */}
                    <div className="relative h-64 rounded-2xl overflow-hidden mb-6 group-hover:shadow-lg transition-all">
                      <img
                        src={hotel.image || '/glassmorphism-bg-4.jpg'}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                        {hotel.location}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{hotel.name}</h3>
                        <div className="flex items-center text-[#E59B2C] font-bold">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          {hotel.rating}
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm mb-6 line-clamp-2">{hotel.description}</p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {hotel.amenities && hotel.amenities.slice(0, 4).map((amenity, i) => (
                          <span key={i} className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-slate-100 flex items-center">
                            {amenity === "Pooling" ? <Waves className="w-3 h-3 mr-1" /> : <Star className="w-3 h-3 mr-1" />}
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Starting from</div>
                        <div className="text-xl font-bold text-slate-900">$ {hotel.price ? hotel.price.toLocaleString() : 'N/A'}</div>
                      </div>
                      <button
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-[#E59B2C] text-white rounded-xl font-bold transition-colors shadow-lg shadow-slate-900/20 hover:shadow-orange-500/30 flex items-center gap-2"
                      >
                        Details <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                  </HolographicCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {filteredHotels.length === 0 && (
          <div className="text-center py-32">
            <Building className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400 font-medium">No hotels match your search.</h3>
            <button
              onClick={() => { setSearchTerm(''); setSelectedAmenity('All'); setSelectedLocation('All'); }}
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
        selectedAmenity={selectedAmenity}
        setSelectedAmenity={setSelectedAmenity}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
    </div>
  )
}

export default Hotels
