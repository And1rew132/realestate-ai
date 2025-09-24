export type UserRole = 'landlord' | 'tenant' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  landlord_id: string
  title: string
  description?: string
  property_type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio' | ''
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  amenities: string[] | readonly string[]
  photos: string[] | readonly string[]
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  property_id: string
  landlord_id: string
  listing_type: 'rent' | 'sale'
  price: number
  deposit?: number
  available_from: string
  available_until?: string
  is_active: boolean
  description?: string
  terms?: string
  created_at: string
  updated_at: string
  property?: Property
}

export interface Offer {
  id: string
  listing_id: string
  tenant_id: string
  landlord_id: string
  offer_price: number
  deposit_amount?: number
  move_in_date: string
  message?: string
  status: 'pending' | 'accepted' | 'declined' | 'countered'
  counter_offer_price?: number
  counter_message?: string
  created_at: string
  updated_at: string
  listing?: Listing
}

export interface Tenancy {
  id: string
  property_id: string
  landlord_id: string
  tenant_id: string
  offer_id: string
  rent_amount: number
  deposit_amount: number
  lease_start: string
  lease_end: string
  status: 'active' | 'ended' | 'terminated'
  contract_url?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  recipient_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: User
}

export interface Payment {
  id: string
  tenancy_id: string
  tenant_id: string
  landlord_id: string
  amount: number
  payment_type: 'rent' | 'deposit' | 'fee'
  payment_method: 'stripe' | 'bank_transfer' | 'cash' | 'check'
  stripe_payment_intent_id?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  due_date: string
  paid_date?: string
  created_at: string
  updated_at: string
}