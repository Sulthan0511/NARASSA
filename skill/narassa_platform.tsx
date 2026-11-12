import React, { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  Calendar,
  Award,
  QrCode,
  Search,
  Bell,
  User,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Filter,
  ArrowRight,
  Download,
  LogOut,
  Key,
  Building2,
  ShieldCheck,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Share2,
  Flame,
  BookOpen,
  Briefcase,
  AlertCircle,
  Eye,
  FileText,
  Camera,
  CheckCircle,
  XCircle,
  Menu,
  ChevronDown,
  Globe,
  BadgeCheck,
  LayoutDashboard,
  HandHeart,
  CalendarDays,
  QrCode as QrIcon,
  Shield,
  Layers,
  Sparkle,
  Phone,
  Mail,
  SlidersHorizontal
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_DONATIONS = [
  {
    id: 1,
    title: 'Bantuan Darurat Logistik & Medis Banjir Demak-Grobogan',
    category: 'Bencana',
    organizer: 'Yayasan Peduli Sesama',
    isVerified: true,
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    collected: 124500000,
    target: 150000000,
    daysLeft: 2,
    isNearestDeadline: true,
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    donorsCount: 428,
    description: 'Penyediaan dapur umum darurat, perahu karet, popok bayi, dan posko kesehatan gratis bagi 1.200 kepala keluarga terdampak banjir.'
  },
  {
    id: 2,
    title: 'Beasiswa Pendidikan 100 Anak Pesisir Muara Angke',
    category: 'Pendidikan',
    organizer: 'Gerakan Sahabat Anak Nusantara',
    isVerified: true,
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    collected: 48200000,
    target: 60000000,
    daysLeft: 4,
    isNearestDeadline: true,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    donorsCount: 215,
    description: 'Bantuan biaya perlengkapan sekolah, seragam, buku cerita, dan SPP 1 tahun untuk anak nelayan kurang mampu.'
  },
  {
    id: 3,
    title: 'Operasi Jantung Balita Ghaisan (1.5 Tahun)',
    category: 'Kesehatan',
    organizer: 'Komunitas Kasih Bunda',
    isVerified: true,
    organizerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    collected: 165000000,
    target: 180000000,
    daysLeft: 3,
    isNearestDeadline: true,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    donorsCount: 680,
    description: 'Dik Ghaisan membutuhkan operasi penutupan kebocoran sekum jantung tahap kedua di RS Harapan Kita.'
  },
  {
    id: 4,
    title: 'Revitalisasi Terumbu Karang & Mangrove Kepulauan Seribu',
    category: 'Lingkungan',
    organizer: 'EcoNusantara Foundation',
    isVerified: true,
    organizerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    collected: 22800000,
    target: 40000000,
    daysLeft: 12,
    isNearestDeadline: false,
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
    donorsCount: 142,
    description: 'Penanaman 2.000 bibit mangrove dan rehabilitasi media tanam terumbu karang di Pulau Pari.'
  }
];

const INITIAL_KEGIATAN = [
  {
    id: 101,
    title: 'Relawan Sabtu Ceria: Pengajar Anak Pesisir',
    category: 'Pendidikan',
    location: 'Muara Angke, Jakarta Utara',
    type: 'On-site',
    organizer: 'Gerakan Sahabat Anak Nusantara',
    isVerified: true,
    date: '2026-03-25',
    deadline: '2026-03-20',
    daysLeft: 3,
    isNearestDeadline: true,
    quota: 20,
    registered: 16,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    requirements: [
      'Minimal usia 18 tahun (Mahasiswa/Umum)',
      'Menyukai aktivitas mengajar & mendongeng',
      'Dapat hadir full-day pada hari Sabtu'
    ],
    perks: ['E-Sertifikat Resmi', 'Konsumsi Makan Siang', 'Kaos Relawan NARASSA', 'Uang Transportasi'],
    description: 'Kegiatan mengajar literasi dasar, mendongeng interaktif, dan kelas kerajinan tangan untuk anak-anak pemukiman nelayan.'
  },
  {
    id: 102,
    title: 'Aksi Bersih Pantai & Penanaman 1.000 Mangrove',
    category: 'Lingkungan',
    location: 'Pulau Pari, Kepulauan Seribu',
    type: 'On-site',
    organizer: 'EcoNusantara Foundation',
    isVerified: true,
    date: '2026-03-28',
    deadline: '2026-03-22',
    daysLeft: 5,
    isNearestDeadline: true,
    quota: 30,
    registered: 28,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    requirements: [
      'Sehat fisik & dapat berenang dasar',
      'Membawa botol minum pribadi (Tumblr)'
    ],
    perks: ['E-Sertifikat 16 Jam Kerja', 'Kapal Penyeberangan Pulang-Pergi', 'Konsumsi 2x'],
    description: 'Aksi kolaboratif relawan dalam pengumpulan sampah plastik pantai dan pemasangan bibit mangrove muda.'
  },
  {
    id: 103,
    title: 'Digital Relawan: UI/UX & Content Creator Kampanye',
    category: 'Digital',
    location: 'Indonesia (Work From Anywhere)',
    type: 'Remote',
    organizer: 'NARASSA Digital Media Hub',
    isVerified: true,
    date: '2026-04-01',
    deadline: '2026-03-24',
    daysLeft: 7,
    isNearestDeadline: false,
    quota: 5,
    registered: 4,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    requirements: [
      'Menguasai Canva, Figma, atau Adobe Illustrator',
      'Memiliki portofolio desain visual / microblog'
    ],
    perks: ['E-Sertifikat Digital Professional', 'Portofolio Project Terverifikasi'],
    description: 'Membantu membuat konten infografis dan desain media sosial untuk mendukung transparansi penggalangan dana darurat.'
  },
  {
    id: 104,
    title: 'Pendampingan Psikososial Pasca Bencana Banjir',
    category: 'Bencana',
    location: 'Demak, Jawa Tengah',
    type: 'On-site',
    organizer: 'Yayasan Peduli Sesama',
    isVerified: true,
    date: '2026-03-26',
    deadline: '2026-03-19',
    daysLeft: 2,
    isNearestDeadline: true,
    quota: 15,
    registered: 11,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    requirements: [
      'Latar belakang Psikologi/Konseling disukai',
      'Bersedia menginap di posko relawan 2 hari'
    ],
    perks: ['E-Sertifikat Tanggap Darurat', 'Akomodasi & Posko', 'Konsumsi Penuh'],
    description: 'Pemberian Trauma Healing ringan, permainan anak, serta pendampingan moral untuk keluarga pengungsi.'
  }
];

const INITIAL_CANDIDATES = [
  {
    id: 1,
    name: 'Siti Nurhaliza',
    email: 'siti.nur@gmail.com',
    phone: '081298765432',
    activityTitle: 'Relawan Sabtu Ceria: Pengajar Anak Pesisir',
    appliedDate: '2026-03-15',
    status: 'Menunggu',
    motivation: 'Saya memiliki pengalaman 1 tahun mengajar bimbel anak dan sangat tertarik berbagi ilmu di Muara Angke.'
  },
  {
    id: 2,
    name: 'Budi Santoso',
    email: 'budi.santoso@yahoo.com',
    phone: '085712345678',
    activityTitle: 'Aksi Bersih Pantai & Penanaman 1.000 Mangrove',
    appliedDate: '2026-03-14',
    status: 'Diterima',
    motivation: 'Aktif di UKM Pencinta Alam dan ingin ambil bagian langsung penanaman mangrove.'
  },
  {
    id: 3,
    name: 'Amanda Putri',
    email: 'amanda.p@gmail.com',
    phone: '081345678901',
    activityTitle: 'Digital Relawan: UI/UX & Content Creator',
    appliedDate: '2026-03-12',
    status: 'Diterima',
    motivation: 'UI/UX Designer junior yang bersedia menyumbangkan keahlian visual untuk kemanusiaan.'
  }
];

const INITIAL_CERTIFICATES = [
  {
    id: 'CERT-NRS-2026-088',
    recipientName: 'Rizky Ramadhan',
    activityTitle: 'Aksi Tanggap Darurat Logistik Banjir Demak',
    organizer: 'NARASSA Volunteer Network',
    dateIssued: '10 Februari 2026',
    hoursCount: 18,
    role: 'Relawan Tim Logistik Posko Utama',
    verificationCode: 'NRS-VER-994812'
  },
  {
    id: 'CERT-NRS-2025-142',
    recipientName: 'Rizky Ramadhan',
    activityTitle: 'Festival Edukasi Literasi & Kebudayaan Anak Pesisir',
    organizer: 'Gerakan Sahabat Anak Nusantara',
    dateIssued: '20 Desember 2025',
    hoursCount: 12,
    role: 'Fasilitator Studio Mendongeng',
    verificationCode: 'NRS-VER-332109'
  }
];

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState('home'); // home, donasi, kegiatan, kalender, candidate, absensi, sertifikat, mitra, admin
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [user, setUser] = useState({
    name: 'Rizky Ramadhan',
    email: 'rizky.ramadhan@example.com',
    phone: '081299887766',
    role: 'relawan',
    isLoggedIn: true
  });

  // Data States
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [kegiatan, setKegiatan] = useState(INITIAL_KEGIATAN);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);

  // Top Header Search Bar Controls
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchCategory, setSearchCategory] = useState('Semua');

  // Filter States
  const [donasiCatFilter, setDonasiCatFilter] = useState('Semua');
  const [kegiatanCatFilter, setKegiatanCatFilter] = useState('Semua');
  const [kegiatanTypeFilter, setKegiatanTypeFilter] = useState('Semua');

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // login, signup, forgotPassword, changePass, donasi, kegiatanDetail, daftarVolunteer, certPreview, addKegiatan
  const [selectedItem, setSelectedItem] = useState(null);

  // Notifications Dropdown & Toast
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Forgot Password OTP Flow States
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotContact, setForgotContact] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Forms
  const [donasiForm, setDonasiForm] = useState({ amount: 50000, customAmount: '', method: 'qris', isAnon: false, donorName: 'Rizky Ramadhan', note: '' });
  const [volunteerForm, setVolunteerForm] = useState({ phone: '081299887766', motivation: '' });
  const [mitraForm, setMitraForm] = useState({ companyName: '', picName: '', phone: '', email: '', type: 'CSR Donasi', note: '', isSubmitted: false, status: 'Menunggu Verifikasi Kontrak' });
  const [newKegiatanForm, setNewKegiatanForm] = useState({
    title: '', category: 'Pendidikan', location: 'Jakarta Utara', type: 'On-site', date: '', deadline: '', quota: 20, description: ''
  });

  // Absensi & Calendar States
  const [absensiTab, setAbsensiTab] = useState('scan');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-03-25');

  // Session Timeout Simulation (5 minutes = 300 seconds)
  const [sessionTime, setSessionTime] = useState(300);

  // Toast Function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Session Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1) {
          setUser(u => ({ ...u, isLoggedIn: false }));
          showToast('Sesi Anda telah expired! Silakan login kembali.', 'warning');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Submit Handlers
  const handleDonasiSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    const finalAmt = donasiForm.customAmount ? parseInt(donasiForm.customAmount) : donasiForm.amount;
    
    setDonations(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          collected: item.collected + finalAmt,
          donorsCount: item.donorsCount + 1
        };
      }
      return item;
    }));

    setActiveModal(null);
    showToast(`Terima kasih! Donasi sebesar ${formatRupiah(finalAmt)} berhasil disalurkan.`);
  };

  const handleRegisterVolunteer = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newCandidate = {
      id: Date.now(),
      name: user.name,
      email: user.email,
      phone: volunteerForm.phone || user.phone,
      activityTitle: selectedItem.title,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Menunggu',
      motivation: volunteerForm.motivation || 'Sangat bersemangat untuk bergabung dalam aksi sosial ini.'
    };

    setCandidates([newCandidate, ...candidates]);
    setKegiatan(prev => prev.map(k => k.id === selectedItem.id ? { ...k, registered: k.registered + 1 } : k));

    setActiveModal(null);
    setVolunteerForm({ phone: user.phone, motivation: '' });
    showToast(`Pendaftaran volunteer untuk "${selectedItem.title}" berhasil! Cek di menu Kandidat.`);
  };

  const handleMitraSubmit = (e) => {
    e.preventDefault();
    setMitraForm({ ...mitraForm, isSubmitted: true });
    showToast('Formulir kontrak awal kemitraan berhasil terkirim. Admin akan memverifikasi dalam 1x24 jam.');
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setActiveModal(null);
    showToast('Password berhasil diubah! Sistem melakukan logout otomatis untuk relogin.', 'warning');
    setTimeout(() => {
      setUser(prev => ({ ...prev, isLoggedIn: false }));
      setActiveModal('login');
    }, 1200);
  };

  const handleAddKegiatanSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      title: newKegiatanForm.title,
      category: newKegiatanForm.category,
      location: newKegiatanForm.location,
      type: newKegiatanForm.type,
      organizer: 'Tim Admin NARASSA',
      isVerified: true,
      date: newKegiatanForm.date || '2026-04-10',
      deadline: newKegiatanForm.deadline || '2026-04-05',
      daysLeft: 10,
      isNearestDeadline: true,
      quota: parseInt(newKegiatanForm.quota),
      registered: 0,
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80',
      requirements: ['Minimal 18 tahun', 'Komitmen hadir tepat waktu'],
      perks: ['E-Sertifikat Resmi', 'Konsumsi', 'ID Card'],
      description: newKegiatanForm.description || 'Program relawan baru yang dipublikasikan administrator.'
    };

    setKegiatan([created, ...kegiatan]);
    setActiveModal(null);
    showToast('Kegiatan relawan baru berhasil diterbitkan!');
  };

  const handleUpdateCandidateStatus = (candId, newStatus) => {
    setCandidates(prev => prev.map(c => c.id === candId ? { ...c, status: newStatus } : c));
    showToast(`Status pendaftar diubah menjadi "${newStatus}".`);
  };

  // Filtered Donasi & Kegiatan
  const filteredDonations = donations.filter(d => {
    const matchCat = donasiCatFilter === 'Semua' ? true : d.category.toLowerCase() === donasiCatFilter.toLowerCase();
    const matchGlobal = d.title.toLowerCase().includes(globalSearch.toLowerCase()) || d.organizer.toLowerCase().includes(globalSearch.toLowerCase());
    return matchCat && matchGlobal;
  });

  const filteredKegiatan = kegiatan.filter(k => {
    const matchGlobal = k.title.toLowerCase().includes(globalSearch.toLowerCase()) || k.location.toLowerCase().includes(globalSearch.toLowerCase());
    const matchCat = kegiatanCatFilter === 'Semua' ? true : k.category.toLowerCase() === kegiatanCatFilter.toLowerCase();
    const matchType = kegiatanTypeFilter === 'Semua' ? true : k.type.toLowerCase() === kegiatanTypeFilter.toLowerCase();
    return matchGlobal && matchCat && matchType;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 font-sans flex flex-col antialiased selection:bg-[#E53935] selection:text-white">

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          {toast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER: Prominent Center Search Bar (Peduly replica style) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">

            {/* Left: NARASSA Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer shrink-0"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-9 h-9 bg-[#E53935] rounded-xl flex items-center justify-center text-white shadow-xs">
                <Heart className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  NARASSA<span className="text-[#E53935]">.id</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider">DONASI & RELAWAN</span>
              </div>
            </div>

            {/* Center: Prominent Search Input with Category Dropdown */}
            <div className="flex-1 max-w-xl mx-2 hidden sm:flex items-center bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg p-1 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#E53935]">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 px-3 py-1.5 border-r border-slate-300 focus:outline-none shrink-0"
              >
                <option value="Semua">Semua Program</option>
                <option value="Donasi">Donasi Online</option>
                <option value="Relawan">Kegiatan Relawan</option>
                <option value="Bencana">Bencana Alam</option>
                <option value="Pendidikan">Pendidikan</option>
              </select>

              <div className="flex items-center flex-1 px-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari program donasi, lokasi, atau aksi relawan..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full bg-transparent text-xs pl-2.5 pr-2 py-1.5 focus:outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Session Expired Counter Indicator */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-mono text-slate-600" title="Sesi Login Aktif">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{Math.floor(sessionTime / 60)}:{sessionTime % 60 < 10 ? '0' : ''}{sessionTime % 60}</span>
              </div>

              {/* Staff Admin Toggle Button */}
              <button
                onClick={() => {
                  const nextState = !isAdminMode;
                  setIsAdminMode(nextState);
                  if (nextState) setCurrentView('admin');
                  showToast(nextState ? 'Mode Administrator Aktif' : 'Mode User Relawan');
                }}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-md border transition flex items-center gap-1 ${
                  isAdminMode 
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isAdminMode ? 'Admin Mode' : 'Switch Admin'}</span>
              </button>

              {/* Notification Bell Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E53935] rounded-full ring-2 ring-white"></span>
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 font-bold text-slate-900">
                      <span>Notifikasi Program</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">2 Baru</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-slate-50 rounded-lg space-y-0.5">
                        <p className="font-bold text-slate-900">Aplikasi Diterima 🎉</p>
                        <p className="text-[11px] text-slate-600">Selamat! Pendaftaran relawan "Aksi Bersih Pantai" disetujui.</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg space-y-0.5">
                        <p className="font-bold text-slate-900">Penyaluran Donasi</p>
                        <p className="text-[11px] text-slate-600">Donasi Banjir Demak tahap 1 telah disalurkan ke lokasi.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile / Auth */}
              {user.isLoggedIn ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-[#E53935] text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                    <button
                      onClick={() => setActiveModal('changePass')}
                      className="text-[10px] text-[#0294A5] hover:underline font-semibold"
                    >
                      Ubah Password
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setUser({ ...user, isLoggedIn: false });
                      showToast('Anda telah keluar dari sesi.');
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModal('login')}
                    className="text-xs font-bold px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-100"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => setActiveModal('signup')}
                    className="text-xs font-bold px-3 py-1.5 bg-[#E53935] hover:bg-red-700 text-white rounded-md shadow-xs"
                  >
                    Daftar
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER WITH SIDEBAR & CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex w-full gap-6 py-6">

        {/* SIDEBAR NAVIGATION (Desktop Peduly Replica) */}
        <aside className="hidden md:block w-60 shrink-0 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-1 shadow-xs sticky top-20">
            <p className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Navigasi Utama</p>

            <button
              onClick={() => setCurrentView('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                currentView === 'home' ? 'bg-[#E53935] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard Utama
            </button>

            <button
              onClick={() => setCurrentView('donasi')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                currentView === 'donasi' ? 'bg-[#E53935] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <HandHeart className="w-4 h-4" /> Donasi Online
            </button>

            <button
              onClick={() => setCurrentView('kegiatan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                currentView === 'kegiatan' ? 'bg-[#E53935] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" /> Kegiatan Relawan
            </button>

            <button
              onClick={() => setCurrentView('kalender')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                currentView === 'kalender' ? 'bg-[#E53935] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Kalender Agenda
            </button>

            <button
              onClick={() => setCurrentView('candidate')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                currentView === 'candidate' ? 'bg-[#E53935] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" /> Candidate Relawan
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${currentView === 'candidate' ? 'bg-white text-red-600' : 'bg-slate-200 text-slate-700'}`}>
                {candidates.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentView('absensi')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                currentView === 'absensi' ? 'bg-[#E53935] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <QrIcon className="w-4 h-4" /> Absensi QR Code
            </button>

            <button
              onClick={() => setCurrentView('sertifikat')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                currentView === 'sertifikat' ? 'bg-[#E53935] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" /> E-Sertifikat
            </button>

            <button
              onClick={() => setCurrentView('mitra')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                currentView === 'mitra' ? 'bg-[#E53935] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" /> Pendaftaran Mitra
            </button>

            {isAdminMode && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  currentView === 'admin' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Panel
              </button>
            )}

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 p-2 space-y-1">
              <p className="font-bold text-slate-700">NARASSA Support</p>
              <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#0294A5]" /> 0812-9000-8000</p>
              <p className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#0294A5]" /> halo@narassa.id</p>
            </div>
          </div>
        </aside>

        {/* CONTENT DISPLAY AREA */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* VIEW 1: DASHBOARD MAIN PAGE */}
          {currentView === 'home' && (
            <div className="space-y-6">

              {/* Authentic Top Peduly Banner Card */}
              <div className="bg-gradient-to-r from-[#0294A5] to-[#0D9488] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-3 z-10 max-w-lg">
                  <span className="bg-white/20 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    Platform Philanthropy & Relawan Terpercaya
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                    Mari Bantu Sesama, Salurkan Kebajikan Nyata
                  </h1>
                  <p className="text-xs text-white/90 leading-relaxed">
                    Sistem transparansi donasi 100% serta tempat bergabung aksi volunteer langsung di seluruh pelosok Indonesia.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setCurrentView('donasi')}
                      className="px-5 py-2.5 bg-[#E53935] hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-md transition"
                    >
                      Donasi Sekarang
                    </button>
                    <button
                      onClick={() => setCurrentView('kegiatan')}
                      className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-lg transition"
                    >
                      Daftar Relawan
                    </button>
                  </div>
                </div>

                <div className="w-36 h-36 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <Heart className="w-20 h-20 text-white/40 fill-white/20" />
                </div>
              </div>

              {/* HIGHLIGHT: DEADLINE TERDEKAT SECTION (PDF Specification 7.b & 7.c) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#E53935]" />
                    <h2 className="text-lg font-black text-slate-900">Highlight Deadline Terdekat</h2>
                  </div>
                  <span className="text-xs text-slate-500">Mendesak & Butuh Bantuan Segera</span>
                </div>

                {/* Grid Highlight Dual Cards */}
                <div className="grid md:grid-cols-2 gap-4">

                  {/* Highlight Urgent Donasi */}
                  {donations.filter(d => d.isNearestDeadline)[0] && (
                    <div className="bg-white border-2 border-red-500/40 rounded-xl p-4 shadow-2xs space-y-3 relative">
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        Batas {donations.filter(d => d.isNearestDeadline)[0].daysLeft} Hari Lagi!
                      </span>

                      <div className="flex gap-3">
                        <img
                          src={donations.filter(d => d.isNearestDeadline)[0].image}
                          alt="Urgent Donasi"
                          className="w-28 h-24 object-cover rounded-lg shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded">
                            DONASI URGENT
                          </span>
                          <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                            {donations.filter(d => d.isNearestDeadline)[0].title}
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Oleh: {donations.filter(d => d.isNearestDeadline)[0].organizer}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#E53935]">
                            {formatRupiah(donations.filter(d => d.isNearestDeadline)[0].collected)}
                          </span>
                          <span className="text-slate-400 font-normal">
                            Target {formatRupiah(donations.filter(d => d.isNearestDeadline)[0].target)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#E53935] h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (donations.filter(d => d.isNearestDeadline)[0].collected /
                                  donations.filter(d => d.isNearestDeadline)[0].target) *
                                  100
                              )}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedItem(donations.filter(d => d.isNearestDeadline)[0]);
                          setActiveModal('donasi');
                        }}
                        className="w-full py-2 bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        Donasi Darurat Sekarang
                      </button>
                    </div>
                  )}

                  {/* Highlight Urgent Kegiatan */}
                  {kegiatan.filter(k => k.isNearestDeadline)[0] && (
                    <div className="bg-white border-2 border-amber-500/40 rounded-xl p-4 shadow-2xs space-y-3 relative">
                      <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        Pendaftaran Segera Ditutup
                      </span>

                      <div className="flex gap-3">
                        <img
                          src={kegiatan.filter(k => k.isNearestDeadline)[0].image}
                          alt="Urgent Kegiatan"
                          className="w-28 h-24 object-cover rounded-lg shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">
                            RELAWAN URGENT
                          </span>
                          <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                            {kegiatan.filter(k => k.isNearestDeadline)[0].title}
                          </h3>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#0294A5]" /> {kegiatan.filter(k => k.isNearestDeadline)[0].location}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-600">
                          Batas: <strong>{kegiatan.filter(k => k.isNearestDeadline)[0].deadline}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedItem(kegiatan.filter(k => k.isNearestDeadline)[0]);
                            setActiveModal('daftarVolunteer');
                          }}
                          className="px-4 py-1.5 bg-[#0294A5] hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition"
                        >
                          Daftar Relawan
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* DONATION CAMPAIGN CATALOG GRID */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base">Program Donasi Pilihan</h3>
                  <button onClick={() => setCurrentView('donasi')} className="text-xs font-bold text-[#0294A5] hover:underline flex items-center gap-1">
                    Lihat Semua Donasi <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {donations.slice(0, 3).map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition p-4 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="relative">
                          <img src={item.image} alt={item.title} className="w-full h-36 object-cover rounded-lg" />
                          <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug">{item.title}</h4>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold">
                            <span className="text-[#E53935]">{formatRupiah(item.collected)}</span>
                            <span className="text-slate-400">Target {formatRupiah(item.target)}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#E53935] h-full rounded-full" style={{ width: `${Math.min(100, (item.collected/item.target)*100)}%` }}></div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => { setSelectedItem(item); setActiveModal('donasi'); }}
                        className="w-full py-2 bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        Donasi
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: DONASI CATALOG PAGE */}
          {currentView === 'donasi' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Program Donasi Online</h1>
                <p className="text-xs text-slate-500">Salurkan kepedulian Anda secara terbuka dan 100% aman.</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {['Semua', 'Bencana', 'Pendidikan', 'Kesehatan', 'Lingkungan'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setDonasiCatFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      donasiCatFilter === cat
                        ? 'bg-[#E53935] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDonations.map(item => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="relative">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
                        <span className="absolute top-2 right-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Sisa {item.daysLeft} Hari
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-[#0294A5] bg-teal-50 px-2 py-0.5 rounded uppercase">
                        {item.category}
                      </span>

                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">{item.title}</h3>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#E53935]">{formatRupiah(item.collected)}</span>
                          <span className="text-slate-400 font-normal">Target {formatRupiah(item.target)}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#E53935] h-full rounded-full" style={{ width: `${Math.min(100, (item.collected/item.target)*100)}%` }}></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{item.donorsCount} Donatur</span>
                        <span>Verifikasi Peduly</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setSelectedItem(item); setActiveModal('donasi'); }}
                      className="w-full py-2 bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs rounded-lg transition"
                    >
                      Donasi Sekarang
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: KEGIATAN RELAWAN PAGE */}
          {currentView === 'kegiatan' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Kegiatan Relawan (Voluntrip)</h1>
                <p className="text-xs text-slate-500">Daftarkan diri Anda sebagai bagian dari perubahan sosial nyata.</p>
              </div>

              {/* Filters */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2">
                  <select
                    value={kegiatanCatFilter}
                    onChange={(e) => setKegiatanCatFilter(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Lingkungan">Lingkungan</option>
                    <option value="Bencana">Bencana</option>
                  </select>

                  <select
                    value={kegiatanTypeFilter}
                    onChange={(e) => setKegiatanTypeFilter(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="Semua">Semua Tipe Mode</option>
                    <option value="On-site">On-site (Lokasi)</option>
                    <option value="Remote">Remote (Online)</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredKegiatan.map(item => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="relative">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
                        <span className="absolute top-2 left-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">{item.title}</h3>

                      <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 text-xs text-slate-600">
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#0294A5]" /> {item.location}</p>
                        <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#0294A5]" /> Pelaksanaan: {item.date}</p>
                        <p className="flex items-center gap-1.5 text-red-600 font-bold"><Clock className="w-3.5 h-3.5" /> Batas: {item.deadline}</p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Kuota: <strong>{item.registered}/{item.quota}</strong></span>
                        <span className="text-teal-700 font-bold">Sisa {item.quota - item.registered} Slot</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedItem(item); setActiveModal('kegiatanDetail'); }}
                        className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition"
                      >
                        Detail Perks
                      </button>
                      <button
                        onClick={() => { setSelectedItem(item); setActiveModal('daftarVolunteer'); }}
                        className="w-1/2 py-2 bg-[#0294A5] hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        Daftar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: KALENDER KEGIATAN */}
          {currentView === 'kalender' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Kalender Agenda Relawan</h1>
                <p className="text-xs text-slate-500">Jadwal pelaksanaan kegiatan dan deadline pendaftaran terkoordinasi.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h3 className="font-extrabold text-slate-900 text-sm">Maret 2026</h3>
                    <span className="text-xs bg-teal-50 text-[#0294A5] font-bold px-2.5 py-0.5 rounded">4 Agenda</span>
                  </div>

                  <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 py-1">
                    <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold">
                    {[...Array(5)].map((_, i) => <div key={`b-${i}`} className="p-2 text-slate-200"></div>)}
                    {[...Array(31)].map((_, idx) => {
                      const dayNum = idx + 1;
                      const dateStr = `2026-03-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                      const hasEv = kegiatan.some(k => k.date === dateStr || k.deadline === dateStr);
                      const isSel = selectedCalendarDate === dateStr;

                      return (
                        <button
                          key={dayNum}
                          onClick={() => setSelectedCalendarDate(dateStr)}
                          className={`p-2.5 rounded-lg transition flex flex-col items-center justify-center min-h-[42px] ${
                            isSel
                              ? 'bg-[#E53935] text-white font-bold shadow-xs'
                              : hasEv
                              ? 'bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span>{dayNum}</span>
                          {hasEv && <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSel ? 'bg-white' : 'bg-[#0294A5]'}`}></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs border-b pb-2">Agenda Pada: {selectedCalendarDate}</h4>
                  {kegiatan.filter(k => k.date === selectedCalendarDate || k.deadline === selectedCalendarDate).length > 0 ? (
                    kegiatan.filter(k => k.date === selectedCalendarDate || k.deadline === selectedCalendarDate).map(ev => (
                      <div key={ev.id} className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border">
                        <span className="text-[10px] font-bold text-[#0294A5]">{ev.type}</span>
                        <h5 className="font-bold text-slate-900">{ev.title}</h5>
                        <p className="text-slate-500">{ev.location}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-6 text-center">Tidak ada agenda pada tanggal ini.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: CANDIDATE APPLICANTS TABLE */}
          {currentView === 'candidate' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Candidate Pendaftar Relawan</h1>
                <p className="text-xs text-slate-500">Informasi pendaftaran kandidat relawan dan verifikasi kelayakan.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Nama Pelamar</th>
                        <th className="py-3 px-4">Kegiatan Dituju</th>
                        <th className="py-3 px-4">Tgl Daftar</th>
                        <th className="py-3 px-4">Status</th>
                        {isAdminMode && <th className="py-3 px-4">Verifikasi Admin</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {candidates.map(cand => (
                        <tr key={cand.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {cand.name}
                            <span className="block text-[10px] text-slate-400 font-normal">{cand.email}</span>
                          </td>
                          <td className="py-3 px-4 max-w-xs">{cand.activityTitle}</td>
                          <td className="py-3 px-4 text-slate-500">{cand.appliedDate}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              cand.status === 'Diterima' ? 'bg-emerald-100 text-emerald-800' :
                              cand.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {cand.status}
                            </span>
                          </td>
                          {isAdminMode && (
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdateCandidateStatus(cand.id, 'Diterima')}
                                  className="px-2 py-1 bg-emerald-600 text-white font-bold rounded text-[10px]"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleUpdateCandidateStatus(cand.id, 'Ditolak')}
                                  className="px-2 py-1 bg-red-600 text-white font-bold rounded text-[10px]"
                                >
                                  Tolak
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: ABSENSI QR CODE */}
          {currentView === 'absensi' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="text-center">
                <h1 className="text-xl font-extrabold text-slate-900">Absensi Relawan via QR Code</h1>
                <p className="text-xs text-slate-500">Scan QR di lokasi kegiatan atau tunjukkan ID QR Card Anda.</p>
              </div>

              <div className="flex justify-center border-b pb-3 gap-2">
                <button
                  onClick={() => setAbsensiTab('scan')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold ${absensiTab === 'scan' ? 'bg-[#E53935] text-white' : 'bg-white border text-slate-700'}`}
                >
                  Scan Kamera QR
                </button>
                <button
                  onClick={() => setAbsensiTab('myqr')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold ${absensiTab === 'myqr' ? 'bg-[#E53935] text-white' : 'bg-white border text-slate-700'}`}
                >
                  QR Card Saya
                </button>
              </div>

              {absensiTab === 'scan' && (
                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center space-y-4 border border-slate-800">
                  <div className="w-48 h-48 border-2 border-dashed border-teal-400 rounded-xl p-3 flex items-center justify-center mx-auto relative bg-slate-950/60">
                    <QrCode className="w-32 h-32 text-slate-400 opacity-70" />
                  </div>
                  <button
                    onClick={() => showToast('Presensi Berhasil! Jam hadir Anda telah tercatat.')}
                    className="w-full py-2.5 bg-[#0294A5] hover:bg-teal-600 font-bold text-xs rounded-lg transition"
                  >
                    Simulasi Scan Berhasil
                  </button>
                </div>
              )}

              {absensiTab === 'myqr' && (
                <div className="bg-white p-6 rounded-2xl border text-center space-y-3">
                  <span className="text-[10px] bg-teal-50 text-[#0294A5] font-bold px-2 py-0.5 rounded">ID Relawan Official</span>
                  <QrCode className="w-40 h-40 text-slate-800 mx-auto" />
                  <h3 className="font-extrabold text-slate-900 text-base">{user.name}</h3>
                  <p className="text-xs font-mono text-slate-400">NRS-VOL-99201</p>
                </div>
              )}
            </div>
          )}

          {/* VIEW 7: E-SERTIFIKAT */}
          {currentView === 'sertifikat' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">E-Sertifikat Keikutsertaan</h1>
                <p className="text-xs text-slate-500">Unduh bukti apresiasi resmi atas kontribusi aksi sosial Anda.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-400">{cert.id}</span>
                        <Award className="w-5 h-5 text-amber-500" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{cert.activityTitle}</h3>
                      <p className="text-xs text-slate-500">Peran: <strong>{cert.role}</strong> ({cert.hoursCount} Jam)</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedItem(cert); setActiveModal('certPreview'); }}
                        className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-lg"
                      >
                        Pratinjau
                      </button>
                      <button
                        onClick={() => showToast(`Mengunduh PDF Sertifikat ${cert.id}...`)}
                        className="w-1/2 py-2 bg-[#0294A5] hover:bg-teal-700 text-white font-bold text-xs rounded-lg"
                      >
                        Unduh PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 8: MITRA KONTRAK PERUSAHAAN */}
          {currentView === 'mitra' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Pendaftaran Kontrak Mitra Corporate</h1>
                <p className="text-xs text-slate-500">Formulir pendaftaran awal kerjasama CSR & NGO dengan NARASSA.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                {!mitraForm.isSubmitted ? (
                  <form onSubmit={handleMitraSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700">Nama Perusahaan / Komunitas</label>
                      <input
                        type="text"
                        required
                        placeholder="PT Sahabat Kebaikan Indonesia"
                        value={mitraForm.companyName}
                        onChange={(e) => setMitraForm({ ...mitraForm, companyName: e.target.value })}
                        className="w-full p-2.5 mt-1 border rounded-lg"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700">Nama PIC</label>
                        <input
                          type="text"
                          required
                          placeholder="Hendra Wijaya"
                          value={mitraForm.picName}
                          onChange={(e) => setMitraForm({ ...mitraForm, picName: e.target.value })}
                          className="w-full p-2.5 mt-1 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">No Telp / WA</label>
                        <input
                          type="text"
                          required
                          placeholder="08129000..."
                          value={mitraForm.phone}
                          onChange={(e) => setMitraForm({ ...mitraForm, phone: e.target.value })}
                          className="w-full p-2.5 mt-1 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">Alamat Email Perusahaan</label>
                      <input
                        type="email"
                        required
                        placeholder="csr@perusahaan.com"
                        value={mitraForm.email}
                        onChange={(e) => setMitraForm({ ...mitraForm, email: e.target.value })}
                        className="w-full p-2.5 mt-1 border rounded-lg"
                      />
                    </div>
                    <button type="submit" className="w-full py-3 bg-[#E53935] hover:bg-red-700 text-white font-bold rounded-lg">
                      Kirim Pendaftaran Kontrak
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="font-bold text-slate-900">Data Kontrak Terkirim!</h3>
                    <p className="text-xs text-slate-500">Status verifikasi admin: <strong>{mitraForm.status}</strong></p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 9: ADMIN PANEL */}
          {currentView === 'admin' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">Panel Staff Admin</h1>
                  <p className="text-xs text-slate-500">Kelola kegiatan relawan & terbitkan sertifikat resmi.</p>
                </div>
                <button
                  onClick={() => setActiveModal('addKegiatan')}
                  className="px-3 py-2 bg-[#E53935] text-white font-bold text-xs rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Terbitkan Kegiatan
                </button>
              </div>

              <div className="bg-white rounded-xl border p-4 space-y-3">
                <h3 className="font-bold text-xs text-slate-900">Daftar Kegiatan Membutuhkan Sertifikat</h3>
                <div className="space-y-2 text-xs">
                  {kegiatan.map(k => (
                    <div key={k.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                      <span className="font-bold text-slate-800">{k.title}</span>
                      <button
                        onClick={() => {
                          const newCert = {
                            id: `CERT-NRS-2026-${Math.floor(100+Math.random()*900)}`,
                            recipientName: 'Rizky Ramadhan',
                            activityTitle: k.title,
                            organizer: 'NARASSA Staff Admin',
                            dateIssued: 'Hari Ini',
                            hoursCount: 14,
                            role: 'Relawan Terverifikasi',
                            verificationCode: `NRS-VER-${Math.floor(100000+Math.random()*900000)}`
                          };
                          setCertificates([newCert, ...certificates]);
                          showToast(`Sertifikat diterbitkan untuk "${k.title}"!`);
                        }}
                        className="px-2.5 py-1 bg-teal-600 text-white font-bold rounded text-[10px]"
                      >
                        Terbitkan E-Sertifikat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (Peduly Replica Mobile Standard) */}
      <nav className="md:hidden sticky bottom-0 z-40 bg-white border-t border-slate-200 px-3 py-2 flex justify-around text-[10px] font-bold text-slate-600 shadow-lg">
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-0.5 ${currentView === 'home' ? 'text-[#E53935]' : ''}`}>
          <LayoutDashboard className="w-4 h-4" /> Beranda
        </button>
        <button onClick={() => setCurrentView('donasi')} className={`flex flex-col items-center gap-0.5 ${currentView === 'donasi' ? 'text-[#E53935]' : ''}`}>
          <HandHeart className="w-4 h-4" /> Donasi
        </button>
        <button onClick={() => setCurrentView('kegiatan')} className={`flex flex-col items-center gap-0.5 ${currentView === 'kegiatan' ? 'text-[#E53935]' : ''}`}>
          <Users className="w-4 h-4" /> Relawan
        </button>
        <button onClick={() => setCurrentView('kalender')} className={`flex flex-col items-center gap-0.5 ${currentView === 'kalender' ? 'text-[#E53935]' : ''}`}>
          <CalendarDays className="w-4 h-4" /> Kalender
        </button>
        <button onClick={() => setCurrentView('absensi')} className={`flex flex-col items-center gap-0.5 ${currentView === 'absensi' ? 'text-[#E53935]' : ''}`}>
          <QrIcon className="w-4 h-4" /> QR Absen
        </button>
      </nav>

      {/* MODALS */}
      {/* MODAL DONASI */}
      {activeModal === 'donasi' && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Donasi Kebajikan</h3>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-600 font-bold line-clamp-1">{selectedItem.title}</p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Pilih Nominal Donasi:</label>
              <div className="grid grid-cols-3 gap-2">
                {[10000, 25000, 50000, 100000, 250000, 500000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setDonasiForm({ ...donasiForm, amount: amt, customAmount: '' })}
                    className={`py-2 rounded-lg text-xs font-bold border ${
                      donasiForm.amount === amt && !donasiForm.customAmount ? 'bg-[#E53935] text-white border-[#E53935]' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Metode Pembayaran:</label>
              <select
                value={donasiForm.method}
                onChange={(e) => setDonasiForm({ ...donasiForm, method: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="qris">QRIS (GoPay, OVO, ShopeePay)</option>
                <option value="bca">BCA Virtual Account</option>
                <option value="mandiri">Mandiri Transfer</option>
              </select>
            </div>

            <button
              onClick={handleDonasiSubmit}
              className="w-full py-2.5 bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs rounded-lg"
            >
              Bayar Donasi Sekarang
            </button>
          </div>
        </div>
      )}

      {/* MODAL KEGIATAN DETAIL */}
      {activeModal === 'kegiatanDetail' && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900 text-xs">Detail Program Relawan</h3>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-40 object-cover rounded-lg" />
            <h2 className="font-bold text-slate-900 text-sm">{selectedItem.title}</h2>
            <p className="text-xs text-slate-600">{selectedItem.description}</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="w-1/2 py-2 bg-slate-100 font-bold text-xs rounded-lg">Tutup</button>
              <button onClick={() => setActiveModal('daftarVolunteer')} className="w-1/2 py-2 bg-[#0294A5] text-white font-bold text-xs rounded-lg">Daftar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DAFTAR VOLUNTEER */}
      {activeModal === 'daftarVolunteer' && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <form onSubmit={handleRegisterVolunteer} className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Form Pendaftaran Volunteer</h3>
              <button type="button" onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <p className="font-bold text-slate-800">{selectedItem.title}</p>
            <div>
              <label className="font-bold text-slate-700">No. WhatsApp</label>
              <input type="text" required value={volunteerForm.phone} onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
            </div>
            <div>
              <label className="font-bold text-slate-700">Motivasi Keikutsertaan</label>
              <textarea required rows={3} value={volunteerForm.motivation} onChange={(e) => setVolunteerForm({...volunteerForm, motivation: e.target.value})} className="w-full p-2 border rounded-lg mt-1"></textarea>
            </div>
            <button type="submit" className="w-full py-2.5 bg-[#0294A5] text-white font-bold rounded-lg">Kirim Pendaftaran</button>
          </form>
        </div>
      )}

      {/* MODAL E-SERTIFIKAT PREVIEW */}
      {activeModal === 'certPreview' && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-3 border-4 border-teal-500/20">
            <Award className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">Sertifikat Resmi NARASSA</h3>
            <p className="text-xs text-slate-500">Diberikan kepada: <strong>{selectedItem.recipientName}</strong></p>
            <p className="text-xs text-slate-700 italic">"{selectedItem.activityTitle}"</p>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-[#0294A5] text-white font-bold text-xs rounded-lg">Tutup</button>
          </div>
        </div>
      )}

      {/* AUTH MODALS */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Masuk Akun NARASSA</h3>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setUser({...user, isLoggedIn: true}); setActiveModal(null); showToast('Login berhasil!'); }} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700">Email / No HP</label>
                <input type="text" required placeholder="email@domain.com" className="w-full p-2 border rounded-lg mt-1" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Password</label>
                <input type="password" required placeholder="••••••••" className="w-full p-2 border rounded-lg mt-1" />
              </div>
              <button type="button" onClick={() => { setActiveModal('forgotPassword'); setForgotStep(1); }} className="text-[#0294A5] font-bold text-[11px]">Lupa Password (OTP)?</button>
              <button type="submit" className="w-full py-2.5 bg-[#E53935] text-white font-bold rounded-lg">Masuk Sesi</button>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'signup' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Daftar Akun Baru</h3>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setUser({...user, isLoggedIn: true}); setActiveModal(null); showToast('Pendaftaran akun berhasil!'); }} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700">Nama Lengkap</label>
                <input type="text" required placeholder="Nama Anda" className="w-full p-2 border rounded-lg mt-1" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Email atau No HP</label>
                <input type="text" required placeholder="0812..." className="w-full p-2 border rounded-lg mt-1" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Password</label>
                <input type="password" required placeholder="••••••••" className="w-full p-2 border rounded-lg mt-1" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#E53935] text-white font-bold rounded-lg">Daftar Relawan</button>
            </form>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD OTP 3-STEP */}
      {activeModal === 'forgotPassword' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Reset Password (OTP Step {forgotStep}/3)</h3>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {forgotStep === 1 && (
              <div className="space-y-2">
                <p className="text-slate-500">Masukkan Email/No HP untuk menerima OTP:</p>
                <input type="text" value={forgotContact} onChange={(e) => setForgotContact(e.target.value)} placeholder="0812... / email@..." className="w-full p-2 border rounded-lg" />
                <button onClick={() => setForgotStep(2)} className="w-full py-2 bg-[#0294A5] text-white font-bold rounded-lg">Kirim OTP</button>
              </div>
            )}

            {forgotStep === 2 && (
              <div className="space-y-2">
                <p className="text-slate-500">Masukkan OTP 6-digit (Gunakan: <strong>882910</strong>):</p>
                <input type="text" maxLength={6} value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="882910" className="w-full p-2 border rounded-lg text-center font-mono font-bold" />
                <button onClick={() => setForgotStep(3)} className="w-full py-2 bg-[#0294A5] text-white font-bold rounded-lg">Verifikasi OTP</button>
              </div>
            )}

            {forgotStep === 3 && (
              <div className="space-y-2">
                <p className="text-slate-500">Masukkan password baru Anda:</p>
                <input type="password" value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} placeholder="Password Baru" className="w-full p-2 border rounded-lg" />
                <button onClick={() => { setActiveModal(null); showToast('Password baru berhasil dibuat!'); }} className="w-full py-2 bg-[#0294A5] text-white font-bold rounded-lg">Simpan Password</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD */}
      {activeModal === 'changePass' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <form onSubmit={handleChangePasswordSubmit} className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Ubah Password Akun</h3>
              <button type="button" onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div>
              <label className="font-bold text-slate-700">Password Lama</label>
              <input type="password" required className="w-full p-2 border rounded-lg mt-1" />
            </div>
            <div>
              <label className="font-bold text-slate-700">Password Baru</label>
              <input type="password" required className="w-full p-2 border rounded-lg mt-1" />
            </div>
            <p className="text-[10px] text-amber-600 font-bold">*Sistem akan meminta relogin otomatis setelah mengganti password.</p>
            <button type="submit" className="w-full py-2 bg-[#0294A5] text-white font-bold rounded-lg">Simpan & Relogin</button>
          </form>
        </div>
      )}

      {/* ADMIN ADD KEGIATAN */}
      {activeModal === 'addKegiatan' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <form onSubmit={handleAddKegiatanSubmit} className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900">Tambah Kegiatan Baru</h3>
              <button type="button" onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div>
              <label className="font-bold text-slate-700">Judul Kegiatan</label>
              <input type="text" required value={newKegiatanForm.title} onChange={(e) => setNewKegiatanForm({...newKegiatanForm, title: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700">Mode</label>
                <select value={newKegiatanForm.type} onChange={(e) => setNewKegiatanForm({...newKegiatanForm, type: e.target.value})} className="w-full p-2 border rounded-lg mt-1">
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">Lokasi</label>
                <input type="text" required value={newKegiatanForm.location} onChange={(e) => setNewKegiatanForm({...newKegiatanForm, location: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg">Terbitkan Kegiatan</button>
          </form>
        </div>
      )}

    </div>
  );
}