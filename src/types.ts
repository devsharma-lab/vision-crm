export type UserRole = 'ADMIN' | 'VP' | 'TEAM_LEADER' | 'SALES_EXECUTIVE';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  parentUid?: string; // For hierarchy: Sales -> Team Leader -> VP -> Admin
  teamId?: string;
  createdAt: string;
  photoURL?: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  color: string;
  order: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  location: string;
  budget: number;
  requirement: string;
  source: 'INDIAMART' | 'WEBSITE' | 'WHATSAPP' | 'MANUAL';
  status: string; // Dynamic status
  assignedTo: string; // User UID
  assignedByName?: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  followUpNotes?: {
    id: string;
    text: string;
    createdAt: string;
    createdBy: string;
    userName: string;
  }[];
  documents?: string[]; // URLs
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
}

export type VisitStatus = 'PLANNED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED';

export interface SiteVisit {
  id: string;
  leadId: string;
  userId: string;
  title: string;
  plannedDate: string;
  actualDate?: string;
  status: VisitStatus;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  images?: string[];
}

export interface Quotation {
  id: string;
  leadId: string;
  userId: string;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface Invoice {
  id: string;
  quotationId: string;
  leadId: string;
  userId: string;
  invoiceNumber: string;
  amount: number;
  status: 'UNPAID' | 'PAID' | 'CANCELLED';
  dueDate: string;
  createdAt: string;
}
