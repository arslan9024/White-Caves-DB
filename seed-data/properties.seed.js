// Sample Property Data for White Caves Real Estate Database

const sampleProperties = [
  {
    propertyId: "PROP001",
    title: "Luxury 3BR Apartment in Dubai Marina",
    description: "Stunning 3-bedroom apartment with breathtaking marina views. Features modern amenities, spacious living areas, and premium finishes throughout.",
    type: "apartment",
    status: "available",
    transactionType: "sale",
    location: {
      area: "Dubai Marina",
      city: "Dubai",
      address: "Marina Promenade, Building 5",
      building: "Marina Heights Tower",
      coordinates: {
        latitude: 25.0795,
        longitude: 55.1384
      }
    },
    price: {
      amount: 2500000,
      currency: "AED",
      paymentFrequency: "one-time"
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: {
        value: 2200,
        unit: "sqft"
      },
      parkingSpaces: 2,
      furnished: "furnished",
      floor: 25,
      totalFloors: 40
    },
    features: [
      "Swimming Pool",
      "Gym",
      "24/7 Security",
      "Covered Parking",
      "Sea View",
      "Balcony",
      "Built-in Wardrobes",
      "Central AC"
    ],
    images: [
      {
        url: "https://example.com/images/prop001-1.jpg",
        caption: "Living Room",
        isPrimary: true
      },
      {
        url: "https://example.com/images/prop001-2.jpg",
        caption: "Master Bedroom",
        isPrimary: false
      },
      {
        url: "https://example.com/images/prop001-3.jpg",
        caption: "Marina View",
        isPrimary: false
      }
    ],
    agent: {
      agentId: "AGT001",
      name: "Ahmed Al-Mansouri",
      contact: "+971-50-123-4567"
    },
    owner: {
      ownerId: "OWN001",
      name: "Property Owner LLC"
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    viewCount: 245
  },
  {
    propertyId: "PROP002",
    title: "Modern Villa in Arabian Ranches",
    description: "Beautiful 4-bedroom villa with private garden and pool. Located in the prestigious Arabian Ranches community.",
    type: "villa",
    status: "available",
    transactionType: "rent",
    location: {
      area: "Arabian Ranches",
      city: "Dubai",
      address: "Al Reem 2, Street 15",
      building: "Villa 42",
      coordinates: {
        latitude: 25.0548,
        longitude: 55.2708
      }
    },
    price: {
      amount: 180000,
      currency: "AED",
      paymentFrequency: "yearly"
    },
    specifications: {
      bedrooms: 4,
      bathrooms: 5,
      area: {
        value: 3500,
        unit: "sqft"
      },
      parkingSpaces: 3,
      furnished: "unfurnished",
      floor: 0,
      totalFloors: 2
    },
    features: [
      "Private Pool",
      "Private Garden",
      "Maid's Room",
      "Study Room",
      "Covered Parking",
      "Garage",
      "Community Amenities",
      "Kids Play Area"
    ],
    images: [
      {
        url: "https://example.com/images/prop002-1.jpg",
        caption: "Villa Exterior",
        isPrimary: true
      }
    ],
    agent: {
      agentId: "AGT002",
      name: "Sarah Johnson",
      contact: "+971-55-987-6543"
    },
    owner: {
      ownerId: "OWN002",
      name: "Villa Owner"
    },
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    viewCount: 89
  },
  {
    propertyId: "PROP003",
    title: "Prime Office Space in Business Bay",
    description: "State-of-the-art office space in the heart of Business Bay. Perfect for growing businesses.",
    type: "office",
    status: "available",
    transactionType: "rent",
    location: {
      area: "Business Bay",
      city: "Dubai",
      address: "Bay Avenue, Tower A",
      building: "Bay Business Plaza",
      coordinates: {
        latitude: 25.1867,
        longitude: 55.2636
      }
    },
    price: {
      amount: 15000,
      currency: "AED",
      paymentFrequency: "monthly"
    },
    specifications: {
      bedrooms: 0,
      bathrooms: 2,
      area: {
        value: 1500,
        unit: "sqft"
      },
      parkingSpaces: 3,
      furnished: "semi-furnished",
      floor: 12,
      totalFloors: 30
    },
    features: [
      "Reception Area",
      "Meeting Rooms",
      "Pantry",
      "High-Speed Internet",
      "Central AC",
      "Parking",
      "24/7 Access",
      "Security"
    ],
    images: [],
    agent: {
      agentId: "AGT003",
      name: "Mohammed Hassan",
      contact: "+971-52-555-1234"
    },
    owner: {
      ownerId: "OWN003",
      name: "Business Bay Holdings"
    },
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-01T09:00:00Z",
    viewCount: 156
  }
];

module.exports = sampleProperties;
