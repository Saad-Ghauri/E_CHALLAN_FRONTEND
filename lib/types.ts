export type Role = "admin" | "officer" | "citizen"

export type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: Role
  badge_number: string
  phone: string
  cnic: string
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
  appeal_status: AppealStatus | null
  video_event: number | null
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
    pending_appeals: number
    video_jobs: number
    video_events_new: number
  }
  status_breakdown: { status: ChallanStatus; count: number }[]
  violations_breakdown: { name: string; count: number }[]
  trend: { date: string; challans: number; amount: number }[]
  recent_challans: Challan[]
}

// ---- appeals, citizen portal, public lookup -----------------------------------------------------
export type AppealStatus = "pending" | "accepted" | "rejected"

export type Appeal = {
  id: number
  challan: number
  challan_number: string
  plate_number: string
  total_fine: number
  submitted_by_name: string
  reason: string
  evidence: string | null
  status: AppealStatus
  decision_note: string
  decided_at: string | null
  created_at: string
}

export type CitizenChallan = {
  id: number
  challan_number: string
  plate_number: string
  location: string
  issued_at: string
  due_date: string
  total_fine: number
  status: ChallanStatus
  is_overdue: boolean
  paid_at: string | null
  payment_reference: string
  cancel_reason: string
  items: ChallanItem[]
  evidence_image: string | null
  appeal: { id: number; status: AppealStatus; reason: string; decision_note: string } | null
  can_pay: boolean
  can_appeal: boolean
}

export type PublicChallan = {
  challan_number: string
  plate_number: string
  violations: string[]
  total_fine: number
  status: ChallanStatus
  is_overdue: boolean
  issued_at: string
  due_date: string
  location: string
}

export type CitizenSummary = {
  vehicles: number
  unpaid_count: number
  unpaid_amount: number
  overdue_count: number
  paid_count: number
  pending_appeals: number
}

export type PaymentMethod = "card" | "jazzcash" | "easypaisa" | "bank"

// ---- notifications, audit ---------------------------------------------------------------------------
export type NotificationItem = {
  id: number
  title: string
  message: string
  link: string
  is_read: boolean
  created_at: string
}

export type AuditEntry = {
  id: number
  user: number | null
  user_name: string
  action: string
  description: string
  object_type: string
  object_id: number | null
  ip_address: string | null
  created_at: string
}

// ---- video analysis ------------------------------------------------------------------------------------
export type VideoJobStatus = "queued" | "processing" | "completed" | "failed"
export type VideoEventType = "wrong_way" | "illegal_parking" | "triple_riding" | "red_light"
export type VideoEventStatus = "new" | "challan_issued" | "dismissed"
export type FlowDirection = "down" | "up" | "left" | "right"

export type VideoConfig = {
  wrong_way: { enabled: boolean; direction: FlowDirection }
  illegal_parking: { enabled: boolean; seconds: number; zone: [number, number, number, number] | null }
  triple_riding: { enabled: boolean }
  red_light: { enabled: boolean; stop_line: number }
}

export type VideoTrack = {
  id: number
  track_id: number
  label: string
  first_time: number
  last_time: number
  frames_seen: number
  plate_number: string
  plate_valid: boolean
  plate_confidence: number
  vehicle_detail: VehicleBrief | null
  snapshot: string | null
}

export type VideoEvent = {
  id: number
  job: number
  event_type: VideoEventType
  event_type_label: string
  time_sec: number
  confidence: number
  description: string
  snapshot: string | null
  plate_number: string
  status: VideoEventStatus
  track_number: number | null
  vehicle_label: string
  vehicle_detail: VehicleBrief | null
  violation_name: string
  fine_amount: number | null
  challan_id: number | null
}

export type VideoJob = {
  id: number
  status: VideoJobStatus
  progress: number
  error: string
  location: string
  video: string
  annotated_video: string | null
  preview: string | null
  config: VideoConfig
  fps: number
  duration: number
  frames_analysed: number
  vehicle_count: number
  event_count: number
  uploaded_by_name: string
  created_at: string
  started_at: string | null
  finished_at: string | null
}

export type VideoJobDetail = VideoJob & { tracks: VideoTrack[]; events: VideoEvent[] }

// ---- reports -----------------------------------------------------------------------------------------------
export type ReportSummary = {
  totals: {
    challans: number
    cancelled: number
    total_fines: number
    collected: number
    outstanding: number
    collection_rate: number
  }
  by_status: { status: ChallanStatus; count: number }[]
  by_violation: { name: string; count: number; amount: number }[]
  by_location: { location: string; count: number; amount: number }[]
  by_officer: { name: string; count: number; amount: number }[]
  by_day: { date: string; count: number; amount: number }[]
}
