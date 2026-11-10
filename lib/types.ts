export type Role = "admin" | "officer"

export type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: Role
  badge_number: string
  phone: string
  is_active: boolean
  date_joined: string
}

export type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type VehicleType = "car" | "motorcycle" | "truck" | "bus" | "rickshaw" | "other"

export type VehicleBrief = {
  id: number
  plate_number: string
  vehicle_type: VehicleType
  make: string
  model: string
  color: string
  owner_name: string
  registration_expiry: string | null
  insurance_expiry: string | null
  is_blacklisted: boolean
  is_registration_expired: boolean
  is_insurance_expired: boolean
}

export type Vehicle = VehicleBrief & {
  owner_cnic: string
  owner_phone: string
  owner_address: string
  notes: string
  challan_count: number
  unpaid_amount: number
  created_at: string
}

export type ViolationType = {
  id: number
  code: string
  name: string
  description: string
  fine_amount: number
  auto_detectable: boolean
  is_active: boolean
}

export type DetectionStatus = "completed" | "needs_review" | "failed"

export type Detection = {
  id: number
  media_type: "image" | "video"
  media: string
  annotated_image: string | null
  location: string
  status: DetectionStatus
  error: string
  raw_text: string
  plate_number: string
  plate_valid: boolean
  confidence: number
  manually_corrected: boolean
  vehicle_label: string
  frames_analysed: number
  vehicle: number | null
  vehicle_detail: VehicleBrief | null
  suggested_violations: ViolationType[]
  challan_id: number | null
  uploaded_by_name: string
  created_at: string
}

export type ChallanStatus = "unpaid" | "paid" | "cancelled"

export type ChallanItem = { id: number; code: string; name: string; fine_amount: number }

export type Challan = {
  id: number
  challan_number: string
  plate_number: string
  vehicle: number | null
  vehicle_detail: VehicleBrief | null
  detection: number | null
  issued_by_name: string
  location: string
  issued_at: string
  due_date: string
  total_fine: number
  status: ChallanStatus
  is_overdue: boolean
  notes: string
  paid_at: string | null
  payment_reference: string
  cancel_reason: string
  items: ChallanItem[]
  evidence_image: string | null
}

export type DashboardStats = {
  totals: {
    challans: number
    challans_today: number
    unpaid_count: number
    overdue_count: number
    unpaid_amount: number
    collected_amount: number
    vehicles: number
    detections: number
    needs_review: number
  }
  status_breakdown: { status: ChallanStatus; count: number }[]
  violations_breakdown: { name: string; count: number }[]
  trend: { date: string; challans: number; amount: number }[]
  recent_challans: Challan[]
}
