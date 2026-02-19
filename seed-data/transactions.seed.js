// Sample Transaction Data for White Caves Real Estate Database

const sampleTransactions = [
  {
    transactionId: "TXN001",
    propertyId: "PROP001",
    type: "sale",
    status: "in-progress",
    buyer: {
      userId: "BUY001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+971-56-111-2222"
    },
    seller: {
      userId: "OWN001",
      name: "Property Owner LLC",
      email: "owner@company.ae",
      phone: "+971-50-999-8888"
    },
    agent: {
      agentId: "AGT001",
      name: "Ahmed Al-Mansouri",
      commission: {
        percentage: 2,
        amount: 50000
      }
    },
    financialDetails: {
      agreedPrice: 2500000,
      currency: "AED",
      deposit: 250000,
      paymentMethod: "bank-transfer",
      installments: [
        {
          amount: 250000,
          dueDate: "2024-02-01",
          isPaid: true
        },
        {
          amount: 1250000,
          dueDate: "2024-03-15",
          isPaid: false
        },
        {
          amount: 1000000,
          dueDate: "2024-04-30",
          isPaid: false
        }
      ]
    },
    documents: [
      {
        name: "Purchase Agreement",
        type: "contract",
        url: "https://example.com/docs/txn001-contract.pdf",
        uploadedAt: "2024-01-25T14:30:00Z"
      },
      {
        name: "Buyer Passport",
        type: "passport",
        url: "https://example.com/docs/txn001-passport.pdf",
        uploadedAt: "2024-01-25T15:00:00Z"
      },
      {
        name: "Buyer Emirates ID",
        type: "emirates-id",
        url: "https://example.com/docs/txn001-eid.pdf",
        uploadedAt: "2024-01-25T15:00:00Z"
      }
    ],
    timeline: [
      {
        stage: "Initial Inquiry",
        timestamp: "2024-01-15T10:00:00Z",
        note: "Buyer expressed interest in the property"
      },
      {
        stage: "Property Viewing",
        timestamp: "2024-01-18T14:00:00Z",
        note: "Property viewing scheduled and completed"
      },
      {
        stage: "Offer Made",
        timestamp: "2024-01-20T16:30:00Z",
        note: "Buyer made an offer of AED 2,500,000"
      },
      {
        stage: "Offer Accepted",
        timestamp: "2024-01-22T11:00:00Z",
        note: "Seller accepted the offer"
      },
      {
        stage: "Deposit Paid",
        timestamp: "2024-02-01T10:00:00Z",
        note: "Buyer paid deposit of AED 250,000"
      }
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z"
  },
  {
    transactionId: "TXN002",
    propertyId: "PROP002",
    type: "lease",
    status: "completed",
    buyer: {
      userId: "TNT001",
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+971-58-333-4444"
    },
    seller: {
      userId: "OWN002",
      name: "Villa Owner",
      email: "owner2@email.com",
      phone: "+971-50-777-6666"
    },
    agent: {
      agentId: "AGT002",
      name: "Sarah Johnson",
      commission: {
        percentage: 5,
        amount: 9000
      }
    },
    financialDetails: {
      agreedPrice: 180000,
      currency: "AED",
      deposit: 18000,
      paymentMethod: "cheque"
    },
    leasingDetails: {
      startDate: "2024-02-15",
      endDate: "2025-02-14",
      rentAmount: 180000,
      paymentFrequency: "yearly",
      securityDeposit: 18000,
      renewalOption: true
    },
    documents: [
      {
        name: "Tenancy Contract",
        type: "contract",
        url: "https://example.com/docs/txn002-contract.pdf",
        uploadedAt: "2024-02-10T10:00:00Z"
      },
      {
        name: "Tenant Passport",
        type: "passport",
        url: "https://example.com/docs/txn002-passport.pdf",
        uploadedAt: "2024-02-10T10:30:00Z"
      },
      {
        name: "Tenant Visa",
        type: "visa",
        url: "https://example.com/docs/txn002-visa.pdf",
        uploadedAt: "2024-02-10T10:30:00Z"
      }
    ],
    timeline: [
      {
        stage: "Initial Inquiry",
        timestamp: "2024-01-25T09:00:00Z",
        note: "Tenant inquired about the villa"
      },
      {
        stage: "Property Viewing",
        timestamp: "2024-01-28T11:00:00Z",
        note: "Property viewing completed"
      },
      {
        stage: "Application Submitted",
        timestamp: "2024-02-01T14:00:00Z",
        note: "Tenant submitted rental application"
      },
      {
        stage: "Application Approved",
        timestamp: "2024-02-05T16:00:00Z",
        note: "Landlord approved the application"
      },
      {
        stage: "Contract Signed",
        timestamp: "2024-02-10T11:00:00Z",
        note: "Tenancy contract signed by both parties"
      },
      {
        stage: "Keys Handed Over",
        timestamp: "2024-02-14T15:00:00Z",
        note: "Keys handed over to tenant"
      }
    ],
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-02-14T15:00:00Z",
    completedAt: "2024-02-14T15:00:00Z"
  }
];

module.exports = sampleTransactions;
