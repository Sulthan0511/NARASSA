export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  avatar?: string;
  city?: string;
  bio?: string;
  volunteerId: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  title: string;
  category: string;
  organizer: string;
  organizerAvatar: string;
  image: string;
  description: string;
  collected: number;
  target: number;
  donorsCount: number;
  endDate: string;
  verified: boolean;
  featured: boolean;
  urgent: boolean;
  createdAt: string;
}

export interface DonationTx {
  id: string;
  donationId: string;
  userId: string | null;
  donorName: string;
  amount: number;
  method: string;
  anon: boolean;
  note: string;
  createdAt: string;
  /** Status verifikasi admin: "Menunggu Verifikasi" | "Dikonfirmasi" | "Ditolak".
   *  (opsional agar data lama tanpa field ini tetap aman; transaksi baru SELALU diisi) */
  status?: string;
  /** Bukti pembayaran (gambar dikompres -> dataURL base64, disimpan di database). */
  bukti?: string;
  /** Nomor referensi/struk transfer (diisi donatur saat mengunggah bukti). */
  reference?: string;
}

/** Rekening/e-wallet tujuan transfer — bisa diedit admin (tabel `settings`). */
export interface PaymentAccount {
  method: string;
  number: string;
  owner: string;
}

/** Penyimpanan pengaturan bernama: key = "payment_accounts", value = PaymentAccount[] */
export interface Setting {
  key: string;
  value: unknown;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  location: string;
  type: "On-site" | "Remote";
  organizer: string;
  verified: boolean;
  urgent: boolean;
  date: string;
  deadline: string;
  quota: number;
  registered: number;
  image: string;
  requirements: string[];
  perks: string[];
  description: string;
  createdAt: string;
  /** Kode absensi harian yang dibuat admin — menjadi isi QR absensi kegiatan ini. */
  absenCode?: string;
}

export interface Application {
  id: string;
  activityId: string;
  activityTitle: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  motivation: string;
  status: "Menunggu" | "Diterima" | "Ditolak";
  appliedDate: string;
}

export interface Certificate {
  id: string;
  userId: string;
  recipientName: string;
  activityTitle: string;
  organizer: string;
  dateIssued: string;
  hoursCount: number;
  role: string;
  verificationCode: string;
}

export interface Attendance {
  id: string;
  userId: string;
  activityId: string | null;
  checkInAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "donasi" | "relawan" | "sistem";
  read: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  title: string;
  body: string;
  image: string;
  tag: string;
  createdAt: string;
}

export interface FundraisingRequest {
  id: string;
  userId: string;
  organizerName: string;
  orgType: string;
  title: string;
  category: string;
  target: number;
  deadline: string;
  phone: string;
  email: string;
  description: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  createdAt: string;
}

export interface RecurringDonation {
  id: string;
  userId: string;
  amount: number;
  period: "Mingguan" | "Bulanan";
  method: string;
  campaignId: string | null;
  active: boolean;
  createdAt: string;
}

export interface SupporterPledge {
  id: string;
  userId: string;
  name: string;
  email: string;
  tier: string;
  message: string;
  createdAt: string;
}

export interface CSRRequest {
  id: string;
  companyName: string;
  picName: string;
  phone: string;
  email: string;
  type: string;
  note: string;
  status: "Menunggu Verifikasi Kontrak" | "Disetujui" | "Ditolak";
  createdAt: string;
}

export interface OtpRecord {
  contact: string;
  code: string;
  expiresAt: number;
}

export interface DB {
  users: User[];
  donations: Donation[];
  txs: DonationTx[];
  activities: Activity[];
  applications: Application[];
  certificates: Certificate[];
  attendance: Attendance[];
  notifications: Notification[];
  blog: BlogPost[];
  feed: FeedPost[];
  fundraising: FundraisingRequest[];
  recurring: RecurringDonation[];
  supporters: SupporterPledge[];
  csr: CSRRequest[];
  otps: OtpRecord[];
  settings: Setting[];
}
