const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import all models
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Vehicle = require('../models/Vehicle');
const CustomTrip = require('../models/CustomTrip');
const Notification = require('../models/Notification');
const Hotel = require('../models/hotels/Hotel');
const HotelBooking = require('../models/hotels/HotelBooking');
const HotelReview = require('../models/hotels/HotelReview');
const Room = require('../models/hotels/Room');
const Driver = require('../models/vehicles/Driver');
const VehicleBooking = require('../models/vehicles/VehicleBooking');

// Set fallback MongoDB URI if not defined (same as server.js)
if (!process.env.MONGODB_URI) {
    console.warn('⚠️  WARNING: MONGODB_URI is not set! Using fallback...');
    process.env.MONGODB_URI = 'mongodb+srv://admin:admin123@serandibgo.izvdsyx.mongodb.net/serendibgo?retryWrites=true&w=majority';
}

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
        console.log('   Database:', mongoose.connection.name);
        console.log('   Host:', mongoose.connection.host);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample data arrays
const sampleUsers = async () => {
    const users = [
        // Tourists
        {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            password: 'password123',
            phone: '+1-555-0101',
            role: 'tourist',
            status: 'active',
            isVerified: true,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
            firstName: 'Emma',
            lastName: 'Johnson',
            email: 'emma.johnson@example.com',
            password: 'password123',
            phone: '+1-555-0102',
            role: 'tourist',
            status: 'active',
            isVerified: true,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
        },
        {
            firstName: 'Michael',
            lastName: 'Brown',
            email: 'michael.brown@example.com',
            password: 'password123',
            phone: '+1-555-0103',
            role: 'tourist',
            status: 'active',
            isVerified: true
        },
        // Guides
        {
            firstName: 'Nimal',
            lastName: 'Perera',
            email: 'nimal.perera@guide.com',
            password: 'password123',
            phone: '+94-77-1234567',
            role: 'guide',
            status: 'active',
            isVerified: true,
            profile: {
                guideLicense: 'GL-2020-001',
                languages: ['English', 'Sinhala', 'Tamil'],
                experience: 8,
                specialties: ['Cultural Tours', 'Wildlife', 'Historical Sites'],
                location: 'Colombo',
                pricePerDay: 75,
                bio: 'Experienced tour guide with deep knowledge of Sri Lankan culture and history.',
                certifications: ['Licensed Tour Guide', 'First Aid Certified'],
                responseTime: 'Within 2 hours',
                highlights: ['8+ years experience', 'Multilingual', 'Cultural expert'],
                availability: 'Available',
                workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            rating: 4.8
        },
        {
            firstName: 'Saman',
            lastName: 'Silva',
            email: 'saman.silva@guide.com',
            password: 'password123',
            phone: '+94-77-2345678',
            role: 'guide',
            status: 'active',
            isVerified: true,
            profile: {
                guideLicense: 'GL-2019-002',
                languages: ['English', 'Sinhala', 'German'],
                experience: 10,
                specialties: ['Adventure Tours', 'Nature', 'Hiking'],
                location: 'Kandy',
                pricePerDay: 85,
                bio: 'Adventure specialist with extensive knowledge of Sri Lankan wildlife and nature.',
                certifications: ['Licensed Tour Guide', 'Wildlife Expert', 'Mountain Guide'],
                responseTime: 'Within 1 hour',
                highlights: ['10+ years experience', 'Adventure specialist', 'Wildlife expert'],
                availability: 'Available',
                workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            },
            rating: 4.9
        },
        {
            firstName: 'Kamala',
            lastName: 'Fernando',
            email: 'kamala.fernando@guide.com',
            password: 'password123',
            phone: '+94-77-3456789',
            role: 'guide',
            status: 'active',
            isVerified: true,
            profile: {
                guideLicense: 'GL-2021-003',
                languages: ['English', 'Sinhala', 'French'],
                experience: 5,
                specialties: ['Beach Tours', 'Culinary', 'Photography'],
                location: 'Galle',
                pricePerDay: 65,
                bio: 'Passionate about showcasing Sri Lankan cuisine and coastal beauty.',
                certifications: ['Licensed Tour Guide', 'Culinary Expert'],
                responseTime: 'Within 3 hours',
                highlights: ['5+ years experience', 'Food tours specialist', 'Photography guide'],
                availability: 'Available',
                workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            rating: 4.7
        },
        // Drivers
        {
            firstName: 'Ravi',
            lastName: 'Jayawardena',
            email: 'ravi.driver@example.com',
            password: 'password123',
            phone: '+94-77-4567890',
            role: 'driver',
            status: 'active',
            isVerified: true,
            profile: {
                driverLicense: 'DL-2015-001',
                vehicleTypes: ['Car', 'Van'],
                licenseNumber: 'B1234567'
            }
        },
        {
            firstName: 'Sunil',
            lastName: 'Bandara',
            email: 'sunil.driver@example.com',
            password: 'password123',
            phone: '+94-77-5678901',
            role: 'driver',
            status: 'active',
            isVerified: true,
            profile: {
                driverLicense: 'DL-2016-002',
                vehicleTypes: ['Bus', 'Minibus'],
                licenseNumber: 'B2345678'
            }
        },
        // Hotel Owners
        {
            firstName: 'Priya',
            lastName: 'Wickramasinghe',
            email: 'priya.hotel@example.com',
            password: 'password123',
            phone: '+94-77-6789012',
            role: 'hotel_owner',
            status: 'active',
            isVerified: true,
            profile: {
                hotelName: 'Paradise Beach Resort',
                hotelAddress: '123 Beach Road, Bentota',
                hotelLicense: 'HL-2018-001'
            }
        },
        {
            firstName: 'Ajith',
            lastName: 'Rajapaksa',
            email: 'ajith.hotel@example.com',
            password: 'password123',
            phone: '+94-77-7890123',
            role: 'hotel_owner',
            status: 'active',
            isVerified: true,
            profile: {
                hotelName: 'Hill Country Retreat',
                hotelAddress: '456 Mountain View, Nuwara Eliya',
                hotelLicense: 'HL-2019-002'
            }
        },
        // Admin
        {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@serendibgo.com',
            password: 'admin123',
            phone: '+94-77-8901234',
            role: 'admin',
            status: 'active',
            isVerified: true
        },
        // Staff
        {
            firstName: 'Sarah',
            lastName: 'De Silva',
            email: 'sarah.staff@serendibgo.com',
            password: 'password123',
            phone: '+94-77-9012345',
            role: 'staff',
            status: 'active',
            isVerified: true,
            profile: {
                staffId: 'STF-001',
                department: 'operations',
                position: 'Operations Manager',
                hireDate: new Date('2023-01-15'),
                salary: 75000,
                permissions: [
                    { module: 'bookings', actions: ['read', 'write', 'approve'] },
                    { module: 'vehicles', actions: ['read', 'write'] },
                    { module: 'hotels', actions: ['read', 'write'] }
                ]
            }
        }
    ];

    return users;
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Tour.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        await Vehicle.deleteMany({});
        await CustomTrip.deleteMany({});
        await Notification.deleteMany({});
        await Hotel.deleteMany({});
        await HotelBooking.deleteMany({});
        await HotelReview.deleteMany({});
        await Room.deleteMany({});
        await Driver.deleteMany({});
        await VehicleBooking.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // 1. Seed Users
        console.log('👥 Seeding users...');
        const usersData = await sampleUsers();
        const users = await User.create(usersData);
        console.log(`✅ Created ${users.length} users\n`);

        // Get specific users for references
        const tourists = users.filter(u => u.role === 'tourist');
        const guides = users.filter(u => u.role === 'guide');
        const drivers = users.filter(u => u.role === 'driver');
        const hotelOwners = users.filter(u => u.role === 'hotel_owner');
        const admin = users.find(u => u.role === 'admin');

        // 2. Seed Tours
        console.log('🗺️  Seeding tours...');
        const tours = await Tour.create([
            {
                title: 'Ancient Cities Cultural Tour',
                description: 'Explore the magnificent ancient cities of Sri Lanka including Anuradhapura, Polonnaruwa, and Sigiriya. This 5-day journey takes you through UNESCO World Heritage Sites, ancient temples, and historical monuments that showcase the rich cultural heritage of Sri Lanka.',
                shortDescription: 'Discover Sri Lanka\'s ancient kingdoms and UNESCO heritage sites',
                images: [
                    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', alt: 'Sigiriya Rock', isPrimary: true },
                    { url: 'https://images.unsplash.com/photo-1588417786026-c3a2f4b5e8b3?w=800', alt: 'Ancient Temple' }
                ],
                duration: 5,
                price: 450,
                originalPrice: 550,
                maxParticipants: 15,
                minParticipants: 2,
                category: 'cultural',
                difficulty: 'easy',
                location: {
                    name: 'Sigiriya',
                    coordinates: [7.9570, 80.7603],
                    address: 'Sigiriya, Central Province',
                    city: 'Sigiriya',
                    district: 'Matale'
                },
                itinerary: [
                    {
                        day: 1,
                        title: 'Arrival and Sigiriya Rock Fortress',
                        activities: ['Climb Sigiriya Rock', 'Visit frescoes', 'Explore water gardens'],
                        accommodation: 'Sigiriya Hotel',
                        meals: ['Dinner'],
                        highlights: ['UNESCO World Heritage Site', 'Ancient frescoes', 'Panoramic views']
                    },
                    {
                        day: 2,
                        title: 'Polonnaruwa Ancient City',
                        activities: ['Explore ancient ruins', 'Visit Gal Vihara', 'Cycle tour'],
                        accommodation: 'Polonnaruwa Hotel',
                        meals: ['Breakfast', 'Lunch', 'Dinner'],
                        highlights: ['Ancient capital', 'Buddhist temples', 'Royal palace ruins']
                    }
                ],
                included: ['Professional guide', 'Transportation', 'Accommodation', 'Entrance fees', 'Breakfast'],
                excluded: ['International flights', 'Travel insurance', 'Personal expenses', 'Lunch and dinner'],
                highlights: ['UNESCO World Heritage Sites', 'Ancient rock fortress', 'Buddhist temples', 'Cultural experiences'],
                requirements: ['Moderate fitness level', 'Comfortable walking shoes', 'Sun protection'],
                guide: guides[0]._id,
                isActive: true,
                isFeatured: true,
                rating: { average: 4.8, count: 24 },
                tags: ['cultural', 'history', 'UNESCO', 'temples'],
                seasonality: {
                    bestMonths: ['December', 'January', 'February', 'March', 'April'],
                    avoidMonths: ['October', 'November']
                },
                cancellationPolicy: 'moderate'
            },
            {
                title: 'Wildlife Safari Adventure',
                description: 'Experience the incredible wildlife of Sri Lanka with visits to Yala National Park and Udawalawe National Park. Spot leopards, elephants, sloth bears, and hundreds of bird species in their natural habitat.',
                shortDescription: 'Safari adventure through Sri Lanka\'s premier wildlife parks',
                images: [
                    { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', alt: 'Leopard', isPrimary: true },
                    { url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800', alt: 'Elephants' }
                ],
                duration: 3,
                price: 320,
                originalPrice: 380,
                maxParticipants: 12,
                minParticipants: 2,
                category: 'wildlife',
                difficulty: 'easy',
                location: {
                    name: 'Yala National Park',
                    coordinates: [6.3725, 81.5185],
                    address: 'Yala, Southern Province',
                    city: 'Tissamaharama',
                    district: 'Hambantota'
                },
                itinerary: [
                    {
                        day: 1,
                        title: 'Yala National Park Safari',
                        activities: ['Morning safari', 'Afternoon safari', 'Wildlife photography'],
                        accommodation: 'Yala Safari Lodge',
                        meals: ['Breakfast', 'Lunch', 'Dinner'],
                        highlights: ['Leopard sightings', 'Elephant herds', 'Bird watching']
                    }
                ],
                included: ['Safari jeep', 'Professional guide', 'Park entrance fees', 'Accommodation', 'All meals'],
                excluded: ['Personal expenses', 'Tips', 'Travel insurance'],
                highlights: ['Leopard sightings', 'Elephant herds', 'Bird watching', 'Nature photography'],
                requirements: ['Early morning starts', 'Camera recommended', 'Binoculars helpful'],
                guide: guides[1]._id,
                isActive: true,
                isFeatured: true,
                rating: { average: 4.9, count: 18 },
                tags: ['wildlife', 'safari', 'nature', 'photography'],
                seasonality: {
                    bestMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August'],
                    avoidMonths: ['September', 'October']
                },
                cancellationPolicy: 'moderate'
            },
            {
                title: 'Beach Paradise Tour',
                description: 'Relax on pristine beaches, enjoy water sports, and explore coastal towns. Visit Mirissa, Unawatuna, and Galle Fort while enjoying the best of Sri Lanka\'s southern coast.',
                shortDescription: 'Coastal adventure along Sri Lanka\'s beautiful southern beaches',
                images: [
                    { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', alt: 'Beach', isPrimary: true }
                ],
                duration: 4,
                price: 280,
                maxParticipants: 20,
                category: 'beach',
                difficulty: 'easy',
                location: {
                    name: 'Mirissa',
                    coordinates: [5.9467, 80.4692],
                    address: 'Mirissa, Southern Province',
                    city: 'Mirissa',
                    district: 'Matara'
                },
                included: ['Accommodation', 'Breakfast', 'Transportation', 'Guide'],
                excluded: ['Lunch', 'Dinner', 'Water sports activities'],
                highlights: ['Whale watching', 'Beach relaxation', 'Galle Fort', 'Surfing'],
                guide: guides[2]._id,
                isActive: true,
                rating: { average: 4.7, count: 31 },
                tags: ['beach', 'relaxation', 'water sports', 'coastal']
            }
        ]);
        console.log(`✅ Created ${tours.length} tours\n`);

        // 3. Seed Vehicles
        console.log('🚗 Seeding vehicles...');
        const vehicles = await Vehicle.create([
            {
                name: 'Toyota Hiace Van',
                description: 'Comfortable 12-seater van perfect for group tours',
                vehicleType: 'Van',
                make: 'Toyota',
                model: 'Hiace',
                year: 2020,
                licensePlate: 'CAR-1234',
                capacity: { passengers: 12, luggage: 8 },
                features: {
                    airConditioning: true,
                    wifi: true,
                    gps: true,
                    musicSystem: true,
                    chargingPorts: true
                },
                pricing: {
                    dailyRate: 85,
                    hourlyRate: 12,
                    fuelIncluded: true,
                    driverIncluded: true
                },
                driver: drivers[0]._id,
                location: {
                    city: 'Colombo',
                    district: 'Colombo',
                    coordinates: { latitude: 6.9271, longitude: 79.8612 }
                },
                images: [
                    { url: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800', caption: 'Toyota Hiace', isPrimary: true }
                ],
                insurance: {
                    policyNumber: 'INS-2024-001',
                    expiryDate: new Date('2025-12-31'),
                    coverage: 'comprehensive'
                },
                registration: {
                    number: 'REG-2020-001',
                    expiryDate: new Date('2025-06-30')
                },
                status: 'available',
                ratings: { overall: 4.7, cleanliness: 4.8, comfort: 4.6, driver: 4.9, value: 4.5 },
                reviewCount: 23,
                featured: true
            },
            {
                name: 'Mercedes Sprinter',
                description: 'Luxury minibus for premium tours',
                vehicleType: 'Minibus',
                make: 'Mercedes',
                model: 'Sprinter',
                year: 2021,
                licensePlate: 'CAR-5678',
                capacity: { passengers: 16, luggage: 12 },
                features: {
                    airConditioning: true,
                    wifi: true,
                    gps: true,
                    musicSystem: true,
                    chargingPorts: true,
                    wheelchairAccessible: true
                },
                pricing: {
                    dailyRate: 120,
                    hourlyRate: 18,
                    fuelIncluded: true,
                    driverIncluded: true
                },
                driver: drivers[1]._id,
                location: {
                    city: 'Kandy',
                    district: 'Kandy',
                    coordinates: { latitude: 7.2906, longitude: 80.6337 }
                },
                images: [
                    { url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800', caption: 'Mercedes Sprinter', isPrimary: true }
                ],
                insurance: {
                    policyNumber: 'INS-2024-002',
                    expiryDate: new Date('2025-12-31'),
                    coverage: 'full-coverage'
                },
                registration: {
                    number: 'REG-2021-002',
                    expiryDate: new Date('2025-08-31')
                },
                status: 'available',
                ratings: { overall: 4.9, cleanliness: 5.0, comfort: 4.9, driver: 4.8, value: 4.7 },
                reviewCount: 15,
                featured: true
            },
            {
                name: 'Toyota Corolla',
                description: 'Comfortable sedan for small groups',
                vehicleType: 'Car',
                make: 'Toyota',
                model: 'Corolla',
                year: 2022,
                licensePlate: 'CAR-9012',
                capacity: { passengers: 4, luggage: 3 },
                features: {
                    airConditioning: true,
                    gps: true,
                    musicSystem: true,
                    chargingPorts: true
                },
                pricing: {
                    dailyRate: 55,
                    hourlyRate: 8,
                    fuelIncluded: false,
                    driverIncluded: true
                },
                driver: drivers[0]._id,
                location: {
                    city: 'Galle',
                    district: 'Galle',
                    coordinates: { latitude: 6.0535, longitude: 80.2210 }
                },
                images: [
                    { url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', caption: 'Toyota Corolla', isPrimary: true }
                ],
                insurance: {
                    policyNumber: 'INS-2024-003',
                    expiryDate: new Date('2025-12-31'),
                    coverage: 'comprehensive'
                },
                registration: {
                    number: 'REG-2022-003',
                    expiryDate: new Date('2025-10-31')
                },
                status: 'available',
                ratings: { overall: 4.6, cleanliness: 4.7, comfort: 4.5, driver: 4.8, value: 4.6 },
                reviewCount: 12
            }
        ]);
        console.log(`✅ Created ${vehicles.length} vehicles\n`);

        // 4. Seed Hotels
        console.log('🏨 Seeding hotels...');
        const hotels = await Hotel.create([
            {
                name: 'Paradise Beach Resort',
                description: 'Luxury beachfront resort with stunning ocean views, world-class amenities, and exceptional service. Perfect for relaxation and water sports.',
                shortDescription: 'Luxury beachfront resort with ocean views',
                location: {
                    address: '123 Beach Road, Bentota',
                    city: 'Bentota',
                    district: 'Galle',
                    coordinates: { latitude: 6.4260, longitude: 79.9957 },
                    area: 'Beach'
                },
                contact: {
                    phone: '+94-34-2275176',
                    email: 'info@paradisebeach.lk',
                    website: 'www.paradisebeach.lk'
                },
                owner: hotelOwners[0]._id,
                category: 'Beach Resort',
                starRating: 5,
                amenities: {
                    wifi: true,
                    airConditioning: true,
                    hotWater: true,
                    parking: true,
                    restaurant: true,
                    bar: true,
                    pool: true,
                    gym: true,
                    spa: true,
                    airportPickup: true,
                    tourBooking: true,
                    laundryService: true,
                    englishSpeakingStaff: true,
                    ayurveda: true,
                    localCuisine: true
                },
                images: [
                    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', caption: 'Resort View', isPrimary: true, category: 'exterior' },
                    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', caption: 'Pool Area', category: 'pool' }
                ],
                roomTypes: [
                    {
                        name: 'Deluxe Ocean View',
                        description: 'Spacious room with panoramic ocean views',
                        maxOccupancy: 2,
                        bedTypes: ['King'],
                        size: 35,
                        amenities: ['Ocean view', 'Balcony', 'Mini bar', 'Safe'],
                        basePrice: 150,
                        availability: 10
                    },
                    {
                        name: 'Family Suite',
                        description: 'Large suite perfect for families',
                        maxOccupancy: 4,
                        bedTypes: ['King', 'Twin'],
                        size: 50,
                        amenities: ['Ocean view', 'Living area', 'Kitchenette', 'Balcony'],
                        basePrice: 250,
                        availability: 5
                    }
                ],
                policies: {
                    checkInTime: '14:00',
                    checkOutTime: '12:00',
                    cancellationPolicy: 'Free cancellation',
                    petPolicy: 'Pets not allowed',
                    smokingPolicy: 'Non-smoking'
                },
                touristInfo: {
                    nearbyAttractions: [
                        { name: 'Bentota Beach', distance: 0.5, type: 'Beach' },
                        { name: 'Brief Garden', distance: 5, type: 'Museum' }
                    ],
                    transportation: {
                        airportDistance: 65,
                        trainStationDistance: 2,
                        tukTukAvailable: true,
                        carRentalAvailable: true
                    }
                },
                status: 'approved',
                approvalDate: new Date('2024-01-15'),
                ratings: { overall: 4.8, cleanliness: 4.9, location: 4.7, service: 4.8, value: 4.6, amenities: 4.9 },
                reviewCount: 127,
                featured: true
            },
            {
                name: 'Hill Country Retreat',
                description: 'Charming boutique hotel nestled in the misty hills of Nuwara Eliya. Experience colonial elegance, tea plantation tours, and cool mountain air.',
                shortDescription: 'Boutique hotel in the scenic hill country',
                location: {
                    address: '456 Mountain View, Nuwara Eliya',
                    city: 'Nuwara Eliya',
                    district: 'Nuwara Eliya',
                    coordinates: { latitude: 6.9497, longitude: 80.7891 },
                    area: 'Hill Country'
                },
                contact: {
                    phone: '+94-52-2222345',
                    email: 'info@hillcountry.lk',
                    website: 'www.hillcountry.lk'
                },
                owner: hotelOwners[1]._id,
                category: 'Hill Station Hotel',
                starRating: 4,
                amenities: {
                    wifi: true,
                    airConditioning: false,
                    hotWater: true,
                    parking: true,
                    restaurant: true,
                    bar: true,
                    gym: false,
                    spa: true,
                    airportPickup: true,
                    tourBooking: true,
                    laundryService: true,
                    englishSpeakingStaff: true,
                    plantationTour: true,
                    localCuisine: true,
                    heritageExperience: true
                },
                images: [
                    { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', caption: 'Hotel Exterior', isPrimary: true, category: 'exterior' }
                ],
                roomTypes: [
                    {
                        name: 'Colonial Room',
                        description: 'Classic room with colonial-era charm',
                        maxOccupancy: 2,
                        bedTypes: ['Queen'],
                        size: 28,
                        amenities: ['Mountain view', 'Fireplace', 'Tea/Coffee maker'],
                        basePrice: 95,
                        availability: 8
                    },
                    {
                        name: 'Premium Suite',
                        description: 'Luxurious suite with panoramic views',
                        maxOccupancy: 3,
                        bedTypes: ['King'],
                        size: 45,
                        amenities: ['Mountain view', 'Living area', 'Fireplace', 'Balcony'],
                        basePrice: 180,
                        availability: 4
                    }
                ],
                policies: {
                    checkInTime: '14:00',
                    checkOutTime: '11:00',
                    cancellationPolicy: '48 hours',
                    petPolicy: 'Pets not allowed',
                    smokingPolicy: 'Designated smoking areas'
                },
                touristInfo: {
                    nearbyAttractions: [
                        { name: 'Gregory Lake', distance: 2, type: 'Beach' },
                        { name: 'Pedro Tea Estate', distance: 8, type: 'Museum' },
                        { name: 'Horton Plains', distance: 32, type: 'National Park' }
                    ],
                    transportation: {
                        airportDistance: 180,
                        trainStationDistance: 3,
                        busStationDistance: 2,
                        tukTukAvailable: true
                    }
                },
                status: 'approved',
                approvalDate: new Date('2024-02-20'),
                ratings: { overall: 4.6, cleanliness: 4.7, location: 4.8, service: 4.5, value: 4.4, amenities: 4.3 },
                reviewCount: 89,
                featured: true
            }
        ]);
        console.log(`✅ Created ${hotels.length} hotels\n`);

        // 5. Seed Bookings
        console.log('📅 Seeding bookings...');
        const bookings = await Booking.create([
            {
                user: tourists[0]._id,
                tour: tours[0]._id,
                guide: guides[0]._id,
                bookingDate: new Date('2024-11-15'),
                startDate: new Date('2025-01-10'),
                endDate: new Date('2025-01-15'),
                duration: 'multi-day',
                groupSize: 2,
                totalAmount: 900,
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentMethod: 'card',
                amountPaid: 900,
                paymentDate: new Date('2024-11-15'),
                bookingReference: 'BK-2024-001'
            },
            {
                user: tourists[1]._id,
                tour: tours[1]._id,
                guide: guides[1]._id,
                bookingDate: new Date('2024-11-20'),
                startDate: new Date('2025-02-05'),
                endDate: new Date('2025-02-08'),
                duration: 'multi-day',
                groupSize: 3,
                totalAmount: 960,
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentMethod: 'card',
                amountPaid: 960,
                paymentDate: new Date('2024-11-20'),
                bookingReference: 'BK-2024-002'
            },
            {
                user: tourists[2]._id,
                tour: tours[2]._id,
                guide: guides[2]._id,
                bookingDate: new Date('2024-12-01'),
                startDate: new Date('2025-03-15'),
                endDate: new Date('2025-03-19'),
                duration: 'multi-day',
                groupSize: 2,
                totalAmount: 560,
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: 'card',
                bookingReference: 'BK-2024-003'
            }
        ]);
        console.log(`✅ Created ${bookings.length} bookings\n`);

        // 6. Seed Reviews
        console.log('⭐ Seeding reviews...');
        const reviews = await Review.create([
            {
                user: tourists[0]._id,
                tour: tours[0]._id,
                guide: guides[0]._id,
                booking: bookings[0]._id,
                rating: 5,
                comment: 'Amazing tour! Nimal was an excellent guide with deep knowledge of Sri Lankan history. The ancient sites were breathtaking and the organization was perfect.',
                isVerified: true,
                helpful: 12,
                notHelpful: 1
            },
            {
                user: tourists[1]._id,
                tour: tours[1]._id,
                guide: guides[1]._id,
                booking: bookings[1]._id,
                rating: 5,
                comment: 'Incredible wildlife experience! We saw leopards, elephants, and so many birds. Saman was fantastic and knew exactly where to find the animals. Highly recommended!',
                isVerified: true,
                helpful: 18,
                notHelpful: 0
            }
        ]);
        console.log(`✅ Created ${reviews.length} reviews\n`);

        // 7. Seed Custom Trips
        console.log('✈️  Seeding custom trips...');
        const customTrips = await CustomTrip.create([
            {
                customer: tourists[0]._id,
                customerName: 'John Smith',
                customerEmail: 'john.smith@example.com',
                customerPhone: '+1-555-0101',
                requestDetails: {
                    destination: 'Multiple Cities',
                    destinations: ['Colombo', 'Kandy', 'Ella', 'Galle'],
                    startDate: new Date('2025-04-01'),
                    endDate: new Date('2025-04-10'),
                    duration: 9,
                    groupSize: 4,
                    budget: '$3000-$4000',
                    budgetAmount: 3500,
                    interests: ['culture', 'nature', 'food'],
                    activities: [
                        { id: 'temple-visit', label: 'Temple Visits', price: 50 },
                        { id: 'tea-plantation', label: 'Tea Plantation Tour', price: 75 }
                    ],
                    accommodation: 'mid-range',
                    transport: ['private-car', 'train'],
                    specialRequests: 'Would like to experience authentic Sri Lankan cuisine and visit tea plantations',
                    contactInfo: {
                        name: 'John Smith',
                        email: 'john.smith@example.com',
                        phone: '+1-555-0101'
                    }
                },
                status: 'pending',
                priority: 'high'
            },
            {
                customer: tourists[2]._id,
                customerName: 'Michael Brown',
                customerEmail: 'michael.brown@example.com',
                customerPhone: '+1-555-0103',
                requestDetails: {
                    destination: 'Ella',
                    startDate: new Date('2025-05-15'),
                    endDate: new Date('2025-05-20'),
                    duration: 5,
                    groupSize: 2,
                    budget: '$1500-$2000',
                    budgetAmount: 1750,
                    interests: ['nature', 'adventure', 'photography'],
                    accommodation: 'luxury',
                    transport: ['private-car'],
                    specialRequests: 'Interested in hiking and photography opportunities',
                    contactInfo: {
                        name: 'Michael Brown',
                        email: 'michael.brown@example.com',
                        phone: '+1-555-0103'
                    }
                },
                status: 'under_review',
                priority: 'medium'
            }
        ]);
        console.log(`✅ Created ${customTrips.length} custom trips\n`);

        // 8. Seed Notifications
        console.log('🔔 Seeding notifications...');
        const notifications = await Notification.create([
            {
                user: tourists[0]._id,
                type: 'booking',
                title: 'Booking Confirmed',
                message: 'Your booking for Ancient Cities Cultural Tour has been confirmed!',
                priority: 'high',
                booking: bookings[0]._id,
                guide: guides[0]._id,
                actionUrl: '/bookings/' + bookings[0]._id,
                actionText: 'View Booking'
            },
            {
                user: guides[0]._id,
                type: 'booking',
                title: 'New Booking Received',
                message: 'You have a new booking for Ancient Cities Cultural Tour',
                priority: 'high',
                booking: bookings[0]._id,
                tourist: tourists[0]._id,
                actionUrl: '/guide/bookings/' + bookings[0]._id
            },
            {
                user: tourists[1]._id,
                type: 'payment',
                title: 'Payment Successful',
                message: 'Your payment of $960 has been processed successfully',
                priority: 'medium',
                booking: bookings[1]._id,
                actionUrl: '/bookings/' + bookings[1]._id
            }
        ]);
        console.log(`✅ Created ${notifications.length} notifications\n`);

        // 9. Seed Drivers
        console.log('🚗 Seeding driver profiles...');
        const driverProfiles = await Driver.create([
            {
                user: drivers[0]._id,
                driverId: 'DRV-2024-001',
                status: 'active',
                personalInfo: {
                    dateOfBirth: new Date('1985-05-15'),
                    gender: 'male',
                    nationality: 'Sri Lankan',
                    emergencyContact: {
                        name: 'Kumari Jayawardena',
                        relationship: 'Spouse',
                        phone: '+94-77-1111111',
                        email: 'kumari@example.com'
                    }
                },
                license: {
                    licenseNumber: 'B1234567',
                    licenseType: 'B',
                    issueDate: new Date('2015-03-20'),
                    expiryDate: new Date('2026-03-20'),
                    issuingAuthority: 'Department of Motor Traffic',
                    licenseClass: 'Light Vehicle'
                },
                vehicleTypes: [
                    { vehicleType: 'van', experience: 8, isPreferred: true },
                    { vehicleType: 'sedan', experience: 10, isPreferred: false }
                ],
                availability: [
                    { dayOfWeek: 'Monday', startTime: '06:00', endTime: '20:00', isAvailable: true },
                    { dayOfWeek: 'Tuesday', startTime: '06:00', endTime: '20:00', isAvailable: true },
                    { dayOfWeek: 'Wednesday', startTime: '06:00', endTime: '20:00', isAvailable: true },
                    { dayOfWeek: 'Thursday', startTime: '06:00', endTime: '20:00', isAvailable: true },
                    { dayOfWeek: 'Friday', startTime: '06:00', endTime: '20:00', isAvailable: true },
                    { dayOfWeek: 'Saturday', startTime: '07:00', endTime: '18:00', isAvailable: true }
                ],
                serviceAreas: [
                    { city: 'Colombo', district: 'Colombo', radius: 100, isActive: true },
                    { city: 'Kandy', district: 'Kandy', radius: 50, isActive: true }
                ],
                currentLocation: {
                    latitude: 6.9271,
                    longitude: 79.8612,
                    address: 'Colombo, Sri Lanka',
                    lastUpdated: new Date(),
                    isOnline: true
                },
                performance: {
                    totalTrips: 156,
                    completedTrips: 152,
                    cancelledTrips: 4,
                    averageRating: 4.8,
                    totalRating: 730,
                    ratingCount: 152,
                    onTimePercentage: 96,
                    customerComplaints: 2,
                    safetyIncidents: 0
                },
                financial: {
                    baseRate: 50,
                    currency: 'USD',
                    commissionRate: 20,
                    paymentMethod: 'bank_transfer',
                    bankDetails: {
                        accountNumber: '1234567890',
                        bankName: 'Bank of Ceylon',
                        branchName: 'Colombo Main',
                        accountHolderName: 'Ravi Jayawardena'
                    },
                    totalEarnings: 7800,
                    pendingPayout: 450
                },
                verification: {
                    identityVerified: true,
                    licenseVerified: true,
                    backgroundCheckPassed: true,
                    insuranceVerified: true,
                    vehicleVerified: true,
                    verificationDate: new Date('2024-01-10')
                },
                preferences: {
                    maxTripDistance: 250,
                    maxTripDuration: 10,
                    preferredTripTypes: ['multi_city', 'city_tour', 'airport_transfer'],
                    workingHours: {
                        startTime: '06:00',
                        endTime: '20:00',
                        timeZone: 'Asia/Colombo'
                    },
                    languages: ['English', 'Sinhala'],
                    specialSkills: ['Tour guide knowledge', 'First aid certified']
                }
            },
            {
                user: drivers[1]._id,
                driverId: 'DRV-2024-002',
                status: 'active',
                personalInfo: {
                    dateOfBirth: new Date('1980-08-22'),
                    gender: 'male',
                    nationality: 'Sri Lankan',
                    emergencyContact: {
                        name: 'Nimal Bandara',
                        relationship: 'Brother',
                        phone: '+94-77-2222222'
                    }
                },
                license: {
                    licenseNumber: 'B2345678',
                    licenseType: 'D',
                    issueDate: new Date('2016-06-15'),
                    expiryDate: new Date('2027-06-15'),
                    issuingAuthority: 'Department of Motor Traffic',
                    licenseClass: 'Heavy Vehicle'
                },
                vehicleTypes: [
                    { vehicleType: 'bus', experience: 7, isPreferred: true },
                    { vehicleType: 'minivan', experience: 8, isPreferred: true }
                ],
                availability: [
                    { dayOfWeek: 'Monday', startTime: '05:00', endTime: '22:00', isAvailable: true },
                    { dayOfWeek: 'Tuesday', startTime: '05:00', endTime: '22:00', isAvailable: true },
                    { dayOfWeek: 'Wednesday', startTime: '05:00', endTime: '22:00', isAvailable: true },
                    { dayOfWeek: 'Thursday', startTime: '05:00', endTime: '22:00', isAvailable: true },
                    { dayOfWeek: 'Friday', startTime: '05:00', endTime: '22:00', isAvailable: true }
                ],
                serviceAreas: [
                    { city: 'Kandy', district: 'Kandy', radius: 150, isActive: true },
                    { city: 'Nuwara Eliya', district: 'Nuwara Eliya', radius: 80, isActive: true }
                ],
                currentLocation: {
                    latitude: 7.2906,
                    longitude: 80.6337,
                    address: 'Kandy, Sri Lanka',
                    lastUpdated: new Date(),
                    isOnline: true
                },
                performance: {
                    totalTrips: 98,
                    completedTrips: 96,
                    cancelledTrips: 2,
                    averageRating: 4.9,
                    totalRating: 470,
                    ratingCount: 96,
                    onTimePercentage: 98,
                    customerComplaints: 1,
                    safetyIncidents: 0
                },
                financial: {
                    baseRate: 65,
                    currency: 'USD',
                    commissionRate: 20,
                    paymentMethod: 'bank_transfer',
                    bankDetails: {
                        accountNumber: '9876543210',
                        bankName: 'Commercial Bank',
                        branchName: 'Kandy',
                        accountHolderName: 'Sunil Bandara'
                    },
                    totalEarnings: 6370,
                    pendingPayout: 325
                },
                verification: {
                    identityVerified: true,
                    licenseVerified: true,
                    backgroundCheckPassed: true,
                    insuranceVerified: true,
                    vehicleVerified: true,
                    verificationDate: new Date('2024-02-05')
                },
                preferences: {
                    maxTripDistance: 300,
                    maxTripDuration: 12,
                    preferredTripTypes: ['multi_city', 'round_trip'],
                    workingHours: {
                        startTime: '05:00',
                        endTime: '22:00',
                        timeZone: 'Asia/Colombo'
                    },
                    languages: ['English', 'Sinhala', 'Tamil'],
                    specialSkills: ['Mountain driving', 'Long distance tours']
                }
            }
        ]);
        console.log(`✅ Created ${driverProfiles.length} driver profiles\n`);

        // 10. Seed Vehicle Bookings
        console.log('🚙 Seeding vehicle bookings...');
        const vehicleBookings = await VehicleBooking.create([
            {
                bookingReference: 'VB-2025-001',
                vehicle: vehicles[0]._id,
                user: tourists[0]._id,
                tripDetails: {
                    pickupLocation: {
                        address: 'Bandaranaike International Airport',
                        city: 'Colombo',
                        district: 'Gampaha',
                        coordinates: { latitude: 7.1807, longitude: 79.8842 }
                    },
                    dropoffLocation: {
                        address: 'Sigiriya Hotel',
                        city: 'Sigiriya',
                        district: 'Matale',
                        coordinates: { latitude: 7.9570, longitude: 80.7603 }
                    },
                    startDate: new Date('2025-01-10'),
                    endDate: new Date('2025-01-15'),
                    startTime: '09:00',
                    endTime: '18:00',
                    duration: 120, // 5 days * 24 hours
                    distance: 180
                },
                passengers: {
                    adults: 2,
                    children: 0,
                    infants: 0
                },
                guestDetails: {
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john.smith@example.com',
                    phone: '+1-555-0101',
                    nationality: 'American'
                },
                specialRequests: 'Please ensure vehicle is clean and well-maintained',
                pricing: {
                    basePrice: 350,
                    distancePrice: 50,
                    durationPrice: 0,
                    taxes: 20,
                    serviceCharge: 5,
                    totalPrice: 425,
                    currency: 'USD'
                },
                bookingStatus: 'confirmed',
                paymentStatus: 'paid',
                paymentDetails: {
                    method: 'card',
                    transactionId: 'TXN-2024-001',
                    paidAt: new Date('2024-11-15')
                },
                driver: {
                    assignedDriver: drivers[0]._id,
                    assignedAt: new Date('2024-11-16')
                }
            },
            {
                bookingReference: 'VB-2025-002',
                vehicle: vehicles[1]._id,
                user: tourists[1]._id,
                tripDetails: {
                    pickupLocation: {
                        address: 'Colombo City Hotel',
                        city: 'Colombo',
                        district: 'Colombo',
                        coordinates: { latitude: 6.9271, longitude: 79.8612 }
                    },
                    dropoffLocation: {
                        address: 'Yala Safari Lodge',
                        city: 'Tissamaharama',
                        district: 'Hambantota',
                        coordinates: { latitude: 6.2833, longitude: 81.2833 }
                    },
                    startDate: new Date('2025-02-05'),
                    endDate: new Date('2025-02-08'),
                    startTime: '07:00',
                    endTime: '19:00',
                    duration: 72, // 3 days * 24 hours
                    distance: 250
                },
                passengers: {
                    adults: 3,
                    children: 0,
                    infants: 0
                },
                guestDetails: {
                    firstName: 'Emma',
                    lastName: 'Johnson',
                    email: 'emma.johnson@example.com',
                    phone: '+1-555-0102',
                    nationality: 'American'
                },
                specialRequests: 'Need early morning pickup for safari',
                pricing: {
                    basePrice: 300,
                    distancePrice: 40,
                    durationPrice: 0,
                    taxes: 15,
                    serviceCharge: 5,
                    totalPrice: 360,
                    currency: 'USD'
                },
                bookingStatus: 'confirmed',
                paymentStatus: 'paid',
                paymentDetails: {
                    method: 'card',
                    transactionId: 'TXN-2024-002',
                    paidAt: new Date('2024-11-20')
                },
                driver: {
                    assignedDriver: drivers[1]._id,
                    assignedAt: new Date('2024-11-21')
                }
            }
        ]);
        console.log(`✅ Created ${vehicleBookings.length} vehicle bookings\n`);

        // 11. Seed Hotel Bookings (Skipped - requires complex Room model setup)
        /*
        console.log('🏨 Seeding hotel bookings...');

        // Create Room documents first (required by HotelBooking model)
        const rooms = await Room.create([
            {
                hotel: hotels[0]._id,
                roomNumber: '101',
                roomType: 'Deluxe Ocean View',
                floor: 1,
                status: 'available',
                basePrice: 150,
                maxOccupancy: 2,
                amenities: ['Ocean view', 'Balcony', 'Mini bar', 'Safe'],
                bedTypes: ['King']
            },
            {
                hotel: hotels[1]._id,
                roomNumber: '201',
                roomType: 'Colonial Room',
                floor: 2,
                status: 'available',
                basePrice: 95,
                maxOccupancy: 2,
                amenities: ['Mountain view', 'Fireplace', 'Tea/Coffee maker'],
                bedTypes: ['Queen']
            }
        ]);

        const hotelBookings = await HotelBooking.create([
            {
                bookingReference: 'HB-2025-001',
                hotel: hotels[0]._id,
                room: rooms[0]._id,
                user: tourists[0]._id,
                checkInDate: new Date('2025-01-10'),
                checkOutDate: new Date('2025-01-13'),
                numberOfRooms: 1,
                guests: {
                    adults: 2,
                    children: 0,
                    infants: 0
                },
                guestDetails: {
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john.smith@example.com',
                    phone: '+1-555-0101',
                    nationality: 'American'
                },
                pricing: {
                    basePrice: 450,
                    taxes: 45,
                    serviceCharge: 15,
                    totalPrice: 510,
                    currency: 'USD'
                },
                bookingStatus: 'confirmed',
                paymentStatus: 'paid',
                specialRequests: 'Late check-in requested'
            },
            {
                bookingReference: 'HB-2025-002',
                hotel: hotels[1]._id,
                room: rooms[1]._id,
                user: tourists[2]._id,
                checkInDate: new Date('2025-03-15'),
                checkOutDate: new Date('2025-03-18'),
                numberOfRooms: 1,
                guests: {
                    adults: 2,
                    children: 0,
                    infants: 0
                },
                guestDetails: {
                    firstName: 'Michael',
                    lastName: 'Brown',
                    email: 'michael.brown@example.com',
                    phone: '+1-555-0103',
                    nationality: 'American'
                },
                pricing: {
                    basePrice: 285,
                    taxes: 28,
                    serviceCharge: 10,
                    totalPrice: 323,
                    currency: 'USD'
                },
                bookingStatus: 'pending',
                paymentStatus: 'pending'
            }
        ]);
        console.log(`✅ Created ${hotelBookings.length} hotel bookings\n`);
        */
        console.log('⏭️  Skipping hotel bookings and reviews (requires complex Room setup)\n');

        // 12. Seed Hotel Reviews (Skipped - depends on hotel bookings)
        /*
        console.log('⭐ Seeding hotel reviews...');
        const hotelReviews = await HotelReview.create([
            {
                hotel: hotels[0]._id,
                booking: hotelBookings[0]._id,
                guest: tourists[0]._id,
                ratings: {
                    overall: 5,
                    cleanliness: 5,
                    location: 5,
                    service: 5,
                    value: 4,
                    amenities: 5
                },
                title: 'Perfect Beach Getaway',
                comment: 'Absolutely wonderful stay! The ocean view room was stunning, staff were incredibly friendly, and the beach access was perfect. The ayurveda spa was a highlight. Highly recommend!',
                pros: ['Beautiful location', 'Excellent service', 'Great amenities', 'Delicious food'],
                cons: ['Slightly expensive'],
                wouldRecommend: true,
                tripType: 'leisure',
                isVerified: true,
                helpful: 24,
                notHelpful: 1
            }
        ]);
        console.log(`✅ Created ${hotelReviews.length} hotel reviews\n`);
        */

        console.log('\n🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Tours: ${tours.length}`);
        console.log(`   - Vehicles: ${vehicles.length}`);
        console.log(`   - Hotels: ${hotels.length}`);
        console.log(`   - Bookings: ${bookings.length}`);
        console.log(`   - Reviews: ${reviews.length}`);
        console.log(`   - Custom Trips: ${customTrips.length}`);
        console.log(`   - Notifications: ${notifications.length}`);
        console.log(`   - Driver Profiles: ${driverProfiles.length}`);
        console.log(`   - Vehicle Bookings: ${vehicleBookings.length}`);
        // console.log(`   - Hotel Bookings: ${hotelBookings.length}`);
        // console.log(`   - Hotel Reviews: ${hotelReviews.length}\n`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};

// Run the seeder
const runSeeder = async () => {
    try {
        await connectDB();
        await seedDatabase();
        console.log('✅ Seeding process completed. Disconnecting...');
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
};

// Execute if run directly
if (require.main === module) {
    runSeeder();
}

module.exports = { seedDatabase, connectDB };
