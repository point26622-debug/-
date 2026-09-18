export type ServiceCategory = 'bathroom' | 'kitchen' | 'waterproof' | 'general';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Reservation {
  id: string;
  serviceCategory: ServiceCategory;
  serviceType: string;
  subOptions?: string[];
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "오전 09:00 - 12:00"
  customerName: string;
  phone: string;
  address: string;
  addressDetail?: string;
  notes: string;
  photoUrl?: string;
  status: ReservationStatus;
  assignedEngineer?: string;
  userId?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BeforeAfterCase {
  id: string;
  category: string;
  title: string;
  location: string;
  period: string;
  before: {
    description: string;
    image: string;
    issues: string[];
  };
  after: {
    description: string;
    image: string;
    highlights: string[];
  };
}
