// Sample User Data for White Caves Real Estate Database

const sampleUsers = [
  {
    userId: "AGT001",
    email: "ahmed.almansouri@whitecaves.ae",
    name: {
      firstName: "Ahmed",
      lastName: "Al-Mansouri"
    },
    role: "agent",
    phone: {
      countryCode: "+971",
      number: "50-123-4567"
    },
    profile: {
      photo: "https://example.com/profiles/agent001.jpg",
      bio: "Experienced real estate agent specializing in luxury properties in Dubai Marina and JBR.",
      nationality: "UAE",
      language: ["Arabic", "English"]
    },
    agentDetails: {
      licenseNumber: "BRN-12345",
      company: "White Caves Real Estate LLC",
      specialization: ["residential", "luxury"],
      rating: 4.8,
      completedDeals: 47
    },
    preferences: {},
    savedProperties: [],
    createdAt: "2023-06-15T08:00:00Z",
    updatedAt: "2024-02-01T10:30:00Z",
    isActive: true
  },
  {
    userId: "AGT002",
    email: "sarah.johnson@whitecaves.ae",
    name: {
      firstName: "Sarah",
      lastName: "Johnson"
    },
    role: "agent",
    phone: {
      countryCode: "+971",
      number: "55-987-6543"
    },
    profile: {
      photo: "https://example.com/profiles/agent002.jpg",
      bio: "Specialist in villa rentals and sales across Dubai's premium communities.",
      nationality: "UK",
      language: ["English", "French"]
    },
    agentDetails: {
      licenseNumber: "BRN-23456",
      company: "White Caves Real Estate LLC",
      specialization: ["residential", "leasing"],
      rating: 4.9,
      completedDeals: 62
    },
    preferences: {},
    savedProperties: [],
    createdAt: "2023-08-20T09:00:00Z",
    updatedAt: "2024-02-05T14:20:00Z",
    isActive: true
  },
  {
    userId: "BUY001",
    email: "john.smith@email.com",
    name: {
      firstName: "John",
      lastName: "Smith"
    },
    role: "buyer",
    phone: {
      countryCode: "+971",
      number: "56-111-2222"
    },
    profile: {
      photo: "https://example.com/profiles/buyer001.jpg",
      bio: "",
      nationality: "USA",
      language: ["English"]
    },
    preferences: {
      propertyTypes: ["apartment", "penthouse"],
      locations: ["Dubai Marina", "Downtown Dubai", "Palm Jumeirah"],
      priceRange: {
        min: 1500000,
        max: 3000000
      }
    },
    savedProperties: ["PROP001"],
    createdAt: "2024-01-10T12:00:00Z",
    updatedAt: "2024-01-25T16:45:00Z",
    isActive: true
  },
  {
    userId: "TNT001",
    email: "maria.garcia@email.com",
    name: {
      firstName: "Maria",
      lastName: "Garcia"
    },
    role: "tenant",
    phone: {
      countryCode: "+971",
      number: "58-333-4444"
    },
    profile: {
      photo: "",
      bio: "",
      nationality: "Spain",
      language: ["Spanish", "English"]
    },
    preferences: {
      propertyTypes: ["villa", "townhouse"],
      locations: ["Arabian Ranches", "The Springs", "The Meadows"],
      priceRange: {
        min: 120000,
        max: 200000
      }
    },
    savedProperties: ["PROP002"],
    createdAt: "2024-01-18T10:30:00Z",
    updatedAt: "2024-01-28T11:15:00Z",
    isActive: true
  },
  {
    userId: "ADM001",
    email: "admin@whitecaves.ae",
    name: {
      firstName: "Admin",
      lastName: "User"
    },
    role: "admin",
    phone: {
      countryCode: "+971",
      number: "50-000-0000"
    },
    profile: {
      photo: "",
      bio: "System Administrator",
      nationality: "UAE",
      language: ["Arabic", "English"]
    },
    preferences: {},
    savedProperties: [],
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
    isActive: true
  }
];

module.exports = sampleUsers;
