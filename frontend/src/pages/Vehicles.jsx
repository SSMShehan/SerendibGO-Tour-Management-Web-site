import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Car,
  Search,
  Filter,
  X,
  Users,
  Fuel,
  Gauge,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Briefcase,
  MapPin,
  Star,
  Settings,
  Navigation
} from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence, LayoutGroup, useMotionTemplate, useMotionValue } from 'framer-motion'

// --- Constants ---
const VEHICLE_TYPES = ['All', 'Luxury', 'Sedan', 'SUV', 'Van', 'Bus', 'Off-Road']
const FEATURES_LIST = ['All', 'Air Conditioning', 'Bluetooth', 'GPS', 'Leather Seats', 'Sunroof', '4WD', 'Hybrid']

const DEMO_VEHICLES = [
  {
    _id: 'v1',
    name: "Range Rover Sport",
    vehicleType: "Luxury SUV",
    make: "Land Rover",
    model: "Sport HSE",
    pricing: { dailyRate: 45000, currency: 'USD' },
    capacity: { passengers: 5, luggage: 4 },
    fuelType: "Petrol",
    transmission: "Automatic",
    images: [{ url: "/glassmorphism-bg-3.jpg" }],
    features: { gps: true, bluetooth: true, airConditioning: true, leatherSeats: true },
    rating: 4.9,
    description: "The ultimate combination of performance and luxury for your journey.",
    isAvailable: true
  },
  {
    _id: 'v2',
    name: "Mercedes Benz E-Class",
    vehicleType: "Luxury Sedan",
    make: "Mercedes",
    model: "E300 AMG",
    pricing: { dailyRate: 35000, currency: 'USD' },
    capacity: { passengers: 4, luggage: 3 },
    fuelType: "Hybrid",
    transmission: "Automatic",
    images: [{ url: "/glassmorphism-bg-1.jpg" }],
    features: { gps: true, bluetooth: true, airConditioning: true, leatherSeats: true },
    rating: 4.8,
    description: "Sophisticated styling and top-tier comfort for executive travel.",
    isAvailable: true
  },
  {
    _id: 'v3',
    name: "Toyota Land Cruiser",
    vehicleType: "Off-Road SUV",
    make: "Toyota",
    model: "Prado",
    pricing: { dailyRate: 30000, currency: 'USD' },
    capacity: { passengers: 7, luggage: 5 },
    fuelType: "Diesel",
    transmission: "Automatic",
    images: [{ url: "/glassmorphism-bg-2.jpg" }],
    features: { gps: true, fourWheelDrive: true, airConditioning: true },
    rating: 4.9,
    description: "Conquer any terrain with confidence and reliability.",
    isAvailable: true
  },
  {
    _id: 'v4',
    name: "Toyota Hiace",
    vehicleType: "Luxury Van",
    make: "Toyota",
    model: "Super GL",
    pricing: { dailyRate: 20000, currency: 'USD' },
    capacity: { passengers: 10, luggage: 8 },
    fuelType: "Diesel",
    transmission: "Automatic",
    images: [{ url: "/glassmorphism-bg-4.jpg" }],
    features: { gps: true, airConditioning: true, bluetooth: true },
    rating: 4.7,
    description: "Perfect for group travel with ample space and comfort.",
    isAvailable: true
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
  selectedType, setSelectedType,
  isFilterOpen, setIsFilterOpen,
  selectedFeature, setSelectedFeature
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
          placeholder="Search vehicles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm font-medium ml-2"
        />
      </div>

      <div className="flex-[2] flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden mask-gradient-x py-1">
        {VEHICLE_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedType === type
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100'
              }`}
          >
            {type}
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
            <Settings className="w-4 h-4 text-[#E59B2C] mr-2" />
            Filter by Features
          </h4>
          <div className="flex flex-wrap gap-2">
            {FEATURES_LIST.map(feature => (
              <button
                key={feature}
                onClick={() => setSelectedFeature(feature)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedFeature === feature
                  ? 'bg-[#E59B2C] border-[#E59B2C] text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#E59B2C]'
                  }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

const Vehicles = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // State
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedFeature, setSelectedFeature] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch Vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        // Try main endpoint first
        try {
          const response = await api.get('/vehicles?status=available')
          if (response.data.data && response.data.data.length > 0) {
            setVehicles(response.data.data)
          } else {
            setVehicles(DEMO_VEHICLES)
          }
        } catch (mainError) {
          console.log('Main vehicles endpoint failed, using demo data', mainError.message)
          setVehicles(DEMO_VEHICLES)
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err)
        setVehicles(DEMO_VEHICLES)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  // Filtering Logic
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())

    // Type matching (broad matching for categories like "SUV" matching "Luxury SUV")
    const matchType = selectedType === 'All' ||
      vehicle.vehicleType?.toLowerCase().includes(selectedType.toLowerCase()) ||
      vehicle.type?.toLowerCase().includes(selectedType.toLowerCase())

    // Feature matching
    let matchFeature = true
    if (selectedFeature !== 'All') {
      // Convert feature name to proper key if needed, or check array
      const featureKey = selectedFeature.toLowerCase().replace(/\s/g, '')
      // Simple check if feature exists in features object keys or list
      if (vehicle.features) {
        matchFeature = Object.keys(vehicle.features).some(k => k.toLowerCase().includes(featureKey) && vehicle.features[k])
      }
    }

    return matchSearch && matchType && matchFeature
  })

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32">

      {/* --- Massive Typographic Hero (Pointer Events None) --- */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center bg-slate-900 pointer-events-none">
        <img
          src="/glassmorphism-bg-3.jpg"
          alt="Vehicles Hero"
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
              PREMIUM<br />FLEET
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/80 font-mono text-sm md:text-base tracking-[0.3em] uppercase">
              <span>Safety</span>
              <span className="w-1 h-1 bg-[#E59B2C] rounded-full"></span>
              <span>Comfort</span>
              <span className="w-1 h-1 bg-[#E59B2C] rounded-full"></span>
              <span>Style</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 mt-4 relative z-20 pointer-events-auto">

        {/* --- Spotlight Collections Section --- */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-bold text-slate-800">Browse by Category</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SpotlightCard
              title="Luxury Sedans"
              subtitle="Executive Travel"
              icon={Briefcase}
              image="/glassmorphism-bg-1.jpg"
              delay={0}
            />
            <SpotlightCard
              title="Adventure 4x4"
              subtitle="Off-Road Ready"
              icon={Navigation}
              image="/glassmorphism-bg-2.jpg"
              delay={0.1}
            />
            <SpotlightCard
              title="Group Travel"
              subtitle="Spacious Vans"
              icon={Users}
              image="/glassmorphism-bg-4.jpg"
              delay={0.2}
            />
          </div>
        </div>

        {/* Vehicles Grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={vehicle._id}
                >
                  <HolographicCard className="h-full flex flex-col p-4">
                    {/* Image */}
                    <div className="relative h-56 rounded-2xl overflow-hidden mb-6 group-hover:shadow-lg transition-all">
                      <img
                        src={(vehicle.images && (vehicle.images[0]?.url || vehicle.images[0]?.url)) || (vehicle.images && vehicle.images[0]) || '/glassmorphism-bg-3.jpg'}
                        alt={vehicle.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                        {vehicle.vehicleType}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 leading-tight">{vehicle.name}</h3>
                          <div className="text-sm text-slate-500 font-medium">{vehicle.make} {vehicle.model}</div>
                        </div>
                        <div className="flex items-center text-[#E59B2C] font-bold text-sm">
                          <Star className="w-3.5 h-3.5 fill-current mr-1" />
                          {vehicle.rating || '4.8'}
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm mb-6 line-clamp-2">{vehicle.description}</p>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Users className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {vehicle.capacity?.passengers || 4} Seats
                        </div>
                        <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Fuel className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {vehicle.fuelType}
                        </div>
                        <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Gauge className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {vehicle.transmission || 'Auto'}
                        </div>
                        <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <ShieldCheck className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          Insurance
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily Rate</div>
                        <div className="text-xl font-bold text-slate-900">
                          {vehicle.pricing?.currency || 'USD'} {vehicle.pricing?.dailyRate?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/vehicles/${vehicle._id}`)}
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

        {filteredVehicles.length === 0 && (
          <div className="text-center py-32">
            <Car className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400 font-medium">No vehicles match your search.</h3>
            <button
              onClick={() => { setSearchTerm(''); setSelectedType('All'); setSelectedFeature('All'); }}
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
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
      />
    </div>
  )
}

export default Vehicles
