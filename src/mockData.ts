import { UserProfile, Lead, SiteVisit, Quotation, Invoice, PipelineStage, CompanyInfo } from './types';

export const INITIAL_STAGES: PipelineStage[] = [
  { id: 'NEW', label: 'New', color: 'bg-slate-100 text-slate-600', order: 0 },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-blue-100 text-blue-600', order: 1 },
  { id: 'QUALIFIED', label: 'Qualified', color: 'bg-purple-100 text-purple-600', order: 2 },
  { id: 'VISIT_SCHEDULED', label: 'Visit Scheduled', color: 'bg-amber-100 text-amber-600', order: 3 },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-indigo-100 text-indigo-600', order: 4 },
  { id: 'WON', label: 'Won', color: 'bg-emerald-100 text-emerald-600', order: 5 },
  { id: 'LOST', label: 'Lost', color: 'bg-rose-100 text-rose-600', order: 6 },
];

export const MOCK_COMPANY: CompanyInfo = {
  name: 'Vision Analytics & Real Estate',
  address: '123 Business Park, Sector 62, Noida, UP - 201301',
  phone: '+91 120 456 7890',
  email: 'contact@visionanalytics.com',
  website: 'www.visionanalytics.com',
  logoUrl: 'https://picsum.photos/seed/vision/200/200',
};

export const MOCK_USERS: UserProfile[] = [
  {
    uid: 'admin-1',
    email: 'admin@visioncrm.com',
    displayName: 'Super Admin',
    role: 'ADMIN',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    uid: 'vp-1',
    email: 'vp.north@visioncrm.com',
    displayName: 'Rajesh Kumar',
    role: 'VP',
    parentUid: 'admin-1',
    teamId: 'north-region',
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    uid: 'vp-2',
    email: 'vp.south@visioncrm.com',
    displayName: 'Meera Reddy',
    role: 'VP',
    parentUid: 'admin-1',
    teamId: 'south-region',
    createdAt: '2025-01-20T00:00:00Z',
  },
  {
    uid: 'tl-1',
    email: 'tl.delhi@visioncrm.com',
    displayName: 'Amit Sharma',
    role: 'TEAM_LEADER',
    parentUid: 'vp-1',
    teamId: 'delhi-team',
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    uid: 'tl-2',
    email: 'tl.bangalore@visioncrm.com',
    displayName: 'Suresh Iyer',
    role: 'TEAM_LEADER',
    parentUid: 'vp-2',
    teamId: 'bangalore-team',
    createdAt: '2025-02-05T00:00:00Z',
  },
  {
    uid: 'se-1',
    email: 'sales.delhi1@visioncrm.com',
    displayName: 'Priya Singh',
    role: 'SALES_EXECUTIVE',
    parentUid: 'tl-1',
    teamId: 'delhi-team',
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    uid: 'se-2',
    email: 'sales.delhi2@visioncrm.com',
    displayName: 'Vikram Malhotra',
    role: 'SALES_EXECUTIVE',
    parentUid: 'tl-1',
    teamId: 'delhi-team',
    createdAt: '2025-02-12T00:00:00Z',
  },
  {
    uid: 'se-3',
    email: 'sales.blr1@visioncrm.com',
    displayName: 'Ananya Rao',
    role: 'SALES_EXECUTIVE',
    parentUid: 'tl-2',
    teamId: 'bangalore-team',
    createdAt: '2025-02-15T00:00:00Z',
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sanjay Gupta',
    phone: '+91 98100 12345',
    location: 'Gurgaon, Sector 45',
    budget: 7500000,
    requirement: 'Looking for a 3BHK apartment with modern amenities.',
    source: 'INDIAMART',
    status: 'NEW',
    assignedTo: 'se-1',
    score: 85,
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'lead-2',
    name: 'Anjali Verma',
    phone: '+91 99580 54321',
    location: 'Noida, Sector 62',
    budget: 12000000,
    requirement: 'Interested in luxury villas or penthouses.',
    source: 'WEBSITE',
    status: 'QUALIFIED',
    assignedTo: 'se-2',
    score: 92,
    createdAt: '2026-03-18T14:30:00Z',
    updatedAt: '2026-03-21T09:15:00Z',
  },
  {
    id: 'lead-3',
    name: 'Rohan Mehra',
    phone: '+91 98711 22334',
    location: 'South Delhi, GK-II',
    budget: 25000000,
    requirement: 'Commercial space for a new boutique showroom.',
    source: 'WHATSAPP',
    status: 'VISIT_SCHEDULED',
    assignedTo: 'se-1',
    score: 78,
    createdAt: '2026-03-15T11:20:00Z',
    updatedAt: '2026-03-22T16:45:00Z',
  },
  {
    id: 'lead-4',
    name: 'Kavita Reddy',
    phone: '+91 91234 56789',
    location: 'Bangalore, Indiranagar',
    budget: 9000000,
    requirement: '2BHK flat near IT park.',
    source: 'MANUAL',
    status: 'NEGOTIATION',
    assignedTo: 'se-3',
    score: 65,
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-24T12:00:00Z',
  },
  {
    id: 'lead-5',
    name: 'Deepak Chawla',
    phone: '+91 98999 00000',
    location: 'Chandigarh, Sector 17',
    budget: 5500000,
    requirement: 'Plot for investment purposes.',
    source: 'INDIAMART',
    status: 'WON',
    assignedTo: 'se-1',
    score: 95,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-25T15:30:00Z',
  },
  {
    id: 'lead-6',
    name: 'Sunil Mehta',
    phone: '+91 98111 22233',
    location: 'Mumbai, Andheri',
    budget: 15000000,
    requirement: 'Office space for startup.',
    source: 'WEBSITE',
    status: 'WON',
    assignedTo: 'se-3',
    score: 88,
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-26T11:00:00Z',
  }
];

export const MOCK_VISITS: SiteVisit[] = [
  {
    id: 'visit-1',
    leadId: 'lead-3',
    userId: 'se-1',
    title: 'Initial Site Survey',
    plannedDate: '2026-03-28T11:00:00Z',
    status: 'PLANNED',
    notes: 'Client wants to see the corner unit specifically.',
  },
  {
    id: 'visit-2',
    leadId: 'lead-2',
    userId: 'se-2',
    title: 'Luxury Villa Tour',
    plannedDate: '2026-03-21T10:00:00Z',
    actualDate: '2026-03-21T10:30:00Z',
    status: 'COMPLETED',
    notes: 'Visit successful. Client liked the layout.',
  },
  {
    id: 'visit-3',
    leadId: 'lead-6',
    userId: 'se-3',
    title: 'Final Measurement',
    plannedDate: '2026-03-25T14:00:00Z',
    actualDate: '2026-03-25T14:45:00Z',
    status: 'COMPLETED',
    notes: 'Final negotiation visit.',
  }
];

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'qtn-1',
    leadId: 'lead-4',
    userId: 'se-3',
    items: [
      { description: '2BHK Apartment - Unit 402', quantity: 1, price: 8500000 },
      { description: 'Parking Slot', quantity: 1, price: 500000 }
    ],
    totalAmount: 9000000,
    status: 'SENT',
    createdAt: '2026-03-24T14:00:00Z',
  },
  {
    id: 'qtn-2',
    leadId: 'lead-5',
    userId: 'se-1',
    items: [
      { description: 'Plot 45 - Sector 17', quantity: 1, price: 5500000 }
    ],
    totalAmount: 5500000,
    status: 'ACCEPTED',
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'qtn-3',
    leadId: 'lead-6',
    userId: 'se-3',
    items: [
      { description: 'Office Space - Andheri', quantity: 1, price: 15000000 }
    ],
    totalAmount: 15000000,
    status: 'ACCEPTED',
    createdAt: '2026-03-25T10:00:00Z',
  }
];
