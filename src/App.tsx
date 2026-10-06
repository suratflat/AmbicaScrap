import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Car, 
  Bike, 
  ShieldCheck, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Download, 
  Search, 
  Filter, 
  ArrowRight, 
  Lock, 
  User as UserIcon, 
  Globe, 
  RefreshCw, 
  Tag, 
  Eye, 
  Check, 
  FileSpreadsheet, 
  LogOut, 
  LogIn, 
  ArrowUpDown, 
  ShoppingBag, 
  BadgeCheck, 
  Zap, 
  Share2, 
  Plus, 
  History, 
  CheckSquare, 
  Square, 
  MessageSquare, 
  Scale, 
  Edit3, 
  UserPlus, 
  FileCheck2, 
  Printer, 
  AlertTriangle, 
  Trash2,
  X,
  Phone,
  ChevronRight,
  FileDown,
  Crown,
  UserCog,
  Key,
  Sparkles,
  MapPin,
  ShieldAlert,
  EyeOff,
  ExternalLink,
  Users,
  Calendar
} from 'lucide-react';

// --- TYPES & INTERFACES ---
type Language = 'EN' | 'GU' | 'HI';

interface ManagedSocietyAccount {
  id: string;
  loginEmail: string;
  password: string;
  societyName: string;
  address: string;
  regNo: string;
  chairmanName: string;
  chairmanMobile: string;
  secretaryName: string;
  secretaryMobile: string;
  district: string;
  isFirstLoginCompleted: boolean;
}

interface ManagedVendorAccount {
  id: string;
  loginEmail: string;
  password: string;
  vendorName: string;
  rvsfRegNo: string;
  address: string;
  contactPerson: string;
  mobile: string;
  gstin: string;
  isFirstLoginCompleted: boolean;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  society: string;
  flatNo: string;
}

interface StatusHistoryItem {
  id: string;
  fromStatus: string;
  toStatus: string;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

interface Lead {
  id: string;
  tokenId: string;
  society: string;
  customSociety?: string;
  flatNo: string;
  ownerName: string;
  mobile: string;
  category: '2W' | '4W';
  brand: string;
  model: string;
  customModel?: string;
  regNumber: string;
  regYear: string;
  condition: 'dead' | 'incomplete' | 'running_expired' | 'scrap' | 'rusted' | 'stripped' | 'non_functional';
  rcStatus: 'original' | 'mparivahan' | 'lost' | 'scrap_unregistered';
  rcPreviewUrl?: string;
  idProofVerified: boolean;
  aadhaarNumber?: string;
  panNumber?: string;
  hypothecationStatus?: 'cleared' | 'hypothecated';
  parkingLocation?: string;
  chassisNumber?: string;
  engineNumber?: string;
  idProofPreviewUrl?: string;
  preferredDate: string;
  preferredTimeSlot?: string;
  paymentMethod?: string;
  remarks?: string;
  estWeightKg: number;
  actualWeightKg?: number;
  ratePerKg: number;
  estPayout: number;
  status: 'Registered' | 'Inspected & Weighed' | 'Payment Transferred' | 'CoD Issued' | 'Rejected / Offer Declined';
  createdAt: string;
  codNumber?: string;
  isWalkIn?: boolean;
  isSocietyAbandoned?: boolean;
  statusHistory?: StatusHistoryItem[];
}

interface CodBid {
  id: string;
  bidderName: string;
  bidderMobile: string;
  bidderSociety: string;
  bidAmount: number;
  timestamp: string;
}

interface CodCertificate {
  id: string;
  codNumber: string;
  chassisNo: string;
  vehicleReg: string;
  ownerName: string;
  category: '2W' | '4W';
  vehicleModel: string;
  vehicleYear: string | number;
  bsCategory: 'BS-I' | 'BS-II' | 'BS-III' | 'BS-IV' | 'Pre-BS' | 'BS-VI';
  roadTaxWaiverPercent: number; // In % instead of flat Rupee amount (e.g. 25% or 15%)
  taxConcessionValue?: number; // Optional reference valuation
  oemDiscountMinPercent: number; // Minimum OEM Discount in %
  oemDiscountMaxPercent: number; // Maximum OEM Discount in %
  registrationFeeBenefit: string; // Strictly as per Govt policy (e.g. "100% Waived (₹0)")
  issueDate: string;
  rvsfName: string;
  status: 'Available' | 'Listed_For_Sale' | 'Sold' | 'Redeemed';
  askingPrice?: number;
  sellerMobile?: string;
  sellerSociety?: string;
  transferToken?: string;
  leadId?: string;
  engineNo?: string;
  bidsCount?: number;
  highestBid?: number;
  bids?: CodBid[];
}

interface AbandonedVehicleItem {
  id: string;
  category: '2W' | '4W';
  makeModel: string;
  color: string;
  regNumber: string;
  chassisNumber: string;
  engineNumber: string;
  condition: 'Scrap' | 'Rusted' | 'Stripped' | 'Non-functional';
  durationYears: number;
  parkingSpot: string;
}

const TRANSLATIONS = {
  EN: {
    portalTitle: "Gujarat Vehicle Scrappage Policy",
    rvsfPartner: "Authorized Partner: SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF)",
    heroHeading: "Gujarat Vehicle Scrappage Policy: Authorized Old Vehicle Scrappage",
    heroSub: "Dispose of end-of-life, unused, or dead vehicles legally. Get guaranteed weight-based cash payouts (₹25–₹28/kg) and RTO Certificate of Deposit (CoD) benefits.",
    tabScrappage: "Vehicle Scrappage",
    tabSocietyNoc: "Society Committee (Pramukh & Sec)",
    tabDigiElv: "DigiELV CoD Market",
    tabAdmin: "Vendor Admin Panel",
    calcHeading: "Interactive Scrap Value Calculator",
    calcSub: "An instant weight-based estimator calculated transparently between ₹25 and ₹28 per kg.",
    registerHeader: "Multi-Step Vehicle Intake & Scrap Registration",
    digiElvHeading: "DigiELV Certificate of Deposit (CoD) Trading Portal",
    digiElvSub: "View, trade, or sell your Certificate of Destruction (CoD) directly to new vehicle buyers across Gujarat.",
    myCertificates: "My CoD Certificates",
    marketplace: "Explore DigiELV Marketplace"
  },
  GU: {
    portalTitle: "ગુજરાત વાહન સ્ક્રેપેજ પોલિસી",
    rvsfPartner: "અધિકૃત ભાગીદાર: શ્રી અંબિકા ઓટોમોટિવ પ્રા. લિ. (SHREE AMBICA AUTOMOTIVE PVT LTD)",
    heroHeading: "ગુજરાત વાહન સ્ક્રેપેજ નીતિ: સત્તાવાર વાહન સ્ક્રેપેજ પોર્ટલ",
    heroSub: "જૂના અને બિનઉપયોગી વાહનોનો કાયદેસર નિકાલ કરો. ગેરંટીડ રોકડ રકમ (₹25–₹28/કિલો) અને RTO ટેક્સ છૂટ સર્ટિફિકેટ મેળવો.",
    tabScrappage: "વાહન સ્ક્રેપેજ",
    tabSocietyNoc: "સોસાયટી કમિટી (પ્રમુખ & મંત્રી)",
    tabDigiElv: "ડીજીઈએલવી માર્કેટ",
    tabAdmin: "એડમિન પેનલ",
    calcHeading: "લાઈવ સ્ક્રેપ કિંમત અને ગણતરી",
    calcSub: "કિલો દીઠ ₹25 થી ₹28 ની વચ્ચે પારદર્શક ગેરંટીડ રોકડ રકમ ચૂકવણી.",
    registerHeader: "વાહન નોંધણી ફોર્મ",
    digiElvHeading: "ડીજીઈએલવી સર્ટિફિકેટ ઓફ ડિપોઝિટ (CoD) ટ્રેડિંગ પોર્ટલ",
    digiElvSub: "તમારું સર્ટિફિકેટ ઓફ ડિસ્ટ્રક્શન (CoD) જુઓ, વેચો અથવા ટ્રાન્સફર કરો.",
    myCertificates: "મારા CoD સર્ટિફિકેટ્સ",
    marketplace: "ડીજીઈએલવી માર્કેટપ્લેસ જુઓ"
  },
  HI: {
    portalTitle: "गुजरात वाहन स्क्रैपेज नीति",
    rvsfPartner: "अधिकृत पार्टनर: श्री अंबिका ऑटोमोटिव प्रा. लि. (SHREE AMBICA AUTOMOTIVE PVT LTD)",
    heroHeading: "गुजरात वाहन स्क्रैपेज नीति: अधिकृत वाहन स्क्रैपेज पोर्टल",
    heroSub: "पुराने एवं निष्प्रयोज्य वाहनों का कानूनी निपटान करें।एं गारंटीड कैश (₹25–₹28/किग्रा) एवं RTO रोड टैक्स छूट लाभ।",
    tabScrappage: "वाहन स्क्रैपेज",
    tabSocietyNoc: "सोसायटी समिति (प्रमुख व सचिव)",
    tabDigiElv: "डिजीलव मार्केट",
    tabAdmin: "एडमिन पैनल",
    calcHeading: "लाइव स्क्रैप मूल्य एवं कैलकुलेटर",
    calcSub: "₹25 से ₹28 प्रति किग्रा के बीच पारदर्शी गारंटीड नकद भुगतान।",
    registerHeader: "वाहन स्क्रैपेज रजिस्ट्रेशन फॉर्म",
    digiElvHeading: "डिजीलव सर्टिफिकेट ऑफ डिपॉजिट (CoD) ट्रेडिंग पोर्टल",
    digiElvSub: "अपना सर्टिफिकेट ऑफ डिस्ट्रक्शन (CoD) देखें, बेचें या नए वाहन खरीदारों को ट्रांसफर करें।",
    myCertificates: "मेरे CoD सर्टिफिकेट",
    marketplace: "डिजीलव मार्केटप्लेस देखें"
  }
};

const BRANDS_DATABASE: Record<'2W' | '4W', Record<string, string[]>> = {
  '4W': {
    'Maruti Suzuki': [
      '800 (SS80 / Type 1 / 2)',
      'Zen / Zen Carbon / Steel',
      'Zen Estilo',
      'Esteem',
      'Maruti 1000',
      'Gypsy / Gypsy King',
      'Omni (Van)',
      'Alto / Alto K10',
      'WagonR',
      'Swift / Swift Dzire',
      'Eeco',
      'Versa',
      'Baleno (Sedan / Hatch)',
      'Kizashi',
      'SX4',
      'Ritz',
      'Celerio / Celerio X',
      'Ignis',
      'S-Presso',
      'Ertiga',
      'XL6',
      'Vitara Brezza / Brezza',
      'Grand Vitara',
      'A-Star',
      'Ciaz',
      'S-Cross',
      'Fronx',
      'Jimny',
      'Invicto',
      'Model Not Listed'
    ],
    'Hyundai': [
      'Santro (ZipDrive / ZipPlus)',
      'Santro Xing',
      'Accent',
      'Sonata (Gold / Embera)',
      'Getz / Getz Prime',
      'i10 / Grand i10 / Nios',
      'i20 / Elite i20 / N Line',
      'Verna (Transform / Fluidic / Turbo)',
      'Elantra',
      'Tucson',
      'Santa Fe',
      'Creta',
      'Venue',
      'Aura',
      'Alcazar',
      'Eon',
      'Terracan',
      'Exter',
      'Ioniq 5',
      'Model Not Listed'
    ],
    'Tata Motors': [
      'Indica (V1 / V2 / eV2)',
      'Indica Vista',
      'Indigo / Indigo CS / Marina / XL',
      'Indigo Manza',
      'Sumo / Sumo Spacio / Victa / Grande',
      'Safari / Safari Dicor / Storme',
      'Nano / Nano Twist / GenX',
      'Sierra / Sierra Turbo',
      'Estate',
      'Aria',
      'Zest',
      'Bolt',
      'Tiago / Tiago EV',
      'Tigor / Tigor EV',
      'Nexon / Nexon EV',
      'Harrier',
      'Safari (New)',
      'Punch / Punch EV',
      'Altroz',
      'Hexa',
      'Venture',
      'Magic / Magic Iris',
      'Model Not Listed'
    ],
    'Mahindra': [
      'Scorpio (Classic / VLX / S10 / Scorpio-N)',
      'Bolero / Bolero Camper / Neo',
      'Armada / Armada Grand',
      'Commander / CL 500 / CJ340',
      'Marshal',
      'Major',
      'Classic 4x4',
      'Xylo',
      'Quanto',
      'NuvoSport',
      'XUV500',
      'XUV300 / XUV 3XO',
      'XUV700',
      'Thar (CRDe / 2020 / Roxx)',
      'Marazzo',
      'Verito / Verito Vibe',
      'Mahindra-Renault Logan',
      'e2o / e2o Plus / Reva',
      'KUV100',
      'TUV300 / TUV300 Plus',
      'Alturas G4',
      'Voyager',
      'Model Not Listed'
    ],
    'Mahindra & Mahindra': [
      'Scorpio (Classic / VLX / S10 / Scorpio-N)',
      'Bolero / Bolero Camper / Neo',
      'Armada / Armada Grand',
      'Commander / CL 500 / CJ340',
      'Marshal',
      'Major',
      'Classic 4x4',
      'Xylo',
      'Quanto',
      'NuvoSport',
      'XUV500',
      'XUV300 / XUV 3XO',
      'XUV700',
      'Thar (CRDe / 2020 / Roxx)',
      'Marazzo',
      'Verito / Verito Vibe',
      'Mahindra-Renault Logan',
      'e2o / e2o Plus / Reva',
      'KUV100',
      'TUV300 / TUV300 Plus',
      'Alturas G4',
      'Voyager',
      'Model Not Listed'
    ],
    'Honda': [
      'City (1st / Type 2 / ZX / 3rd / 4th / 5th Gen)',
      'Civic',
      'Accord',
      'CR-V',
      'Jazz',
      'Brio',
      'Amaze',
      'Mobilio',
      'BR-V',
      'WR-V',
      'Elevate',
      'Model Not Listed'
    ],
    'Toyota': [
      'Qualis',
      'Corolla / Corolla Altis',
      'Innova (Type 1-4)',
      'Innova Crysta',
      'Innova Hycross',
      'Etios / Etios Liva / Cross',
      'Camry',
      'Fortuner',
      'Land Cruiser / Prado',
      'Yaris',
      'Glanza',
      'Urban Cruiser / Hyryder',
      'Hilux',
      'Model Not Listed'
    ],
    'Premier': [
      'Padmini (Fiat 1100D)',
      '118 NE',
      '137 D',
      'Rio (Compact SUV)',
      'Signet',
      'Model Not Listed'
    ],
    'Hindustan Motors': [
      'Ambassador Mark I/II/III/IV',
      'Ambassador Nova / Classic / Grand / Avigo',
      'Contessa / Contessa Classic',
      'Trekker',
      'Pushpak',
      'RTV (with OKA)',
      'Model Not Listed'
    ],
    'Fiat': [
      'Uno',
      'Palio / Palio 1.6 / Palio D',
      'Palio Weekend',
      'Siena / Petra',
      'Grande Punto / Punto Evo / Abarth',
      'Linea / Linea T-Jet',
      'Avventura',
      'Urban Cross',
      'Premier 1100 Delight',
      'Model Not Listed'
    ],
    'Ford': [
      'Ikon (Flair / Rocam / TDCI)',
      'Escort (1.6 / 1.8D)',
      'Mondeo',
      'Fusion',
      'Fiesta / Classic',
      'Figo (1st & 2nd Gen)',
      'Figo Aspire',
      'EcoSport',
      'Endeavour (2.5 / 3.0 / 3.2 / 2.0)',
      'Freestyle',
      'Mustang',
      'Model Not Listed'
    ],
    'Chevrolet / GM / Opel': [
      'Opel Astra',
      'Opel Corsa / Corsa Sail / Swing',
      'Opel Vectra',
      'Tavera / Tavera Neo',
      'Beat (Petrol / Diesel)',
      'Spark',
      'Cruze',
      'Optra / Optra Magnum / SRV',
      'Aveo / Aveo U-VA',
      'Sail / Sail U-VA',
      'Enjoy',
      'Captiva',
      'Trailblazer',
      'Chevrolet Forester',
      'Model Not Listed'
    ],
    'Daewoo': [
      'Matiz',
      'Cielo',
      'Nexia',
      'Model Not Listed'
    ],
    'Volkswagen': [
      'Polo (1.2 / 1.6 / TSI / GT TDI / Cross Polo)',
      'Vento',
      'Jetta',
      'Passat',
      'Ameo',
      'Taigun',
      'Virtus',
      'Tiguan',
      'Beetle',
      'Phaeton',
      'Touareg',
      'T-Roc',
      'Model Not Listed'
    ],
    'Skoda': [
      'Octavia / Octavia vRS (Mk1/Mk2/Mk3/Mk4)',
      'Laura',
      'Fabia',
      'Rapid',
      'Superb',
      'Yeti',
      'Kodiaq',
      'Kushaq',
      'Slavia',
      'Karoq',
      'Model Not Listed'
    ],
    'Renault': [
      'Duster',
      'Kwid',
      'Triber',
      'Kiger',
      'Pulse',
      'Scala',
      'Fluence',
      'Koleos',
      'Lodgy',
      'Captur',
      'Model Not Listed'
    ],
    'Nissan': [
      'Micra / Micra Active',
      'Sunny',
      'Terrano',
      'Teana',
      'X-Trail',
      'Evalia',
      'Kicks',
      'Magnite',
      '370Z',
      'Model Not Listed'
    ],
    'Kia': [
      'Seltos',
      'Sonet',
      'Carens',
      'Carnival',
      'EV6',
      'Model Not Listed'
    ],
    'MG (Morris Garages)': [
      'Hector / Hector Plus',
      'ZS EV',
      'Astor',
      'Gloster',
      'Comet EV',
      'Model Not Listed'
    ],
    'Mitsubishi': [
      'Lancer (1.5 / 2.0D / Invex / SFXi)',
      'Pajero / Pajero SFX / Pajero Sport',
      'Cedia / Cedia Sports',
      'Outlander',
      'Montero',
      'Model Not Listed'
    ],
    'Standard Motors': [
      'Standard 2000 (Rover SD1)',
      'Standard Gazel',
      'Herald',
      'Companion',
      'Model Not Listed'
    ],
    'Force Motors / Tempo': [
      'Matador (F305 / F307)',
      'Tempo Trax / Cruiser / Toofan',
      'Gurkha (Classic / 4x4 / 5-door)',
      'Minidor (3-Wheeler / 4-Wheeler)',
      'Force One SUV',
      'Judo / Gama',
      'Traveller',
      'Model Not Listed'
    ],
    'Jeep': [
      'Compass',
      'Meridian',
      'Wrangler',
      'Grand Cherokee',
      'Model Not Listed'
    ],
    'Other / Unlisted Brand': ['Model Not Listed']
  },
  '2W': {
    'Hero Honda / Hero MotoCorp': [
      'Splendor',
      'Splendor Plus / Pro',
      'CD 100 / CD 100 SS',
      'CD Dawn / Deluxe',
      'Passion / Passion Plus / Pro',
      'Karizma / Karizma ZMR',
      'CBZ / CBZ Xtreme',
      'Hunk',
      'Glamour / Glamour 125',
      'Achiever',
      'HF Deluxe / HF Dawn',
      'Pleasure / Pleasure Plus',
      'Maestro / Maestro Edge',
      'Destini 125',
      'Xpulse 200 / 200T',
      'Super Splendor',
      'Ignitor',
      'Model Not Listed'
    ],
    'Bajaj': [
      'Chetak (2-Stroke Classic)',
      'Chetak 4-Stroke',
      'Super',
      'M-80 (Step-through)',
      'Priya',
      'Cub',
      'Sunny',
      'Bravo',
      'Saffire',
      'Wave',
      'Legend',
      'Spirit',
      'Pulsar 150',
      'Pulsar 180',
      'Pulsar 200 / 220F',
      'Pulsar NS200 / RS200',
      'Discover 100/125/135',
      'Platina',
      'Boxer AT/CT',
      'Caliber / Croma / 115',
      'CT 100 / CT 110',
      'Avenger 150/180/220',
      'Wind 125',
      'XCD 125',
      'Eliminator',
      'Dominar 400',
      'Chetak Electric',
      'Model Not Listed'
    ],
    'TVS': [
      'Scooty',
      'Scooty Pep / Pep+',
      'Scooty Streak',
      'XL 100',
      'XL Super / Heavy Duty',
      'Champ',
      'Apache RTR 160/180/200',
      'Victor / Victor GLX',
      'Jupiter / Jupiter 125',
      'Star City / City Plus',
      'Sport',
      'Fiero / Fiero FX',
      'Centra',
      'Flame',
      'Wego',
      'Radeon',
      'NTORQ 125',
      'Raider 125',
      'iQube Electric',
      'Samurai (No Problem)',
      'Shogun (The Boss)',
      'Shaolin',
      'Suzuki Max 100 / Max 100R',
      'Model Not Listed'
    ],
    'Honda (HMSI)': [
      'Activa (Gen 1 to 6G / H-Smart)',
      'Activa 125',
      'Dio / Dio 125',
      'Shine (CB Shine 125)',
      'SP 125',
      'Unicorn 150/160',
      'Aviator',
      'Navi',
      'Grazia',
      'Dream Yuga',
      'Dream Neo',
      'CD 110 Dream',
      'Hornet 160R / 2.0',
      'CB Trigger',
      'CB Twister',
      'CB Dazzler',
      'Eterno (Geared Scooter)',
      'CBR 150R',
      'CBR 250R',
      'Hness CB350',
      'Model Not Listed'
    ],
    'Mahindra': [
      'Gusto 110/125 / RS',
      'Centuro / Centuro N1 / Rockstar',
      'Rodeo / Rodeo RZ 125',
      'Duro / Duro DZ 125',
      'Flyte (Sym Flyte 125)',
      'Mojo 300 / UT300 / XT300',
      'Pantero 110',
      'Kine 72',
      'Stallio 110',
      'Model Not Listed'
    ],
    'Mahindra 2-Wheelers': [
      'Gusto 110/125 / RS',
      'Centuro / Centuro N1 / Rockstar',
      'Rodeo / Rodeo RZ 125',
      'Duro / Duro DZ 125',
      'Flyte (Sym Flyte 125)',
      'Mojo 300 / UT300 / XT300',
      'Pantero 110',
      'Kine 72',
      'Stallio 110',
      'Model Not Listed'
    ],
    'Suzuki': [
      'Access 125',
      'Burgman Street 125',
      'Gixxer 150/250',
      'Gixxer SF',
      'GS150R',
      'Zeus 125',
      'Heat 125',
      'Slingshot 125',
      'Hayate',
      'Swish 125',
      'Lets',
      'Fiero (TVS-Suzuki)',
      'Max 100',
      'Intruder 150',
      'V-Strom SX 250',
      'Model Not Listed'
    ],
    'Yamaha': [
      'RX 100',
      'RX 135 (4-speed / 5-speed)',
      'RXZ',
      'RD 350',
      'Crux',
      'Libero',
      'Gladiator',
      'Enticer',
      'FZ16 / FZ-S',
      'Fazer',
      'YZF R15 (V1/V2/V3/V4)',
      'Ray / Ray-ZR',
      'Fascino 125',
      'SZ-R / SZ-X',
      'Saluto',
      'Aerox 155',
      'Model Not Listed'
    ],
    'Royal Enfield': [
      'Bullet 350 (Cast Iron / UCE)',
      'Bullet 500',
      'Electra 350',
      'Thunderbird 350/500',
      'Classic 350',
      'Classic 500',
      'Himalayan 411/450',
      'Hunter 350',
      'Meteor 350',
      'Interceptor 650',
      'Continental GT 535/650',
      'Machismo 350/500',
      'Lightning 535',
      'Mini Bullet (200cc)',
      'Model Not Listed'
    ],
    'Kinetic': [
      'Kinetic Honda DX',
      'Kinetic Honda ZX',
      'Luna Moped (TFR / Super / Double Plus)',
      'Kinetic Nova 135',
      'Kinetic Blaze 165',
      'Kinetic Zing',
      'Kinetic Marvel',
      'Kinetic Boss 115',
      'Kinetic Challenger',
      'Kinetic Velocity',
      'Kinetic Safari',
      'Model Not Listed'
    ],
    'LML': [
      'LML Vespa NV / NV Special',
      'LML Select / Select II',
      'LML Supremo',
      'LML Star / Star Euro',
      'LML Stella',
      'LML Pulse',
      'LML Freedom / Prima',
      'LML Graptor',
      'LML Beamer',
      'LML Adreno FX',
      'LML Energy FX',
      'Model Not Listed'
    ],
    'Jawa / Yezdi': [
      'Yezdi Roadking (250cc)',
      'Yezdi Classic',
      'Yezdi Monarch',
      'Yezdi 350 (Twin cylinder)',
      'Yezdi CL II',
      'Jawa 250 Type A/B',
      'Jawa 42',
      'Jawa Classic',
      'Jawa Perak',
      'Yezdi Adventure',
      'Yezdi Scrambler',
      'Model Not Listed'
    ],
    'Rajdoot': [
      'Rajdoot 175 (SHL M11)',
      'Rajdoot 350 (Yamaha RD350 Licensed)',
      'Rajdoot GTS / Bobby',
      'Rajdoot Excel T',
      'Model Not Listed'
    ],
    'Lambretta / API': [
      'Lambretta Li 150',
      'Vijay Super (Scooters India Ltd)',
      'Vijeta',
      'Lamby 150',
      'API MAC 175',
      'Lambretta Centauro',
      'Model Not Listed'
    ],
    'Piaggio / Vespa / Aprilia': [
      'Vespa LX 125',
      'Vespa VXL 125/150',
      'Vespa SXL 125/150',
      'Aprilia SR 125/150/160',
      'Aprilia Storm 125',
      'Aprilia SXR 125/160',
      'Model Not Listed'
    ],
    'KTM': [
      'Duke 125',
      'Duke 200',
      'Duke 250',
      'Duke 390',
      'RC 125',
      'RC 200',
      'RC 390',
      'Adventure 250/390',
      'Model Not Listed'
    ],
    'Ather Energy': [
      'Ather 450',
      'Ather 450X',
      'Ather 450S',
      'Ather 450 Apex',
      'Ather Rizta',
      'Model Not Listed'
    ],
    'Ola Electric': [
      'Ola S1',
      'Ola S1 Pro',
      'Ola S1 Air',
      'Ola S1 X',
      'Model Not Listed'
    ],
    'Revolt Motors': [
      'RV400',
      'RV400 BRZ',
      'RV300',
      'Model Not Listed'
    ],
    'TVS Electric': [
      'iQube (Standard / S / ST)',
      'TVS X',
      'Model Not Listed'
    ],
    'Hero Electric': [
      'Optima / Optima CX',
      'Flash',
      'Photon',
      'NYX',
      'Atria',
      'Eddy',
      'Model Not Listed'
    ],
    'Okinawa': [
      'Praise / Praise Pro',
      'Ridge / Ridge Plus',
      'i-Praise Plus',
      'Okhi-90',
      'Dual 100',
      'Model Not Listed'
    ],
    'Ampere': [
      'Magnus EX',
      'Zeus',
      'Reo / Reo Elite',
      'Nexus',
      'Primus',
      'Model Not Listed'
    ],
    'Kawasaki': [
      'Kawasaki Bajaj 4S Champion',
      'Kawasaki Bajaj KB 100',
      'Kawasaki Bajaj Boxer',
      'Ninja 250R / 300 / 400',
      'Z250 / Z650',
      'Model Not Listed'
    ],
    'Other / Unlisted Brand': ['Model Not Listed']
  }
};

// HELPER: Restrict all mobile numbers strictly to 10 digits
const formatMobile10 = (val: string): string => {
  return val.replace(/\D/g, '').slice(0, 10);
};

// HELPER: Mask CoD Number on public marketplace to prevent fraud
const maskCodNumber = (cod: string): string => {
  if (!cod) return 'COD-****-****';
  const parts = cod.split('-');
  if (parts.length >= 4) {
    return `${parts[0]}-${parts[1]}-****-${parts.slice(3).join('-')}`;
  }
  if (cod.length > 8) {
    return cod.slice(0, 4) + '****' + cod.slice(-4);
  }
  return cod.slice(0, 3) + '***';
};

// HELPER: Mask mobile number for public marketplace (e.g. +91 98*** **345)
const maskMobileNumber = (mob?: string): string => {
  if (!mob) return '+91 98*** **000';
  const clean = mob.replace(/\D/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 2)}*** **${clean.slice(-3)}`;
  }
  if (clean.length > 4) {
    return `${clean.slice(0, 2)}****${clean.slice(-2)}`;
  }
  return '******';
};

// HELPER: Mask chassis number for public marketplace (e.g. MA3E****9012)
const maskChassisNumber = (chassis?: string): string => {
  if (!chassis) return 'MA3E****0000';
  const clean = chassis.trim().toUpperCase();
  if (clean.length > 8) {
    return clean.slice(0, 4) + '****' + clean.slice(-4);
  }
  return clean.slice(0, 2) + '****' + clean.slice(-2);
};

// HELPER: Mask engine number for public marketplace (e.g. G13B****34)
const maskEngineNumber = (engine?: string): string => {
  if (!engine) return 'ENG****00';
  const clean = engine.trim().toUpperCase();
  if (clean.length > 6) {
    return clean.slice(0, 4) + '****' + clean.slice(-2);
  }
  return clean.slice(0, 2) + '****' + clean.slice(-2);
};

// HELPER: Mask owner name for public marketplace (e.g. Rajesh P****)
const maskOwnerName = (name?: string): string => {
  if (!name) return 'Owner';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].length > 3 ? `${parts[0].slice(0, 3)}****` : `${parts[0]}*`;
  }
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first} ${last[0]}****`;
};

// HELPER: Mask vehicle reg for public marketplace (e.g. GJ-05-**-1234)
const maskVehicleReg = (reg?: string): string => {
  if (!reg) return 'GJ-05-**-****';
  const clean = reg.trim().toUpperCase();
  const parts = clean.split('-');
  if (parts.length >= 4) {
    return `${parts[0]}-${parts[1]}-**-${parts[3]}`;
  }
  if (clean.length >= 8) {
    return clean.slice(0, 4) + '**' + clean.slice(-4);
  }
  return clean.slice(0, 3) + '****';
};

const DEFAULT_SOCIETIES = [
  'Vaishnodevi Sky',
  'Vaishnodevi Township',
  'Vaishnodevi Ideal Homes',
  'Vaishnodevi Blue Bells',
  'Shyam Heights',
  'Samarpan Heights',
  'Shashank',
  'Nakshatra Nebula',
  'Sangini Swaraj'
];

export default function App() {
  const [lang, setLang] = useState<Language>('EN');
  const [activeTab, setActiveTab] = useState<'scrappage' | 'digielv' | 'admin' | 'societyNoc' | 'godAdmin'>('scrappage');
  
  // GOD ADMIN & MANAGED ACCOUNTS STATE
  const [isGodAdminAuthenticated, setIsGodAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vnd_god_admin_auth') === 'true';
  });
  const [godAdminEmailInput, setGodAdminEmailInput] = useState('');
  const [godAdminPasswordInput, setGodAdminPasswordInput] = useState('');
  const [godAdminAuthError, setGodAdminAuthError] = useState('');

  const [managedSocieties, setManagedSocieties] = useState<ManagedSocietyAccount[]>(() => {
    const saved = localStorage.getItem('vnd_managed_societies');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'soc-acc-1',
        loginEmail: 'society.vaishnodevi@gujarat.gov.in',
        password: 'soc@2026',
        societyName: 'Vaishnodevi Sky Co-Op Housing Society Ltd.',
        address: 'Vaishnodevi Road, Jahangirpura, Surat - 395005',
        regNo: 'SUR/HSG/2012/9904',
        chairmanName: 'Manishbhai V. Patel',
        chairmanMobile: '9825099887',
        secretaryName: 'Bhavin S. Mehta',
        secretaryMobile: '9898011223',
        district: 'RTO Surat (GJ-05)',
        isFirstLoginCompleted: true
      }
    ];
  });

  const [managedVendors, setManagedVendors] = useState<ManagedVendorAccount[]>(() => {
    const saved = localStorage.getItem('vnd_managed_vendors');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'vnd-acc-1',
        loginEmail: 'vendor@ambica.com',
        password: 'vendor@2026',
        vendorName: 'SHREE AMBICA AUTOMOTIVE PVT LTD',
        rvsfRegNo: 'GJ-RVSF-SURAT-004',
        address: 'PLOT NO 122 TOLL NAKA, B K AMBICA TATA, AMBOLI, KAMREJ, SURAT-394180',
        contactPerson: 'Director / Yard Operations',
        mobile: '7043493333',
        gstin: '24AAAAA0000A1Z5',
        isFirstLoginCompleted: true
      }
    ];
  });

  // GOD ADMIN MODALS & FORMS
  const [showSocietyModal, setShowSocietyModal] = useState(false);
  const [societyModalMode, setSocietyModalMode] = useState<'create' | 'edit'>('create');
  const [societyFormData, setSocietyFormData] = useState<ManagedSocietyAccount>({
    id: '',
    loginEmail: '',
    password: '',
    societyName: '',
    address: '',
    regNo: '',
    chairmanName: '',
    chairmanMobile: '',
    secretaryName: '',
    secretaryMobile: '',
    district: 'RTO Surat (GJ-05)',
    isFirstLoginCompleted: false
  });
  const [showSocPassword, setShowSocPassword] = useState(false);

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [vendorModalMode, setVendorModalMode] = useState<'create' | 'edit'>('create');
  const [vendorFormData, setVendorFormData] = useState<ManagedVendorAccount>({
    id: '',
    loginEmail: '',
    password: '',
    vendorName: '',
    rvsfRegNo: '',
    address: '',
    contactPerson: '',
    mobile: '',
    gstin: '',
    isFirstLoginCompleted: false
  });
  const [showVndPassword, setShowVndPassword] = useState(false);

  // RESIDENT AUTO-LOOKUP BY MOBILE OR REG NO ONLY (EXCLUDING NAME SEARCH)
  const [residentSearchInput, setResidentSearchInput] = useState('');
  const [residentLookupMessage, setResidentLookupMessage] = useState('');

  // Societies State
  const [societiesList, setSocietiesList] = useState<string[]>(() => {
    const saved = localStorage.getItem('vnd_societies_list');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIETIES;
  });
  const [showAddSocietyModal, setShowAddSocietyModal] = useState(false);
  const [newSocietyInput, setNewSocietyInput] = useState('');

  // Vendor Auth State
  const [isVendorAuthenticated, setIsVendorAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vnd_vendor_auth') === 'true';
  });
  const [vendorIdInput, setVendorIdInput] = useState('');
  const [vendorPasswordInput, setVendorPasswordInput] = useState('');
  const [vendorAuthError, setVendorAuthError] = useState('');

  // Society Committee Auth State
  const [currentOfficer, setCurrentOfficer] = useState<{
    name: string;
    designation: 'Chairman / Pramukh' | 'Secretary' | 'Committee Member';
    mobile: string;
    idProof: string;
    societyName: string;
    societyRegNo: string;
    societyAddress?: string;
    accountId?: string;
  } | null>(() => {
    const saved = localStorage.getItem('vnd_society_officer');
    return saved ? JSON.parse(saved) : null;
  });

  const [societyLoginEmailInput, setSocietyLoginEmailInput] = useState('');
  const [societyLoginPasswordInput, setSocietyLoginPasswordInput] = useState('');
  const [societyLoginDesignation, setSocietyLoginDesignation] = useState<'Chairman / Pramukh' | 'Secretary'>('Chairman / Pramukh');
  const [showSocietyLoginPassword, setShowSocietyLoginPassword] = useState(false);
  const [societyAuthError, setSocietyAuthError] = useState('');

  // First Login Setup States
  const [showSocietyFirstLoginModal, setShowSocietyFirstLoginModal] = useState(false);
  const [firstLoginSociety, setFirstLoginSociety] = useState<ManagedSocietyAccount | null>(null);

  const [showVendorFirstLoginModal, setShowVendorFirstLoginModal] = useState(false);
  const [firstLoginVendor, setFirstLoginVendor] = useState<ManagedVendorAccount | null>(null);

  // Edit Society Profile Modal
  const [showEditSocietyProfileModal, setShowEditSocietyProfileModal] = useState(false);

  // Pre-Printed Letterhead Header Exclusion state
  const [excludeSocietyHeader, setExcludeSocietyHeader] = useState(false);

  // GOD Admin User Editing State
  const [editingUserLead, setEditingUserLead] = useState<Lead | null>(null);
  const [godUserSearch, setGodUserSearch] = useState('');
  const [godUserSocietyFilter, setGodUserSocietyFilter] = useState('ALL');

  // DigiELV Government Portal Sync State
  const [isSyncingWithGovt, setIsSyncingWithGovt] = useState(false);
  const [lastGovtSyncTime, setLastGovtSyncTime] = useState<string>(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));

  const [officerForm, setOfficerForm] = useState({
    name: 'Manishbhai V. Patel',
    designation: 'Chairman / Pramukh' as 'Chairman / Pramukh' | 'Secretary' | 'Committee Member',
    mobile: '9825099887',
    idProof: 'Aadhaar XXXX-XXXX-9012',
    societyName: 'Vaishnodevi Sky Co-Op Housing Society Ltd.',
    societyRegNo: 'SUR/HSG/2012/9904',
    password: 'password123'
  });

  // Scrappage Leads
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('vnd_scrappage_leads');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'lead-init-1',
        tokenId: 'VND-SCRAP-1082',
        society: 'Vaishnodevi Sky',
        flatNo: 'A-402',
        ownerName: 'Rajeshkumar Patel',
        mobile: '9825012345',
        category: '4W',
        brand: 'Maruti Suzuki',
        model: '800',
        regNumber: 'GJ-05-AB-1234',
        regYear: '2004',
        condition: 'dead',
        rcStatus: 'original',
        idProofVerified: true,
        preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        estWeightKg: 720,
        actualWeightKg: 740,
        ratePerKg: 27,
        estPayout: 19980,
        status: 'Inspected & Weighed',
        createdAt: new Date().toISOString().split('T')[0],
        statusHistory: [
          {
            id: 'h-1',
            fromStatus: 'Registered',
            toStatus: 'Inspected & Weighed',
            timestamp: new Date().toLocaleString('en-IN'),
            updatedBy: 'Vendor Counter',
            note: 'Weighed on digital weighbridge at Shree Ambica Yard. Actual: 740kg @ ₹27/kg.'
          }
        ]
      }
    ];
  });

  // CoD Certificates State
  const [codList, setCodList] = useState<CodCertificate[]>(() => {
    const saved = localStorage.getItem('vnd_digielv_cods');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'cod-seed-1',
        codNumber: 'COD-GJ05-2026-88120',
        chassisNo: 'MA3EYD1S00099201',
        engineNo: 'F8BIN220198',
        vehicleReg: 'GJ-05-AB-1234',
        ownerName: 'Rajeshkumar Patel',
        category: '4W',
        vehicleModel: 'Maruti Suzuki 800',
        vehicleYear: '2004',
        bsCategory: 'BS-II',
        roadTaxWaiverPercent: 25,
        taxConcessionValue: 38000,
        oemDiscountMinPercent: 4,
        oemDiscountMaxPercent: 6,
        registrationFeeBenefit: '100% Waived (₹0 under MoRTH CMVR Rule 115)',
        issueDate: '2026-10-01',
        rvsfName: 'SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF #GJ05-09)',
        status: 'Listed_For_Sale',
        askingPrice: 19500,
        sellerMobile: '9825012345',
        sellerSociety: 'Vaishnodevi Sky (Flat A-402), Surat',
        bidsCount: 2,
        highestBid: 18500,
        bids: [
          {
            id: 'bid-1',
            bidderName: 'Amitbhai Shah',
            bidderMobile: '9898011223',
            bidderSociety: 'Sangini Swaraj, Vesu',
            bidAmount: 18500,
            timestamp: new Date(Date.now() - 86400000 * 2).toLocaleString('en-IN')
          },
          {
            id: 'bid-2',
            bidderName: 'Pratikkumar Dave',
            bidderMobile: '9825123456',
            bidderSociety: 'Adajan, Surat',
            bidAmount: 17500,
            timestamp: new Date(Date.now() - 86400000 * 4).toLocaleString('en-IN')
          }
        ]
      },
      {
        id: 'cod-seed-2',
        codNumber: 'COD-GJ05-2026-94301',
        chassisNo: 'MBLHA10A1K209811',
        engineNo: 'HA10EX99014',
        vehicleReg: 'GJ-01-AB-1234',
        ownerName: 'Hasmukhbhai Prajapati',
        category: '2W',
        vehicleModel: 'Hero Honda Splendor',
        vehicleYear: '2003',
        bsCategory: 'BS-I',
        roadTaxWaiverPercent: 25,
        taxConcessionValue: 8500,
        oemDiscountMinPercent: 3,
        oemDiscountMaxPercent: 5,
        registrationFeeBenefit: '100% Waived (₹0 under MoRTH CMVR Rule 115)',
        issueDate: '2026-09-28',
        rvsfName: 'SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF #GJ05-09)',
        status: 'Listed_For_Sale',
        askingPrice: 4200,
        sellerMobile: '9879543210',
        sellerSociety: 'Royal Heights (Flat B-204), Surat',
        bidsCount: 1,
        highestBid: 4000,
        bids: [
          {
            id: 'bid-3',
            bidderName: 'Chiragbhai Varma',
            bidderMobile: '9898455667',
            bidderSociety: 'Pal Gam, Surat',
            bidAmount: 4000,
            timestamp: new Date(Date.now() - 86400000 * 3).toLocaleString('en-IN')
          }
        ]
      },
      {
        id: 'cod-seed-3',
        codNumber: 'COD-GJ05-2026-77820',
        chassisNo: 'MALBA51EP6M10293',
        engineNo: 'G4HG109283',
        vehicleReg: 'GJ-05-CD-5678',
        ownerName: 'Dharmeshbhai M. Shah',
        category: '4W',
        vehicleModel: 'Hyundai Santro Xing',
        vehicleYear: '2005',
        bsCategory: 'BS-III',
        roadTaxWaiverPercent: 25,
        taxConcessionValue: 34000,
        oemDiscountMinPercent: 4,
        oemDiscountMaxPercent: 6,
        registrationFeeBenefit: '100% Waived (₹0 under MoRTH CMVR Rule 115)',
        issueDate: '2026-09-25',
        rvsfName: 'SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF #GJ05-09)',
        status: 'Listed_For_Sale',
        askingPrice: 17000,
        sellerMobile: '9824188765',
        sellerSociety: 'Sangini Swaraj (Flat C-501), Surat',
        bidsCount: 1,
        highestBid: 16500,
        bids: [
          {
            id: 'bid-4',
            bidderName: 'Sunilkumar Mehta',
            bidderMobile: '9825877889',
            bidderSociety: 'Citylight, Surat',
            bidAmount: 16500,
            timestamp: new Date(Date.now() - 86400000).toLocaleString('en-IN')
          }
        ]
      }
    ];
  });

  // IN-APP DELETE CONFIRMATION MODAL STATE (Guaranteed to work reliably in sandboxed iframes)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemDetails?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const requestConfirmDelete = (
    title: string,
    message: string,
    onConfirm: () => void,
    itemDetails?: string,
    confirmLabel: string = 'Permanently Delete'
  ) => {
    setConfirmDeleteModal({
      isOpen: true,
      title,
      message,
      itemDetails,
      confirmLabel,
      onConfirm: () => {
        onConfirm();
        setConfirmDeleteModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Calculator State
  const [calcCategory, setCalcCategory] = useState<'2W' | '4W'>('4W');
  const [calcWeight, setCalcWeight] = useState<number>(850);
  const [calcRate, setCalcRate] = useState<number>(26.5);

  // Registration Form State
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    society: 'Vaishnodevi Sky',
    customSociety: '',
    flatNo: '',
    ownerName: '',
    mobile: '',
    category: '4W' as '2W' | '4W',
    brand: 'Maruti Suzuki',
    model: '800 (SS80 / Type 1 / 2)',
    customModel: '',
    isCustomModel: false,
    regNumber: '',
    regYear: '2004',
    condition: 'dead' as 'dead' | 'incomplete' | 'running_expired' | 'scrap' | 'rusted' | 'stripped' | 'non_functional',
    rcStatus: 'original' as 'original' | 'mparivahan' | 'lost' | 'scrap_unregistered',
    hypothecationStatus: 'cleared' as 'cleared' | 'hypothecated',
    aadhaarNumber: '',
    panNumber: '',
    parkingLocation: '',
    chassisNumber: '',
    engineNumber: '',
    rcPreviewUrl: '',
    rcFileAttached: false,
    rcFileName: '',
    idProofVerified: true,
    idProofPreviewUrl: '',
    aadhaarFileAttached: false,
    aadhaarFileName: '',
    panFileAttached: false,
    panFileName: '',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTimeSlot: 'Morning (09:00 AM - 12:00 PM)'
  });
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  // DigiELV Marketplace State
  const [selectedCodForModal, setSelectedCodForModal] = useState<CodCertificate | null>(null);
  const [bidAmountInput, setBidAmountInput] = useState<number>(0);
  const [bidderMobileInput, setBidderMobileInput] = useState('');
  const [bidderNameInput, setBidderNameInput] = useState('');
  const [bidError, setBidError] = useState('');

  // Vendor Admin Panel State (Comprehensive Filters & Sorting)
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSocietyFilter, setAdminSocietyFilter] = useState('ALL');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<'ALL' | '2W' | '4W'>('ALL');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('ALL');
  const [adminWeightFilter, setAdminWeightFilter] = useState<string>('ALL');
  const [adminSortBy, setAdminSortBy] = useState<
    'date_desc' | 'date_asc' | 'weight_desc' | 'weight_asc' | 'payout_desc' | 'payout_asc' | 'owner_asc' | 'society_asc' | 'status_asc'
  >('date_desc');
  const [vendorSubTab, setVendorSubTab] = useState<'leads' | 'bids' | 'cods'>('leads');

  // CoD Filter States for CoD Registry Sub-tab
  const [codSearch, setCodSearch] = useState('');
  const [codCategoryFilter, setCodCategoryFilter] = useState<'ALL' | '2W' | '4W'>('ALL');
  const [codMarketplaceFilter, setCodMarketplaceFilter] = useState<'ALL' | 'Listed' | 'Private'>('ALL');

  // Physical CoD Manual Issuance Modal State
  const [showIssueCodModal, setShowIssueCodModal] = useState(false);
  const [codTargetLead, setCodTargetLead] = useState<Lead | null>(null);
  const [codFormData, setCodFormData] = useState({
    codNumber: '',
    digielvRef: '',
    chassisNo: '',
    engineNo: '',
    vehicleReg: '',
    ownerName: '',
    category: '4W' as '2W' | '4W',
    vehicleModel: '',
    vehicleYear: '2004',
    bsCategory: 'BS-II' as 'BS-I' | 'BS-II' | 'BS-III' | 'BS-IV' | 'Pre-BS' | 'BS-VI',
    roadTaxWaiverPercent: 25,
    taxConcessionValue: 38000,
    oemDiscountMinPercent: 4,
    oemDiscountMaxPercent: 6,
    registrationFeeBenefit: '100% Waived (₹0 under MoRTH CMVR Rule 115)',
    issueDate: new Date().toISOString().split('T')[0],
    rvsfName: 'SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF #GJ05-09)',
    listOnMarketplace: true,
    askingPrice: 19500,
    sellerMobile: '',
    sellerSociety: '',
    rtoJurisdiction: 'GJ-05 Surat RTO',
    remarks: ''
  });

  // Certificate Detail / Print Preview Modal State
  const [viewingCodCertificate, setViewingCodCertificate] = useState<CodCertificate | null>(null);

  // Full Lead Edit Modal State (CRUD)
  const [editingLeadModal, setEditingLeadModal] = useState<Lead | null>(null);

  // Batch Society Migration Modal State
  const [showSocietyMigrationModal, setShowSocietyMigrationModal] = useState(false);
  const [migrationSourceSociety, setMigrationSourceSociety] = useState('');
  const [migrationTargetSociety, setMigrationTargetSociety] = useState('');
  const [migrationCustomTarget, setMigrationCustomTarget] = useState('');

  // Walk-In Customer Intake Form State (Comprehensive fields)
  const [showWalkInModal, setShowAddWalkInModal] = useState(false);
  const [walkInFormData, setWalkInFormData] = useState({
    ownerName: '',
    mobile: '',
    society: 'Vaishnodevi Sky',
    customSociety: '',
    flatNo: '',
    address: 'Near Society Entrance, Palanpur Canal Road, Surat',
    category: '4W' as '2W' | '4W',
    brand: 'Maruti Suzuki',
    model: '800 (SS80 / Type 1 / 2)',
    customModel: '',
    regNumber: '',
    regYear: '2005',
    chassisNumber: '',
    engineNumber: '',
    condition: 'dead' as Lead['condition'],
    rcStatus: 'original' as Lead['rcStatus'],
    aadhaarNumber: '',
    panNumber: '',
    hypothecationStatus: 'cleared' as 'cleared' | 'hypothecated',
    parkingLocation: 'Direct Yard Delivery / Walk-In Counter',
    actualWeightKg: 850,
    ratePerKg: 27.0,
    paymentMethod: 'Instant UPI / Bank Transfer',
    remarks: 'Physical counter walk-in intake at Shree Ambica RVSF Yard'
  });

  // Edit Pricing & Weight Modal State
  const [editingPricingLead, setEditingPricingLead] = useState<Lead | null>(null);
  const [editActualWeightInput, setEditActualWeightInput] = useState<number>(800);
  const [editRatePerKgInput, setEditRatePerKgInput] = useState<number>(27.0);

  // Bulk Selection & Lead Detail Modal State
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [batchTargetStatus, setBatchTargetStatus] = useState<Lead['status']>('Inspected & Weighed');
  const [activeLeadModal, setActiveLeadModal] = useState<Lead | null>(null);

  // SOCIETY ABANDONED VEHICLE NOC & AUTOMATED RESOLUTION DRAFTING STATE
  const [nocSocietyName, setNocSocietyName] = useState('Vaishnodevi Sky Co-Op Housing Society Ltd.');
  const [nocSocietyRegNo, setNocSocietyRegNo] = useState('SUR/HSG/2012/9904');
  const [nocSocietyAddress, setNocSocietyAddress] = useState('Palanpur Canal Road, Near T.P. 10, Jahangirpura, Surat - 395009, Gujarat');
  const [nocResolutionDate, setNocResolutionDate] = useState('2026-09-15');
  const [nocResolutionNo, setNocResolutionNo] = useState('RES/2026/09-12');
  const [nocMeetingVenue, setNocMeetingVenue] = useState('Society Clubhouse / Registered Office');
  
  // Police Jurisdiction Details
  const [nocLocalPoliceStation, setNocLocalPoliceStation] = useState('Palanpur Jakatnaka Police Station, Surat');
  const [nocPoliceStationHead, setNocPoliceStationHead] = useState<'Police Inspector (PI)' | 'The Station House Officer (SHO)'>('Police Inspector (PI)');
  const [nocPoliceStationAddress, setNocPoliceStationAddress] = useState('Opp. Galaxy Circle, Palanpur Canal Road, Rander-Adajan Zone, Surat, Gujarat - 395009');

  // RTO Jurisdiction Details
  const [nocRtoOffice, setNocRtoOffice] = useState('Regional Transport Office, Surat (GJ-05), Gujarat');
  const [nocRtoPostalAddress, setNocRtoPostalAddress] = useState('RTO Office Complex, Pal-Hazira Road, Near Pal RTO, Pal, Surat, Gujarat - 395009');

  // Authorized Signatories Details
  const [nocChairmanName, setNocChairmanName] = useState('Manishbhai V. Patel');
  const [nocChairmanMobile, setNocChairmanMobile] = useState('9825099887');
  const [nocChairmanIdProof, setNocChairmanIdProof] = useState('Aadhaar XXXX-XXXX-9012');
  const [nocSecretaryName, setNocSecretaryName] = useState('Bhavin S. Mehta');
  const [nocSecretaryMobile, setNocSecretaryMobile] = useState('9898011223');
  const [nocSecretaryIdProof, setNocSecretaryIdProof] = useState('PAN ABCPM1234K');

  // Authorized RVSF Scrapping Agency Details
  const [nocRvsfPartnerName, setNocRvsfPartnerName] = useState('SHREE AMBICA AUTOMOTIVE PVT LTD (Govt Authorized RVSF)');
  const [nocRvsfLicenseId, setNocRvsfLicenseId] = useState('MoRTH/RVSF/GJ-05/2023/009');

  // CORE COMMITTEE MEMBERS (ATTENDANCE REGISTER FOR RESOLUTION)
  const [committeeMembers, setCommitteeMembers] = useState<{ id: string; name: string; designation: string; flatNo: string; mobile: string; }[]>([
    { id: 'cm-1', name: 'Manishbhai V. Patel', designation: 'Chairman / Pramukh', flatNo: 'A-101', mobile: '9825099887' },
    { id: 'cm-2', name: 'Bhavin S. Mehta', designation: 'Secretary', flatNo: 'B-202', mobile: '9898011223' },
    { id: 'cm-3', name: 'Rameshbhai K. Shah', designation: 'Treasurer / Khajanchi', flatNo: 'C-303', mobile: '9825144556' },
    { id: 'cm-4', name: 'Sanjaykumar R. Joshi', designation: 'Executive Committee Member', flatNo: 'A-504', mobile: '9898077889' }
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberDesignation, setNewMemberDesignation] = useState('Executive Committee Member');
  const [newMemberFlat, setNewMemberFlat] = useState('');
  const [newMemberMobile, setNewMemberMobile] = useState('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  
  const [nocDraftDocType, setNocDraftDocType] = useState<
    'COMPLETE_SUITE' | 'SECTION_1_CHECKLIST' | 'SECTION_2_RESOLUTION' | 'SECTION_3_POLICE' | 'SECTION_4_RTO' | 'SECTION_5_SCHEDULE'
  >('COMPLETE_SUITE');
  const [nocLetterLang, setNocLetterLang] = useState<'EN' | 'GU' | 'HI'>('GU');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // ABANDONED VEHICLE LOG
  const [abandonedVehiclesList, setAbandonedVehiclesList] = useState<AbandonedVehicleItem[]>([
    {
      id: 'ab-1',
      category: '2W',
      makeModel: 'Hero Honda Splendor',
      color: 'Black & Red',
      regNumber: 'GJ-01-AB-1234',
      chassisNumber: 'MBLHA10XXXXXXXXX1',
      engineNumber: 'HA10EXXXXXXXXX2',
      condition: 'Scrap',
      durationYears: 3,
      parkingSpot: 'Wing A, Parking Slot No. 12'
    },
    {
      id: 'ab-2',
      category: '4W',
      makeModel: 'Hyundai Santro Xing',
      color: 'Silver',
      regNumber: 'Unknown / Missing',
      chassisNumber: 'MALBA51XXXXXXXXX3',
      engineNumber: 'G4HGXXXXXXXXX4',
      condition: 'Rusted',
      durationYears: 4,
      parkingSpot: 'Basement B-2, Slot 08'
    }
  ]);

  const [newAbCategory, setNewAbCategory] = useState<'2W' | '4W'>('4W');
  const [newAbMakeModel, setNewAbMakeModel] = useState('');
  const [newAbColor, setNewAbColor] = useState('');
  const [newAbRegNo, setNewAbRegNo] = useState('');
  const [newAbChassisNo, setNewAbChassisNo] = useState('');
  const [newAbEngineNo, setNewAbEngineNo] = useState('');
  const [newAbCondition, setNewAbCondition] = useState<'Scrap' | 'Rusted' | 'Stripped' | 'Non-functional'>('Scrap');
  const [newAbDuration, setNewAbDuration] = useState<number>(3);
  const [newAbSpot, setNewAbSpot] = useState('');
  const [editingAbVehicleId, setEditingAbVehicleId] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('vnd_scrappage_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('vnd_digielv_cods', JSON.stringify(codList));
  }, [codList]);

  useEffect(() => {
    localStorage.setItem('vnd_societies_list', JSON.stringify(societiesList));
  }, [societiesList]);

  useEffect(() => {
    localStorage.setItem('vnd_managed_societies', JSON.stringify(managedSocieties));
  }, [managedSocieties]);

  useEffect(() => {
    localStorage.setItem('vnd_managed_vendors', JSON.stringify(managedVendors));
  }, [managedVendors]);

  const t = TRANSLATIONS[lang];
  const livePayout = useMemo(() => Math.round(calcWeight * calcRate), [calcWeight, calcRate]);

  const availableModels = useMemo(() => {
    return BRANDS_DATABASE[formData.category][formData.brand] || ['Model Not Listed'];
  }, [formData.category, formData.brand]);

  const handleBrandChange = (newBrand: string) => {
    const models = BRANDS_DATABASE[formData.category][newBrand] || ['Model Not Listed'];
    setFormData(prev => ({
      ...prev,
      brand: newBrand,
      model: models[0] || 'Model Not Listed',
      isCustomModel: false
    }));
  };

  const walkInAvailableModels = useMemo(() => {
    return BRANDS_DATABASE[walkInFormData.category][walkInFormData.brand] || ['Model Not Listed'];
  }, [walkInFormData.category, walkInFormData.brand]);

  const handleWalkInBrandChange = (newBrand: string) => {
    const models = BRANDS_DATABASE[walkInFormData.category][newBrand] || ['Model Not Listed'];
    setWalkInFormData(prev => ({
      ...prev,
      brand: newBrand,
      model: models[0] || 'Model Not Listed',
      customModel: ''
    }));
  };

  const handleWalkInCategoryChange = (newCat: '2W' | '4W') => {
    const defaultBrand = newCat === '2W' ? 'Hero Honda / Hero MotoCorp' : 'Maruti Suzuki';
    const models = BRANDS_DATABASE[newCat][defaultBrand] || ['Model Not Listed'];
    setWalkInFormData(prev => ({
      ...prev,
      category: newCat,
      brand: defaultBrand,
      model: models[0] || 'Model Not Listed',
      customModel: '',
      actualWeightKg: newCat === '2W' ? 110 : 850
    }));
  };

  const fillFormFromCalculator = () => {
    setFormData(prev => ({
      ...prev,
      category: calcCategory,
      brand: calcCategory === '2W' ? 'Bajaj' : 'Maruti Suzuki',
      model: calcCategory === '2W' ? 'Chetak' : '800'
    }));
    const el = document.getElementById('registration-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddSociety = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocietyInput.trim()) return;
    const formatted = newSocietyInput.trim();
    if (!societiesList.includes(formatted)) {
      setSocietiesList(prev => [...prev, formatted]);
    }
    setFormData(prev => ({ ...prev, society: formatted }));
    setNewSocietyInput('');
    setShowAddSocietyModal(false);
  };

  // PRINT DOCUMENT HANDLER
  const handlePrintDocument = () => {
    const element = document.getElementById('noc-official-letter-draft');
    if (!element) {
      window.print();
      return;
    }

    try {
      const printWindow = window.open('', '_blank', 'width=900,height=1000');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${nocSocietyName} - Legal Letter</title>
              <style>
                body {
                  font-family: Arial, sans-serif, serif;
                  padding: 30px;
                  color: #000;
                  background: #fff;
                  line-height: 1.6;
                }
                .no-print-placeholder { display: none !important; visibility: hidden !important; }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 12px;
                  margin-bottom: 12px;
                }
                th, td {
                  border: 1px solid #333;
                  padding: 6px 8px;
                  font-size: 11px;
                  text-align: left;
                }
                th {
                  background-color: #f5f5f5;
                  font-weight: bold;
                }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .font-mono { font-family: monospace; }
                @media print {
                  body { padding: 0; }
                  @page { size: A4; margin: 15mm; }
                  .no-print-placeholder { display: none !important; visibility: hidden !important; }
                  .letterhead-blank-space { border: none !important; border-bottom: none !important; }
                }
              </style>
            </head>
            <body>
              ${element.innerHTML}
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 400);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        return;
      }
    } catch (e) {
      console.warn('Popup print blocked, fallback to window.print():', e);
    }

    window.print();
  };

  // PDF DOWNLOAD GENERATOR - FULL MULTI-PAGE EXPORT WITH ZERO TRUNCATION
  const handleDownloadPdfDocument = async () => {
    const element = document.getElementById('noc-official-letter-draft');
    if (!element) {
      handlePrintDocument();
      return;
    }
    setIsGeneratingPdf(true);
    try {
      // html2canvas capture with unconstrained cloned element dimensions
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('noc-official-letter-draft');
          if (clonedElement) {
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.padding = '30px';
            const placeholders = clonedElement.querySelectorAll('.no-print-placeholder');
            placeholders.forEach(el => (el as HTMLElement).style.display = 'none');
            const blankSpaces = clonedElement.querySelectorAll('.letterhead-blank-space');
            blankSpaces.forEach(el => {
              (el as HTMLElement).style.border = 'none';
              (el as HTMLElement).style.borderBottom = 'none';
            });
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add Page 1
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfPageHeight;

      // Loop to add extra A4 pages if document exceeds single page
      while (heightLeft > 0) {
        position -= pdfPageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfPageHeight;
      }
      
      const cleanDocName = 
        nocDraftDocType === 'COMPLETE_SUITE' ? 'Complete_5Section_Legal_Suite' :
        nocDraftDocType === 'SECTION_1_CHECKLIST' ? 'Section1_Compliance_Checklist' :
        nocDraftDocType === 'SECTION_2_RESOLUTION' ? 'Section2_Society_Resolution' :
        nocDraftDocType === 'SECTION_3_POLICE' ? 'Section3_Police_Intimation_Notice' :
        nocDraftDocType === 'SECTION_4_RTO' ? 'Section4_RTO_Deregistration_Petition' :
        nocDraftDocType === 'SECTION_5_SCHEDULE' ? 'Section5_ScheduleA_Vehicle_Inventory' :
        'Legal_Documentation_Suite';
      const cleanSocName = nocSocietyName.replace(/[^a-zA-Z0-9]/g, '_');
      const letterheadSuffix = excludeSocietyHeader ? '_Letterhead_Blank' : '';
      pdf.save(`${cleanSocName}_${cleanDocName}_${nocLetterLang}${letterheadSuffix}.pdf`);
    } catch (err) {
      console.error('PDF generation error, fallback to print:', err);
      handlePrintDocument();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Submit Lead from Online Citizen Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `VND-SCRAP-${Math.floor(1000 + Math.random() * 9000)}`;
    const estW = formData.category === '2W' ? 110 : 850;
    const payout = Math.round(estW * calcRate);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      tokenId: token,
      society: formData.society === 'Other (Enter custom society name)' ? (formData.customSociety || 'Other Society') : formData.society,
      flatNo: formData.flatNo,
      ownerName: formData.ownerName,
      mobile: formatMobile10(formData.mobile),
      category: formData.category,
      brand: formData.brand,
      model: formData.model === 'Model Not Listed' ? (formData.customModel || 'Unlisted Model') : formData.model,
      regNumber: formData.regNumber.trim().toUpperCase(),
      regYear: formData.regYear,
      condition: formData.condition,
      rcStatus: formData.rcStatus,
      rcPreviewUrl: formData.rcPreviewUrl,
      idProofVerified: true,
      aadhaarNumber: formData.aadhaarNumber.trim(),
      panNumber: formData.panNumber.trim().toUpperCase(),
      hypothecationStatus: formData.hypothecationStatus,
      parkingLocation: formData.parkingLocation,
      chassisNumber: formData.chassisNumber.trim().toUpperCase() || undefined,
      engineNumber: formData.engineNumber.trim().toUpperCase() || undefined,
      idProofPreviewUrl: formData.idProofPreviewUrl,
      preferredDate: formData.preferredDate,
      preferredTimeSlot: formData.preferredTimeSlot,
      estWeightKg: estW,
      actualWeightKg: estW,
      ratePerKg: calcRate,
      estPayout: payout,
      status: 'Registered',
      createdAt: new Date().toISOString().split('T')[0],
      statusHistory: [
        {
          id: `h-${Date.now()}`,
          fromStatus: 'New Submission',
          toStatus: 'Registered',
          timestamp: new Date().toLocaleString('en-IN'),
          updatedBy: 'Resident Owner',
          note: 'Submitted via Vaishnodevi Scrappage Drive Portal with Aadhaar & PAN KYC.'
        }
      ]
    };

    setLeads(prev => [newLead, ...prev]);
    setSubmittedLead(newLead);
    setStep(4);
  };

  // Walk-In Submit (Comprehensive Data Capture)
  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `VND-WALKIN-${Math.floor(1000 + Math.random() * 9000)}`;
    const actualW = walkInFormData.actualWeightKg || (walkInFormData.category === '2W' ? 110 : 850);
    const rateKg = walkInFormData.ratePerKg || 27.0;
    const finalValuation = Math.round(actualW * rateKg);

    const resolvedSociety = walkInFormData.society === 'Other (Enter custom society name)'
      ? (walkInFormData.customSociety || 'Other Society')
      : walkInFormData.society;

    const resolvedModel = walkInFormData.model === 'Model Not Listed'
      ? (walkInFormData.customModel || 'Unlisted Model')
      : walkInFormData.model;

    const walkInLead: Lead = {
      id: `lead-walkin-${Date.now()}`,
      tokenId: token,
      society: resolvedSociety,
      flatNo: walkInFormData.flatNo || 'Counter Walk-In',
      ownerName: walkInFormData.ownerName.trim(),
      mobile: formatMobile10(walkInFormData.mobile),
      category: walkInFormData.category,
      brand: walkInFormData.brand,
      model: resolvedModel,
      regNumber: walkInFormData.regNumber.trim().toUpperCase() || 'SCRAP-NO-PLATE',
      regYear: walkInFormData.regYear,
      chassisNumber: walkInFormData.chassisNumber.trim().toUpperCase() || undefined,
      engineNumber: walkInFormData.engineNumber.trim().toUpperCase() || undefined,
      condition: 'scrap',
      rcStatus: walkInFormData.rcStatus,
      idProofVerified: true,
      aadhaarNumber: walkInFormData.aadhaarNumber.trim(),
      panNumber: walkInFormData.panNumber.trim().toUpperCase(),
      preferredDate: new Date().toISOString().split('T')[0],
      paymentMethod: walkInFormData.paymentMethod,
      remarks: walkInFormData.remarks,
      estWeightKg: actualW,
      actualWeightKg: actualW,
      ratePerKg: rateKg,
      estPayout: finalValuation,
      status: 'Inspected & Weighed',
      createdAt: new Date().toISOString().split('T')[0],
      isWalkIn: true,
      statusHistory: [
        {
          id: `h-${Date.now()}`,
          fromStatus: 'Initial',
          toStatus: 'Inspected & Weighed',
          timestamp: new Date().toLocaleString('en-IN'),
          updatedBy: 'Vendor Counter',
          note: `Walk-in customer registered at RVSF counter. Weight: ${actualW}kg @ ₹${rateKg}/kg. KYC: Aadhaar ${walkInFormData.aadhaarNumber || 'Verified'}, PAN ${walkInFormData.panNumber || 'Verified'}.`
        }
      ]
    };

    setLeads(prev => [walkInLead, ...prev]);
    setShowAddWalkInModal(false);
  };

  // Open Physical CoD Issuance Modal
  const openIssueCodModal = (target: Lead) => {
    setCodTargetLead(target);
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const existingCod = codList.find(c => c.leadId === target.id || c.vehicleReg === target.regNumber);
    
    // Calculate BS category from year
    const y = parseInt(target.regYear, 10) || 2004;
    let autoBs: 'BS-I' | 'BS-II' | 'BS-III' | 'BS-IV' | 'Pre-BS' | 'BS-VI' = 'BS-II';
    if (y < 2000) autoBs = 'Pre-BS';
    else if (y <= 2005) autoBs = 'BS-I';
    else if (y <= 2010) autoBs = 'BS-II';
    else if (y <= 2017) autoBs = 'BS-III';
    else if (y <= 2020) autoBs = 'BS-IV';
    else autoBs = 'BS-VI';

    setCodFormData({
      codNumber: existingCod ? existingCod.codNumber : `COD-GJ05-2026-${randomSuffix}`,
      chassisNo: existingCod ? existingCod.chassisNo : (target.chassisNumber || `GJ05CH${target.regNumber.replace(/[^A-Z0-9]/g, '') || randomSuffix}`),
      engineNo: existingCod ? (existingCod.engineNo || '') : (target.engineNumber || `ENG${randomSuffix}`),
      vehicleReg: target.regNumber,
      ownerName: target.ownerName,
      category: target.category,
      vehicleModel: `${target.brand} ${target.model}`,
      vehicleYear: existingCod ? String(existingCod.vehicleYear) : (target.regYear || '2004'),
      bsCategory: existingCod ? existingCod.bsCategory : autoBs,
      roadTaxWaiverPercent: existingCod ? existingCod.roadTaxWaiverPercent : (target.category === '4W' ? 25 : 25),
      taxConcessionValue: existingCod ? (existingCod.taxConcessionValue || 38000) : (target.category === '4W' ? 38000 : 8500),
      oemDiscountMinPercent: existingCod ? existingCod.oemDiscountMinPercent : (target.category === '4W' ? 4 : 3),
      oemDiscountMaxPercent: existingCod ? existingCod.oemDiscountMaxPercent : (target.category === '4W' ? 6 : 5),
      registrationFeeBenefit: existingCod ? existingCod.registrationFeeBenefit : '100% Waived (₹0 under MoRTH CMVR Rule 115)',
      issueDate: existingCod ? existingCod.issueDate : new Date().toISOString().split('T')[0],
      rvsfName: 'SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF #GJ05-09)',
      listOnMarketplace: existingCod ? existingCod.status === 'Listed_For_Sale' : true,
      askingPrice: existingCod?.askingPrice || Math.round(target.estPayout * 0.95),
      sellerMobile: formatMobile10(target.mobile),
      sellerSociety: `${target.society} (${target.flatNo})`,
      digielvRef: `DELV-2026-${randomSuffix}`,
      rtoJurisdiction: 'GJ-05 Surat RTO',
      remarks: 'Issued against verified resident inspection'
    });
    setShowIssueCodModal(true);
  };

  // Open Direct Physical CoD Issuance (Without Lead)
  const handleOpenDirectIssueCod = () => {
    setCodTargetLead(null);
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    setCodFormData({
      codNumber: `COD-GJ05-2026-${randomSuffix}`,
      digielvRef: `DELV-2026-${randomSuffix}`,
      chassisNo: '',
      engineNo: '',
      vehicleReg: '',
      ownerName: '',
      category: '4W',
      vehicleModel: '',
      vehicleYear: '2004',
      bsCategory: 'BS-II',
      roadTaxWaiverPercent: 25,
      taxConcessionValue: 38000,
      oemDiscountMinPercent: 4,
      oemDiscountMaxPercent: 6,
      registrationFeeBenefit: '100% Waived (₹0 under MoRTH CMVR Rule 115)',
      issueDate: new Date().toISOString().split('T')[0],
      rvsfName: 'SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF #GJ05-09)',
      listOnMarketplace: true,
      askingPrice: 19500,
      sellerMobile: '',
      sellerSociety: 'Vaishnodevi Sky, Surat',
      rtoJurisdiction: 'GJ-05 Surat RTO',
      remarks: 'Direct counter CoD registration'
    });
    setShowIssueCodModal(true);
  };

  // Save Physical CoD Details & Update Status
  const handleSavePhysicalCod = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLeadId = codTargetLead ? codTargetLead.id : `cod-direct-${Date.now()}`;

    const newCod: CodCertificate = {
      id: `cod-${targetLeadId}`,
      codNumber: codFormData.codNumber.trim().toUpperCase(),
      chassisNo: codFormData.chassisNo.trim().toUpperCase() || 'CHASSIS-UNRECORDED',
      engineNo: codFormData.engineNo.trim().toUpperCase() || 'ENGINE-UNRECORDED',
      vehicleReg: codFormData.vehicleReg.trim().toUpperCase(),
      ownerName: codFormData.ownerName.trim(),
      category: codFormData.category,
      vehicleModel: codFormData.vehicleModel.trim(),
      vehicleYear: codFormData.vehicleYear || '2004',
      bsCategory: codFormData.bsCategory || 'BS-II',
      roadTaxWaiverPercent: Number(codFormData.roadTaxWaiverPercent) || 25,
      taxConcessionValue: Number(codFormData.taxConcessionValue) || 38000,
      oemDiscountMinPercent: Number(codFormData.oemDiscountMinPercent) || 4,
      oemDiscountMaxPercent: Number(codFormData.oemDiscountMaxPercent) || 6,
      registrationFeeBenefit: codFormData.registrationFeeBenefit || '100% Waived (₹0 under MoRTH CMVR Rule 115)',
      issueDate: codFormData.issueDate,
      rvsfName: codFormData.rvsfName,
      status: codFormData.listOnMarketplace ? 'Listed_For_Sale' : 'Available',
      askingPrice: Number(codFormData.askingPrice) || (codFormData.category === '4W' ? 19500 : 4500),
      sellerMobile: formatMobile10(codFormData.sellerMobile),
      sellerSociety: codFormData.sellerSociety,
      leadId: codTargetLead ? codTargetLead.id : undefined,
      bidsCount: 0,
      highestBid: 0,
      bids: []
    };

    setCodList(prev => {
      const filtered = prev.filter(c => c.codNumber !== newCod.codNumber && (codTargetLead ? c.leadId !== codTargetLead.id : true));
      return [newCod, ...filtered];
    });

    // Update Lead to CoD Issued with history note if linked to lead
    if (codTargetLead) {
      setLeads(prev => prev.map(l => {
        if (l.id === codTargetLead.id) {
          const history = l.statusHistory || [];
          const updatedHistory: StatusHistoryItem[] = [
            ...history,
            {
              id: `h-${Date.now()}`,
              fromStatus: l.status,
              toStatus: 'CoD Issued',
              timestamp: new Date().toLocaleString('en-IN'),
              updatedBy: 'Vendor Counter',
              note: `Physical Certificate of Deposit issued: ${newCod.codNumber}. Chassis: ${newCod.chassisNo}. Tax Waiver: ${newCod.roadTaxWaiverPercent}%. BS Category: ${newCod.bsCategory}. Marketplace: ${codFormData.listOnMarketplace ? 'Listed on DigiELV Market' : 'Private (Owner Retained)'}.`
            }
          ];
          return {
            ...l,
            status: 'CoD Issued',
            codNumber: newCod.codNumber,
            chassisNumber: newCod.chassisNo,
            engineNumber: newCod.engineNo,
            statusHistory: updatedHistory
          };
        }
        return l;
      }));
    }

    setShowIssueCodModal(false);
    setCodTargetLead(null);
  };

  // Toggle Marketplace Listing for any CoD (Button/Checkbox action)
  const handleToggleCodMarketListing = (codId: string) => {
    setCodList(prev => prev.map(c => {
      if (c.id === codId) {
        const nextStatus = c.status === 'Listed_For_Sale' ? 'Available' : 'Listed_For_Sale';
        return {
          ...c,
          status: nextStatus
        };
      }
      return c;
    }));
  };

  // Delete CoD Record (Using Reliable In-App Confirmation)
  const handleDeleteCod = (codId: string) => {
    const target = codList.find(c => c.id === codId);
    if (!target) return;
    requestConfirmDelete(
      'Delete Certificate of Deposit (CoD)',
      `Are you sure you want to delete CoD certificate "${target.codNumber}" for vehicle "${target.vehicleReg}"? This record will be removed from the registry and DigiELV trading.`,
      () => {
        setCodList(prev => prev.filter(c => c.id !== codId));
        if (target.leadId) {
          setLeads(prev => prev.map(l => l.id === target.leadId ? { ...l, codNumber: undefined } : l));
        }
      },
      `CoD #${target.codNumber} • ${target.vehicleModel} (${target.vehicleReg}) • Holder: ${target.ownerName}`
    );
  };

  // Delete Lead Record (Using Reliable In-App Confirmation)
  const handleDeleteLead = (leadId: string) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;
    requestConfirmDelete(
      'Permanently Delete Vehicle Lead',
      `Are you sure you want to permanently delete vehicle registration record for "${target.ownerName}" (${target.regNumber})? This operation will remove all associated logs and cannot be undone.`,
      () => {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        setSelectedLeadIds(prev => prev.filter(id => id !== leadId));
        setCodList(prev => prev.filter(c => c.leadId !== leadId));
      },
      `Token ID: ${target.tokenId} • ${target.brand} ${target.model} (${target.regNumber}) • Society: ${target.society}`
    );
  };

  // Save Full Lead Modifications (Full CRUD)
  const handleSaveEditLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeadModal) return;

    const updated = { ...editingLeadModal };
    const actualW = updated.actualWeightKg || updated.estWeightKg;
    const finalPayout = Math.round(actualW * updated.ratePerKg);
    updated.estPayout = finalPayout;
    updated.mobile = formatMobile10(updated.mobile);

    setLeads(prev => prev.map(l => {
      if (l.id === updated.id) {
        const history = l.statusHistory || [];
        const updatedHistory: StatusHistoryItem[] = [
          ...history,
          {
            id: `h-${Date.now()}`,
            fromStatus: l.status,
            toStatus: updated.status,
            timestamp: new Date().toLocaleString('en-IN'),
            updatedBy: 'Vendor Administrator',
            note: `Listing modified: ${updated.ownerName}, ${updated.society} (${updated.flatNo}), Weight: ${actualW}kg @ ₹${updated.ratePerKg}/kg. Status: ${updated.status}.`
          }
        ];
        return {
          ...updated,
          statusHistory: updatedHistory
        };
      }
      return l;
    }));

    // Sync owner & vehicle to CoD if one exists
    setCodList(prev => prev.map(c => {
      if (c.leadId === updated.id || c.vehicleReg === updated.regNumber) {
        return {
          ...c,
          ownerName: updated.ownerName,
          sellerMobile: updated.mobile,
          sellerSociety: `${updated.society} (${updated.flatNo})`,
          vehicleModel: `${updated.brand} ${updated.model}`,
          vehicleReg: updated.regNumber
        };
      }
      return c;
    }));

    setEditingLeadModal(null);
  };

  // Batch Society Migration & Global Purge Tool
  const handleExecuteSocietyMigration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!migrationSourceSociety) return;
    const resolvedTarget = migrationTargetSociety === 'NEW_CUSTOM' ? migrationCustomTarget.trim() : migrationTargetSociety.trim();
    if (!resolvedTarget) {
      alert('Please specify a valid target society name.');
      return;
    }
    if (resolvedTarget === migrationSourceSociety) {
      alert('Source and target society names must be different.');
      return;
    }

    let affectedLeads = 0;
    let affectedCods = 0;

    // 1. Migrate Leads
    setLeads(prev => prev.map(l => {
      if (l.society === migrationSourceSociety || l.customSociety === migrationSourceSociety) {
        affectedLeads++;
        return {
          ...l,
          society: resolvedTarget,
          customSociety: undefined,
          statusHistory: [
            ...(l.statusHistory || []),
            {
              id: `h-${Date.now()}`,
              fromStatus: l.status,
              toStatus: l.status,
              timestamp: new Date().toLocaleString('en-IN'),
              updatedBy: 'Admin Migration Tool',
              note: `Batch migrated society name from "${migrationSourceSociety}" to verified name "${resolvedTarget}".`
            }
          ]
        };
      }
      return l;
    }));

    // 2. Migrate CoDs
    setCodList(prev => prev.map(c => {
      if (c.sellerSociety && c.sellerSociety.includes(migrationSourceSociety)) {
        affectedCods++;
        return {
          ...c,
          sellerSociety: c.sellerSociety.replace(migrationSourceSociety, resolvedTarget)
        };
      }
      return c;
    }));

    // 3. Migrate Managed Societies
    setManagedSocieties(prev => prev.map(s => {
      if (s.societyName === migrationSourceSociety) {
        return { ...s, societyName: resolvedTarget };
      }
      return s;
    }));

    // 4. Update Societies Dropdown List (Purge old name, add new name)
    setSocietiesList(prev => {
      const filtered = prev.filter(s => s !== migrationSourceSociety);
      if (!filtered.includes(resolvedTarget)) {
        return [resolvedTarget, ...filtered];
      }
      return filtered;
    });

    // 5. Reset Filter if currently set to migrated society
    if (adminSocietyFilter === migrationSourceSociety) {
      setAdminSocietyFilter(resolvedTarget);
    }

    setShowSocietyMigrationModal(false);
    setMigrationSourceSociety('');
    setMigrationTargetSociety('');
    setMigrationCustomTarget('');

    alert(`✅ Successfully migrated ${affectedLeads} lead(s) and ${affectedCods} CoD(s) from "${migrationSourceSociety}" to "${resolvedTarget}". The old unverified name has been permanently purged from all global dropdowns.`);
  };

  // Edit Pricing Submit
  const handleUpdateLeadPricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricingLead) return;

    const newPayout = Math.round(editActualWeightInput * editRatePerKgInput);
    setLeads(prev => prev.map(l => {
      if (l.id === editingPricingLead.id) {
        const history = l.statusHistory || [];
        const updatedHistory: StatusHistoryItem[] = [
          ...history,
          {
            id: `h-${Date.now()}`,
            fromStatus: l.status,
            toStatus: l.status,
            timestamp: new Date().toLocaleString('en-IN'),
            updatedBy: 'Vendor Staff',
            note: `Updated weight from ${l.actualWeightKg || l.estWeightKg}kg to ${editActualWeightInput}kg and rate to ₹${editRatePerKgInput}/kg. New Valuation: ₹${newPayout}`
          }
        ];
        return {
          ...l,
          actualWeightKg: editActualWeightInput,
          ratePerKg: editRatePerKgInput,
          estPayout: newPayout,
          statusHistory: updatedHistory
        };
      }
      return l;
    }));

    setEditingPricingLead(null);
  };

  // Lead Status Change Handler
  const handleSingleLeadStatusChange = (leadId: string, newStatus: Lead['status'], note?: string) => {
    if (newStatus === 'CoD Issued') {
      const target = leads.find(l => l.id === leadId);
      if (target) {
        openIssueCodModal(target);
        return;
      }
    }

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const history = l.statusHistory || [];
        const updatedHistory: StatusHistoryItem[] = [
          ...history,
          {
            id: `h-${Date.now()}`,
            fromStatus: l.status,
            toStatus: newStatus,
            timestamp: new Date().toLocaleString('en-IN'),
            updatedBy: 'Vendor Admin',
            note: note || `Status updated to ${newStatus}`
          }
        ];
        return {
          ...l,
          status: newStatus,
          statusHistory: updatedHistory
        };
      }
      return l;
    }));
  };

  // Batch Status Update
  const handleBatchStatusApply = () => {
    if (selectedLeadIds.length === 0) return;
    setLeads(prev => prev.map(l => {
      if (selectedLeadIds.includes(l.id)) {
        const history = l.statusHistory || [];
        const updatedHistory: StatusHistoryItem[] = [
          ...history,
          {
            id: `h-${Date.now()}`,
            fromStatus: l.status,
            toStatus: batchTargetStatus,
            timestamp: new Date().toLocaleString('en-IN'),
            updatedBy: 'Vendor Admin (Batch)',
            note: `Batch update applied to ${selectedLeadIds.length} selected leads.`
          }
        ];
        return {
          ...l,
          status: batchTargetStatus,
          statusHistory: updatedHistory
        };
      }
      return l;
    }));

    if (batchTargetStatus === 'CoD Issued') {
      const targets = leads.filter(l => selectedLeadIds.includes(l.id));
      setCodList(prev => {
        const added: CodCertificate[] = [];
        targets.forEach(target => {
          if (!prev.some(c => c.leadId === target.id || c.vehicleReg === target.regNumber) && !added.some(c => c.leadId === target.id)) {
            const randomSuffix = Math.floor(10000 + Math.random() * 90000);
            const y = parseInt(target.regYear, 10) || 2004;
            let autoBs: 'BS-I' | 'BS-II' | 'BS-III' | 'BS-IV' | 'Pre-BS' | 'BS-VI' = 'BS-II';
            if (y < 2000) autoBs = 'Pre-BS';
            else if (y <= 2005) autoBs = 'BS-I';
            else if (y <= 2010) autoBs = 'BS-II';
            else if (y <= 2017) autoBs = 'BS-III';
            else if (y <= 2020) autoBs = 'BS-IV';
            else autoBs = 'BS-VI';

            added.push({
              id: `cod-${target.id}`,
              codNumber: `COD-GJ05-2026-${randomSuffix}`,
              chassisNo: target.chassisNumber || ('MA3EYD1S000' + randomSuffix),
              engineNo: target.engineNumber || ('ENG' + randomSuffix),
              vehicleReg: target.regNumber,
              ownerName: target.ownerName,
              category: target.category,
              vehicleModel: `${target.brand} ${target.model}`,
              vehicleYear: target.regYear || '2004',
              bsCategory: autoBs,
              roadTaxWaiverPercent: 25,
              taxConcessionValue: target.category === '4W' ? 38000 : 8500,
              oemDiscountMinPercent: target.category === '4W' ? 4 : 3,
              oemDiscountMaxPercent: target.category === '4W' ? 6 : 5,
              registrationFeeBenefit: target.category === '2W'
                ? '100% Waived (₹0 under MoRTH CMVR - std. ₹300 waived)'
                : '100% Waived (₹0 under MoRTH CMVR - std. ₹600–₹1,000 waived)',
              issueDate: new Date().toISOString().split('T')[0],
              rvsfName: 'SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF #GJ05-09)',
              status: 'Listed_For_Sale',
              askingPrice: Math.round(target.estPayout * 0.95),
              sellerMobile: formatMobile10(target.mobile),
              sellerSociety: `${target.society} (${target.flatNo})`,
              leadId: target.id,
              bidsCount: 0,
              highestBid: 0,
              bids: []
            });
          }
        });
        return [...added, ...prev];
      });
    }
    setSelectedLeadIds([]);
  };

  // Abandoned Vehicle CRUD Handlers
  const handleSaveAbandonedVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAbMakeModel.trim()) return;

    if (editingAbVehicleId) {
      setAbandonedVehiclesList(prev => prev.map(v => {
        if (v.id === editingAbVehicleId) {
          return {
            ...v,
            category: newAbCategory,
            makeModel: newAbMakeModel.trim(),
            color: newAbColor.trim() || 'Unspecified',
            regNumber: newAbRegNo.trim().toUpperCase() || 'Unknown / Missing',
            chassisNumber: newAbChassisNo.trim().toUpperCase() || 'PENCIL-RUB-NEEDED',
            engineNumber: newAbEngineNo.trim().toUpperCase() || 'PENCIL-RUB-NEEDED',
            condition: newAbCondition,
            durationYears: newAbDuration,
            parkingSpot: newAbSpot.trim() || 'Society Premises'
          };
        }
        return v;
      }));
      setEditingAbVehicleId(null);
    } else {
      const newItem: AbandonedVehicleItem = {
        id: `ab-${Date.now()}`,
        category: newAbCategory,
        makeModel: newAbMakeModel.trim(),
        color: newAbColor.trim() || 'Unspecified',
        regNumber: newAbRegNo.trim().toUpperCase() || 'Unknown / Missing',
        chassisNumber: newAbChassisNo.trim().toUpperCase() || 'PENCIL-RUB-NEEDED',
        engineNumber: newAbEngineNo.trim().toUpperCase() || 'PENCIL-RUB-NEEDED',
        condition: newAbCondition,
        durationYears: newAbDuration,
        parkingSpot: newAbSpot.trim() || 'Society Premises'
      };
      setAbandonedVehiclesList(prev => [...prev, newItem]);
    }

    setNewAbMakeModel('');
    setNewAbColor('');
    setNewAbRegNo('');
    setNewAbChassisNo('');
    setNewAbEngineNo('');
    setNewAbSpot('');
    setNewAbDuration(3);
    setNewAbCondition('Scrap');
  };

  const handleStartEditAbandonedVehicle = (item: AbandonedVehicleItem) => {
    setEditingAbVehicleId(item.id);
    setNewAbCategory(item.category);
    setNewAbMakeModel(item.makeModel);
    setNewAbColor(item.color || '');
    setNewAbRegNo(item.regNumber === 'Unknown / Missing' ? '' : item.regNumber);
    setNewAbChassisNo(item.chassisNumber);
    setNewAbEngineNo(item.engineNumber);
    setNewAbCondition(item.condition as any);
    setNewAbDuration(item.durationYears);
    setNewAbSpot(item.parkingSpot || '');
    // Scroll smoothly to form
    const el = document.getElementById('abandoned-vehicle-form-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEditAbandonedVehicle = () => {
    setEditingAbVehicleId(null);
    setNewAbMakeModel('');
    setNewAbColor('');
    setNewAbRegNo('');
    setNewAbChassisNo('');
    setNewAbEngineNo('');
    setNewAbSpot('');
    setNewAbDuration(3);
    setNewAbCondition('Scrap');
  };

  const handleDeleteAbandonedVehicle = (id: string, name: string) => {
    requestConfirmDelete(
      'Remove Abandoned Vehicle',
      `Are you sure you want to remove "${name}" from the Abandoned Vehicle Inventory Log?`,
      () => {
        setAbandonedVehiclesList(prev => prev.filter(v => v.id !== id));
        if (editingAbVehicleId === id) {
          handleCancelEditAbandonedVehicle();
        }
      },
      name
    );
  };

  // Managing Committee Member CRUD Handlers
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    if (editingMemberId) {
      setCommitteeMembers(prev => prev.map(m => {
        if (m.id === editingMemberId) {
          return {
            ...m,
            name: newMemberName.trim(),
            designation: newMemberDesignation,
            flatNo: newMemberFlat.trim() || 'Managing Committee',
            mobile: newMemberMobile.trim() || '9825000000'
          };
        }
        return m;
      }));
      setEditingMemberId(null);
    } else {
      setCommitteeMembers(prev => [
        ...prev,
        {
          id: `cm-${Date.now()}`,
          name: newMemberName.trim(),
          designation: newMemberDesignation,
          flatNo: newMemberFlat.trim() || 'Managing Committee',
          mobile: newMemberMobile.trim() || '9825000000'
        }
      ]);
    }

    setNewMemberName('');
    setNewMemberDesignation('Executive Committee Member');
    setNewMemberFlat('');
    setNewMemberMobile('');
  };

  const handleStartEditMember = (m: { id: string; name: string; designation: string; flatNo: string; mobile: string; }) => {
    setEditingMemberId(m.id);
    setNewMemberName(m.name);
    setNewMemberDesignation(m.designation);
    setNewMemberFlat(m.flatNo);
    setNewMemberMobile(m.mobile || '');
    const el = document.getElementById('committee-member-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEditMember = () => {
    setEditingMemberId(null);
    setNewMemberName('');
    setNewMemberDesignation('Executive Committee Member');
    setNewMemberFlat('');
    setNewMemberMobile('');
  };

  const handleDeleteMember = (id: string, name: string) => {
    requestConfirmDelete(
      'Remove Committee Member',
      `Are you sure you want to remove "${name}" from the Managing Committee Members list?`,
      () => {
        setCommitteeMembers(prev => prev.filter(m => m.id !== id));
        if (editingMemberId === id) {
          handleCancelEditMember();
        }
      },
      name
    );
  };

  // RESIDENT AUTO LOOKUP HANDLER (EXCLUDING NAME SEARCH)
  const handleResidentAutoLookup = (query: string) => {
    const q = query.trim().toUpperCase();
    if (!q) {
      setResidentLookupMessage('Please enter a 10-digit mobile number or vehicle registration number.');
      return;
    }
    // Search leads strictly by mobile or registration number (excluding ownerName)
    const cleanDigits = q.replace(/[^0-9]/g, '');
    const cleanAlphaNum = q.replace(/[^A-Z0-9]/g, '');

    const matched = leads.find(l => {
      const leadMobile = (l.mobile || '').replace(/[^0-9]/g, '');
      const leadReg = (l.regNumber || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      return (cleanDigits.length >= 6 && leadMobile.includes(cleanDigits)) ||
             (cleanAlphaNum.length >= 4 && leadReg.includes(cleanAlphaNum));
    });

    if (matched) {
      setFormData(prev => ({
        ...prev,
        ownerName: matched.ownerName,
        mobile: matched.mobile,
        society: matched.society,
        flatNo: matched.flatNo,
        category: matched.category,
        brand: matched.brand,
        model: matched.model,
        regNumber: matched.regNumber,
        regYear: matched.regYear,
        condition: matched.condition,
        rcStatus: matched.rcStatus
      }));
      setResidentLookupMessage(`✅ Saved details auto-fetched for Mobile/Reg No (${matched.mobile} / ${matched.regNumber})! Form auto-populated.`);
    } else {
      setResidentLookupMessage(`No prior matching record found for Mobile/Reg No "${query}". Registration is optional; please complete the form.`);
    }
  };

  // Send Resolution to Vendor Dashboard
  const handleSyncNocToVendorPanel = () => {
    const newLeads: Lead[] = abandonedVehiclesList.map(item => ({
      id: `lead-noc-${item.id}`,
      tokenId: `VND-NOC-${Math.floor(1000 + Math.random() * 9000)}`,
      society: nocSocietyName,
      flatNo: 'Untraceable Property',
      ownerName: 'Untraceable / Abandoned Vehicle Owner',
      mobile: 'N/A (Society Resolution)',
      category: item.category,
      brand: item.makeModel.split(' ')[0] || 'Unlisted',
      model: item.makeModel,
      regNumber: item.regNumber,
      regYear: 'Unknown',
      condition: 'dead',
      rcStatus: 'lost',
      idProofVerified: true,
      preferredDate: new Date().toISOString().split('T')[0],
      estWeightKg: item.category === '2W' ? 110 : 850,
      actualWeightKg: item.category === '2W' ? 110 : 850,
      ratePerKg: 26.5,
      estPayout: item.category === '2W' ? 2915 : 22525,
      status: 'Registered',
      createdAt: new Date().toISOString().split('T')[0],
      isSocietyAbandoned: true,
      statusHistory: [
        {
          id: `h-${Date.now()}`,
          fromStatus: 'Society Resolution Passed',
          toStatus: 'Registered',
          timestamp: new Date().toLocaleString('en-IN'),
          updatedBy: `${nocChairmanName} (Society Chairman)`,
          note: `Registered via Society Abandoned RTO NOC Letter. Resolution dated ${nocResolutionDate}. Chassis: ${item.chassisNumber}`
        }
      ]
    }));

    setLeads(prev => [...newLeads, ...prev]);
    alert(`Success! ${newLeads.length} abandoned vehicles registered into Vendor Panel for RTO Surat NOC pickup.`);
    setActiveTab('admin');
  };

  // Submit Buyer Bid
  // Submit Buyer Bid (No Resident Account required - Name & Mobile captured)
  const handlePlaceBuyerBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidderNameInput.trim()) {
      setBidError('Please enter your full name.');
      return;
    }
    if (!bidderMobileInput || bidderMobileInput.replace(/[^0-9]/g, '').length < 10) {
      setBidError('Please provide a valid 10-digit mobile number for communication.');
      return;
    }
    if (!selectedCodForModal || bidAmountInput <= 0) {
      setBidError('Please enter a valid bid amount.');
      return;
    }

    const newBid: CodBid = {
      id: `bid-${Date.now()}`,
      bidderName: bidderNameInput.trim(),
      bidderMobile: bidderMobileInput.trim(),
      bidderSociety: 'Gujarat Buyer',
      bidAmount: bidAmountInput,
      timestamp: new Date().toLocaleString('en-IN')
    };

    setCodList(prev => prev.map(c => {
      if (c.id === selectedCodForModal.id) {
        const currentBids = c.bids || [];
        const updatedBids = [newBid, ...currentBids];
        const highest = Math.max(...updatedBids.map(b => b.bidAmount));
        return {
          ...c,
          bids: updatedBids,
          bidsCount: updatedBids.length,
          highestBid: highest
        };
      }
      return c;
    }));

    alert(`Bid of ₹${bidAmountInput.toLocaleString('en-IN')} submitted successfully for ${selectedCodForModal.codNumber}!`);
    setSelectedCodForModal(null);
    setBidError('');
  };

  // SOCIETY COMMITTEE AUTHENTICATION & FIRST-LOGIN WORKFLOW
  const completeSocietyLogin = (soc: ManagedSocietyAccount, designation: 'Chairman / Pramukh' | 'Secretary') => {
    setNocSocietyName(soc.societyName);
    setNocSocietyRegNo(soc.regNo);
    if (soc.chairmanName) setNocChairmanName(soc.chairmanName);
    if (soc.secretaryName) setNocSecretaryName(soc.secretaryName);

    const officerData = {
      name: designation === 'Secretary' ? (soc.secretaryName || 'Secretary') : (soc.chairmanName || 'Chairman'),
      designation: designation,
      mobile: designation === 'Secretary' ? (soc.secretaryMobile || '') : (soc.chairmanMobile || ''),
      idProof: 'Official Aadhaar / PAN',
      societyName: soc.societyName,
      societyRegNo: soc.regNo,
      societyAddress: soc.address,
      accountId: soc.id
    };
    setCurrentOfficer(officerData);
    localStorage.setItem('vnd_society_officer', JSON.stringify(officerData));
    setSocietyLoginEmailInput('');
    setSocietyLoginPasswordInput('');
    setSocietyAuthError('');
  };

  const handleSocietyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const inputId = societyLoginEmailInput.trim().toLowerCase();
    const inputPass = societyLoginPasswordInput;

    const matched = managedSocieties.find(s => 
      (s.loginEmail.toLowerCase() === inputId || 
       (s.chairmanMobile && s.chairmanMobile.includes(inputId)) || 
       (s.secretaryMobile && s.secretaryMobile.includes(inputId))) &&
      s.password === inputPass
    ) || (inputId === 'society.vaishnodevi@gujarat.gov.in' && inputPass === 'soc@2026' ? managedSocieties[0] : null);

    if (!matched) {
      setSocietyAuthError('Invalid Committee Login ID or Password. Only authorized Society Executive Committee accounts can access this portal.');
      return;
    }

    if (!matched.isFirstLoginCompleted) {
      // First login - open mandatory data setup modal
      setFirstLoginSociety({ ...matched });
      setShowSocietyFirstLoginModal(true);
    } else {
      completeSocietyLogin(matched, societyLoginDesignation);
    }
  };

  const handleSaveSocietyFirstLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstLoginSociety) return;
    if (!firstLoginSociety.address.trim() || !firstLoginSociety.regNo.trim()) {
      alert('Please fill mandatory Society Address and Registration Number.');
      return;
    }

    const updatedAccount: ManagedSocietyAccount = {
      ...firstLoginSociety,
      isFirstLoginCompleted: true
    };

    setManagedSocieties(prev => prev.map(s => s.id === updatedAccount.id ? updatedAccount : s));
    setShowSocietyFirstLoginModal(false);
    completeSocietyLogin(updatedAccount, societyLoginDesignation);
    alert('First login profile details saved successfully! Access granted to Society Committee Portal.');
  };

  const handleSocietyLogout = () => {
    setCurrentOfficer(null);
    localStorage.removeItem('vnd_society_officer');
  };

  // Vendor Auth (Supports default and any GOD ADMIN provisioned vendor with first-login data setup)
  const handleVendorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const inputEmail = vendorIdInput.trim().toLowerCase();
    const matchedVendor = managedVendors.find(
      v => v.loginEmail.toLowerCase() === inputEmail && v.password === vendorPasswordInput
    ) || (inputEmail === 'vendor@ambica.com' && vendorPasswordInput === 'vendor@2026' ? managedVendors[0] : null);

    if (matchedVendor) {
      if (!matchedVendor.isFirstLoginCompleted) {
        setFirstLoginVendor({ ...matchedVendor });
        setShowVendorFirstLoginModal(true);
      } else {
        setIsVendorAuthenticated(true);
        localStorage.setItem('vnd_vendor_auth', 'true');
        setVendorAuthError('');
      }
    } else {
      setVendorAuthError('Invalid Vendor Email or Password.');
    }
  };

  const handleSaveVendorFirstLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstLoginVendor) return;
    if (!firstLoginVendor.address.trim() || !firstLoginVendor.rvsfRegNo.trim()) {
      alert('Please fill mandatory Yard Address and RVSF Authorization Registration Number.');
      return;
    }

    const updatedVendor: ManagedVendorAccount = {
      ...firstLoginVendor,
      isFirstLoginCompleted: true
    };

    setManagedVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    setShowVendorFirstLoginModal(false);
    setIsVendorAuthenticated(true);
    localStorage.setItem('vnd_vendor_auth', 'true');
    alert('First login vendor key data completed successfully!');
  };

  const handleVendorLogout = () => {
    setIsVendorAuthenticated(false);
    localStorage.removeItem('vnd_vendor_auth');
  };

  // VENDOR OPERATIONS EXPORT HANDLERS
  const handleExportLeadsCSV = () => {
    if (filteredAndSortedLeads.length === 0) {
      alert('No leads available to export with current filters.');
      return;
    }
    const headers = [
      'Token ID',
      'Owner Name',
      'Customer Mobile',
      'Housing Society',
      'Flat / Wing No',
      'Category',
      'Brand',
      'Model',
      'Registration No',
      'Registration Year',
      'Condition',
      'RC Document Status',
      'Actual / Est Weight (kg)',
      'Scrap Rate (Rs/kg)',
      'Total Valuation Payout (Rs)',
      'Current Status',
      'Submission Date'
    ];

    const rows = filteredAndSortedLeads.map(l => [
      `"${l.tokenId}"`,
      `"${(l.ownerName || '').replace(/"/g, '""')}"`,
      `"${l.mobile}"`,
      `"${(l.society || '').replace(/"/g, '""')}"`,
      `"${(l.flatNo || '').replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.brand}"`,
      `"${l.model}"`,
      `"${l.regNumber}"`,
      `"${l.regYear}"`,
      `"${l.condition}"`,
      `"${l.rcStatus}"`,
      `"${l.actualWeightKg || l.estWeightKg}"`,
      `"${l.ratePerKg}"`,
      `"${l.estPayout}"`,
      `"${l.status}"`,
      `"${l.createdAt}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Shree_Ambica_Scrappage_Leads_${adminStatusFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportVendorPrint = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    const rowsHtml = filteredAndSortedLeads.map(l => `
      <tr>
        <td style="padding:6px;border:1px solid #cbd5e1;font-family:monospace;font-weight:bold;">${l.tokenId}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;"><strong>${l.ownerName}</strong><br/><span style="font-size:10px;color:#475569;">${l.society} (${l.flatNo})</span></td>
        <td style="padding:6px;border:1px solid #cbd5e1;font-family:monospace;font-weight:bold;color:#047857;">${l.mobile}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;">${l.brand} ${l.model}<br/><span style="font-family:monospace;font-size:10px;">${l.regNumber}</span></td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;font-family:monospace;">${l.actualWeightKg || l.estWeightKg} kg</td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;font-family:monospace;font-weight:bold;color:#047857;">₹${l.estPayout.toLocaleString('en-IN')}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:center;"><span style="background:#dcfce7;color:#14532d;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;">${l.status}</span></td>
      </tr>
    `).join('');

    const totalWeight = filteredAndSortedLeads.reduce((acc, l) => acc + (l.actualWeightKg || l.estWeightKg), 0);
    const totalValuation = filteredAndSortedLeads.reduce((acc, l) => acc + l.estPayout, 0);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shree Ambica Automotive - Vehicle Scrappage Operations Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 11px; }
            th { background-color: #f1f5f9; padding: 8px; border: 1px solid #94a3b8; font-weight: bold; text-align: left; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
            .stats { display: flex; gap: 16px; margin-bottom: 16px; font-size: 12px; }
            .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px; }
            @media print { body { padding: 0; } @page { size: landscape; margin: 10mm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0;font-size:18px;">SHREE AMBICA AUTOMOTIVE PVT LTD (Govt Authorized RVSF)</h2>
            <p style="margin:2px 0;font-size:11px;color:#475569;">PLOT NO 122 TOLL NAKA, B K AMBICA TATA, AMBOLI, KAMREJ, SURAT-394180 · Contact: 7043493333</p>
            <p style="margin:2px 0;font-size:12px;font-weight:bold;color:#047857;">Vehicle Intake & Valuation Summary Report · Generated: ${new Date().toLocaleString('en-IN')}</p>
          </div>
          <div class="stats">
            <div class="stat-box">Total Records: <strong>${filteredAndSortedLeads.length}</strong></div>
            <div class="stat-box">Total Measured Weight: <strong>${totalWeight.toLocaleString('en-IN')} kg</strong></div>
            <div class="stat-box">Total Payout Valuation: <strong style="color:#047857;">₹${totalValuation.toLocaleString('en-IN')}</strong></div>
            <div class="stat-box">Active Filter: <strong>${adminStatusFilter}</strong></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Owner / Society</th>
                <th>Mobile Number</th>
                <th>Vehicle & Reg No</th>
                <th style="text-align:right;">Weight</th>
                <th style="text-align:right;">Payout Valuation</th>
                <th style="text-align:center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 300);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // VENDOR OPERATIONS: EXPORT BIDS HANDLERS
  const handleExportBidsCSV = () => {
    const bidRows = codList.flatMap(c => (c.bids || []).map(b => ({
      ...b,
      targetCod: c.codNumber,
      vehicleModel: c.vehicleModel,
      vehicleReg: c.vehicleReg,
      taxConcession: c.taxConcessionValue,
      ownerName: c.ownerName,
      ownerMobile: c.sellerMobile || '',
      ownerSociety: c.sellerSociety || ''
    })));

    if (bidRows.length === 0) {
      alert('No buyer bids available to export.');
      return;
    }

    const headers = [
      'Target CoD Number',
      'Vehicle Model',
      'Vehicle Reg Number',
      'Tax Concession Value (Rs)',
      'Actual Owner Name (Seller)',
      'Actual Owner Contact Mobile',
      'Owner Society / Flat',
      'Buyer Name (Bidder)',
      'Buyer Verified Mobile',
      'Buyer Society / Location',
      'Bid Offer Amount (Rs)',
      'Bid Timestamp'
    ];

    const rows = bidRows.map(r => [
      `"${r.targetCod}"`,
      `"${r.vehicleModel}"`,
      `"${r.vehicleReg}"`,
      `"${r.taxConcession}"`,
      `"${r.ownerName}"`,
      `"${r.ownerMobile}"`,
      `"${r.ownerSociety.replace(/"/g, '""')}"`,
      `"${r.bidderName}"`,
      `"${r.bidderMobile}"`,
      `"${(r.bidderSociety || '').replace(/"/g, '""')}"`,
      `"${r.bidAmount}"`,
      `"${r.timestamp}"`
    ]);

    const csvString = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DigiELV_Buyer_Bids_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportBidsPrint = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    const bidRows = codList.flatMap(c => (c.bids || []).map(b => ({
      ...b,
      targetCod: c.codNumber,
      vehicleModel: c.vehicleModel,
      vehicleReg: c.vehicleReg,
      taxConcession: c.taxConcessionValue,
      ownerName: c.ownerName,
      ownerMobile: c.sellerMobile || '',
      ownerSociety: c.sellerSociety || ''
    })));

    if (!printWindow) {
      window.print();
      return;
    }

    const rowsHtml = bidRows.map(b => `
      <tr>
        <td style="padding:6px;border:1px solid #cbd5e1;font-family:monospace;font-weight:bold;">${b.targetCod}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;">${b.vehicleModel}<br/><span style="font-family:monospace;font-size:10px;">${b.vehicleReg}</span></td>
        <td style="padding:6px;border:1px solid #cbd5e1;"><strong>${b.ownerName}</strong><br/><span style="color:#047857;font-weight:bold;font-family:monospace;">${b.ownerMobile}</span><br/><span style="font-size:10px;color:#475569;">${b.ownerSociety}</span></td>
        <td style="padding:6px;border:1px solid #cbd5e1;"><strong>${b.bidderName}</strong><br/><span style="color:#047857;font-weight:bold;font-family:monospace;">${b.bidderMobile}</span><br/><span style="font-size:10px;color:#475569;">${b.bidderSociety}</span></td>
        <td style="padding:6px;border:1px solid #cbd5e1;text-align:right;font-family:monospace;font-weight:bold;color:#047857;">₹${b.bidAmount.toLocaleString('en-IN')}</td>
        <td style="padding:6px;border:1px solid #cbd5e1;font-size:10px;color:#64748b;">${b.timestamp}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DigiELV Marketplace - Buyer Bids & CoD Holders Summary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 11px; }
            th { background-color: #f1f5f9; padding: 8px; border: 1px solid #94a3b8; font-weight: bold; text-align: left; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
            @media print { body { padding: 0; } @page { size: landscape; margin: 10mm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0;font-size:18px;">SHREE AMBICA AUTOMOTIVE PVT LTD - DIGIELV BIDS REPORT</h2>
            <p style="margin:2px 0;font-size:11px;color:#475569;">CoD Transfer & Trading Management · Generated: ${new Date().toLocaleString('en-IN')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Target CoD</th>
                <th>Vehicle</th>
                <th>Actual CoD Holder (Owner)</th>
                <th>Prospective Buyer (Bidder)</th>
                <th style="text-align:right;">Bid Offer</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            setTimeout(() => { window.print(); window.close(); }, 300);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // GOD ADMIN ACCOUNT CREATION & EDITING HANDLERS
  const handleOpenCreateSociety = () => {
    // Open a completely fresh, blank form without copying or pre-filling old details
    setSocietyFormData({
      id: `soc-acc-${Date.now()}`,
      loginEmail: '',
      password: '',
      societyName: '',
      address: '',
      regNo: '',
      chairmanName: '',
      chairmanMobile: '',
      secretaryName: '',
      secretaryMobile: '',
      district: '',
      isFirstLoginCompleted: false
    });
    setSocietyModalMode('create');
    setShowSocietyModal(true);
  };

  const handleAutoSuggestSocietyData = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setSocietyFormData(prev => ({
      ...prev,
      societyName: prev.societyName || `Royal Palms Co-Op Society (${randomSuffix})`,
      regNo: prev.regNo || `SUR/HSG/${new Date().getFullYear()}/${randomSuffix}`,
      district: prev.district || 'RTO Surat (GJ-05)',
      address: prev.address || 'Near Community Ring Road, Surat - 395005',
      loginEmail: prev.loginEmail || `society.${randomSuffix}@gujarat.gov.in`,
      password: prev.password || `soc@${randomSuffix}`,
      chairmanName: prev.chairmanName || 'Manishbhai Patel',
      chairmanMobile: prev.chairmanMobile || `98250${randomSuffix}`,
      secretaryName: prev.secretaryName || 'Bhavin Mehta',
      secretaryMobile: prev.secretaryMobile || `98980${randomSuffix}`
    }));
  };

  const handleOpenEditSociety = (acc: ManagedSocietyAccount) => {
    setSocietyFormData({ ...acc });
    setSocietyModalMode('edit');
    setShowSocietyModal(true);
  };

  const handleSaveSocietyAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!societyFormData.societyName.trim() || !societyFormData.loginEmail.trim() || !societyFormData.password.trim()) {
      alert('Please fill mandatory fields: Society Name, Login Email, and Password.');
      return;
    }

    if (societyModalMode === 'create') {
      setManagedSocieties(prev => [societyFormData, ...prev]);
      if (!societiesList.includes(societyFormData.societyName.trim())) {
        setSocietiesList(prev => [...prev, societyFormData.societyName.trim()]);
      }
    } else {
      setManagedSocieties(prev => prev.map(s => s.id === societyFormData.id ? societyFormData : s));
      if (!societiesList.includes(societyFormData.societyName.trim())) {
        setSocietiesList(prev => [...prev, societyFormData.societyName.trim()]);
      }
    }
    setShowSocietyModal(false);
  };

  const handleDeleteSocietyAccount = (id: string, name: string) => {
    requestConfirmDelete(
      'Delete Society Portal Account',
      `Are you sure you want to delete Society account for "${name || 'this society'}"?`,
      () => {
        setManagedSocieties(prev => prev.filter(s => s.id !== id));
      },
      name
    );
  };

  const handleOpenCreateVendor = () => {
    // Open a completely fresh, blank form without copying or pre-filling old details
    setVendorFormData({
      id: `vnd-acc-${Date.now()}`,
      loginEmail: '',
      password: '',
      vendorName: '',
      rvsfRegNo: '',
      address: '',
      contactPerson: '',
      mobile: '',
      gstin: '',
      isFirstLoginCompleted: false
    });
    setVendorModalMode('create');
    setShowVendorModal(true);
  };

  const handleAutoSuggestVendorData = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setVendorFormData(prev => ({
      ...prev,
      vendorName: prev.vendorName || `Gujarat Green Eco-Scrap RVSF Pvt Ltd`,
      rvsfRegNo: prev.rvsfRegNo || `GJ-RVSF-SURAT-${randomSuffix}`,
      gstin: prev.gstin || `24AABCS${randomSuffix}Z4`,
      address: prev.address || `Plot ${randomSuffix}, GIDC Industrial Area, Hazira Road, Surat-394510`,
      contactPerson: prev.contactPerson || 'Dharmeshbhai V. Patel',
      mobile: prev.mobile || `98251${randomSuffix}11`,
      loginEmail: prev.loginEmail || `vendor.${randomSuffix}@ambicarvsf.com`,
      password: prev.password || `vnd@${randomSuffix}`
    }));
  };

  const handleOpenEditVendor = (v: ManagedVendorAccount) => {
    setVendorFormData({ ...v });
    setVendorModalMode('edit');
    setShowVendorModal(true);
  };

  const handleSaveVendorAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorFormData.vendorName.trim() || !vendorFormData.loginEmail.trim() || !vendorFormData.password.trim()) {
      alert('Please fill mandatory fields: Vendor Name, Login Email, and Password.');
      return;
    }

    if (vendorModalMode === 'create') {
      setManagedVendors(prev => [vendorFormData, ...prev]);
    } else {
      setManagedVendors(prev => prev.map(v => v.id === vendorFormData.id ? vendorFormData : v));
    }
    setShowVendorModal(false);
  };

  const handleDeleteVendorAccount = (id: string, name: string) => {
    requestConfirmDelete(
      'Delete Vendor Portal Account',
      `Are you sure you want to delete Vendor account for "${name || 'this vendor'}"?`,
      () => {
        setManagedVendors(prev => prev.filter(v => v.id !== id));
      },
      name
    );
  };

  // GOD ADMIN REGISTERED USER & LEAD EDITING HANDLERS
  const handleOpenEditUser = (lead: Lead) => {
    setEditingUserLead({ ...lead });
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserLead) return;

    const newPayout = Math.round((editingUserLead.actualWeightKg || editingUserLead.estWeightKg) * editingUserLead.ratePerKg);
    const updatedLead: Lead = {
      ...editingUserLead,
      estPayout: newPayout
    };

    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));

    // Also sync codList if this lead has a CoD
    setCodList(prev => prev.map(c => {
      if (c.leadId === updatedLead.id || c.vehicleReg === updatedLead.regNumber) {
        return {
          ...c,
          ownerName: updatedLead.ownerName,
          sellerMobile: updatedLead.mobile,
          sellerSociety: `${updatedLead.society} (${updatedLead.flatNo})`,
          vehicleReg: updatedLead.regNumber,
          vehicleModel: `${updatedLead.brand} ${updatedLead.model}`
        };
      }
      return c;
    }));

    setEditingUserLead(null);
    alert('Citizen user & vehicle registration updated successfully by GOD Admin!');
  };

  const handleDeleteUserLead = (id: string, name: string) => {
    requestConfirmDelete(
      'Delete Citizen User & Vehicle Record',
      `Are you sure you want to delete user and vehicle record for "${name}"?`,
      () => {
        setLeads(prev => prev.filter(l => l.id !== id));
        setCodList(prev => prev.filter(c => c.leadId !== id));
      },
      name
    );
  };

  // Filtered & Sorted Leads for Vendor Panel
  const filteredAndSortedLeads = useMemo(() => {
    const list = leads.filter(l => {
      const q = adminSearch.toLowerCase().trim();
      const matchSearch = !q ||
        l.ownerName.toLowerCase().includes(q) ||
        l.tokenId.toLowerCase().includes(q) ||
        l.regNumber.toLowerCase().includes(q) ||
        (l.mobile && l.mobile.toLowerCase().includes(q)) ||
        (l.flatNo && l.flatNo.toLowerCase().includes(q)) ||
        l.society.toLowerCase().includes(q);

      const matchSociety = adminSocietyFilter === 'ALL' || l.society === adminSocietyFilter;
      const matchStatus = adminStatusFilter === 'ALL' || l.status === adminStatusFilter;
      const matchCat = adminCategoryFilter === 'ALL' || l.category === adminCategoryFilter;

      const w = l.actualWeightKg || l.estWeightKg;
      let matchWeight = true;
      if (adminWeightFilter === 'under150') matchWeight = w < 150;
      else if (adminWeightFilter === '150to500') matchWeight = w >= 150 && w < 500;
      else if (adminWeightFilter === '500to900') matchWeight = w >= 500 && w < 900;
      else if (adminWeightFilter === '900to1300') matchWeight = w >= 900 && w < 1300;
      else if (adminWeightFilter === 'above1300') matchWeight = w >= 1300;

      return matchSearch && matchSociety && matchStatus && matchCat && matchWeight;
    });

    // Multi-factor Sorting
    list.sort((a, b) => {
      const wA = a.actualWeightKg || a.estWeightKg;
      const wB = b.actualWeightKg || b.estWeightKg;
      if (adminSortBy === 'date_desc') return (b.createdAt || '').localeCompare(a.createdAt || '');
      if (adminSortBy === 'date_asc') return (a.createdAt || '').localeCompare(b.createdAt || '');
      if (adminSortBy === 'weight_desc') return wB - wA;
      if (adminSortBy === 'weight_asc') return wA - wB;
      if (adminSortBy === 'payout_desc') return b.estPayout - a.estPayout;
      if (adminSortBy === 'payout_asc') return a.estPayout - b.estPayout;
      if (adminSortBy === 'owner_asc') return a.ownerName.localeCompare(b.ownerName);
      if (adminSortBy === 'society_asc') return a.society.localeCompare(b.society);
      if (adminSortBy === 'status_asc') return a.status.localeCompare(b.status);
      return 0;
    });

    return list;
  }, [leads, adminSearch, adminSocietyFilter, adminStatusFilter, adminCategoryFilter, adminWeightFilter, adminSortBy]);

  // Filtered CoDs for Vendor Panel CoD Registry
  const filteredCods = useMemo(() => {
    return codList.filter(c => {
      const q = codSearch.toLowerCase().trim();
      const matchSearch = !q ||
        c.codNumber.toLowerCase().includes(q) ||
        c.vehicleReg.toLowerCase().includes(q) ||
        c.ownerName.toLowerCase().includes(q) ||
        c.vehicleModel.toLowerCase().includes(q) ||
        c.chassisNo.toLowerCase().includes(q) ||
        (c.sellerSociety && c.sellerSociety.toLowerCase().includes(q));
      const matchCat = codCategoryFilter === 'ALL' || c.category === codCategoryFilter;
      const matchMarket = codMarketplaceFilter === 'ALL' ||
        (codMarketplaceFilter === 'Listed' && c.status === 'Listed_For_Sale') ||
        (codMarketplaceFilter === 'Private' && c.status !== 'Listed_For_Sale');
      return matchSearch && matchCat && matchMarket;
    });
  }, [codList, codSearch, codCategoryFilter, codMarketplaceFilter]);

  const statusCounts = useMemo(() => {
    return {
      ALL: leads.length,
      'Registered': leads.filter(l => l.status === 'Registered').length,
      'Inspected & Weighed': leads.filter(l => l.status === 'Inspected & Weighed').length,
      'Payment Transferred': leads.filter(l => l.status === 'Payment Transferred').length,
      'CoD Issued': leads.filter(l => l.status === 'CoD Issued').length,
      'Rejected / Offer Declined': leads.filter(l => l.status === 'Rejected / Offer Declined').length,
    };
  }, [leads]);

  const isAnyUserLoggedIn = Boolean(currentOfficer || isVendorAuthenticated || isGodAdminAuthenticated);

  const loggedInRoleText = useMemo(() => {
    if (isGodAdminAuthenticated) return 'GOD Admin';
    if (isVendorAuthenticated) return 'Vendor';
    if (currentOfficer) return currentOfficer.designation.includes('Chairman') ? 'Chairman' : 'Secretary';
    return '';
  }, [isGodAdminAuthenticated, isVendorAuthenticated, currentOfficer]);

  const handleGlobalLogout = () => {
    if (isGodAdminAuthenticated) {
      setIsGodAdminAuthenticated(false);
      localStorage.removeItem('vnd_god_admin_auth');
    }
    if (isVendorAuthenticated) {
      setIsVendorAuthenticated(false);
      localStorage.removeItem('vnd_vendor_auth');
    }
    if (currentOfficer) {
      setCurrentOfficer(null);
      localStorage.removeItem('vnd_society_officer');
    }
    setActiveTab('scrappage');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      
      {/* TOP LOGO HEADER BAR - ONLY LOGO/TITLE, LANGUAGE TABS, AND LOGOUT BUTTON */}
      <header className="sticky top-0 z-50 bg-slate-950 text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <button onClick={() => setActiveTab('scrappage')} className="text-sm sm:text-base font-extrabold tracking-tight text-white block leading-tight text-left cursor-pointer">
                {t.portalTitle}
              </button>
              <span className="text-[10px] text-emerald-400 font-medium hidden sm:block">
                {t.rvsfPartner}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* MULTILINGUAL LANGUAGE SWITCHER */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs font-bold text-slate-200">
              <Globe className="w-3.5 h-3.5 ml-1 text-emerald-400 hidden sm:inline-block" />
              {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded-md transition-all text-[11px] ${
                    lang === l ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* LOGOUT BUTTON FOR LOGGED-IN USERS */}
            {isAnyUserLoggedIn && (
              <button
                onClick={handleGlobalLogout}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-red-500/60 bg-red-950/80 text-red-200 hover:bg-red-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Logout from current account"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Logout {loggedInRoleText ? `(${loggedInRoleText})` : ''}</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ROW JUST BELOW THE LOGO BAR: SELECT PORTAL LOGIN & NAVIGATION */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-2.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          <span className="text-emerald-400 flex items-center gap-1.5 shrink-0">
            <LogIn className="w-4 h-4 text-emerald-400 shrink-0" />
            Select Portal Login:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('scrappage')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'scrappage'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-750 hover:text-white border border-slate-700'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Vehicle Scrappage</span>
            </button>

            <button
              onClick={() => setActiveTab('societyNoc')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'societyNoc'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-750 hover:text-white border border-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Society Committee (Pramukh &amp; Sec)</span>
            </button>

            <button
              onClick={() => setActiveTab('digielv')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'digielv'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-750 hover:text-white border border-slate-700'
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>DigiELV CoD Market</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-750 border border-slate-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Vendor Admin Panel</span>
            </button>

            <button
              onClick={() => setActiveTab('godAdmin')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-extrabold transition-all cursor-pointer ${
                activeTab === 'godAdmin'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-amber-950/80 text-amber-200 border border-amber-600 hover:bg-amber-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>GOD Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: VEHICLE SCRAPPAGE DRIVE FRONT PAGE */}
      {activeTab === 'scrappage' && (
        <main className="grow">

          {/* PROMINENT REGULATORY POLICY TIME-LIMITED ANNOUNCEMENT BANNER */}
          <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-4 py-3 sm:py-3.5 shadow-md border-b-2 border-amber-600">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-slate-950 text-amber-400 rounded-2xl shrink-0 shadow-sm animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                    <span className="px-2.5 py-0.5 bg-slate-950 text-amber-300 rounded-md font-extrabold text-[10px] uppercase tracking-wider">
                      Official Regulatory Notice
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wide text-slate-950 bg-amber-300/90 px-2 py-0.5 rounded border border-amber-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Time-Limited Policy Benefit
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-950 mt-1 leading-snug">
                    📢 Important Notice: This specific policy benefit is time-limited and is available only till <span className="underline decoration-slate-950 decoration-2 font-black text-slate-950 bg-white/40 px-1.5 py-0.5 rounded shadow-2xs">31 March 2027</span> (the official last date for the policy benefit).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right hidden xl:block text-xs font-bold text-slate-900 leading-tight">
                  <div>100% Registration Fee Waiver · Road Tax Waiver · OEM Discount</div>
                  <div className="text-[10px] opacity-90">Valid strictly for vehicle scrappage registered before 31 March 2027</div>
                </div>
                <a
                  href="#registration-section"
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Register Before 31 March 2027</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* HERO & HIGH-CONTRAST TRUST BADGES */}
          <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
            <div className="max-w-5xl mx-auto text-center relative z-10">
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-200 text-xs font-extrabold shadow-md animate-pulse">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  Time-Limited Policy Benefit: Valid Only Till 31 March 2027 (Official Last Date)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950 border-2 border-emerald-400 text-emerald-200 text-xs font-extrabold shadow-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  Government Approved RVSF Partner: SHREE AMBICA AUTOMOTIVE PVT LTD
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-950 border-2 border-teal-300 text-teal-100 text-xs font-extrabold shadow-md">
                  <BadgeCheck className="w-4 h-4 text-teal-300 shrink-0" />
                  MoRTH &amp; Gujarat RTO Compliant
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border-2 border-blue-400 text-blue-200 text-xs font-extrabold shadow-md">
                  <Lock className="w-4 h-4 text-blue-300 shrink-0" />
                  100% Legal Deregistration Immunity
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
                {t.heroHeading}
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t.heroSub}
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
                <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">₹25 - ₹28</div>
                  <div className="text-xs text-slate-200 mt-1 font-semibold">Guaranteed Cash Rate / kg</div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">50% Off</div>
                  <div className="text-xs text-slate-200 mt-1 font-semibold">Motor Vehicle Tax Waiver</div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">DigiELV</div>
                  <div className="text-xs text-slate-200 mt-1 font-semibold">Trade CoD Certificate</div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">Free</div>
                  <div className="text-xs text-slate-200 mt-1 font-semibold">Doorstep Towing Pickup</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="#registration-section"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm"
                >
                  Register Vehicle Now <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActiveTab('digielv')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/30 transition-all text-xs sm:text-sm flex items-center gap-2"
                >
                  <BadgeCheck className="w-4 h-4 text-emerald-400" /> Explore DigiELV Marketplace
                </button>
              </div>

            </div>
          </section>

          {/* PROMINENT PARTICIPATING SOCIETIES SELECTION BAR */}
          <section className="py-6 bg-slate-100 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Participating Vaishnodevi Road Communities &amp; Housing Societies ({societiesList.length})
                </span>
                <button
                  onClick={() => setShowAddSocietyModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-lg px-3 py-1.5 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-white shrink-0" /> + Add Your Society
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-800">
                {societiesList.map((soc) => (
                  <button
                    key={soc}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, society: soc }));
                      const el = document.getElementById('registration-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`bg-white border rounded-lg px-3 py-1.5 shadow-2xs flex items-center gap-1.5 font-semibold transition-all hover:border-emerald-500 hover:text-emerald-950 ${
                      formData.society === soc ? 'border-emerald-600 text-emerald-950 ring-2 ring-emerald-400 font-extrabold' : 'border-slate-300 text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {soc}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* GUJARAT SCRAPPAGE POLICY TAX BENEFIT MATRIX */}
          <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-extrabold text-emerald-950 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300 inline-block mb-2">
                Official MoRTH &amp; Gujarat RTO Circulars
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Gujarat Vehicle Scrappage Policy Tax Benefit Matrix
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="w-2 h-full bg-emerald-600 absolute left-0 top-0"></div>
                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-xs font-extrabold text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">
                      Pre-BS &amp; BS-I Vehicles (Pre-2000s)
                    </span>
                    <span className="text-lg font-extrabold text-slate-900 font-mono">50% Tax Waiver</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    50% Motor Vehicle Road Tax Concession
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Scrap vintage or 15+ year old vehicles and receive a <strong>Certificate of Deposit (CoD)</strong> granting a 50% waiver on new vehicle road tax in Gujarat.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="w-2 h-full bg-teal-600 absolute left-0 top-0"></div>
                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-xs font-extrabold text-teal-950 bg-teal-100 px-2.5 py-1 rounded-md border border-teal-300">
                      BS-II, BS-III &amp; BS-IV Vehicles
                    </span>
                    <span className="text-lg font-extrabold text-slate-900 font-mono">25% Tax + 5% OEM</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    25% Tax Concession + 5% OEM Manufacturer Discount
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Get a 25% Motor Vehicle Tax concession plus an additional <strong>5% manufacturer discount</strong> directly offered by automobile OEMs against valid CoD.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE SCRAP ESTIMATOR */}
          <section id="calculator-section" className="py-12 bg-white border-y border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-extrabold text-emerald-950 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300 inline-block mb-2">
                  {t.calcHeading}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Instant Weight-Based Scrap Estimator
                </h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Select Vehicle Category (Radio Option)
                    </label>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-200 rounded-xl">
                      <label
                        onClick={() => { setCalcCategory('2W'); setCalcWeight(110); }}
                        className={`py-3 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                          calcCategory === '2W' ? 'bg-white text-slate-950 border-emerald-500 shadow-sm' : 'text-slate-700 hover:text-slate-950 border-transparent'
                        }`}
                      >
                        <input
                          type="radio"
                          name="calcVehicleRadio"
                          checked={calcCategory === '2W'}
                          onChange={() => { setCalcCategory('2W'); setCalcWeight(110); }}
                          className="accent-emerald-600"
                        />
                        <Bike className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>2-Wheeler (Bike / Scooter)</span>
                      </label>
                      <label
                        onClick={() => { setCalcCategory('4W'); setCalcWeight(850); }}
                        className={`py-3 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                          calcCategory === '4W' ? 'bg-white text-slate-950 border-emerald-500 shadow-sm' : 'text-slate-700 hover:text-slate-950 border-transparent'
                        }`}
                      >
                        <input
                          type="radio"
                          name="calcVehicleRadio"
                          checked={calcCategory === '4W'}
                          onChange={() => { setCalcCategory('4W'); setCalcWeight(850); }}
                          className="accent-emerald-600"
                        />
                        <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>4-Wheeler (Car / SUV)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-900">Estimated Kerb Weight (kg)</label>
                      <span className="text-sm font-bold text-slate-900 font-mono bg-white px-2.5 py-1 rounded border border-slate-300">
                        {calcWeight} kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min={calcCategory === '2W' ? 80 : 700}
                      max={calcCategory === '2W' ? 180 : 1600}
                      step={5}
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Number(e.target.value))}
                      className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-900">Scrap Rate per kg (Shree Ambica)</label>
                      <span className="text-sm font-bold text-emerald-900 font-mono bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                        ₹{calcRate.toFixed(1)} / kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25}
                      max={28}
                      step={0.5}
                      value={calcRate}
                      onChange={(e) => setCalcRate(Number(e.target.value))}
                      className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full space-y-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">Calculated Estimate</span>
                    <h3 className="text-lg font-bold text-white">Estimated Cash Payout</h3>
                    <div className="my-4">
                      <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                        ₹{livePayout.toLocaleString('en-IN')}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Formula: {calcWeight}kg × ₹{calcRate}/kg + Free Towing
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={fillFormFromCalculator}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md"
                  >
                    Lock Rate &amp; Register Vehicle <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* MULTI-STEP VEHICLE INTAKE FORM */}
          <section id="registration-section" className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-extrabold text-emerald-950 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300 inline-block mb-2">
                Doorstep Inspection &amp; Pickup
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t.registerHeader}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                  
                  {/* RESIDENT AUTO-LOOKUP BOX (NO MANDATORY REGISTRATION, SEARCH BY MOBILE / REG NO ONLY) */}
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-emerald-700" /> Optional Resident Auto-Lookup (No Password Needed)
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold">Search by Mobile or Reg No Only</span>
                    </div>
                    <p className="text-[11px] text-slate-700">
                      If you previously entered vehicle or scrap details, type your <strong>10-Digit Mobile Number</strong> or <strong>Vehicle Registration Number</strong> to auto-fill. (Name search excluded to avoid duplicate name mismatches).
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 9825012345 or GJ-05-AB-1234"
                        value={residentSearchInput}
                        onChange={(e) => setResidentSearchInput(e.target.value)}
                        className="w-full text-xs bg-white border border-emerald-400 rounded-xl px-3 py-2 font-mono font-bold text-slate-950"
                      />
                      <button
                        type="button"
                        onClick={() => handleResidentAutoLookup(residentSearchInput)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs whitespace-nowrap cursor-pointer transition-all"
                      >
                        Auto-Fetch
                      </button>
                    </div>
                    {residentLookupMessage && (
                      <p className={`text-[11px] font-bold ${residentLookupMessage.startsWith('✅') ? 'text-emerald-900' : 'text-slate-600'}`}>
                        {residentLookupMessage}
                      </p>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
                    <Building2 className="w-5 h-5 text-emerald-600" /> Step 1: Resident Info &amp; Society Selection
                  </h3>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-900">Select Society *</label>
                      <button
                        type="button"
                        onClick={() => setShowAddSocietyModal(true)}
                        className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Society to List
                      </button>
                    </div>
                    <select
                      value={formData.society}
                      onChange={(e) => setFormData(prev => ({ ...prev, society: e.target.value }))}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
                    >
                      {societiesList.map(s => <option key={s} value={s}>{s}</option>)}
                      <option value="Other (Enter custom society name)">Other (Enter custom society name)</option>
                    </select>
                  </div>

                  {formData.society === 'Other (Enter custom society name)' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Enter Custom Society Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Heights, Vaishnodevi Road"
                        value={formData.customSociety || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, customSociety: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Flat / Wing *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. B-402"
                        value={formData.flatNo}
                        onChange={(e) => setFormData(prev => ({ ...prev, flatNo: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Owner Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name as on RC"
                        value={formData.ownerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">WhatsApp / Mobile Number (Strictly 10 Digits) *</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      inputMode="numeric"
                      placeholder="10-digit Mobile Number"
                      value={formData.mobile}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile: formatMobile10(e.target.value) }))}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Direct SMS &amp; WhatsApp status alerts will be delivered on this 10-digit number.</p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer">
                      Next: Vehicle Specs <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
                    <Car className="w-5 h-5 text-emerald-600" /> Step 2: Vehicle Specs &amp; Condition
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2">Vehicle Category (Radio Toggle) *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer font-bold text-xs ${formData.category === '2W' ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="vTypeFormRadio"
                          value="2W"
                          checked={formData.category === '2W'}
                          onChange={() => setFormData(prev => ({ ...prev, category: '2W', brand: 'Hero Honda / Hero MotoCorp', model: 'Splendor' }))}
                          className="accent-emerald-600"
                        />
                        <Bike className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>2-Wheeler (Bike / Scooter)</span>
                      </label>
                      <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer font-bold text-xs ${formData.category === '4W' ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="vTypeFormRadio"
                          value="4W"
                          checked={formData.category === '4W'}
                          onChange={() => setFormData(prev => ({ ...prev, category: '4W', brand: 'Maruti Suzuki', model: '800 (SS80 / Type 1 / 2)' }))}
                          className="accent-emerald-600"
                        />
                        <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>4-Wheeler (Car / SUV)</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Brand / Make (Last 50 Years) *</label>
                      <select
                        value={formData.brand}
                        onChange={(e) => handleBrandChange(e.target.value)}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
                      >
                        {Object.keys(BRANDS_DATABASE[formData.category]).map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Model Selection *</label>
                      <select
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
                      >
                        {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  {formData.model === 'Model Not Listed' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Enter Unlisted Model Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mahindra Duro 125 / Kinetic Nova"
                        value={formData.customModel}
                        onChange={e => setFormData(prev => ({ ...prev, customModel: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Registration Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. GJ-05-AB-1234 or GJ05AB1234"
                        value={formData.regNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, regNumber: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Registration Year *</label>
                      <input
                        type="number"
                        required
                        min={1970}
                        max={2026}
                        placeholder="2004"
                        value={formData.regYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, regYear: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Operating Condition *</label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
                      >
                        <option value="dead">Dead / Engine Seized / Non-Starting</option>
                        <option value="incomplete">Incomplete / Stripped / Missing Body Parts</option>
                        <option value="running_expired">Running but Fitness/RC Expired (&gt;15 Years)</option>
                        <option value="scrap">Severe Rust / Scrap / Accidental Loss</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Society Parking Spot / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Basement Parking Slot B-14 / Open Parking"
                        value={formData.parkingLocation}
                        onChange={e => setFormData(prev => ({ ...prev, parkingLocation: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Back</button>
                    <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer">
                      Next: RC &amp; Mandatory KYC Documents <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
                    <FileText className="w-5 h-5 text-emerald-600" /> Step 3: Registration Certificate (RC) &amp; Mandatory KYC Documents
                  </h3>

                  {/* 1. REGISTRATION CERTIFICATE (RC) STATUS (MANDATORY) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-900">
                      1. Vehicle Registration Certificate (RC) Availability Status *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer ${formData.rcStatus === 'original' ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold' : 'border-slate-200 bg-slate-50/50'}`}>
                        <input
                          type="radio"
                          name="rcStatusRadio"
                          value="original"
                          checked={formData.rcStatus === 'original'}
                          onChange={() => setFormData(prev => ({ ...prev, rcStatus: 'original' }))}
                          className="accent-emerald-600 mt-0.5"
                        />
                        <div>
                          <strong className="block text-slate-950">Original Physical RC Book / Smart Card</strong>
                          <span className="text-[11px] text-slate-600 font-normal">Physical RC is available for submission to RTO &amp; RVSF yard.</span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer ${formData.rcStatus === 'mparivahan' ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold' : 'border-slate-200 bg-slate-50/50'}`}>
                        <input
                          type="radio"
                          name="rcStatusRadio"
                          value="mparivahan"
                          checked={formData.rcStatus === 'mparivahan'}
                          onChange={() => setFormData(prev => ({ ...prev, rcStatus: 'mparivahan' }))}
                          className="accent-emerald-600 mt-0.5"
                        />
                        <div>
                          <strong className="block text-slate-950">mParivahan / DigiLocker Digital RC</strong>
                          <span className="text-[11px] text-slate-600 font-normal">Verified digital RC on Ministry of Road Transport (MoRTH) portal.</span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer ${formData.rcStatus === 'lost' ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold' : 'border-slate-200 bg-slate-50/50'}`}>
                        <input
                          type="radio"
                          name="rcStatusRadio"
                          value="lost"
                          checked={formData.rcStatus === 'lost'}
                          onChange={() => setFormData(prev => ({ ...prev, rcStatus: 'lost' }))}
                          className="accent-emerald-600 mt-0.5"
                        />
                        <div>
                          <strong className="block text-slate-950">Lost / Missing RC Book</strong>
                          <span className="text-[11px] text-slate-600 font-normal">Physical RC book misplaced. Requires Police Intimation &amp; Indemnity Affidavit.</span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer ${formData.rcStatus === 'scrap_unregistered' ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold' : 'border-slate-200 bg-slate-50/50'}`}>
                        <input
                          type="radio"
                          name="rcStatusRadio"
                          value="scrap_unregistered"
                          checked={formData.rcStatus === 'scrap_unregistered'}
                          onChange={() => setFormData(prev => ({ ...prev, rcStatus: 'scrap_unregistered' }))}
                          className="accent-emerald-600 mt-0.5"
                        />
                        <div>
                          <strong className="block text-slate-950">Scrap / End-of-Life Vehicle without RC</strong>
                          <span className="text-[11px] text-slate-600 font-normal">Processed under MoRTH RVSF Scrap &amp; Society Committee Resolution.</span>
                        </div>
                      </label>
                    </div>

                    {/* RC DOCUMENT PROOF ATTACHMENT */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          Attach RC Document Copy / Screenshot (Image / PDF) *
                        </label>
                        {formData.rcFileAttached && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> RC Attached &amp; Verified ({formData.rcFileName})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData(prev => ({
                                ...prev,
                                rcFileAttached: true,
                                rcFileName: file.name,
                                rcPreviewUrl: URL.createObjectURL(file)
                              }));
                            }
                          }}
                          className="text-xs text-slate-700 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500">
                          {formData.rcStatus === 'original' ? 'Upload photo of original RC Book/Card' : formData.rcStatus === 'mparivahan' ? 'Upload mParivahan/DigiLocker screenshot' : formData.rcStatus === 'lost' ? 'Upload Police NCR/FIR Copy' : 'Upload society affidavit/declaration'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. HYPOTHECATION & BANK LOAN STATUS */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-900">
                      2. Vehicle Hypothecation / Bank Loan Status *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer ${formData.hypothecationStatus === 'cleared' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="hypothecationRadio"
                          value="cleared"
                          checked={formData.hypothecationStatus === 'cleared'}
                          onChange={() => setFormData(prev => ({ ...prev, hypothecationStatus: 'cleared' }))}
                          className="accent-emerald-600"
                        />
                        <span>No Active Loan / Hypothecation Cleared (NOC Available)</span>
                      </label>
                      <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer ${formData.hypothecationStatus === 'hypothecated' ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="hypothecationRadio"
                          value="hypothecated"
                          checked={formData.hypothecationStatus === 'hypothecated'}
                          onChange={() => setFormData(prev => ({ ...prev, hypothecationStatus: 'hypothecated' }))}
                          className="accent-amber-600"
                        />
                        <span>Active Hypothecation (Owner undertakes bank clearance)</span>
                      </label>
                    </div>
                  </div>

                  {/* 3. MANDATORY KYC DOCUMENTS (AADHAAR & PAN - BOTH MANDATORY) */}
                  <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">
                        Mandatory KYC Identification (Aadhaar &amp; PAN Card - Both Mandatory with Document Upload)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* AADHAAR CARD NUMBER & UPLOAD */}
                      <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                        <label className="block text-xs font-bold text-slate-900">
                          Aadhaar Card Number (12 Digits) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={12}
                          pattern="[0-9]{12}"
                          placeholder="e.g. 982512349012"
                          value={formData.aadhaarNumber}
                          onChange={e => setFormData(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                        />
                        <div className="pt-1 border-t border-slate-100">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Upload Aadhaar Card Copy (Front/Back) *
                          </label>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData(prev => ({
                                  ...prev,
                                  aadhaarFileAttached: true,
                                  aadhaarFileName: file.name
                                }));
                              }
                            }}
                            className="text-xs text-slate-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer w-full"
                          />
                          {formData.aadhaarFileAttached && (
                            <span className="text-[10px] font-bold text-emerald-700 mt-1 block">
                              ✅ Aadhaar Document Attached: {formData.aadhaarFileName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* PAN CARD NUMBER & UPLOAD */}
                      <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                        <label className="block text-xs font-bold text-slate-900">
                          PAN Card Number (10 Characters) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={10}
                          pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
                          placeholder="e.g. ABCDE1234F"
                          value={formData.panNumber}
                          onChange={e => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase().slice(0, 10) }))}
                          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono uppercase font-bold"
                        />
                        <div className="pt-1 border-t border-slate-100">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Upload PAN Card Copy *
                          </label>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData(prev => ({
                                  ...prev,
                                  panFileAttached: true,
                                  panFileName: file.name
                                }));
                              }
                            }}
                            className="text-xs text-slate-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer w-full"
                          />
                          {formData.panFileAttached && (
                            <span className="text-[10px] font-bold text-emerald-700 mt-1 block">
                              ✅ PAN Document Attached: {formData.panFileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        defaultChecked
                        className="accent-emerald-600 mt-0.5 rounded cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-700 font-medium">
                        I solemnly declare that I am the bonafide registered owner or legal representative of this vehicle. Both Aadhaar and PAN documents provided are accurate and belong to the applicant for MoRTH scrappage compliance and DBT payout.
                      </span>
                    </label>
                  </div>

                  {/* 4. PREFERRED INSPECTION DATE & TIME */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Preferred Doorstep Inspection Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Preferred Time Slot *</label>
                      <select
                        value={formData.preferredTimeSlot}
                        onChange={e => setFormData(prev => ({ ...prev, preferredTimeSlot: e.target.value }))}
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-semibold"
                      >
                        <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                        <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                        <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setStep(2)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Back</button>
                    <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer hover:bg-emerald-700 transition-all">
                      Submit Registration &amp; Issue Token <Check className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {step === 4 && submittedLead && (
                <div className="text-center py-4 space-y-6">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Registration Confirmed</h3>
                  <div className="bg-slate-950 text-white p-6 rounded-2xl text-left max-w-md mx-auto space-y-2 shadow-xl font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Token ID:</span>
                      <strong className="text-emerald-400">{submittedLead.tokenId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Owner &amp; Society:</span>
                      <span>{submittedLead.ownerName} ({submittedLead.society})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-amber-400 font-bold">{submittedLead.status}</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="px-4 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl">
                    Register Another Vehicle
                  </button>
                </div>
              )}
            </div>
          </section>

        </main>
      )}

      {/* VIEW 2: UNTRACEABLE VEHICLES SOCIETY RTO NOC TAB WITH DOWNLOADABLE PDF GENERATOR */}
      {activeTab === 'societyNoc' && (
        <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {!currentOfficer ? (
            /* SOCIETY COMMITTEE AUTHENTICATION GATE */
            <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-xl space-y-4">
              <div className="text-center border-b pb-3 space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <Building2 className="w-6 h-6 text-emerald-700" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-950">Society Committee Sign In</h2>
                <p className="text-xs text-slate-600 font-medium">For Chairman (Pramukh) &amp; Secretary</p>
              </div>

              {societyAuthError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl">
                  {societyAuthError}
                </div>
              )}

              <form onSubmit={handleSocietyLogin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Society Login Email or Registered Mobile *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter society login ID or mobile"
                    value={societyLoginEmailInput}
                    onChange={e => setSocietyLoginEmailInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 font-bold text-slate-950"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-extrabold text-slate-950">Password *</label>
                    <button
                      type="button"
                      onClick={() => setShowSocietyLoginPassword(!showSocietyLoginPassword)}
                      className="text-[10px] text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {showSocietyLoginPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showSocietyLoginPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showSocietyLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={societyLoginPasswordInput}
                    onChange={e => setSocietyLoginPasswordInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 font-bold text-slate-950"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Your Committee Role / Designation *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSocietyLoginDesignation('Chairman / Pramukh')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        societyLoginDesignation === 'Chairman / Pramukh'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      Chairman / Pramukh
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocietyLoginDesignation('Secretary')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        societyLoginDesignation === 'Secretary'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      Secretary
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Sign In Committee Portal
                </button>

                <p className="text-[11px] text-slate-500 text-center font-medium">
                  Society IDs are created and managed by Platform Admin (GOD Admin).
                </p>
              </form>
            </div>
          ) : (
            <>
              {/* AUTHENTICATED SOCIETY COMMITTEE SESSION STATUS BAR */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Authenticated Society Committee Session</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{currentOfficer.name}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                        {currentOfficer.designation}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold">{nocSocietyName} · Reg: {nocSocietyRegNo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEditSocietyProfileModal(true)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Edit Society Profile
                  </button>
                  <button
                    onClick={handleSocietyLogout}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 border border-slate-800">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500 uppercase tracking-widest inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> CMVR &amp; Gujarat RTO Law Compliant
                  </span>
                  <span className="text-xs font-extrabold text-blue-300 bg-slate-900 px-3 py-1 rounded-full border border-blue-400 uppercase tracking-widest inline-flex items-center gap-1.5">
                    <UserIcon className="w-4 h-4 text-blue-400" /> Executive Committee Portal (Chairman &amp; Secretary)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Co-Operative Housing Society Executive Committee (Chairman / Pramukh &amp; Secretary) Portal
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Complete workflow for Society Chairman and Secretary: Register society details, log untraceable abandoned vehicles with frame pencil-rub chassis numbers, draft legal resolutions in English, Gujarati, or Hindi, download signed PDF NOC letters, and authorize Shree Ambica RVSF doorstep towing.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-950 border-b pb-2 border-slate-200 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-700" /> 1. Society &amp; Officer Bearers Information
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-extrabold text-slate-950 mb-1">Society Registered Name *</label>
                        <input type="text" value={nocSocietyName} onChange={e => setNocSocietyName(e.target.value)} className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block font-extrabold text-slate-950 mb-1">Registration Number *</label>
                          <input type="text" value={nocSocietyRegNo} onChange={e => setNocSocietyRegNo(e.target.value)} className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-slate-950 mb-1">Full Society Registered Address *</label>
                          <input type="text" value={nocSocietyAddress} onChange={e => setNocSocietyAddress(e.target.value)} placeholder="Street, Area, City, PIN, Gujarat" className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-medium" />
                        </div>
                      </div>

                      {/* AUTHORIZED SIGNATORIES */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="font-extrabold text-slate-950 text-xs block mb-1.5">Authorized Signatories (Chairman &amp; Secretary)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                          <div>
                            <label className="block font-bold text-slate-900 mb-0.5 text-[11px]">Chairman Name *</label>
                            <input type="text" value={nocChairmanName} onChange={e => setNocChairmanName(e.target.value)} className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold" />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-900 mb-0.5 text-[11px]">Chairman Contact *</label>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              inputMode="numeric"
                              pattern="[0-9]{10}"
                              value={nocChairmanMobile}
                              onChange={e => setNocChairmanMobile(formatMobile10(e.target.value))}
                              placeholder="10-digit mobile"
                              className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-900 mb-0.5 text-[11px]">Chairman ID Proof *</label>
                            <input type="text" value={nocChairmanIdProof} onChange={e => setNocChairmanIdProof(e.target.value)} className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block font-bold text-slate-900 mb-0.5 text-[11px]">Secretary Name *</label>
                            <input type="text" value={nocSecretaryName} onChange={e => setNocSecretaryName(e.target.value)} className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold" />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-900 mb-0.5 text-[11px]">Secretary Contact *</label>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              inputMode="numeric"
                              pattern="[0-9]{10}"
                              value={nocSecretaryMobile}
                              onChange={e => setNocSecretaryMobile(formatMobile10(e.target.value))}
                              placeholder="10-digit mobile"
                              className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-900 mb-0.5 text-[11px]">Secretary ID Proof *</label>
                            <input type="text" value={nocSecretaryIdProof} onChange={e => setNocSecretaryIdProof(e.target.value)} className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono" />
                          </div>
                        </div>
                      </div>

                      {/* RESOLUTION DATE & DETAILS SECTION */}
                      <div className="pt-3 border-t border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-700" /> Resolution &amp; Meeting Details
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Gujarat Co-op Act
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block font-extrabold text-slate-950 mb-1">
                              Date of Resolution (ઠરાવની તારીખ / प्रस्ताव दिनांक) *
                            </label>
                            <input
                              type="date"
                              required
                              value={nocResolutionDate}
                              onChange={e => setNocResolutionDate(e.target.value)}
                              className="w-full p-2 border border-emerald-500 rounded-xl bg-emerald-50/50 text-slate-950 font-bold focus:bg-white transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block font-extrabold text-slate-950 mb-1">
                              Resolution Ref No. (ઠરાવ નંબર) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. RES/2026/09-12"
                              value={nocResolutionNo}
                              onChange={e => setNocResolutionNo(e.target.value)}
                              className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-extrabold text-slate-950 mb-1">
                            Meeting Venue (સભા સ્થળ)
                          </label>
                          <input
                            type="text"
                            placeholder="Society Clubhouse / Registered Office"
                            value={nocMeetingVenue}
                            onChange={e => setNocMeetingVenue(e.target.value)}
                            className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-medium"
                          />
                        </div>
                      </div>

                      {/* JURISDICTION SECTION: POLICE STATION & RTO */}
                      <div className="pt-3 border-t border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Police Jurisdiction Details
                          </span>
                          <span className="text-[10px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Station Head &amp; Address
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block font-extrabold text-slate-950 mb-1">
                              Station Head Designation *
                            </label>
                            <select
                              value={nocPoliceStationHead}
                              onChange={e => setNocPoliceStationHead(e.target.value as any)}
                              className="w-full p-2 border border-blue-400 rounded-xl bg-blue-50/50 text-slate-950 font-bold"
                            >
                              <option value="Police Inspector (PI)">Police Inspector (PI)</option>
                              <option value="The Station House Officer (SHO)">The Station House Officer (SHO)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-extrabold text-slate-950 mb-1">
                              Police Station Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Palanpur Jakatnaka / Rander Police Station"
                              value={nocLocalPoliceStation}
                              onChange={e => setNocLocalPoliceStation(e.target.value)}
                              className="w-full p-2 border border-blue-400 rounded-xl bg-blue-50/40 text-slate-950 font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-900 mb-1 text-[11px]">
                            Complete Police Station Postal Address *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Street, Area, City, Gujarat, Pin Code"
                            value={nocPoliceStationAddress}
                            onChange={e => setNocPoliceStationAddress(e.target.value)}
                            className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-medium"
                          />
                        </div>

                        {/* PRESETS FOR POLICE JURISDICTION */}
                        <div className="flex flex-wrap gap-1 items-center pt-0.5">
                          <span className="text-[10px] text-slate-500 font-semibold mr-1">Quick Select:</span>
                          {[
                            'Rander Police Station, Surat',
                            'Jahangirpura Police Station, Surat',
                            'Palanpur Jakatnaka Police Station, Surat',
                            'Adajan Police Station, Surat',
                            'Katargam Police Station, Surat',
                            'Singanpore Police Station, Surat',
                            'Vesu Police Station, Surat',
                            'Umra Police Station, Surat'
                          ].map(ps => (
                            <button
                              key={ps}
                              type="button"
                              onClick={() => {
                                setNocLocalPoliceStation(ps);
                                setNocPoliceStationAddress(`Near ${ps.replace(' Police Station, Surat', '')} Main Road, Surat, Gujarat - 395009`);
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                                nocLocalPoliceStation === ps
                                  ? 'bg-blue-600 text-white shadow-2xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                              }`}
                            >
                              {ps.replace(' Police Station, Surat', '')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* RTO JURISDICTION */}
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-emerald-700" /> RTO Jurisdiction Details
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            CMVR Rule 51A
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block font-extrabold text-slate-950 mb-1">
                              RTO Office Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Regional Transport Office, Surat (GJ-05)"
                              value={nocRtoOffice}
                              onChange={e => setNocRtoOffice(e.target.value)}
                              className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block font-extrabold text-slate-950 mb-1">
                              RTO Postal Address *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="RTO Office, City, Gujarat, PIN"
                              value={nocRtoPostalAddress}
                              onChange={e => setNocRtoPostalAddress(e.target.value)}
                              className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="text-[10px] text-slate-500 font-semibold mr-1">Quick Select:</span>
                          {[
                            { name: 'Regional Transport Office, Surat (GJ-05)', addr: 'RTO Office Complex, Pal-Hazira Road, Near Pal RTO, Pal, Surat, Gujarat - 395009' },
                            { name: 'Regional Transport Office, Ahmedabad West (GJ-01)', addr: 'Subhash Bridge, Ashram Road, Ahmedabad, Gujarat - 380027' },
                            { name: 'Regional Transport Office, Vadodara (GJ-06)', addr: 'Golden Chokdi, Harni-Waghodia Ring Road, Vadodara, Gujarat - 390022' },
                            { name: 'Regional Transport Office, Palanpur (GJ-08)', addr: 'RTO Office, Ambaji Highway, Palanpur, Gujarat - 385001' }
                          ].map(rto => (
                            <button
                              key={rto.name}
                              type="button"
                              onClick={() => {
                                setNocRtoOffice(rto.name);
                                setNocRtoPostalAddress(rto.addr);
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                                nocRtoOffice === rto.name
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                              }`}
                            >
                              {rto.name.replace('Regional Transport Office, ', '').replace('Office, ', '')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* AUTHORIZED RVSF AGENCY DETAILS */}
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <span className="font-extrabold text-slate-950 text-xs block">Authorized RVSF Scrapping Agency Details</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-900 mb-0.5 text-[11px]">RVSF Partner Name *</label>
                            <input
                              type="text"
                              value={nocRvsfPartnerName}
                              onChange={e => setNocRvsfPartnerName(e.target.value)}
                              className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-900 mb-0.5 text-[11px]">Licence / Authorization ID *</label>
                            <input
                              type="text"
                              value={nocRvsfLicenseId}
                              onChange={e => setNocRvsfLicenseId(e.target.value)}
                              className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* PROMINENT DEDICATED PDF GENERATOR BUTTON FOR CHAIRMAN & SECRETARY WITH LETTERHEAD TOGGLE */}
                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/90 border border-amber-300 text-slate-900 cursor-pointer text-xs font-bold hover:bg-amber-100 transition-all select-none">
                          <input
                            type="checkbox"
                            checked={excludeSocietyHeader}
                            onChange={e => setExcludeSocietyHeader(e.target.checked)}
                            className="accent-amber-600 w-4 h-4 rounded cursor-pointer shrink-0"
                          />
                          <span className="leading-tight">
                            Exclude Society Header (Blank space maintained for <strong>Pre-Printed Letterheads</strong>)
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={handleDownloadPdfDocument}
                          disabled={isGeneratingPdf}
                          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FileDown className="w-4 h-4" />
                          {isGeneratingPdf ? 'Generating Official PDF...' : 'Generate & Download PDF NOC / Resolution'}
                        </button>
                        <p className="text-[10px] text-slate-800 font-bold text-center mt-1">
                          For Chairman &amp; Secretary signature &amp; society round stamp
                        </p>
                      </div>
                    </div>
                  </div>

              {/* CORE COMMITTEE MEMBERS MANAGER CARD */}
              <div id="committee-member-form" className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" /> Managing Committee Members Present ({committeeMembers.length})
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded border border-emerald-300">
                    Signatures Roster
                  </span>
                </div>

                {/* MEMBERS LIST WITH EDIT AND DELETE CONTROLS */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {committeeMembers.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500 italic bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      No committee members added yet. Add members below to populate resolution attendance.
                    </div>
                  ) : (
                    committeeMembers.map((m) => (
                      <div
                        key={m.id}
                        className={`p-2.5 rounded-xl border text-xs flex justify-between items-center transition-all ${
                          editingMemberId === m.id
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <strong className="text-slate-950 font-bold">{m.name}</strong>
                            <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-mono font-semibold">
                              {m.flatNo || 'Member'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                            <span className="text-emerald-800 font-bold">{m.designation}</span> · Mo: {m.mobile || 'Not set'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditMember(m)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 transition-all cursor-pointer"
                            title="Edit / Modify Member Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(m.id, m.name)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 transition-all cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ADD / EDIT MEMBER FORM */}
                <form onSubmit={handleSaveMember} className="space-y-2.5 pt-3 border-t border-slate-200 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      {editingMemberId ? (
                        <>
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-amber-900">Modify Member Details</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Add Committee Member</span>
                        </>
                      )}
                    </span>
                    {editingMemberId && (
                      <button
                        type="button"
                        onClick={handleCancelEditMember}
                        className="text-[10px] text-slate-600 hover:text-slate-900 font-bold px-2 py-0.5 rounded bg-slate-200 cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 text-[11px] mb-0.5">Member Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rameshbhai Patel"
                        value={newMemberName}
                        onChange={e => setNewMemberName(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl text-xs font-bold text-slate-950 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 text-[11px] mb-0.5">Designation *</label>
                      <select
                        value={newMemberDesignation}
                        onChange={e => setNewMemberDesignation(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl text-xs font-bold text-slate-950 bg-slate-50"
                      >
                        <option value="Chairman / Pramukh">Chairman / Pramukh</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Treasurer / Khajanchi">Treasurer / Khajanchi</option>
                        <option value="Executive Committee Member">Executive Committee Member</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 text-[11px] mb-0.5">Flat / Wing No.</label>
                      <input
                        type="text"
                        placeholder="e.g. B-201 / Wing A-504"
                        value={newMemberFlat}
                        onChange={e => setNewMemberFlat(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl text-xs font-bold text-slate-950 bg-slate-50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 text-[11px] mb-0.5">Mobile Contact Number (Strictly 10 Digits)</label>
                      <input
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        placeholder="10-digit mobile"
                        value={newMemberMobile}
                        onChange={e => setNewMemberMobile(formatMobile10(e.target.value))}
                        className="w-full p-2 border border-slate-400 rounded-xl text-xs font-bold text-slate-950 bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      editingMemberId
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-slate-900 hover:bg-slate-950'
                    }`}
                  >
                    {editingMemberId ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Save Changes to Member
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Add Member to Attendance
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* ABANDONED VEHICLE INVENTORY LOG & MANAGEMENT CARD */}
              <div id="abandoned-vehicle-form-card" className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-700" /> Abandoned Vehicle Inventory Log ({abandonedVehiclesList.length})
                  </h3>
                  <span className="text-[10px] bg-red-100 text-red-900 font-bold px-2 py-0.5 rounded border border-red-300">
                    Schedule-A Roster
                  </span>
                </div>

                {/* INVENTORY LIST OF CURRENTLY LOGGED VEHICLES WITH EDIT/MODIFY & DELETE */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {abandonedVehiclesList.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 italic bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      No vehicles logged yet. Add abandoned vehicles using the form below to auto-populate the Schedule-A Technical Inventory.
                    </div>
                  ) : (
                    abandonedVehiclesList.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                          editingAbVehicleId === item.id
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                              {item.category === '2W' ? '2-Wheeler' : '4-Wheeler'}
                            </span>
                            <strong className="text-xs text-slate-950 font-extrabold">{item.makeModel}</strong>
                            {item.color && (
                              <span className="text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {item.color}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditAbandonedVehicle(item)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                              title="Modify / Edit Vehicle Details"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAbandonedVehicle(item.id, item.makeModel)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                              title="Delete Incorrect Vehicle"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-white p-2 rounded-lg border border-slate-200">
                          <div>
                            <span className="text-slate-500 block text-[9px] font-sans font-bold">Registration No:</span>
                            <span className="font-bold text-slate-900">{item.regNumber || 'Unknown / None'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] font-sans font-bold">Physical Condition:</span>
                            <span className="font-bold text-red-700">{item.condition} · {item.durationYears} yrs</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block text-[9px] font-sans font-bold">Chassis No (Frame Rub):</span>
                            <span className="font-bold text-slate-950 tracking-wider break-all">{item.chassisNumber}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block text-[9px] font-sans font-bold">Engine No (Block Rub):</span>
                            <span className="font-bold text-slate-950 tracking-wider break-all">{item.engineNumber}</span>
                          </div>
                          {item.parkingSpot && (
                            <div className="col-span-2 text-slate-600 font-sans text-[10px]">
                              <strong>Location in Premises:</strong> {item.parkingSpot}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ADD / EDIT ABANDONED VEHICLE FORM */}
                <form onSubmit={handleSaveAbandonedVehicle} className="space-y-3 pt-3 border-t border-slate-200 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-950 text-xs flex items-center gap-1.5">
                      {editingAbVehicleId ? (
                        <>
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-amber-950 font-bold">Edit / Modify Abandoned Vehicle</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Log New Abandoned Vehicle</span>
                        </>
                      )}
                    </span>
                    {editingAbVehicleId && (
                      <button
                        type="button"
                        onClick={handleCancelEditAbandonedVehicle}
                        className="text-[10px] text-slate-700 hover:text-slate-950 font-bold px-2 py-0.5 rounded bg-slate-200 cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  {editingAbVehicleId && (
                    <div className="p-2 bg-amber-50 border border-amber-300 rounded-lg text-[11px] text-amber-950 font-medium">
                      Modifying selected vehicle record. Correct any mistyped chassis, engine, make, or registration details and click <strong>Update Vehicle</strong>.
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Vehicle Type *</label>
                      <select
                        value={newAbCategory}
                        onChange={e => setNewAbCategory(e.target.value as any)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-bold text-slate-950"
                      >
                        <option value="2W">2-Wheeler (Motorcycle / Scooter)</option>
                        <option value="4W">4-Wheeler (Car / Van / SUV)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Make &amp; Model *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Honda Activa / Maruti 800"
                        value={newAbMakeModel}
                        onChange={e => setNewAbMakeModel(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-bold text-slate-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Vehicle Color</label>
                      <input
                        type="text"
                        placeholder="e.g. Silver / Black / Maroon"
                        value={newAbColor}
                        onChange={e => setNewAbColor(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Visible Reg. No. (If visible)</label>
                      <input
                        type="text"
                        placeholder="e.g. GJ-05-XX-XXXX or leave blank"
                        value={newAbRegNo}
                        onChange={e => setNewAbRegNo(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-mono uppercase text-slate-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Mandatory Chassis No. (Frame Rub) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Vehicle Frame Extract"
                        value={newAbChassisNo}
                        onChange={e => setNewAbChassisNo(e.target.value)}
                        className="w-full p-2 border border-emerald-500 rounded-xl bg-emerald-50/40 font-mono font-bold uppercase text-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Mandatory Engine No. (Block Rub) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Engine Block Extract"
                        value={newAbEngineNo}
                        onChange={e => setNewAbEngineNo(e.target.value)}
                        className="w-full p-2 border border-emerald-500 rounded-xl bg-emerald-50/40 font-mono font-bold uppercase text-slate-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Current Condition *</label>
                      <select
                        value={newAbCondition}
                        onChange={e => setNewAbCondition(e.target.value as any)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-bold text-slate-950"
                      >
                        <option value="Scrap">Scrap / End-of-Life</option>
                        <option value="Rusted">Rusted &amp; Non-Functional</option>
                        <option value="Stripped">Asset Stripped / Missing Parts</option>
                        <option value="Non-functional">Completely Non-functional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Duration of Abandonment (Years)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={newAbDuration}
                        onChange={e => setNewAbDuration(Number(e.target.value) || 1)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-bold text-slate-950 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Compound Parking Location / Bay</label>
                    <input
                      type="text"
                      placeholder="e.g. Wing A, Slot No. 12 / Basement B-2"
                      value={newAbSpot}
                      onChange={e => setNewAbSpot(e.target.value)}
                      className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      editingAbVehicleId
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {editingAbVehicleId ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Save Changes to Vehicle
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> + Add Vehicle to Inventory Log
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {/* DRAFT PREVIEW, DOCUMENT SWITCHER, LANGUAGE TOGGLE & DOWNLOAD PDF */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900">Official Legal Letter Preview</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* DOCUMENT TYPE SWITCHER */}
                    <select
                      value={nocDraftDocType}
                      onChange={e => setNocDraftDocType(e.target.value as any)}
                      className="p-1.5 border border-slate-400 rounded-lg text-xs font-extrabold bg-slate-100 text-slate-950"
                    >
                      <option value="COMPLETE_SUITE">Complete 5-Section Legal Suite (સંપૂર્ણ ૫-વિભાગીય કાનૂની દસ્તાવેજ સ્યૂટ / संपूर्ण 5-अनुभागीय विधिक दस्तावेज)</option>
                      <option value="SECTION_1_CHECKLIST">Section 1: Pre-Procedural Checklist (પૂર્વ-કાર્યવાહી પ્રોટોકોલ ચેકલિસ્ટ)</option>
                      <option value="SECTION_2_RESOLUTION">Section 2: Managing Committee Resolution (કારોબારી સમિતિ ઠરાવ / प्रस्ताव)</option>
                      <option value="SECTION_3_POLICE">Section 3: Advance Police Intimation Notice (પોલીસ સ્ટેશન ઇન્ટિમેશન નોટિસ)</option>
                      <option value="SECTION_4_RTO">Section 4: RTO Master Deregistration Petition (RTO ડી-રજીસ્ટ્રેશન અરજી)</option>
                      <option value="SECTION_5_SCHEDULE">Section 5: Schedule-A Vehicle Inventory (પરિશિષ્ટ-A વાહન પત્રક)</option>
                    </select>

                    {/* PRE-PRINTED LETTERHEAD CHECKBOX TOGGLE */}
                    <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-slate-900 cursor-pointer text-xs font-bold hover:bg-amber-100 transition-all select-none">
                      <input
                        type="checkbox"
                        checked={excludeSocietyHeader}
                        onChange={e => setExcludeSocietyHeader(e.target.checked)}
                        className="accent-amber-600 w-4 h-4 rounded cursor-pointer shrink-0"
                      />
                      <span>Pre-Printed Letterhead (Blank Header)</span>
                    </label>

                    {/* LANGUAGE TOGGLE */}
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border text-xs font-bold">
                      <button onClick={() => setNocLetterLang('EN')} className={`px-2 py-1 rounded transition-all ${nocLetterLang === 'EN' ? 'bg-emerald-600 text-white font-extrabold' : 'text-slate-700'}`}>English</button>
                      <button onClick={() => setNocLetterLang('GU')} className={`px-2 py-1 rounded transition-all ${nocLetterLang === 'GU' ? 'bg-emerald-600 text-white font-extrabold' : 'text-slate-700'}`}>ગુજરાતી</button>
                      <button onClick={() => setNocLetterLang('HI')} className={`px-2 py-1 rounded transition-all ${nocLetterLang === 'HI' ? 'bg-emerald-600 text-white font-extrabold' : 'text-slate-700'}`}>हिंदी</button>
                    </div>

                    {/* DOWNLOAD PDF BUTTON */}
                    <button
                      onClick={handleDownloadPdfDocument}
                      disabled={isGeneratingPdf}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                      {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
                    </button>
                    
                    <button onClick={handlePrintDocument} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all">
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>
                </div>

                {/* PDF CONTAINER TARGET ELEMENT */}
                <div id="noc-official-letter-draft" className="p-6 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed space-y-4 font-serif text-slate-950 shadow-inner">
                  {excludeSocietyHeader ? (
                    <div 
                      className="w-full text-center border-b border-dashed border-slate-300 select-none flex items-center justify-center"
                      style={{ minHeight: '115px', height: '115px' }}
                    >
                      <span className="no-print-placeholder text-[11px] text-slate-400 font-sans italic border border-dashed border-slate-300 px-3 py-1 rounded bg-slate-50">
                        [ Blank space reserved for Society Official Pre-Printed Letterhead ]
                      </span>
                    </div>
                  ) : (
                    <div className="text-center font-bold text-sm border-b pb-3">
                      <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-950">{nocSocietyName}</h2>
                      <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">Registration No: {nocSocietyRegNo}</div>
                      <div className="text-[11px] text-slate-700 font-sans italic font-bold">Co-operative Housing Society Ltd. · Surat, Gujarat</div>
                    </div>
                  )}

                  {/* DOCUMENT HEADERS & BODIES ACCORDING TO 5-SECTION LEGAL SUITE SCHEMA */}
                  
                  {/* HELPER SECTION RENDERING LOGIC */}
                  {(() => {
                    const isAll = nocDraftDocType === 'COMPLETE_SUITE';
                    const showSec1 = isAll || nocDraftDocType === 'SECTION_1_CHECKLIST';
                    const showSec2 = isAll || nocDraftDocType === 'SECTION_2_RESOLUTION' || (nocDraftDocType as any) === 'SOCIETY_RESOLUTION';
                    const showSec3 = isAll || nocDraftDocType === 'SECTION_3_POLICE' || (nocDraftDocType as any) === 'POLICE_INTIMATION';
                    const showSec4 = isAll || nocDraftDocType === 'SECTION_4_RTO' || (nocDraftDocType as any) === 'RTO_LETTER';
                    const showSec5 = isAll || nocDraftDocType === 'SECTION_5_SCHEDULE';

                    // Reusable Signatories Block
                    const renderSignatories = () => (
                      <div className="pt-3 border-t border-slate-300 font-sans">
                        <div className="text-[11px] font-bold text-slate-900 mb-2">
                          {nocLetterLang === 'GU'
                            ? `વાસ્તે અને સોસાયટી કારોબારી સમિતિ વતી, ${nocSocietyName}`
                            : nocLetterLang === 'HI'
                            ? `वास्ते एवं प्रबंध समिति की ओर से, ${nocSocietyName}`
                            : `For and on behalf of Managing Committee, ${nocSocietyName}`}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-[11px]">
                          <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
                            <strong className="block text-slate-950 font-bold">{nocChairmanName}</strong>
                            <span className="text-slate-700 block font-semibold text-[10px]">
                              {nocLetterLang === 'GU' ? 'પ્રમુખ / Chairman (અધિકૃત સહી કરનાર)' : nocLetterLang === 'HI' ? 'अध्यक्ष / Chairman (अधिकृत हस्ताक्षरकर्ता)' : 'Chairman / Pramukh (Authorized Signatory)'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600 block">
                              {nocLetterLang === 'GU' ? 'સંપર્ક:' : nocLetterLang === 'HI' ? 'संपर्क:' : 'Mobile:'} {nocChairmanMobile}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600 block">
                              {nocLetterLang === 'GU' ? 'ઓળખ પુરાવો:' : nocLetterLang === 'HI' ? 'पहचान प्रमाण:' : 'ID Proof:'} {nocChairmanIdProof}
                            </span>
                            <div className="mt-5 pt-2 border-t border-dashed border-slate-400 text-[10px] text-slate-500 font-semibold text-center">
                              {nocLetterLang === 'GU'
                                ? '(સહી અને સોસાયટીનો સત્તાવાર સિક્કો)'
                                : nocLetterLang === 'HI'
                                ? '(हस्ताक्षर एवं सोसायटी की आधिकारिक मुहर)'
                                : '(Signature & Society Official Round Stamp)'}
                            </div>
                          </div>
                          <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
                            <strong className="block text-slate-950 font-bold">{nocSecretaryName}</strong>
                            <span className="text-slate-700 block font-semibold text-[10px]">
                              {nocLetterLang === 'GU' ? 'મંત્રી / Secretary (અધિકૃત સહી કરનાર)' : nocLetterLang === 'HI' ? 'सचिव / Secretary (अधिकृत हस्ताक्षरकर्ता)' : 'Secretary (Authorized Signatory)'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600 block">
                              {nocLetterLang === 'GU' ? 'સંપર્ક:' : nocLetterLang === 'HI' ? 'संपर्क:' : 'Mobile:'} {nocSecretaryMobile}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600 block">
                              {nocLetterLang === 'GU' ? 'ઓળખ પુરાવો:' : nocLetterLang === 'HI' ? 'पहचान प्रमाण:' : 'ID Proof:'} {nocSecretaryIdProof}
                            </span>
                            <div className="mt-5 pt-2 border-t border-dashed border-slate-400 text-[10px] text-slate-500 font-semibold text-center">
                              {nocLetterLang === 'GU'
                                ? '(સહી અને સોસાયટીનો સત્તાવાર સિક્કો)'
                                : nocLetterLang === 'HI'
                                ? '(हस्ताक्षर एवं सोसायटी की आधिकारिक मुहर)'
                                : '(Signature & Society Official Round Stamp)'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );

                    // Reusable Schedule Table
                    const renderScheduleTable = () => (
                      <div className="overflow-x-auto border border-slate-300 rounded-lg bg-white p-2.5 font-sans">
                        <div className="text-[11px] font-bold text-slate-900 mb-1.5 flex justify-between items-center">
                          <span>
                            {nocLetterLang === 'GU'
                              ? 'પરિશિષ્ટ-A: બિનવારસી વાહનોનું તકનીકી પત્રક (Schedule-A Technical Inventory)'
                              : nocLetterLang === 'HI'
                              ? 'अनुसूची-A: लावारिस वाहनों का तकनीकी विवरण पत्रक (Schedule-A Technical Inventory)'
                              : 'Schedule-A: Technical Inventory of Abandoned Vehicles Lacking RC'}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                            Total: {abandonedVehiclesList.length} Units
                          </span>
                        </div>
                        <table className="w-full text-[10px] text-left border-collapse border border-slate-300">
                          <thead className="bg-slate-100 font-bold border-b border-slate-300 text-slate-900">
                            <tr>
                              <th className="p-1.5 border-r border-slate-300">#</th>
                              <th className="p-1.5 border-r border-slate-300">{nocLetterLang === 'GU' ? 'પ્રકાર' : nocLetterLang === 'HI' ? 'प्रकार' : 'Type'}</th>
                              <th className="p-1.5 border-r border-slate-300">{nocLetterLang === 'GU' ? 'મેક અને મોડલ' : nocLetterLang === 'HI' ? 'मेक व मॉडल' : 'Make & Model'}</th>
                              <th className="p-1.5 border-r border-slate-300">{nocLetterLang === 'GU' ? 'રજીસ્ટ્રેશન નં.' : nocLetterLang === 'HI' ? 'पंजी. संख्या' : 'Reg No.'}</th>
                              <th className="p-1.5 border-r border-slate-300">{nocLetterLang === 'GU' ? 'ફરજિયાત ચેસીસ નંબર (ફ્રેમ રબ)' : nocLetterLang === 'HI' ? 'अनिवार्य चेसिस संख्या (फ्रेम प्रिंट)' : 'Chassis No. (Frame Rub)'}</th>
                              <th className="p-1.5 border-r border-slate-300">{nocLetterLang === 'GU' ? 'એન્જિન નંબર (બ્લોક રબ)' : nocLetterLang === 'HI' ? 'इंजन संख्या (ब्लॉक प्रिंट)' : 'Engine No. (Block Rub)'}</th>
                              <th className="p-1.5 border-r border-slate-300">{nocLetterLang === 'GU' ? 'સ્થિતિ' : nocLetterLang === 'HI' ? 'स्थिति' : 'Condition'}</th>
                              <th className="p-1.5 border-r border-slate-300">{nocLetterLang === 'GU' ? 'બિનવારસી મુદત' : nocLetterLang === 'HI' ? 'लावारिस अवधि' : 'Duration'}</th>
                              <th className="p-1.5">{nocLetterLang === 'GU' ? 'પરિસરમાં સ્થળ' : nocLetterLang === 'HI' ? 'परिसर में स्थल' : 'Premises Spot'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {abandonedVehiclesList.map((item, idx) => (
                              <tr key={item.id}>
                                <td className="p-1.5 border-r border-slate-200 font-bold">{idx + 1}</td>
                                <td className="p-1.5 border-r border-slate-200 font-bold">{item.category}</td>
                                <td className="p-1.5 border-r border-slate-200 font-medium">{item.makeModel}</td>
                                <td className="p-1.5 font-mono border-r border-slate-200">{item.regNumber}</td>
                                <td className="p-1.5 font-mono font-bold border-r border-slate-200 text-slate-950">{item.chassisNumber}</td>
                                <td className="p-1.5 font-mono border-r border-slate-200">{item.engineNumber}</td>
                                <td className="p-1.5 border-r border-slate-200">
                                  <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-800 font-semibold border border-red-200 text-[9px]">
                                    {item.condition}
                                  </span>
                                </td>
                                <td className="p-1.5 border-r border-slate-200">{item.durationYears} {nocLetterLang === 'GU' ? 'વર્ષ+' : nocLetterLang === 'HI' ? 'वर्ष+' : 'Years+'}</td>
                                <td className="p-1.5 text-slate-600 text-[9px]">{item.parkingSpot || 'Society Compound'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );

                    // Reusable Statutory Indemnity Clause
                    const renderIndemnityClause = () => (
                      <div className="p-3 bg-amber-50 border-l-4 border-amber-600 rounded-r-lg text-[11px] leading-relaxed font-sans text-slate-900 space-y-1">
                        <strong className="block text-amber-950 font-extrabold uppercase tracking-wide">
                          {nocLetterLang === 'GU'
                            ? 'બિન-વાટાઘાટપાત્ર કાનૂની ક્ષતિપૂર્તિ અને હોદ્દેદારોની જવાબદારી મુક્તિ કલમ (NON-NEGOTIABLE STATUTORY INDEMNITY CLAUSE):'
                            : nocLetterLang === 'HI'
                            ? 'अपरिहार्य विधिक क्षतिपूर्ति एवं पदाधिकारियों की विधिक दायित्व मुक्ति खंड (NON-NEGOTIABLE STATUTORY INDEMNITY CLAUSE):'
                            : 'NON-NEGOTIABLE STATUTORY INDEMNITY & COMPLETE OFFICE BEARER SHIELD CLAUSE:'}
                        </strong>
                        <p>
                          {nocLetterLang === 'GU'
                            ? `આથી સ્પષ્ટપણે અને અસંદિગ્ધ રીતે ઠરાવવામાં તથા જાહેર કરવામાં આવે છે કે ${nocSocietyName} ના પ્રમુખશ્રી (${nocChairmanName}), મંત્રીશ્રી (${nocSecretaryName}) તથા કારોબારી સમિતિના તમામ સભ્યો સોસાયટી પરિસરની જાહેર સલામતી, આગ અને સ્વાસ્થ્યના જોખમો નિવારવા માટે સંપૂર્ણ સદ્ભાવનાપૂર્વક (in good faith) કાર્યવાહી કરી રહ્યા છે. વાહનોના કાયદેસર નિકાલ બાદ જો કોઈ લાંબા સમયથી ગેરહાજર મૂળ માલિક, બેંક કે નાણાકીય ધિરાણ સંસ્થા (હાઈપોથીકેશન/લોન દાવા), વીમા કંપની કે કાનૂની વારસદારો તરફથી કોઈપણ પશ્ચાત્વર્તી માલિકી હક કે આર્થિક વળતરનો દાવો ઉપસ્થિત કરવામાં આવશે, તો તેનો સંપૂર્ણ નાણાકીય અને કાનૂની દોષ માત્ર ને માત્ર વાહન બિનવારસી છોડી જનાર ડિફોલ્ટર માલિકનો રહેશે. સોસાયટીના પ્રમુખ કે મંત્રીશ્રી કોઈપણ વ્યક્તિગત, દીવાની, આર્થિક કે ફોજદારી જવાબદારીમાંથી કાયદેસર રીતે સંપૂર્ણપણે મુક્ત અને સંરક્ષિત રહેશે.`
                            : nocLetterLang === 'HI'
                            ? `एतद्द्वारा स्पष्ट एवं असंदिग्ध रूप से यह घोषित व संकल्पित किया जाता है कि ${nocSocietyName} के अध्यक्ष (${nocChairmanName}), सचिव (${nocSecretaryName}) तथा प्रबंध समिति के समस्त सदस्य सोसायटी परिसर की सार्वजनिक सुरक्षा, अग्नि सुरक्षा एवं स्वच्छता संरक्षण हेतु पूर्ण सद्भावपूर्वक (in good faith) कार्रवाई कर रहे हैं। वाहनों के विधिपूर्ण निस्तारण के उपरांत यदि किसी लंबे समय से अनुपस्थित मूल स्वामी, बैंक अथवा वित्तीय ऋणदाता संस्था (हाइपोथीकेशन/ऋण दावे), बीमा कंपनी अथवा उत्तराधिकारियों द्वारा कोई पश्चातवर्ती स्वामित्व अथवा वित्तीय क्षतिपूर्ति का दावा उठाया जाता है, तो उसका संपूर्ण विधिक व वित्तीय दायित्व केवल और केवल वाहन का परित्याग करने वाले डिफॉल्टर मालिक का होगा। सोसायटी के अध्यक्ष, सचिव एवं प्रबंध समिति सदस्य किसी भी व्यक्तिगत, दीवानी, वित्तीय अथवा आपराधिक दायित्व से पूर्णतः मुक्त एवं सुरक्षित (Fully Indemnified) रहेंगे।`
                            : `It is hereby explicitly resolved, certified, and declared that the Chairman (${nocChairmanName}), Secretary (${nocSecretaryName}), and Managing Committee members of ${nocSocietyName} are acting purely in good faith and public interest under the Gujarat Co-operative Societies Act and CMVR to eliminate persistent structural fire, dengue/malaria breeding, hygiene, and security hazards within society compound. Any future ownership disputes, post-facto claims, or recovery proceedings by long-lost registered owners, financial institutions (bank loan/hypothecation), insurance companies, or legal heirs following physical disposal shall constitute the sole and exclusive civil, criminal, and financial culpability of the deserting owner due to proactive abandonment. The Society, Chairman, and Secretary shall remain unconditionally and irreversibly indemnified, held completely harmless, and fully shielded from all personal, civil, financial, or criminal liabilities.`}
                        </p>
                      </div>
                    );

                    return (
                      <div className="space-y-6">
                        {/* SUITE OVERVIEW BANNER WHEN IN COMPLETE SUITE MODE */}
                        {isAll && (
                          <div className="bg-slate-900 text-white p-3.5 rounded-xl text-center space-y-1 font-sans">
                            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-extrabold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-600 inline-block">
                              MoRTH · CMVR Rule 51A · Gujarat Co-operative Societies Act 1961
                            </span>
                            <h2 className="text-sm font-extrabold text-white">
                              {nocLetterLang === 'GU'
                                ? 'સંપૂર્ણ ૫-વિભાગીય કાનૂની દસ્તાવેજ સ્યૂટ (પરિશિષ્ટ અને અધિકૃત પત્રો સહિત)'
                                : nocLetterLang === 'HI'
                                ? 'संपूर्ण 5-अनुभागीय विधिक दस्तावेज सूट (समस्त परिशिष्ट एवं आधिकारिक पत्रों सहित)'
                                : 'EXHAUSTIVE 5-SECTION LEGAL DOCUMENTATION SUITE (PRINT-READY LEGAL SHIELD)'}
                            </h2>
                            <p className="text-[10px] text-slate-300">
                              {nocSocietyName} · Reg. No: {nocSocietyRegNo} · Resolution Date: {nocResolutionDate}
                            </p>
                          </div>
                        )}

                        {/* ========================================================= */}
                        {/* SECTION 1: PRE-PROCEDURAL COMPLIANCE & PROTOCOL CHECKLIST */}
                        {/* ========================================================= */}
                        {showSec1 && (
                          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3 font-sans">
                            <div className="border-b border-slate-300 pb-2">
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                {nocLetterLang === 'GU' ? 'વિભાગ ૧' : nocLetterLang === 'HI' ? 'अनुभाग 1' : 'SECTION 1'}
                              </span>
                              <h3 className="text-xs font-extrabold text-slate-950 uppercase mt-1">
                                {nocLetterLang === 'GU'
                                  ? 'પૂર્વ-કાર્યવાહી કાનૂની પાલન અને પ્રોટોકોલ ચેકલિસ્ટ (સોસાયટી કારોબારી સમિતિ માટે કાનૂની સુરક્ષા માર્ગદર્શિકા)'
                                  : nocLetterLang === 'HI'
                                  ? 'पूर्व-प्रक्रियात्मक विधिक अनुपालन एवं प्रोटोकॉल चेकलिस्ट (प्रबंध समिति हेतु अनिवार्य सुरक्षा निर्देशिका)'
                                  : 'PRE-PROCEDURAL COMPLIANCE & PROTOCOL CHECKLIST (Mandatory Legal Shield Guidance for Managing Committee)'}
                              </h3>
                              <p className="text-[10px] text-slate-600 italic">
                                Statutory alignment with Gujarat Co-operative Societies Act, 1961 &amp; Rule 51A Central Motor Vehicles Rules (CMVR) 1989.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px] text-slate-900 leading-relaxed">
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                <div className="font-bold text-slate-950 flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                                  {nocLetterLang === 'GU'
                                    ? 'ચેસીસ ફ્રેમ & એન્જિન બ્લોક પેન્સિલ ઘસાઈ પ્રિન્ટ ટ્રેસિંગ'
                                    : nocLetterLang === 'HI'
                                    ? 'चेसिस फ्रेम व इंजन ब्लॉक पेंसिल प्रिंट ट्रेसिंग'
                                    : 'Mandatory Physical Chassis Frame & Engine Block Rubbing'}
                                </div>
                                <p className="text-[10px] text-slate-700">
                                  {nocLetterLang === 'GU'
                                    ? 'વાહનને હટાવ્યા અગાઉ સોસાયટી હોદ્દેદારોએ વાહનની મેટાલિક બોડી ફ્રેમ પરથી ચેસીસ નંબર અને એન્જિન બ્લોક પરથી એન્જિન નંબરની પેન્સિલ રબિંગ પ્રિન્ટ કાગળ પર લેવી અને સોસાયટીના દફતરે સંગ્રહિત કરવી.'
                                    : nocLetterLang === 'HI'
                                    ? 'वाहन को स्थानांतरित करने से पूर्व मैटेलिक बॉडी फ्रेम से चेसिस नंबर एवं इंजन ब्लॉक से इंजन नंबर का पेंसिल रबिंग इंप्रेशन कागज़ पर लेना और सोसायटी रिकॉर्ड में सुरक्षित रखना अनिवार्य है।'
                                    : 'Extract physical pencil-rub impression directly from vehicle body frame chassis number and engine block for every vehicle lacking RC. File in physical Society Register.'}
                                </p>
                              </div>

                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                <div className="font-bold text-slate-950 flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                                  {nocLetterLang === 'GU'
                                    ? 'કારોબારી સમિતિનો સત્તાવાર વિશેષ ઠરાવ (ગુજરાત સહકારી અધિનિયમ)'
                                    : nocLetterLang === 'HI'
                                    ? 'प्रबंध समिति का आधिकारिक विशेष प्रस्ताव (गुजरात सहकारी अधिनियम)'
                                    : 'Formal Managing Committee Resolution under Gujarat Co-op Act'}
                                </div>
                                <p className="text-[10px] text-slate-700">
                                  {nocLetterLang === 'GU'
                                    ? `તારીખ: ${nocResolutionDate} (ઠરાવ નં: ${nocResolutionNo}) ના રોજ મળેલ બેઠકમાં વાહનોને આરોગ્ય/આગ/સુરક્ષા જોખમ જાહેર કરી પ્રમુખ (${nocChairmanName}) અને મંત્રી (${nocSecretaryName}) ને કાનૂની સત્તા આપતો ઠરાવ પાસ કરવો.`
                                    : nocLetterLang === 'HI'
                                    ? `दिनांक: ${nocResolutionDate} (प्रस्ताव सं: ${nocResolutionNo}) की बैठक में वाहनों को आग/सुरक्षा खतरा घोषित कर अध्यक्ष (${nocChairmanName}) एवं सचिव (${nocSecretaryName}) को अधिकृत करने वाला प्रस्ताव पारित करें।`
                                    : `Convene formal meeting (Res #${nocResolutionNo}, Date: ${nocResolutionDate}) declaring vehicles continuous hazards and unanimously authorizing Chairman & Secretary.`}
                                </p>
                              </div>

                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                <div className="font-bold text-slate-950 flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                                  {nocLetterLang === 'GU'
                                    ? 'સ્થાનિક પોલીસ સ્ટેશન અગાઉથી ઇન્ટિમેશન અને સ્ટેશન ડાયરી સીલ'
                                    : nocLetterLang === 'HI'
                                    ? 'स्थानीय पुलिस थाना अग्रिम सूचना एवं स्टेशन डायरी मुहर'
                                    : 'Advance Police Intimation & Station Diary Inward Seal'}
                                </div>
                                <p className="text-[10px] text-slate-700">
                                  {nocLetterLang === 'GU'
                                    ? `વિભાગ ૩ હેઠળનો પત્ર ${nocPoliceStationHead}, ${nocLocalPoliceStation} ને રૂબરૂ આપી CCTNS ચોરી રેકોર્ડ ચકાસણીની માંગણી કરવી અને સ્ટેશન ડાયરી એન્ટ્રી સાથેની ઇનવર્ડ પહોંચ મેળવવી.`
                                    : nocLetterLang === 'HI'
                                    ? `अनुभाग 3 के तहत पत्र ${nocPoliceStationHead}, ${nocLocalPoliceStation} को सौंपकर CCTNS चोरी रिकॉर्ड सत्यापन का अनुरोध करें एवं स्टेशन डायरी संदर्भ सहित मुहरयुक्त पावती प्राप्त करें।`
                                    : `Submit Section 3 notice to ${nocPoliceStationHead}, ${nocLocalPoliceStation} to cross-verify against CCTNS & stolen vehicle records. Secure stamped Inward seal & diary entry.`}
                                </p>
                              </div>

                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                <div className="font-bold text-slate-950 flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                                  {nocLetterLang === 'GU'
                                    ? '૧૫ દિવસની કાનૂની વાંધા મુદત (Statutory 15-Day Window)'
                                    : nocLetterLang === 'HI'
                                    ? '15-दिवसीय सांविधिक आपत्ति प्रतीक्षा अवधि'
                                    : 'Statutory 15-Day Notice Window Observance'}
                                </div>
                                <p className="text-[10px] text-slate-700">
                                  {nocLetterLang === 'GU'
                                    ? 'પોલીસ ઇનવર્ડ તારીખથી ફરજિયાત ૧૫ દિવસની રાહ જોવી. કોઈ ચોરી કે ગુનાહિત રેકોર્ડ ન મળે તો સોસાયટી કાનૂની રીતે નિર્દોષ સાબિત થાય છે અને વાહન નિકાલ માટે ક્લિયરન્સ ગણાય છે.'
                                    : nocLetterLang === 'HI'
                                    ? 'पुलिस पावती दिनांक से अनिवार्यतः 15 दिनों की प्रतीक्षा करें। इस अवधि में कोई चोरी या अपराध रिपोर्ट न आने पर सोसायटी पूर्णतः निर्दोष व अधिकृत मानी जाती है।'
                                    : 'Strictly observe 15-day notice window post-police delivery. If no objection is recorded, society attains clean statutory standing before RTO disposal.'}
                                </p>
                              </div>

                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                <div className="font-bold text-slate-950 flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">5</span>
                                  {nocLetterLang === 'GU'
                                    ? 'RTO કચેરી ખાતે CMVR નિયમ ૫૧-A હેઠળ ડી-રજીસ્ટ્રેશન અરજી'
                                    : nocLetterLang === 'HI'
                                    ? 'RTO कार्यालय में CMVR नियम 51A के तहत पंजीकरण निरस्तीकरण याचिका'
                                    : 'RTO Deregistration Petition Submission under Rule 51A'}
                                </div>
                                <p className="text-[10px] text-slate-700">
                                  {nocLetterLang === 'GU'
                                    ? `વિભાગ ૪ હેઠળની અરજી ${nocRtoOffice} ખાતે પોલીસ ઇનવર્ડ સાથે રજૂ કરી વાહનના વાહન (VAHAN) પોર્ટલ પરના રેકોર્ડ રદ્દ કરવા અને સ્ક્રેપિંગ મંજૂરી મેળવવી.`
                                    : nocLetterLang === 'HI'
                                    ? `अनुभाग 4 की याचिका ${nocRtoOffice} में पुलिस पावती सहित प्रस्तुत कर वाहन (VAHAN) पोर्टल रिकॉर्ड निरस्तीकरण एवं स्क्रैपिंग अनापत्ति प्राप्त करें।`
                                    : `Submit Section 4 petition to ${nocRtoOffice} along with police receipt for cancellation of VAHAN portal records under CMVR Rule 51A.`}
                                </p>
                              </div>

                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                <div className="font-bold text-slate-950 flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">6</span>
                                  {nocLetterLang === 'GU'
                                    ? 'સરકાર માન્ય RVSF એજન્સીને હસ્તાંતરણ અને ડિપોઝિટ પ્રમાણપત્ર (COD)'
                                    : nocLetterLang === 'HI'
                                    ? 'सरकार-मान्य RVSF संस्था को हस्तांतरण एवं जमा प्रमाण पत्र (COD)'
                                    : 'Authorized RVSF Scrapping Agency Handover & COD Audit Trail'}
                                </div>
                                <p className="text-[10px] text-slate-700">
                                  {nocLetterLang === 'GU'
                                    ? `માત્ર ને માત્ર સરકાર માન્ય RVSF પાર્ટનર "${nocRvsfPartnerName}" (લાઇસન્સ: ${nocRvsfLicenseId}) ને જ વાહન સોંપવું અને ચેસીસ કટિંગ બાદ સરકારી ડિપોઝિટ સર્ટિફિકેટ (COD) મેળવવું.`
                                    : nocLetterLang === 'HI'
                                    ? `केवल सरकार-मान्य स्क्रैपर "${nocRvsfPartnerName}" (लाइसेंस: ${nocRvsfLicenseId}) को ही वाहन सौंपें तथा चेसिस विनष्टीकरण उपरांत आधिकारिक Certificate of Deposit (COD) प्राप्त करें।`
                                    : `Hand over vehicles exclusively to MoRTH Registered RVSF: ${nocRvsfPartnerName} (Licence: ${nocRvsfLicenseId}). Ensure issuance of Certificate of Deposit (CoD).`}
                                </p>
                              </div>
                            </div>

                            {!isAll && renderSignatories()}
                          </div>
                        )}

                        {/* ========================================================= */}
                        {/* SECTION 2: MANAGING COMMITTEE FORMAL RESOLUTION DRAFT     */}
                        {/* ========================================================= */}
                        {showSec2 && (
                          <div className="border border-slate-300 rounded-xl p-4 bg-white space-y-3 font-sans">
                            <div className="text-center border-b border-slate-300 pb-2.5">
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                {nocLetterLang === 'GU' ? 'વિભાગ ૨' : nocLetterLang === 'HI' ? 'अनुभाग 2' : 'SECTION 2'}
                              </span>
                              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-950 mt-1">
                                {nocLetterLang === 'GU'
                                  ? 'સંસ્થાની કારોબારી સમિતિની સામાન્ય સભાનો વિધિવત ઠરાવ (MANAGING COMMITTEE FORMAL RESOLUTION EXTRACT)'
                                  : nocLetterLang === 'HI'
                                  ? 'सहकारी आवास समिति की प्रबंध समिति की सामान्य बैठक का आधिकारिक प्रस्ताव (RESOLUTION EXTRACT)'
                                  : 'EXTRACT OF FORMAL RESOLUTION PASSED IN MANAGING COMMITTEE MEETING'}
                              </h3>
                              <div className="text-[10px] text-slate-600 font-serif italic mt-0.5">
                                {nocLetterLang === 'GU'
                                  ? 'ગુજરાત સહકારી મંડળીઓ અધિનિયમ, ૧૯૬૧ હેઠળ સત્તાવાર ઠરાવ'
                                  : nocLetterLang === 'HI'
                                  ? 'गुजरात सहकारी समितियां अधिनियम, 1961 के अंतर्गत आधिकारिक प्रस्ताव'
                                  : 'Statutory Resolution under the Gujarat Co-operative Societies Act, 1961'}
                              </div>
                              <div className="text-[11px] font-mono text-slate-800 mt-1 bg-slate-50 py-1 px-2 rounded border border-slate-200 inline-block">
                                <strong>{nocLetterLang === 'GU' ? 'ઠરાવ ક્રમાંક:' : nocLetterLang === 'HI' ? 'प्रस्ताव संख्या:' : 'Resolution Ref No:'}</strong> {nocResolutionNo} ·{' '}
                                <strong>{nocLetterLang === 'GU' ? 'તારીખ:' : nocLetterLang === 'HI' ? 'दिनांक:' : 'Date:'}</strong> {nocResolutionDate}
                              </div>
                            </div>

                            <div className="bg-slate-50 p-2.5 border rounded-lg text-[11px] space-y-1">
                              <p>
                                <strong>{nocLetterLang === 'GU' ? 'સભા સ્થળ:' : nocLetterLang === 'HI' ? 'बैठक स्थल:' : 'Meeting Venue:'}</strong> {nocMeetingVenue}
                              </p>
                              <p>
                                <strong>
                                  {nocLetterLang === 'GU'
                                    ? 'એજન્ડા વિષય ક્રમાંક ૩:'
                                    : nocLetterLang === 'HI'
                                    ? 'कार्यसूची (एजेंडा) सं. 3:'
                                    : 'Agenda Item No. 3:'}
                                </strong>{' '}
                                {nocLetterLang === 'GU'
                                  ? `સોસાયટી પરિસરમાંથી છેલ્લા ૨ થી ૩ વર્ષથી પડી રહેલા ${abandonedVehiclesList.length} બિનવારસી, માલિક વગરના અને આરસી બુક વિનાના ભંગાર વાહનોના કેન્દ્ર સરકારના MoRTH અને ગુજરાત RTO નિયમો હેઠળ કાયદેસર નિકાલ અને સરકાર માન્ય RVSF મારફતે સ્ક્રેપિંગ મંજૂરી બાબત.`
                                  : nocLetterLang === 'HI'
                                  ? `सोसायटी परिसर में पिछले 2 से 3 वर्षों से लावारिस, अप्राप्य एवं बिना आरसी बुक के निष्प्रयोज्य ${abandonedVehiclesList.length} वाहनों के MoRTH एवं गुजरात मोटर वाहन नियमों के तहत निस्तारण एवं सरकार-मान्य RVSF के माध्यम से स्क्रैपिंग स्वीकृति बाबत।`
                                  : `Disposal & Scrappage of ${abandonedVehiclesList.length} Untraceable Abandoned Vehicles Lacking RC Books inside Society Compound under MoRTH & CMVR Guidelines through Government-Approved RVSF.`}
                              </p>
                            </div>

                            <div className="space-y-2 text-slate-900 leading-relaxed font-serif text-xs">
                              <p className="font-bold underline text-slate-950">
                                {nocLetterLang === 'GU'
                                  ? 'સર્વાનુમતે પસાર થયેલ ઠરાવની નકલ (RESOLUTION OPERATIVE TEXT):'
                                  : nocLetterLang === 'HI'
                                  ? 'सर्वसम्मति से पारित प्रस्ताव पाठ (RESOLUTION OPERATIVE TEXT):'
                                  : 'RESOLVED UNANIMOUSLY THAT:'}
                              </p>

                              <p>
                                {nocLetterLang === 'GU'
                                  ? `આજના રોજ તારીખ: ${nocResolutionDate} ના રોજ ${nocMeetingVenue} ખાતે મળેલી ${nocSocietyName} (નોંધણી નંબર: ${nocSocietyRegNo}, સરનામું: ${nocSocietyAddress}) ની કારોબારી સમિતિની બેઠકમાં ગંભીર વિચારણા કરી સર્વાનુમતે ઠરાવવામાં આવે છે કે સોસાયટીના કમ્પાઉન્ડમાં છેલ્લા ૨ થી ૩ વર્ષથી વધુ સમયથી બિનવારસી હાલતમાં પડી રહેલા ${abandonedVehiclesList.length} વાહનો, જેના માલિકો સોસાયટી તરફથી વારંવાર જાહેર અને આંતરિક નોટિસો પ્રસિદ્ધ કરવા છતાં મળી આવતા નથી અને જેમની આરસી બુક પણ ઉપલબ્ધ નથી, તે સોસાયટીની આંતરિક સુરક્ષા, સભ્યોના વાહન પાર્કિંગ, આગ સલામતી (Fire Hazard) અને મચ્છરજન્ય રોગચાળા (Health Hazard) માટે ગંભીર અને અસહ્ય જોખમ ઊભું કરી રહ્યા છે.`
                                  : nocLetterLang === 'HI'
                                  ? `आज दिनांक: ${nocResolutionDate} को ${nocMeetingVenue} में आयोजित ${nocSocietyName} (पंजीकरण सं: ${nocSocietyRegNo}, पता: ${nocSocietyAddress}) की प्रबंध समिति बैठक में गहन विचार-विमर्श उपरांत सर्वसम्मति से यह संकल्प पारित किया जाता है कि सोसायटी परिसर में पिछले 2 से 3 वर्षों से लावारिस एवं निष्प्रयोज्य अवस्था में पड़े ${abandonedVehiclesList.length} वाहन, जिनके मालिक आंतरिक सार्वजनिक सूचनाओं के बावजूद पूर्णतः अप्राप्य हैं और जिनकी आरसी बुक भी उपलब्ध नहीं है, वे परिसर में अग्नि सुरक्षा, यातायात अवरोध, डेंगू-मलेरिया जैसे संक्रामक स्वास्थ्य खतरों एवं सुरक्षा हेतु गंभीर संकट उत्पन्न कर रहे हैं।`
                                  : `In the Managing Committee Meeting of ${nocSocietyName} (Registration No: ${nocSocietyRegNo}, Registered Address: ${nocSocietyAddress}) held on ${nocResolutionDate} at ${nocMeetingVenue}, it is unanimously resolved that the ${abandonedVehiclesList.length} untraceable and abandoned vehicles parked inside the society premises for prolonged periods exceeding 2–3 years, whose registered owners remain completely untraceable despite multiple internal notices, public circulars, and physical inquiries, and whose Registration Certificates (RC Books) are unavailable, constitute continuous security, severe structural fire, dengue/malaria breeding health hazards, and acute parking obstruction to residents.`
                                }
                              </p>

                              <p>
                                {nocLetterLang === 'GU'
                                  ? `વધુમાં ઠરાવવામાં આવે છે કે કેન્દ્ર સરકારના પરિવહન મંત્રાલય (MoRTH) ના વાહન સ્ક્રેપેજ પોલિસી અને સેન્ટ્રલ મોટર વ્હીકલ રૂલ્સ (CMVR) ના નિયમ ૫૧-A તથા ગુજરાત મોટર વાહન વિભાગના નિયમો અનુસાર, આ તમામ વાહનોને કેન્દ્ર અને ગુજરાત સરકાર માન્ય રજીસ્ટર્ડ વ્હીકલ સ્ક્રેપિંગ ફેસિલિટી (RVSF) "${nocRvsfPartnerName}" (અધિકૃત લાઇસન્સ ID: ${nocRvsfLicenseId}) મારફતે ઉપાડી લઈ સ્ક્રેપ કરવા તથા ચેસીસનું નિયમોનુસાર વિનિષ્ટીકરણ કરી ડિપોઝિટ સર્ટિફિકેટ (Certificate of Deposit - CoD) ઇશ્યુ કરવાની સોસાયટી સંપૂર્ણ અને સત્તાવાર મંજૂરી આપે છે.`
                                  : nocLetterLang === 'HI'
                                  ? `आगे यह संकल्प पारित किया जाता है कि केंद्रीय सड़क परिवहन मंत्रालय (MoRTH) की राष्ट्रीय वाहन स्क्रैपेज नीति, केंद्रीय मोटर वाहन नियम (CMVR) के नियम 51A एवं गुजरात मोटर वाहन नियमों के तहत इन समस्त लावारिस वाहनों को सरकार द्वारा मान्यता प्राप्त स्क्रैपिंग केंद्र (RVSF) "${nocRvsfPartnerName}" (लाइसेंस ID: ${nocRvsfLicenseId}) के माध्यम से उठाकर स्क्रैप कराने, चेसिस नष्टीकरण उपरांत आधिकारिक Certificate of Deposit (CoD) जारी कराने हेतु सोसायटी पूर्ण विधिक स्वीकृति प्रदान करती है।`
                                  : `FURTHER RESOLVED THAT under the Central Motor Vehicles Rules (CMVR) Rule 51A and the National Vehicle Scrappage Policy of the Ministry of Road Transport and Highways (MoRTH), the Society formally approves and authorizes Government-Approved Registered Vehicle Scrapping Facility (RVSF) partner "${nocRvsfPartnerName}" (Licence/Authorization ID: ${nocRvsfLicenseId}) to lift, transport, depollute, and physically dismantle the listed vehicles and issue official Certificate of Deposit (CoD) and Certificate of Scrapping (CoS).`
                                }
                              </p>

                              <p>
                                {nocLetterLang === 'GU'
                                  ? `વધુમાં ઠરાવવામાં આવે છે કે આ અંગે સ્થાનિક પોલીસ સ્ટેશન (${nocPoliceStationHead}, ${nocLocalPoliceStation}) ખાતે સીસીટીએનએસ (CCTNS) ચોરી રેકોર્ડ ચકાસણી અર્થે અગાઉથી જાણ કરવા, આર.ટી.ઓ. કચેરી (${nocRtoOffice}) સમક્ષ રજીસ્ટ્રેશન કેન્સલેશન માટે કાનૂની અરજી દાખલ કરવા તથા સ્ક્રેપિંગની તમામ કાગળ કાર્યવાહી કરવા માટે સોસાયટીના પ્રમુખશ્રી ${nocChairmanName} (સંપર્ક: ${nocChairmanMobile}, ઓળખ: ${nocChairmanIdProof}) તથા મંત્રીશ્રી ${nocSecretaryName} (સંપર્ક: ${nocSecretaryMobile}, ઓળખ: ${nocSecretaryIdProof}) ને સંયુક્ત અને સ્વતંત્ર રીતે સંપૂર્ણ કાનૂની સત્તા આપવામાં આવે છે.`
                                  : nocLetterLang === 'HI'
                                  ? `आगे यह संकल्प पारित किया जाता है कि इस संबंध में स्थानीय पुलिस थाना (${nocPoliceStationHead}, ${nocLocalPoliceStation}) को CCTNS चोरी सत्यापन हेतु पूर्व सूचना प्रेषित करने, RTO कार्यालय (${nocRtoOffice}) के समक्ष पंजीकरण निरस्तीकरण याचिका दायर करने तथा स्क्रैपिंग संबंधित समस्त विधिक दस्तावेजों के निष्पादन हेतु सोसायटी अध्यक्ष ${nocChairmanName} (मो: ${nocChairmanMobile}, पहचान: ${nocChairmanIdProof}) एवं सचिव ${nocSecretaryName} (मो: ${nocSecretaryMobile}, पहचान: ${nocSecretaryIdProof}) को संयुक्त एवं पृथक रूप से पूर्ण विधिक अधिकार प्रदान किए जाते हैं।`
                                  : `FURTHER RESOLVED THAT Society Chairman ${nocChairmanName} (Mobile: ${nocChairmanMobile}, ID: ${nocChairmanIdProof}) and Secretary ${nocSecretaryName} (Mobile: ${nocSecretaryMobile}, ID: ${nocSecretaryIdProof}) be and are hereby jointly and severally authorized to execute all petitions, sign affidavits, serve Advance Police Intimation to ${nocPoliceStationHead}, ${nocLocalPoliceStation}, submit deregistration application to ${nocRtoOffice}, and oversee RVSF vehicle handover.`
                                }
                              </p>
                            </div>

                            {/* INDEMNITY CLAUSE INSIDE RESOLUTION */}
                            {renderIndemnityClause()}

                            {/* COMMITTEE MEMBERS ATTENDANCE REGISTER */}
                            <div className="pt-2 border-t border-slate-200 font-sans">
                              <strong className="block font-bold text-xs mb-1.5 text-slate-950">
                                {nocLetterLang === 'GU'
                                  ? `કારોબારી સમિતિના ઉપસ્થિત સભ્યોની સહીઓ (${committeeMembers.length} સભ્યો):`
                                  : nocLetterLang === 'HI'
                                  ? `प्रबंध समिति के उपस्थित सदस्यों के हस्ताक्षर (${committeeMembers.length} सदस्य):`
                                  : `Managing Committee Members Present & Signatures (${committeeMembers.length} Members):`}
                              </strong>
                              <table className="w-full text-[10px] text-left border-collapse border border-slate-300">
                                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                                  <tr>
                                    <th className="p-1 border-r border-slate-300">#</th>
                                    <th className="p-1 border-r border-slate-300">{nocLetterLang === 'GU' ? 'સભ્યનું નામ' : nocLetterLang === 'HI' ? 'सदस्य का नाम' : 'Member Name'}</th>
                                    <th className="p-1 border-r border-slate-300">{nocLetterLang === 'GU' ? 'હોદ્દો' : nocLetterLang === 'HI' ? 'पद' : 'Designation'}</th>
                                    <th className="p-1 border-r border-slate-300">{nocLetterLang === 'GU' ? 'ફ્લેટ / વિંગ' : nocLetterLang === 'HI' ? 'फ्लैट / विंग' : 'Flat / Wing'}</th>
                                    <th className="p-1">{nocLetterLang === 'GU' ? 'સહી' : nocLetterLang === 'HI' ? 'हस्ताक्षर' : 'Signature'}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                  {committeeMembers.map((m, idx) => (
                                    <tr key={m.id}>
                                      <td className="p-1 border-r border-slate-200 font-bold">{idx + 1}</td>
                                      <td className="p-1 border-r border-slate-200 font-bold">{m.name}</td>
                                      <td className="p-1 border-r border-slate-200">{m.designation}</td>
                                      <td className="p-1 border-r border-slate-200 font-mono">{m.flatNo}</td>
                                      <td className="p-1 font-mono text-[9px] text-slate-600 font-bold">( Signed / સહી કરેલ )</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {!isAll && renderSignatories()}
                          </div>
                        )}

                        {/* ========================================================= */}
                        {/* SECTION 3: ADVANCE POLICE STATION INTIMATION NOTICE       */}
                        {/* ========================================================= */}
                        {showSec3 && (
                          <div className="border border-slate-300 rounded-xl p-4 bg-white space-y-3 font-sans">
                            <div className="border-b border-slate-300 pb-2">
                              <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                {nocLetterLang === 'GU' ? 'વિભાગ ૩' : nocLetterLang === 'HI' ? 'अनुभाग 3' : 'SECTION 3'}
                              </span>
                              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-950 mt-1">
                                {nocLetterLang === 'GU'
                                  ? 'સ્થાનિક પોલીસ સ્ટેશનને અગાઉથી કાનૂની ઇન્ટિમેશન નોટિસ (ADVANCE POLICE STATION INTIMATION NOTICE)'
                                  : nocLetterLang === 'HI'
                                  ? 'स्थानीय पुलिस थाना को अग्रिम विधिक सूचना (ADVANCE POLICE STATION INTIMATION NOTICE)'
                                  : 'ADVANCE POLICE STATION INTIMATION NOTICE'}
                              </h3>
                              <p className="text-[10px] text-slate-600 italic">
                                Mandatory Pre-Scrapping Criminal &amp; Theft Cross-Verification Request under CCTNS / State Stolen Vehicle Register.
                              </p>
                            </div>

                            <div className="flex justify-between text-[11px] font-bold text-slate-800">
                              <span>
                                {nocLetterLang === 'GU' ? 'તારીખ:' : nocLetterLang === 'HI' ? 'दिनांक:' : 'Date:'}{' '}
                                {new Date().toLocaleDateString('en-IN')}
                              </span>
                              <span>
                                {nocLetterLang === 'GU' ? 'સ્થળ: સુરત, ગુજરાત' : nocLetterLang === 'HI' ? 'स्थान: सूरत, गुजरात' : 'Place: Surat, Gujarat'}
                              </span>
                            </div>

                            <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <strong className="block font-bold text-slate-950">
                                {nocLetterLang === 'GU' ? 'પ્રતિ,' : nocLetterLang === 'HI' ? 'सेवा में,' : 'To,'}
                              </strong>
                              <div className="mt-0.5 text-slate-950 leading-tight">
                                <strong>
                                  {nocPoliceStationHead === 'Police Inspector (PI)'
                                    ? (nocLetterLang === 'GU' ? 'પોલીસ ઇન્સ્પેક્ટર શ્રી (PI),' : nocLetterLang === 'HI' ? 'पुलिस निरीक्षक महोदय (PI),' : 'The Police Inspector (PI),')
                                    : (nocLetterLang === 'GU' ? 'સ્ટેશન હાઉસ ઓફિસર શ્રી (SHO),' : nocLetterLang === 'HI' ? 'स्टेशन हाउस ऑफिसर महोदय (SHO),' : 'The Station House Officer (SHO),')
                                  }
                                </strong>
                                <br />
                                <span>{nocLocalPoliceStation}</span>
                                <br />
                                <span className="text-[10px] text-slate-600 font-medium">{nocPoliceStationAddress}</span>
                              </div>
                            </div>

                            <p className="font-bold underline text-slate-950 text-xs">
                              {nocLetterLang === 'GU'
                                ? 'વિષય: સોસાયટી પરિસરમાં લાંબા સમયથી બિનવારસી, માલિક વગર પડેલા વાહનોના નિકાલ અગાઉ પોલીસ ઇન્ટિમેશન અને CCTNS / નેશનલ ચોરી રેકોર્ડ ચકાસણી બાબત.'
                                : nocLetterLang === 'HI'
                                ? 'विषय: सोसायटी परिसर में लंबे समय से लावारिस एवं अप्राप्य वाहनों के स्क्रैपिंग पूर्व पुलिस सूचना एवं CCTNS / राष्ट्रीय चोरी रिकॉर्ड सत्यापन बाबत।'
                                : 'Subject: Advance police intimation regarding long-term abandoned, untraceable vehicles within society premises and formal request to verify CCTNS / National Stolen Vehicle Register.'}
                            </p>

                            <div className="text-slate-900 font-serif space-y-2 text-xs leading-relaxed">
                              <p className="font-semibold font-sans">
                                {nocLetterLang === 'GU' ? 'આદરણીય સાહેબ,' : nocLetterLang === 'HI' ? 'आदरणीय महोदय,' : 'Respected Sir,'}
                              </p>

                              {nocLetterLang === 'GU' ? (
                                <>
                                  <p>
                                    અમે, <strong>{nocSocietyName}</strong> કો-ઓપરેટિવ હાઉસિંગ સોસાયટી લિમિટેડ (નોંધણી નંબર: <strong>{nocSocietyRegNo}</strong>, સરનામું: <strong>{nocSocietyAddress}</strong>) ની મેનેજમેન્ટ કમિટીના અધિકૃત હોદ્દેદારો આપશ્રીને નમ્રપણે જાણ કરીએ છીએ કે અમારી સોસાયટીના પરિસરમાં નીચે પરિશિષ્ટ-A (Schedule-A) માં દર્શાવેલ <strong>{abandonedVehiclesList.length}</strong> વાહનો છેલ્લા ૨ થી ૩ વર્ષથી વધુ સમયથી કોઈ પણ માલિક કે વારસદાર વગર બિનવારસી અને ભંગાર હાલતમાં પડેલા છે. સોસાયટી દ્વારા વારંવાર આંતરિક નોટિસો આપવા છતાં આ વાહનોના કોઈ માલિકો મળી આવતા નથી (Untraceable છે) અને આ વાહનોની આરસી બુક પણ ઉપલબ્ધ નથી.
                                  </p>
                                  <p>
                                    સોસાયટીની કારોબારી સમિતિની બેઠક તારીખ: <strong>{nocResolutionDate}</strong> ના રોજ સર્વાનુમતે પસાર થયેલ વિધિવત ઠરાવ (ઠરાવ નંબર: <strong>{nocResolutionNo}</strong>) અનુસાર, આપશ્રીને નમ્ર વિનંતી કરવામાં આવે છે કે પરિશિષ્ટ-A માં જણાવેલ વાહનોના બોડી ફ્રેમ પરથી લીધેલા ચેસીસ નંબર અને એન્જિન બ્લોક નંબર આપના પોલીસ સ્ટેશન ચોપડે કે CCTNS (Crime and Criminal Tracking Network &amp; Systems) ચોરીના રેકોર્ડમાં નોંધાયેલ છે કે કેમ તેની ચકાસણી કરી ખાતરી કરી આપશો.
                                  </p>
                                  <p className="font-sans font-bold bg-blue-50 p-2.5 rounded border border-blue-200 text-blue-950">
                                    ૧૫ દિવસની કાનૂની મુદત: જો આ પત્ર મળ્યા તારીખથી ૧૫ (પંદર) દિવસની અંદર આપની કચેરી તરફથી કોઈ વાંધો કે ચોરીનો અહેવાલ નોંધવામાં નહીં આવે, તો સોસાયટી કેન્દ્ર સરકારના MoRTH અને ગુજરાત મોટર વાહન વિભાગના End-of-Life Vehicles (ELV) સ્ક્રેપેજ નિયમો અનુસાર સરકાર માન્ય રજીસ્ટર્ડ વ્હીકલ સ્ક્રેપિંગ ફેસિલિટી (RVSF) <strong>"{nocRvsfPartnerName}"</strong> (લાઇસન્સ ID: {nocRvsfLicenseId}) મારફતે RTO કચેરી ({nocRtoOffice}) ખાતે સ્ક્રેપિંગ ક્લિયરન્સ અને રજીસ્ટ્રેશન કેન્સલેશન માટે આગળની કાયદેસર કાર્યવાહી કરશે.
                                  </p>
                                  <p className="italic text-[11px] font-sans">
                                    કાનૂની જવાબદારી સ્પષ્ટતા: આ વાહનોના મૂળ માલિક દ્વારા લાંબા સમયથી કરેલ બિનજવાબદાર ત્યાગ (Desertion) ના કારણે ભવિષ્યના કોઈપણ માલિકી કે આર્થિક દાવાની સંપૂર્ણ કાનૂની જવાબદારી વાહન છોડી જનારની રહેશે. સોસાયટી કે તેના હોદ્દેદારો કોઈપણ વ્યક્તિગત કે ફોજદારી જવાબદારીમાંથી કાનૂની રીતે સંપૂર્ણ મુક્ત રહેશે.
                                  </p>
                                </>
                              ) : nocLetterLang === 'HI' ? (
                                <>
                                  <p>
                                    हम, <strong>{nocSocietyName}</strong> को-ऑपरेटिव हाउसिंग सोसायटी लिमिटेड (पंजीकरण संख्या: <strong>{nocSocietyRegNo}</strong>, पता: <strong>{nocSocietyAddress}</strong>) की प्रबंध समिति के अधिकृत पदाधिकारी, आपके संज्ञान में लाते हैं कि हमारी सोसायटी परिसर में नीचे अनुसूची-A (Schedule-A) में वर्णित <strong>{abandonedVehiclesList.length}</strong> वाहन पिछले 2 से 3 वर्षों से बिना किसी सक्रिय मालिक के लावारिस एवं निष्प्रयोज्य स्थिति में खड़े हैं। आंतरिक सूचनाओं एवं प्रयासों के बावजूद इनके मालिक पूर्णतः अप्राप्य हैं और आरसी बुक भी उपलब्ध नहीं है।
                                  </p>
                                  <p>
                                    सोसायटी प्रबंध समिति की बैठक दिनांक: <strong>{nocResolutionDate}</strong> में पारित आधिकारिक प्रस्ताव (प्रस्ताव संख्या: <strong>{nocResolutionNo}</strong>) के अनुसार, आपसे सविनय अनुरोध है कि संलग्न चेसिस एवं इंजन नंबरों का आपके थाना एवं CCTNS (Crime and Criminal Tracking Network &amp; Systems) के राष्ट्रीय चोरी अथवा आपराधिक डेटाबेस से सत्यापन करने की कृपा करें।
                                  </p>
                                  <p className="font-sans font-bold bg-blue-50 p-2.5 rounded border border-blue-200 text-blue-950">
                                    15-दिवसीय विधिक सूचना अवधि: यदि इस सूचना प्राप्ति के 15 (पंद्रह) दिनों के भीतर आपके कार्यालय से कोई आपत्ति या चोरी की रिपोर्ट प्राप्त नहीं होती है, तो सोसायटी केंद्र सरकार (MoRTH) एवं गुजरात मोटर वाहन नियमों के अंतर्गत सरकार द्वारा मान्यता प्राप्त स्क्रैपिंग संस्था (RVSF) <strong>"{nocRvsfPartnerName}"</strong> (लाइसेंस ID: {nocRvsfLicenseId}) के माध्यम से RTO कार्यालय ({nocRtoOffice}) से पंजीकरण निरस्तीकरण एवं स्क्रैपिंग अनापत्ति हेतु विधिवत कार्रवाई प्रारंभ करेगी।
                                  </p>
                                  <p className="italic text-[11px] font-sans">
                                    विधिक दायित्व स्पष्टता: डिफॉल्टर वाहन मालिक द्वारा स्वेच्छा से किए गए परित्याग के कारण भविष्य के किसी भी वित्तीय अथवा स्वामित्व विवाद का पूर्ण दायित्व वाहन मालिक का होगा तथा सोसायटी व उसके पदाधिकारी समस्त दायित्वों से पूर्णतः मुक्त रहेंगे।
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p>
                                    We, the Managing Committee of <strong>{nocSocietyName}</strong> Co-operative Housing Society Ltd. (Registration No: <strong>{nocSocietyRegNo}</strong>, Address: <strong>{nocSocietyAddress}</strong>), hereby bring to your kind notice the inventory of <strong>{abandonedVehiclesList.length}</strong> vehicles listed in Schedule-A below. These vehicles have remained abandoned inside our society premises for prolonged periods exceeding 2 to 3 years without active owners or claimants. Despite multiple internal notices, public inquiries, and verifications, the registered owners remain completely untraceable, and their Registration Certificates (RC Books) are unavailable.
                                  </p>
                                  <p>
                                    In accordance with the formal resolution passed by our Managing Committee in its meeting dated <strong>{nocResolutionDate}</strong> (Resolution No: <strong>{nocResolutionNo}</strong>), we respectfully request your office to verify the attached frame chassis numbers and engine numbers against active police station records and the CCTNS (Crime and Criminal Tracking Network &amp; Systems) / National Stolen Vehicle Database.
                                  </p>
                                  <p className="font-sans font-bold bg-blue-50 p-2.5 rounded border border-blue-200 text-blue-950">
                                    Statutory 15-Day Objection Window: If no objection or active theft/criminal record is communicated to our society within 15 (fifteen) days from the receipt of this intimation, the Society shall proceed with scrapping clearance and vehicle registration cancellation through Government-Approved Registered Vehicle Scrapping Facility (RVSF) partner <strong>{nocRvsfPartnerName}</strong> (Licence: {nocRvsfLicenseId}) under MoRTH Scrappage Policy and CMVR Rule 51A.
                                  </p>
                                  <p className="italic text-[11px] font-sans">
                                    Explicit Legal Liability Notice: Due to proactive desertion by the untraceable registered owner, any future civil, financial, or ownership disputes shall be the sole culpability of the deserting owner. The Society and its office bearers bear zero personal or criminal liability.
                                  </p>
                                </>
                              )}
                            </div>

                            {/* SCHEDULE-A TABLE WHEN POLICE NOTICE IS SHOWN */}
                            {!isAll && renderScheduleTable()}
                            {!isAll && renderSignatories()}
                          </div>
                        )}

                        {/* ========================================================= */}
                        {/* SECTION 4: RTO MASTER DEREGISTRATION & SCRAPPING PETITION */}
                        {/* ========================================================= */}
                        {showSec4 && (
                          <div className="border border-slate-300 rounded-xl p-4 bg-white space-y-3 font-sans">
                            <div className="border-b border-slate-300 pb-2">
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                {nocLetterLang === 'GU' ? 'વિભાગ ૪' : nocLetterLang === 'HI' ? 'अनुभाग 4' : 'SECTION 4'}
                              </span>
                              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-950 mt-1">
                                {nocLetterLang === 'GU'
                                  ? 'આર.ટી.ઓ. કચેરી સમક્ષ વાહનોના રજીસ્ટ્રેશન કેન્સલેશન અને સ્ક્રેપિંગ માટેની મુખ્ય કાનૂની અરજી (RTO MASTER DEREGISTRATION PETITION)'
                                  : nocLetterLang === 'HI'
                                  ? 'क्षेत्रीय परिवहन अधिकारी (RTO) के समक्ष पंजीकरण निरस्तीकरण एवं स्क्रैपिंग हेतु मुख्य विधिक याचिका (RTO MASTER DEREGISTRATION PETITION)'
                                  : 'RTO MASTER DEREGISTRATION & SCRAPPING PETITION UNDER CMVR RULE 51A'}
                              </h3>
                              <p className="text-[10px] text-slate-600 italic">
                                Statutory Petition under Rule 51A Central Motor Vehicles Rules (CMVR) 1989 &amp; National Vehicle Scrappage Policy (MoRTH).
                              </p>
                            </div>

                            <div className="flex justify-between text-[11px] font-bold text-slate-800">
                              <span>
                                {nocLetterLang === 'GU' ? 'તારીખ:' : nocLetterLang === 'HI' ? 'दिनांक:' : 'Date:'}{' '}
                                {new Date().toLocaleDateString('en-IN')}
                              </span>
                              <span>
                                {nocLetterLang === 'GU' ? 'સ્થળ: સુરત, ગુજરાત' : nocLetterLang === 'HI' ? 'स्थान: सूरत, गुजरात' : 'Place: Surat, Gujarat'}
                              </span>
                            </div>

                            <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <strong className="block font-bold text-slate-950">
                                {nocLetterLang === 'GU' ? 'પ્રતિ,' : nocLetterLang === 'HI' ? 'सेवा में,' : 'To,'}
                              </strong>
                              <div className="mt-0.5 text-slate-950 leading-tight">
                                <strong>
                                  {nocLetterLang === 'GU'
                                    ? 'રિજનલ ટ્રાન્સપોર્ટ ઓફિસર શ્રી (RTO),'
                                    : nocLetterLang === 'HI'
                                    ? 'क्षेत्रीय परिवहन अधिकारी महोदय (RTO),'
                                    : 'The Regional Transport Officer (RTO),'}
                                </strong>
                                <br />
                                <span>{nocRtoOffice}</span>
                                <br />
                                <span className="text-[10px] text-slate-600 font-medium">{nocRtoPostalAddress}</span>
                              </div>
                            </div>

                            <p className="font-bold underline text-slate-950 text-xs">
                              {nocLetterLang === 'GU'
                                ? 'વિષય: કેન્દ્રીય મોટર વાહન નિયમો (CMVR) ના નિયમ ૫૧-A અને રાષ્ટ્રીય સ્ક્રેપેજ નીતિ (MoRTH) હેઠળ સોસાયટી પરિસરમાં પડેલા બિનવારસી અને RC બુક વગરના ભંગાર વાહનોના રજીસ્ટ્રેશન કેન્સલેશન અને સ્ક્રેપિંગ મંજૂરી બાબત.'
                                : nocLetterLang === 'HI'
                                ? 'विषय: केंद्रीय मोटर वाहन नियम (CMVR) के नियम 51A एवं राष्ट्रीय स्क्रैपेज नीति (MoRTH) के अंतर्गत सोसायटी परिसर में लावारिस व बिना आरसी बुक निष्प्रयोज्य वाहनों के पंजीकरण निरस्तीकरण एवं स्क्रैपिंग अनापत्ति बाबत।'
                                : 'Subject: Application under CMVR Rule 51A and National Vehicle Scrappage Policy (MoRTH) for deregistration and VAHAN portal cancellation of untraceable abandoned End-of-Life Vehicles (ELVs) lacking Registration Certificates (RC Books).'}
                            </p>

                            <div className="text-slate-900 font-serif space-y-2 text-xs leading-relaxed">
                              <p className="font-semibold font-sans">
                                {nocLetterLang === 'GU' ? 'આદરણીય સાહેબ/મેડમ,' : nocLetterLang === 'HI' ? 'आदरणीय महोदय/महोदया,' : 'Respected Sir/Madam,'}
                              </p>

                              {nocLetterLang === 'GU' ? (
                                <>
                                  <p>
                                    અમે, <strong>{nocSocietyName}</strong> કો-ઓપરેટિવ હાઉસિંગ સોસાયટી લિમિટેડ (રજીસ્ટ્રેશન નંબર: <strong>{nocSocietyRegNo}</strong>, સરનામું: <strong>{nocSocietyAddress}</strong>) ના મેનેજમેન્ટ કમિટીના હોદ્દેદારો, આપશ્રીને સવિનય જણાવવા માંગીએ છીએ કે અમારી સોસાયટીના પરિસરમાં છેલ્લા ૨ થી ૩ વર્ષથી વધુ સમયથી <strong>{abandonedVehiclesList.length}</strong> વાહનો સંપૂર્ણ બિનવારસી, ધૂળભરેલી અને જર્જરિત હાલતમાં પડેલા છે.
                                  </p>
                                  <p>
                                    અમારા તમામ પ્રયત્નો અને આંતરિક જાહેર નોટિસો છતાં આ વાહનોના કોઈ માલિકો મળી આવતા નથી (Untraceable છે) અને આ વાહનોની આરસી બુક પણ ઉપલબ્ધ નથી. આ વાહનો હાલમાં સંપૂર્ણ ભંગાર/સ્ક્રેપ (End-of-Life) હાલતમાં હોવાથી સોસાયટીમાં સલામતી, સ્વચ્છતા અને ફાયર સેફ્ટી માટે ગંભીર જોખમ ઊભું કરે છે. આ સંદર્ભે સ્થાનિક પોલીસ સ્ટેશન (<strong>{nocPoliceStationHead}, {nocLocalPoliceStation}</strong>) ને અગાઉથી કાયદેસરની ઇન્ટિમેશન નોટિસ પાઠવી ચોરી/ગુનાહિત રેકોર્ડ ચકાસણીની પ્રક્રિયા પૂર્ણ કરવામાં આવેલ છે.
                                  </p>
                                  <p>
                                    કેન્દ્ર સરકારના MoRTH અને ગુજરાત મોટર વાહન વિભાગના ભંગાર વાહનો (End-of-Life Vehicles) ના નિયમો તેમજ CMVR Rule 51A ને આધીન રહીને સોસાયટીની કારોબારી સમિતિની બેઠક તારીખ: <strong>{nocResolutionDate}</strong> (ઠરાવ નંબર: <strong>{nocResolutionNo}</strong>) ના રોજ વિધિવત ઠરાવ પસાર કરી આ વાહનોનો નિકાલ સરકાર માન્ય રજીસ્ટર્ડ સ્ક્રેપિંગ ફેસિલિટી (RVSF) <strong>"{nocRvsfPartnerName}"</strong> (લાઇસન્સ ID: {nocRvsfLicenseId}) મારફતે કરવાનો સર્વાનુમતે નિર્ણય લીધેલ છે.
                                  </p>
                                  <p>
                                    આ વાહનોની વિગતવાર ટેકનિકલ યાદી નીચે પરિશિષ્ટ-A (Schedule-A) માં સામેલ છે. આપશ્રીને નમ્ર વિનંતી છે કે આ વાહનોના ફ્રેમ ચેસીસ અને એન્જિન નંબર આપના વાહન (VAHAN) સરકારી ડેટાબેઝ સાથે ચકાસી, વાહનોના રજીસ્ટ્રેશન કેન્સલેશન (Deregistration) અને સ્ક્રેપિંગ માટેની કાયદેસર મંજૂરી / NOC ઇશ્યુ કરવા કૃપા કરશો જેથી સરકાર માન્ય અધિકૃત સ્ક્રાપર આ વાહનોને સોસાયટી પરિસરમાંથી ઉપાડી લઈ કાયદેસર વિનિષ્ટીકરણ કરી શકે.
                                  </p>
                                </>
                              ) : nocLetterLang === 'HI' ? (
                                <>
                                  <p>
                                    हम, <strong>{nocSocietyName}</strong> को-ऑपरेटिव हाउसिंग सोसायटी लिमिटेड (पंजीकरण संख्या: <strong>{nocSocietyRegNo}</strong>, पता: <strong>{nocSocietyAddress}</strong>) की प्रबंध समिति, आपके संज्ञान में लाते हैं कि हमारी सोसायटी परिसर में पिछले कई वर्षों (2 से 3 वर्ष से अधिक) से <strong>{abandonedVehiclesList.length}</strong> वाहन लावारिस हालत में खड़े हैं।
                                  </p>
                                  <p>
                                    समस्त आंतरिक सूचनाओं एवं प्रयासों के उपरांत भी इन वाहनों के मालिक पूर्णतः अप्राप्य हैं और आरसी बुक भी उपलब्ध नहीं है। ये वाहन वर्तमान में पूर्ण रूप से कबाड़/स्क्रैप स्थिति में हैं तथा परिसर में सुरक्षा, स्वच्छता एवं पार्किंग हेतु गंभीर खतरा बने हुए हैं। इस संदर्भ में स्थानीय पुलिस थाने (<strong>{nocPoliceStationHead}, {nocLocalPoliceStation}</strong>) को भी पूर्व सूचना प्रेषित कर आपराधिक व चोरी सत्यापन की प्रक्रिया पूर्ण की जा चुकी है।
                                  </p>
                                  <p>
                                    केंद्र सरकार (MoRTH) एवं गुजरात मोटर वाहन विभाग के निष्प्रयोज्य वाहन (ELV) नियमों तथा CMVR Rule 51A के तहत सोसायटी प्रबंध समिति की बैठक दिनांक: <strong>{nocResolutionDate}</strong> (प्रस्ताव सं: <strong>{nocResolutionNo}</strong>) में पारित आधिकारिक प्रस्ताव अनुसार, इन लावारिस वाहनों का निस्तारण सरकार द्वारा मान्यता प्राप्त स्क्रैपिंग संस्था (RVSF) <strong>"{nocRvsfPartnerName}"</strong> (लाइसेंस ID: {nocRvsfLicenseId}) के माध्यम से कराने का निर्णय लिया गया है।
                                  </p>
                                  <p>
                                    वाहनों का विस्तृत तकनीकी विवरण नीचे अनुसूची-A (Schedule-A) में संलग्न है। आपसे सविनय निवेदन है कि इन चेसिस एवं इंजन नंबरों का अपने VAHAN पोर्टल डेटाबेस से सत्यापन कर, पंजीकरण निरस्तीकरण (Deregistration) हेतु स्वीकृति/NOC प्रदान करने की कृपा करें ताकि अधिकृत स्क्रैपर इन वाहनों को उठाकर विधिवत निस्तारित कर सके।
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p>
                                    We, the Managing Committee of <strong>{nocSocietyName}</strong> Co-operative Housing Society Ltd. (Registered Vide Reg. No. <strong>{nocSocietyRegNo}</strong>, Registered Address: <strong>{nocSocietyAddress}</strong>), hereby bring to your kind notice that <strong>{abandonedVehiclesList.length}</strong> vehicles have remained abandoned within our society premises for prolonged periods exceeding 2–3 years.
                                  </p>
                                  <p>
                                    Despite our best efforts, including repeated internal notices and public calls, the owners of these vehicles remain completely untraceable, and their Registration Certificates (RC Books) are unavailable. These vehicles are in complete "Scrap/End-of-Life" non-functional condition, posing grave safety, hygiene, fire, and parking hazards. Advance statutory intimation has already been served to the local police station (<strong>{nocPoliceStationHead}, {nocLocalPoliceStation}</strong>) for theft verification.
                                  </p>
                                  <p>
                                    Under Rule 51A of the Central Motor Vehicles Rules (CMVR), 1989 and the prevailing National Vehicle Scrappage Policy of MoRTH, the Society has passed a formal resolution in its Managing Committee Meeting dated <strong>{nocResolutionDate}</strong> (Resolution No: <strong>{nocResolutionNo}</strong>) to dispose of these untraceable scrap vehicles through Government-Authorized Registered Vehicle Scrapping Facility (RVSF) partner <strong>{nocRvsfPartnerName}</strong> (Licence/Authorization ID: {nocRvsfLicenseId}).
                                  </p>
                                  <p>
                                    The detailed technical inventory of the vehicles is attached herewith in Schedule-A. We respectfully petition the RTO administration to verify the attached frame Chassis/Engine numbers against the national VAHAN register, cancel the vehicle registration records under CMVR Rule 51A, and grant approval/NOC so that our authorized government-approved scrapper can safely lift and scrap these vehicles.
                                  </p>
                                </>
                              )}
                            </div>

                            {/* MANDATORY STATUTORY INDEMNITY CLAUSE */}
                            {renderIndemnityClause()}

                            {/* SCHEDULE-A TABLE WHEN RTO PETITION IS SHOWN INDIVIDUALLY */}
                            {!isAll && renderScheduleTable()}
                            {!isAll && renderSignatories()}
                          </div>
                        )}

                        {/* ========================================================= */}
                        {/* SECTION 5: SCHEDULE-A TECHNICAL VEHICLE INVENTORY ANNEXURE*/}
                        {/* ========================================================= */}
                        {showSec5 && (
                          <div className="border border-slate-300 rounded-xl p-4 bg-white space-y-3 font-sans">
                            <div className="border-b border-slate-300 pb-2 flex justify-between items-center">
                              <div>
                                <span className="text-[10px] font-extrabold text-purple-800 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                  {nocLetterLang === 'GU' ? 'વિભાગ ૫' : nocLetterLang === 'HI' ? 'अनुभाग 5' : 'SECTION 5'}
                                </span>
                                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-950 mt-1">
                                  {nocLetterLang === 'GU'
                                    ? 'પરિશિષ્ટ-A: બિનવારસી વાહનોનું તકનીકી પત્રક (SCHEDULE-A TECHNICAL VEHICLE INVENTORY ANNEXURE)'
                                    : nocLetterLang === 'HI'
                                    ? 'अनुसूची-A: लावारिस वाहनों का तकनीकी विवरण पत्रक (SCHEDULE-A TECHNICAL VEHICLE INVENTORY ANNEXURE)'
                                    : 'SCHEDULE-A: TECHNICAL VEHICLE INVENTORY ANNEXURE'}
                                </h3>
                              </div>
                              <span className="text-[10px] bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full border border-slate-300 font-mono font-bold">
                                Form Annexure
                              </span>
                            </div>

                            {renderScheduleTable()}

                            <div className="p-2.5 bg-slate-50 border rounded-lg text-[10px] text-slate-700 italic">
                              {nocLetterLang === 'GU'
                                ? 'પ્રમાણપત્ર: અમે આથી પ્રમાણિત કરીએ છીએ કે ઉપર દર્શાવેલ તમામ વાહનોના ચેસીસ અને એન્જિન નંબર વાહનના બોડી ફ્રેમ અને એન્જિન બ્લોક પરથી પેન્સિલ પ્રિન્ટ ઘસીને રૂબરૂ ચકાસવામાં આવ્યા છે અને સોસાયટીના દફતરે સુરક્ષિત રાખવામાં આવ્યા છે.'
                                : nocLetterLang === 'HI'
                                ? 'प्रमाणन: हम एतद्द्वारा प्रमाणित करते हैं कि उपर्युक्त समस्त वाहनों के चेसिस एवं इंजन नंबर वाहन की बॉडी फ्रेम व इंजन ब्लॉक से पेंसिल रबिंग इंप्रेशन लेकर प्रत्यक्ष रूप से सत्यापित किए गए हैं एवं सोसायटी रिकॉर्ड में संरक्षित हैं।'
                                : 'Certification: We hereby certify that the Chassis and Engine numbers listed above have been physically extracted and verified directly from the vehicle body frame and engine blocks via pencil-rub impressions and archived in physical society records.'}
                            </div>

                            {/* SIGNATORIES BLOCK AT THE BOTTOM */}
                            {renderSignatories()}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <button
                  onClick={handleSyncNocToVendorPanel}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Send Resolution to Vendor Dashboard for Pickup
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )}

      {/* VIEW 3: DIGI-ELV MARKETPLACE */}
      {activeTab === 'digielv' && (
        <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* HERO BANNER WITH GOVERNMENT PORTAL SYNC & DIGIELV MARKETPLACE INTEGRATION */}
          <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Official Partner: DigiELV Marketplace (digielv.com) Active
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Govt Gateway: vscrap.parivahan.gov.in · Last Synced: {lastGovtSyncTime}
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setIsSyncingWithGovt(true);
                    setTimeout(() => {
                      setIsSyncingWithGovt(false);
                      setLastGovtSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
                      alert('✅ DigiELV database successfully synchronized with MoRTH Parivahan Sewa national gateway & DigiELV.com!');
                    }, 800);
                  }}
                  disabled={isSyncingWithGovt}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncingWithGovt ? 'animate-spin' : ''}`} />
                  <span>{isSyncingWithGovt ? 'Syncing...' : 'Sync Gateway'}</span>
                </button>

                <a
                  href="https://digielv.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Trade on DigiELV Marketplace (digielv.com)</span>
                </a>

                <a
                  href="https://vscrap.parivahan.gov.in/vehiclescrapping/vscrap/codTrade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>MoRTH V-Scrap</span>
                </a>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {t.digiElvHeading}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl leading-relaxed">
                Integrated with <strong>DigiELV Marketplace (digielv.com)</strong> &amp; Central Motor Vehicles Rules (CMVR). Certificate of Deposit (CoD) is issued upon legal vehicle scrappage by SHREE AMBICA AUTOMOTIVE PVT LTD (Govt Authorized RVSF). CoD holders can trade or sell their certificates to vehicle buyers across Gujarat for up to <strong>25% road tax waiver</strong> on commercial vehicles and <strong>15% on passenger cars</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Platform Active CoDs</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">{codList.filter(c => c.status === 'Listed_For_Sale').length} Listed for Trading</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Active on DigiELV &amp; Surat Portal</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Max Road Tax Concession</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">Up to 25% RTO Tax Waiver</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Recognized across all Gujarat RTOs</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Privacy Protection</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">Partially Masked</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Owner mobile &amp; chassis secured against fraud</p>
              </div>
            </div>
          </div>

          {/* COD CERTIFICATES LISTING */}
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-600" />
                  DigiELV Marketplace CoD Certificates ({codList.filter(c => c.status === 'Listed_For_Sale').length})
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Verified certificates listed for sale. Sensitive details are masked for privacy; verified buyers can submit bids or trade via DigiELV.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://digielv.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>DigiELV.com Trading Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {codList.filter(c => c.status === 'Listed_For_Sale').map(cod => (
                <div key={cod.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                        {cod.category} CoD · DigiELV Verified
                      </span>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300 flex items-center gap-1 shadow-2xs" title="Masked for security">
                          <Lock className="w-3 h-3 text-emerald-700" />
                          {maskCodNumber(cod.codNumber)}
                        </span>
                        <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Privacy Masked
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{cod.vehicleModel}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-mono mt-0.5">
                        <span>Reg: <strong>{maskVehicleReg(cod.vehicleReg)}</strong></span>
                        <span>·</span>
                        <span>Chassis: {maskChassisNumber(cod.chassisNo)}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                        RVSF: {cod.rvsfName}
                      </span>
                    </div>

                    {/* MANDATORY VEHICLE DETAILS (Year & BS Category) */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Vehicle Year:</span>
                        <strong className="text-slate-900 font-mono text-xs">{cod.vehicleYear || '2004'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">BS Norms Category:</span>
                        <span className="text-[11px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block font-mono">
                          {cod.bsCategory || 'BS-II'}
                        </span>
                      </div>
                    </div>

                    {/* GOVERNMENT POLICY PARAMETERS & CONCESSIONS */}
                    <div className="p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-2 text-xs">
                      {/* Road Tax Waiver in % */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-slate-800 font-extrabold block">Road Tax Waiver:</span>
                          <span className="text-[10px] text-slate-500 block leading-tight">
                            Calculated as % of new vehicle price (not a fixed flat ₹ discount)
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <strong className="text-emerald-800 font-mono text-sm block font-black">
                            {cod.roadTaxWaiverPercent || 25}%
                          </strong>
                        </div>
                      </div>

                      {/* OEM Discount Min % - Max % */}
                      <div className="flex justify-between items-center border-t border-emerald-200/60 pt-1.5 gap-2">
                        <div>
                          <span className="text-slate-800 font-bold block">OEM Discount:</span>
                          <span className="text-[10px] text-slate-500 block">Manufacturer concession</span>
                        </div>
                        <strong className="text-indigo-950 font-mono text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0 font-bold">
                          Min {cod.oemDiscountMinPercent || (cod.category === '4W' ? 4 : 3)}% – Max {cod.oemDiscountMaxPercent || (cod.category === '4W' ? 6 : 5)}%
                        </strong>
                      </div>

                      {/* Registration Fees as per Government Policy */}
                      <div className="flex justify-between items-center border-t border-emerald-200/60 pt-1.5 gap-2">
                        <div>
                          <span className="text-slate-800 font-bold block">Registration Fees:</span>
                          <span className="text-[10px] text-slate-500 block">MoRTH CMVR Rule 115</span>
                        </div>
                        <strong className="text-emerald-900 font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300 shrink-0">
                          {cod.registrationFeeBenefit || '100% Waived (₹0)'}
                        </strong>
                      </div>

                      {/* Target Asking Price */}
                      <div className="flex justify-between items-center border-t border-emerald-200/60 pt-1.5">
                        <span className="text-slate-800 font-bold">Target Asking Price:</span>
                        <strong className="text-emerald-700 font-mono text-sm font-black">₹{(cod.askingPrice || 19500).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {/* ACTUAL COD HOLDER (OWNER) DETAILS - PRIVACY MASKED */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold text-amber-950 uppercase tracking-wider block">
                          Verified Certificate Holder
                        </span>
                        <span className="text-[9px] font-bold text-amber-800 bg-white px-1.5 py-0.5 rounded border border-amber-300">
                          Masked
                        </span>
                      </div>
                      <div className="font-bold text-slate-950">{maskOwnerName(cod.ownerName)}</div>
                      <div className="text-[11px] text-slate-600">{cod.sellerSociety || 'Surat Society Resident, Gujarat'}</div>
                      
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="font-mono font-bold text-slate-700 text-[11px] bg-white px-2 py-0.5 rounded border border-amber-300">
                          {maskMobileNumber(cod.sellerMobile)}
                        </span>
                        <span className="text-[10px] text-slate-500 italic">
                          (Direct phone hidden for privacy; coordinator connects upon bid)
                        </span>
                      </div>
                    </div>

                    {/* BIDS SUMMARY */}
                    <div className="flex justify-between items-center text-xs font-bold pt-1">
                      <span className="text-slate-600">Captured Buyer Bids:</span>
                      <span className="text-slate-900 font-mono">
                        {cod.bidsCount || 0} bids {cod.highestBid ? `(Highest: ₹${cod.highestBid.toLocaleString('en-IN')})` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedCodForModal(cod);
                        setBidAmountInput((cod.highestBid || cod.askingPrice || 19500) + 500);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" /> Place Buyer Bid on Platform
                    </button>

                    <a
                      href="https://digielv.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-300 transition-all cursor-pointer text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                      <span>Trade on DigiELV Portal (digielv.com)</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BUYER BID MODAL WITH MOBILE NUMBER CAPTURE */}
          {selectedCodForModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Submit Buyer Bid for CoD</h3>
                    <p className="text-[11px] text-slate-500">CoD Holder: {selectedCodForModal.ownerName} ({selectedCodForModal.sellerSociety})</p>
                  </div>
                  <button onClick={() => setSelectedCodForModal(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                </div>

                {bidError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-semibold border border-red-200">
                    {bidError}
                  </div>
                )}

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Target CoD Number:</span>
                    <strong className="font-mono text-slate-950">{selectedCodForModal.codNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle:</span>
                    <strong className="text-slate-950">{selectedCodForModal.vehicleModel} ({selectedCodForModal.vehicleReg})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Year &amp; BS Emission Norms:</span>
                    <strong className="text-slate-950 font-mono font-bold">{selectedCodForModal.vehicleYear || '2004'} · {selectedCodForModal.bsCategory || 'BS-II'}</strong>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-slate-600 block">Road Tax Waiver:</span>
                      <span className="text-[10px] text-slate-500 block leading-tight">Calculated on new vehicle price</span>
                    </div>
                    <strong className="text-emerald-800 font-mono font-bold text-sm">{selectedCodForModal.roadTaxWaiverPercent || 25}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">OEM Discount Range:</span>
                    <strong className="text-indigo-900 font-mono font-bold">Min {selectedCodForModal.oemDiscountMinPercent || 4}% – Max {selectedCodForModal.oemDiscountMaxPercent || 6}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Registration Fees Benefit:</span>
                    <strong className="text-emerald-900 font-bold">{selectedCodForModal.registrationFeeBenefit || '100% Waived (₹0 under CMVR)'}</strong>
                  </div>
                </div>

                <form onSubmit={handlePlaceBuyerBid} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Your Full Name (Prospective Buyer) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={bidderNameInput}
                      onChange={e => setBidderNameInput(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Your Verified Mobile Number (Strictly 10 Digits) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      value={bidderMobileInput}
                      onChange={e => setBidderMobileInput(formatMobile10(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Your Offer Price for CoD (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={bidAmountInput}
                      onChange={e => setBidAmountInput(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-mono font-bold"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Note: Submitting this bid shares your details with Authorized Vendor Shree Ambica Automotive and CoD Holder {selectedCodForModal.ownerName} to coordinate transfer on the official MoRTH Parivahan portal.
                  </p>

                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer">
                    Submit Bid &amp; Share Details with Vendor &amp; Owner
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      )}



      {/* VIEW 5: VENDOR ADMIN PANEL VIEW WITH SECURE AUTHENTICATION */}
      {activeTab === 'admin' && (
        <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {!isVendorAuthenticated ? (
            <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Shree Ambica Vendor Portal</h2>
              
              {vendorAuthError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl font-semibold">
                  {vendorAuthError}
                </div>
              )}

              <form onSubmit={handleVendorLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-left font-bold text-slate-900 mb-1">Vendor Email *</label>
                  <input type="email" required placeholder="vendor@ambica.com" value={vendorIdInput} onChange={e => setVendorIdInput(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 text-slate-900" />
                </div>
                <div>
                  <label className="block text-left font-bold text-slate-900 mb-1">Password *</label>
                  <input type="password" required placeholder="••••••••" value={vendorPasswordInput} onChange={e => setVendorPasswordInput(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 text-slate-900" />
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all">
                  Authenticate Vendor Panel
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* TOP VENDOR CONTROLS & SUB-TABS */}
              <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 gap-4 shadow-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-extrabold text-base text-slate-900">Shree Ambica Vendor Operations</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl border text-xs font-bold gap-1">
                    <button onClick={() => setVendorSubTab('leads')} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${vendorSubTab === 'leads' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'}`}>
                      Vehicle Leads ({leads.length})
                    </button>
                    <button onClick={() => setVendorSubTab('cods')} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${vendorSubTab === 'cods' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'}`}>
                      CoD Registry &amp; Market ({codList.length})
                    </button>
                    <button onClick={() => setVendorSubTab('bids')} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${vendorSubTab === 'bids' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'}`}>
                      Captured Buyer Bids
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleExportLeadsCSV}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-extrabold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Download leads as spreadsheet CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> Export CSV (Excel)
                  </button>
                  <button
                    onClick={handleExportVendorPrint}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Print formal report or save as PDF"
                  >
                    <Printer className="w-4 h-4 text-slate-700" /> Print Summary Report
                  </button>
                  <button
                    onClick={() => setShowSocietyMigrationModal(true)}
                    className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-300 font-extrabold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Batch merge unverified society names into verified ones"
                  >
                    <RefreshCw className="w-4 h-4 text-purple-700" /> Batch Society Migration
                  </button>
                  <button onClick={() => setShowAddWalkInModal(true)} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all">
                    <Plus className="w-4 h-4" /> Walk-In Customer Intake
                  </button>
                  <button onClick={handleVendorLogout} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer">Logout</button>
                </div>
              </div>

              {/* SUB-TAB 1: VEHICLE LEADS */}
              {vendorSubTab === 'leads' && (
                <div className="space-y-4">
                  {/* COMPREHENSIVE FILTER & SORTING TOOLBAR */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b pb-2.5">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">
                          Advanced Multi-Parameter Filters &amp; Sorting Controls
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setAdminSearch('');
                          setAdminSocietyFilter('ALL');
                          setAdminStatusFilter('ALL');
                          setAdminCategoryFilter('ALL');
                          setAdminWeightFilter('ALL');
                          setAdminSortBy('date_desc');
                        }}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <RefreshCw className="w-3 h-3" /> Reset All Filters
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
                      {/* 1. SEARCH INPUT */}
                      <div className="md:col-span-1">
                        <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Search Keywords</label>
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            placeholder="Token / Owner / Reg No / Flat"
                            value={adminSearch}
                            onChange={e => setAdminSearch(e.target.value)}
                            className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900"
                          />
                        </div>
                      </div>

                      {/* 2. SOCIETY FILTER */}
                      <div>
                        <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Filter by Society</label>
                        <select
                          value={adminSocietyFilter}
                          onChange={e => setAdminSocietyFilter(e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900"
                        >
                          <option value="ALL">All Societies (ALL)</option>
                          {Array.from(new Set([...societiesList, ...leads.map(l => l.society)])).filter(Boolean).map(soc => (
                            <option key={soc} value={soc}>{soc}</option>
                          ))}
                        </select>
                      </div>

                      {/* 3. WEIGHT FILTER */}
                      <div>
                        <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Filter by Weight Range</label>
                        <select
                          value={adminWeightFilter}
                          onChange={e => setAdminWeightFilter(e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900"
                        >
                          <option value="ALL">All Measured Weights</option>
                          <option value="under150">&lt; 150 kg (Bikes / 2-Wheelers)</option>
                          <option value="150to500">150 – 500 kg (Three-Wheelers / Minis)</option>
                          <option value="500to900">500 – 900 kg (Small Cars / Hatchbacks)</option>
                          <option value="900to1300">900 – 1300 kg (Sedans / Compact SUVs)</option>
                          <option value="above1300">&gt; 1300 kg (Heavy SUVs / Luxury Cars)</option>
                        </select>
                      </div>

                      {/* 4. CATEGORY FILTER */}
                      <div>
                        <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Vehicle Category</label>
                        <select
                          value={adminCategoryFilter}
                          onChange={e => setAdminCategoryFilter(e.target.value as any)}
                          className="w-full p-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900"
                        >
                          <option value="ALL">All Categories (2W &amp; 4W)</option>
                          <option value="2W">2-Wheelers (Bikes &amp; Scooters)</option>
                          <option value="4W">4-Wheelers (Cars &amp; SUVs)</option>
                        </select>
                      </div>

                      {/* 5. SORTING SELECTION */}
                      <div>
                        <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Sort Leads By</label>
                        <div className="relative">
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                          <select
                            value={adminSortBy}
                            onChange={e => setAdminSortBy(e.target.value as any)}
                            className="w-full p-1.5 pr-8 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 appearance-none"
                          >
                            <option value="date_desc">Date: Newest First</option>
                            <option value="date_asc">Date: Oldest First</option>
                            <option value="weight_desc">Weight: Heaviest First</option>
                            <option value="weight_asc">Weight: Lightest First</option>
                            <option value="payout_desc">Valuation: Highest First</option>
                            <option value="payout_asc">Valuation: Lowest First</option>
                            <option value="owner_asc">Owner Name: A to Z</option>
                            <option value="society_asc">Society Name: A to Z</option>
                            <option value="status_asc">Status: Alphabetical</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* STATUS PILLS & SUMMARY STATS */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                        {['ALL', 'Registered', 'Inspected & Weighed', 'Payment Transferred', 'CoD Issued', 'Rejected / Offer Declined'].map(st => (
                          <button
                            key={st}
                            onClick={() => setAdminStatusFilter(st)}
                            className={`px-2.5 py-1 rounded-xl border text-[11px] transition-all cursor-pointer ${
                              adminStatusFilter === st
                                ? 'bg-slate-950 text-white border-slate-950 font-extrabold shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {st} ({statusCounts[st as keyof typeof statusCounts] || 0})
                          </button>
                        ))}
                      </div>

                      <div className="text-[11px] font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                        Showing <strong>{filteredAndSortedLeads.length}</strong> of {leads.length} | 
                        Weight: <strong>{filteredAndSortedLeads.reduce((a, b) => a + (b.actualWeightKg || b.estWeightKg), 0).toLocaleString()} kg</strong> | 
                        Payout: <strong className="text-emerald-700 font-bold">₹{filteredAndSortedLeads.reduce((a, b) => a + b.estPayout, 0).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* BATCH ACTION BAR IF SELECTED */}
                  {selectedLeadIds.length > 0 && (
                    <div className="p-3 bg-emerald-950 text-white rounded-xl flex items-center justify-between text-xs font-bold shadow-md">
                      <span>{selectedLeadIds.length} leads selected for batch action</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <select value={batchTargetStatus} onChange={e => setBatchTargetStatus(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-white p-1.5 rounded-lg text-xs">
                          <option value="Registered">Registered</option>
                          <option value="Inspected & Weighed">Inspected &amp; Weighed</option>
                          <option value="Payment Transferred">Payment Transferred</option>
                          <option value="CoD Issued">CoD Issued</option>
                          <option value="Rejected / Offer Declined">Rejected / Offer Declined</option>
                        </select>
                        <button onClick={handleBatchStatusApply} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg cursor-pointer transition-all">Apply Status</button>
                        <button
                          onClick={() => {
                            requestConfirmDelete(
                              `Delete ${selectedLeadIds.length} Selected Vehicle Leads`,
                              `Are you sure you want to permanently delete the ${selectedLeadIds.length} selected vehicle records? This operation cannot be undone.`,
                              () => {
                                setLeads(prev => prev.filter(l => !selectedLeadIds.includes(l.id)));
                                setCodList(prev => prev.filter(c => !selectedLeadIds.includes(c.leadId || '')));
                                setSelectedLeadIds([]);
                              },
                              `${selectedLeadIds.length} selected records will be permanently removed.`
                            );
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Selected</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LEADS TABLE */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedLeadIds.length === filteredAndSortedLeads.length && filteredAndSortedLeads.length > 0}
                              onChange={e => {
                                if (e.target.checked) setSelectedLeadIds(filteredAndSortedLeads.map(l => l.id));
                                else setSelectedLeadIds([]);
                              }}
                              className="accent-emerald-600 cursor-pointer"
                            />
                          </th>
                          <th className="p-3 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setAdminSortBy(prev => prev === 'date_desc' ? 'date_asc' : 'date_desc')}>
                            <div className="flex items-center gap-1">Token ID <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                          </th>
                          <th className="p-3 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setAdminSortBy(prev => prev === 'owner_asc' ? 'society_asc' : 'owner_asc')}>
                            <div className="flex items-center gap-1">Owner / Society <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                          </th>
                          <th className="p-3">Vehicle</th>
                          <th className="p-3">Reg Number</th>
                          <th className="p-3 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setAdminSortBy(prev => prev === 'weight_desc' ? 'weight_asc' : 'weight_desc')}>
                            <div className="flex items-center gap-1">Weight &amp; Rate <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                          </th>
                          <th className="p-3 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setAdminSortBy(prev => prev === 'payout_desc' ? 'payout_asc' : 'payout_desc')}>
                            <div className="flex items-center gap-1">Valuation <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                          </th>
                          <th className="p-3 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setAdminSortBy(prev => prev === 'status_asc' ? 'date_desc' : 'status_asc')}>
                            <div className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                          </th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAndSortedLeads.map(lead => (
                          <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={selectedLeadIds.includes(lead.id)}
                                onChange={e => {
                                  if (e.target.checked) setSelectedLeadIds(prev => [...prev, lead.id]);
                                  else setSelectedLeadIds(prev => prev.filter(id => id !== lead.id));
                                }}
                                className="accent-emerald-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-3 font-mono font-bold">
                              <button onClick={() => setActiveLeadModal(lead)} className="text-emerald-700 hover:underline cursor-pointer">
                                {lead.tokenId}
                              </button>
                            </td>
                            <td className="p-3">
                              <strong className="block text-slate-950 font-bold">{lead.ownerName}</strong>
                              <span className="text-[10px] text-slate-500 block mb-1">{lead.society} ({lead.flatNo})</span>
                              {/* CUSTOMER MOBILE VISIBILITY & STRICT 10 DIGITS */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-bold text-slate-900 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                                  {lead.mobile}
                                </span>
                                {lead.mobile && lead.mobile !== 'N/A (Society Resolution)' && (
                                  <>
                                    <a
                                      href={`tel:${lead.mobile.replace(/[^0-9]/g, '')}`}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                      title={`Click to call ${lead.ownerName}`}
                                    >
                                      <Phone className="w-3 h-3" /> Call
                                    </a>
                                    <a
                                      href={`https://wa.me/91${lead.mobile.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${lead.ownerName}, greeting from SHREE AMBICA AUTOMOTIVE PVT LTD (RVSF). Regarding your vehicle ${lead.brand} ${lead.model} (${lead.regNumber}) registered for scrappage under token ${lead.tokenId}.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                      title={`Click to WhatsApp ${lead.ownerName}`}
                                    >
                                      <MessageSquare className="w-3 h-3" /> WhatsApp
                                    </a>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-medium text-slate-800">
                              <div>{lead.brand} {lead.model}</div>
                              <span className="text-[10px] text-slate-500 font-mono">Yr: {lead.regYear} · {lead.category}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-900 font-bold">{lead.regNumber}</td>
                            <td className="p-3">
                              <span className="block font-mono text-slate-900">{lead.actualWeightKg || lead.estWeightKg} kg</span>
                              <span className="text-[10px] text-emerald-800 font-mono">₹{lead.ratePerKg}/kg</span>
                            </td>
                            <td className="p-3 font-mono font-extrabold text-emerald-700 text-sm">₹{lead.estPayout.toLocaleString('en-IN')}</td>
                            <td className="p-3">
                              <select
                                value={lead.status}
                                onChange={e => handleSingleLeadStatusChange(lead.id, e.target.value as any)}
                                className="p-1 border rounded-lg text-[11px] font-bold bg-slate-50 cursor-pointer"
                              >
                                <option value="Registered">Registered</option>
                                <option value="Inspected & Weighed">Inspected &amp; Weighed</option>
                                <option value="Payment Transferred">Payment Transferred</option>
                                <option value="CoD Issued">CoD Issued</option>
                                <option value="Rejected / Offer Declined">Rejected / Offer Declined</option>
                              </select>
                            </td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => setEditingLeadModal(lead)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded-lg border border-emerald-300 cursor-pointer"
                                title="Edit full listing details"
                              >
                                Edit Details
                              </button>
                              <button
                                onClick={() => openIssueCodModal(lead)}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold rounded-lg border border-amber-300 cursor-pointer"
                                title="Issue Official Certificate of Deposit"
                              >
                                Issue CoD
                              </button>
                              <button
                                onClick={() => {
                                  setEditingPricingLead(lead);
                                  setEditActualWeightInput(lead.actualWeightKg || lead.estWeightKg);
                                  setEditRatePerKgInput(lead.ratePerKg);
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                              >
                                Weight/Rate
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-bold rounded-lg cursor-pointer"
                                title="Permanently delete this listing"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: COD REGISTRY & MARKETPLACE MANAGEMENT */}
              {vendorSubTab === 'cods' && (
                <div className="space-y-4">
                  {/* COD TOOLBAR & INTEGRATION PARTNER INFO */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2.5">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-emerald-600" />
                        <div>
                          <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider block">
                            Certificate of Deposit (CoD) Official Management Registry
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Integration Partner: DigiELV Marketplace (
                            <a href="https://digielv.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-bold">
                              digielv.com
                            </a>
                            ) &amp; MoRTH V-Scrap Portal
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleOpenDirectIssueCod}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Plus className="w-4 h-4" /> Issue Physical CoD
                        </button>
                        <a
                          href="https://digielv.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> DigiELV Marketplace
                        </a>
                      </div>
                    </div>

                    {/* SEARCH & FILTERS FOR CODS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Search CoD Registry</label>
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            placeholder="CoD No / Vehicle / Reg / Owner"
                            value={codSearch}
                            onChange={e => setCodSearch(e.target.value)}
                            className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Vehicle Category</label>
                        <select
                          value={codCategoryFilter}
                          onChange={e => setCodCategoryFilter(e.target.value as any)}
                          className="w-full p-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900"
                        >
                          <option value="ALL">All Categories (2W &amp; 4W)</option>
                          <option value="2W">2-Wheelers</option>
                          <option value="4W">4-Wheelers</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Marketplace Listing Status</label>
                        <select
                          value={codMarketplaceFilter}
                          onChange={e => setCodMarketplaceFilter(e.target.value as any)}
                          className="w-full p-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900"
                        >
                          <option value="ALL">All Listing States</option>
                          <option value="Listed">🟢 Listed on DigiELV Marketplace</option>
                          <option value="Private">⚪ Private / Unlisted</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* COD CERTIFICATES TABLE */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">CoD Certificate Number</th>
                          <th className="p-3">Vehicle, Year &amp; BS Norms</th>
                          <th className="p-3">Chassis &amp; Engine No</th>
                          <th className="p-3">Certificate Holder (Owner)</th>
                          <th className="p-3">Govt Policy Incentives</th>
                          <th className="p-3">Asking Price</th>
                          <th className="p-3">Marketplace Listing Toggle</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCods.map(cod => (
                          <tr key={cod.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3">
                              <span className="font-mono font-bold text-slate-950 block">{cod.codNumber}</span>
                              <span className="text-[10px] text-emerald-700 font-semibold">DigiELV Certified · {cod.issueDate}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{cod.vehicleModel}</span>
                              <span className="font-mono text-slate-600 block text-[11px]">{cod.vehicleReg} ({cod.category})</span>
                              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                                Year: {cod.vehicleYear || '2004'} · {cod.bsCategory || 'BS-II'}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[11px]">
                              <span className="text-slate-800 block">CH: {cod.chassisNo}</span>
                              <span className="text-slate-500 block">ENG: {cod.engineNo || 'N/A'}</span>
                            </td>
                            <td className="p-3">
                              <strong className="block text-slate-950 font-bold">{cod.ownerName}</strong>
                              <span className="text-[10px] text-slate-500 block">{cod.sellerSociety}</span>
                              <span className="font-mono font-bold text-slate-900 text-[10px]">{cod.sellerMobile}</span>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <div className="font-mono font-extrabold text-emerald-700 text-xs">
                                {cod.roadTaxWaiverPercent || 25}% Road Tax Waiver
                              </div>
                              <div className="text-[10px] text-indigo-900 font-bold font-mono">
                                OEM: Min {cod.oemDiscountMinPercent || (cod.category === '4W' ? 4 : 3)}% – Max {cod.oemDiscountMaxPercent || (cod.category === '4W' ? 6 : 5)}%
                              </div>
                              <div className="text-[10px] text-slate-600 font-semibold">
                                {cod.registrationFeeBenefit || '100% Reg Fee Waived (₹0)'}
                              </div>
                            </td>
                            <td className="p-3 font-mono text-slate-900 font-bold">
                              ₹{(cod.askingPrice || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3">
                              {/* TOGGLE SWITCH TO EASILY LIST ON DIGIELV MARKETPLACE */}
                              <button
                                onClick={() => handleToggleCodMarketListing(cod.id)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                  cod.status === 'Listed_For_Sale'
                                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-2xs'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                                title="Click to toggle marketplace listing"
                              >
                                <span className={`w-2 h-2 rounded-full ${cod.status === 'Listed_For_Sale' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
                                {cod.status === 'Listed_For_Sale' ? 'Listed on DigiELV' : 'Private (Unlisted)'}
                              </button>
                            </td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => setViewingCodCertificate(cod)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded-lg border border-emerald-300 cursor-pointer"
                              >
                                Certificate
                              </button>
                              <button
                                onClick={() => {
                                  setCodFormData({
                                    codNumber: cod.codNumber,
                                    digielvRef: `DELV-${cod.codNumber.slice(-5)}`,
                                    chassisNo: cod.chassisNo,
                                    engineNo: cod.engineNo || '',
                                    vehicleReg: cod.vehicleReg,
                                    ownerName: cod.ownerName,
                                    category: cod.category,
                                    vehicleModel: cod.vehicleModel,
                                    vehicleYear: String(cod.vehicleYear || '2004'),
                                    bsCategory: cod.bsCategory || 'BS-II',
                                    roadTaxWaiverPercent: cod.roadTaxWaiverPercent || 25,
                                    taxConcessionValue: cod.taxConcessionValue || 38000,
                                    oemDiscountMinPercent: cod.oemDiscountMinPercent || (cod.category === '4W' ? 4 : 3),
                                    oemDiscountMaxPercent: cod.oemDiscountMaxPercent || (cod.category === '4W' ? 6 : 5),
                                    registrationFeeBenefit: cod.registrationFeeBenefit || (cod.category === '2W' ? '100% Waived (₹0 under MoRTH CMVR - std. ₹300 waived)' : '100% Waived (₹0 under MoRTH CMVR - std. ₹600–₹1,000 waived)'),
                                    issueDate: cod.issueDate,
                                    rvsfName: cod.rvsfName,
                                    listOnMarketplace: cod.status === 'Listed_For_Sale',
                                    askingPrice: cod.askingPrice || 19500,
                                    sellerMobile: cod.sellerMobile || '',
                                    sellerSociety: cod.sellerSociety || '',
                                    rtoJurisdiction: 'GJ-05 Surat RTO',
                                    remarks: 'Registry modification'
                                  });
                                  setCodTargetLead(leads.find(l => l.id === cod.leadId) || null);
                                  setShowIssueCodModal(true);
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCod(cod.id)}
                                className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-bold rounded-lg cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: CAPTURED BUYER BIDS */}
              {vendorSubTab === 'bids' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        Captured DigiELV Marketplace Buyer Bids &amp; Certificate Holders
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        Coordination desk for Authorized RVSF: Connect certificate sellers (original vehicle owners) and new car buyers (bidders).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportBidsCSV}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-extrabold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> Export Bids CSV
                      </button>
                      <button
                        onClick={handleExportBidsPrint}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Printer className="w-4 h-4 text-slate-700" /> Print Report
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 font-bold border-b text-slate-900">
                        <tr>
                          <th className="p-3">Target CoD &amp; Vehicle</th>
                          <th className="p-3">Actual CoD Holder (Original Owner)</th>
                          <th className="p-3">Prospective Buyer (Bidder)</th>
                          <th className="p-3">Bid Offer Amount</th>
                          <th className="p-3">Timestamp</th>
                          <th className="p-3 text-right">Vendor Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {codList.flatMap(c => (c.bids || []).map(b => ({
                          ...b,
                          targetCod: c.codNumber,
                          vehicleModel: c.vehicleModel,
                          vehicleReg: c.vehicleReg,
                          taxConcession: c.taxConcessionValue,
                          ownerName: c.ownerName,
                          ownerMobile: c.sellerMobile || '',
                          ownerSociety: c.sellerSociety || ''
                        }))).map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            {/* TARGET COD & VEHICLE */}
                            <td className="p-3">
                              <span className="font-mono font-bold text-slate-900 block">{item.targetCod}</span>
                              <span className="font-semibold text-slate-800 block text-[11px]">{item.vehicleModel}</span>
                              <span className="font-mono text-[10px] text-slate-500 block">{item.vehicleReg}</span>
                              <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                                Concession: ₹{(item.taxConcession || 0).toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* ACTUAL COD HOLDER (ORIGINAL OWNER) */}
                            <td className="p-3">
                              <strong className="block text-slate-950 font-bold">{item.ownerName}</strong>
                              <span className="text-[11px] text-slate-500 block mb-1">{item.ownerSociety || 'Surat, Gujarat'}</span>
                              {item.ownerMobile && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-mono font-bold text-slate-900 text-[11px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">
                                    {item.ownerMobile}
                                  </span>
                                  <a
                                    href={`tel:${item.ownerMobile.replace(/[^0-9]/g, '')}`}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                    title={`Call Owner ${item.ownerName}`}
                                  >
                                    <Phone className="w-2.5 h-2.5" /> Call
                                  </a>
                                  <a
                                    href={`https://wa.me/91${item.ownerMobile.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${item.ownerName}, regarding your CoD ${item.targetCod} for ${item.vehicleModel}. A buyer (${item.bidderName}) has submitted an offer of ₹${item.bidAmount.toLocaleString('en-IN')}. Please confirm if you wish to transfer.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                    title={`WhatsApp Owner ${item.ownerName}`}
                                  >
                                    <MessageSquare className="w-2.5 h-2.5" /> WhatsApp
                                  </a>
                                </div>
                              )}
                            </td>

                            {/* PROSPECTIVE BUYER (BIDDER) */}
                            <td className="p-3">
                              <strong className="block text-slate-950 font-bold">{item.bidderName}</strong>
                              <span className="text-[11px] text-slate-500 block mb-1">{item.bidderSociety || 'Gujarat Buyer'}</span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-bold text-slate-900 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                                  {item.bidderMobile}
                                </span>
                                <a
                                  href={`tel:${item.bidderMobile.replace(/[^0-9]/g, '')}`}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                  title={`Call Bidder ${item.bidderName}`}
                                >
                                  <Phone className="w-2.5 h-2.5" /> Call
                                </a>
                                <a
                                  href={`https://wa.me/91${item.bidderMobile.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${item.bidderName}, regarding your bid of ₹${item.bidAmount.toLocaleString('en-IN')} on CoD ${item.targetCod} at Shree Ambica Automotive. The certificate holder is ${item.ownerName}.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                                  title={`WhatsApp Bidder ${item.bidderName}`}
                                >
                                  <MessageSquare className="w-2.5 h-2.5" /> WhatsApp
                                </a>
                              </div>
                            </td>

                            {/* BID OFFER */}
                            <td className="p-3">
                              <div className="font-mono font-extrabold text-emerald-700 text-sm">
                                ₹{item.bidAmount.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] text-slate-500">Buyer Offer Price</span>
                            </td>

                            {/* TIMESTAMP */}
                            <td className="p-3 text-slate-500 text-[11px]">{item.timestamp}</td>

                            {/* ACTIONS */}
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <a
                                href={`https://wa.me/91${item.ownerMobile.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${item.ownerName}, regarding buyer ${item.bidderName} (Mobile: ${item.bidderMobile}) who offered ₹${item.bidAmount.toLocaleString('en-IN')} for your CoD ${item.targetCod}. Shree Ambica Automotive is ready to facilitate the official MoRTH transfer.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-all"
                              >
                                Connect Parties
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMPREHENSIVE WALK-IN INTAKE MODAL (ENHANCED) */}
          {showWalkInModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Walk-In Customer Scrap Intake (Comprehensive)</h3>
                    <p className="text-[11px] text-slate-500">Capture full demographic, vehicle attributes, KYC &amp; weighbridge measurements</p>
                  </div>
                  <button onClick={() => setShowAddWalkInModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleWalkInSubmit} className="space-y-4 text-xs">
                  {/* CUSTOMER DEMOGRAPHICS */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">1. Customer Demographics</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Customer Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Patel"
                          value={walkInFormData.ownerName}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Mobile Number (Strictly 10 Digits) *</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          placeholder="10-digit mobile"
                          value={walkInFormData.mobile}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, mobile: formatMobile10(e.target.value) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Society Name *</label>
                        <select
                          value={walkInFormData.society}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, society: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        >
                          <option value="Direct Walk-In (Non-Society Resident)">Direct Walk-In (Non-Society Resident)</option>
                          {societiesList.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                          <option value="Other (Enter custom society name)">Other (Enter custom society name)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Address / Flat / Wing Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Flat B-204 or Shop 12, Varachha"
                          value={walkInFormData.flatNo}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, flatNo: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-900"
                        />
                      </div>
                    </div>

                    {walkInFormData.society === 'Other (Enter custom society name)' && (
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Custom Society Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter society name"
                          value={walkInFormData.customSociety}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, customSociety: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-900"
                        />
                      </div>
                    )}
                  </div>

                  {/* VEHICLE SPECIFICATIONS */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">2. Vehicle Specifications (50-Year Database)</span>
                    
                    {/* CATEGORY TOGGLE */}
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer font-bold ${walkInFormData.category === '2W' ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : 'border-slate-200 bg-white'}`}>
                        <input
                          type="radio"
                          name="walkinCategory"
                          checked={walkInFormData.category === '2W'}
                          onChange={() => handleWalkInCategoryChange('2W')}
                          className="accent-emerald-600"
                        />
                        <Bike className="w-4 h-4 text-emerald-700" />
                        <span>2-Wheeler (Bike / Scooter)</span>
                      </label>
                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer font-bold ${walkInFormData.category === '4W' ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : 'border-slate-200 bg-white'}`}>
                        <input
                          type="radio"
                          name="walkinCategory"
                          checked={walkInFormData.category === '4W'}
                          onChange={() => handleWalkInCategoryChange('4W')}
                          className="accent-emerald-600"
                        />
                        <Car className="w-4 h-4 text-emerald-700" />
                        <span>4-Wheeler (Car / SUV)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Brand / Manufacturer *</label>
                        <select
                          value={walkInFormData.brand}
                          onChange={e => handleWalkInBrandChange(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        >
                          {Object.keys(BRANDS_DATABASE[walkInFormData.category]).map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Model Selection *</label>
                        <select
                          value={walkInFormData.model}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, model: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        >
                          {walkInAvailableModels.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {walkInFormData.model === 'Model Not Listed' && (
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Specify Unlisted Model *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mahindra Gusto 125"
                          value={walkInFormData.customModel}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, customModel: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Registration Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. GJ-05-AB-1234"
                          value={walkInFormData.regNumber}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, regNumber: e.target.value.toUpperCase() }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono uppercase font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Registration Year *</label>
                        <input
                          type="number"
                          required
                          min={1970}
                          max={2026}
                          placeholder="2005"
                          value={walkInFormData.regYear}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, regYear: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono text-slate-900 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Operating Condition *</label>
                        <select
                          value={walkInFormData.condition}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        >
                          <option value="dead">Dead Engine / Seized / Non-Starting</option>
                          <option value="incomplete">Incomplete / Stripped Body</option>
                          <option value="running_expired">Running but RC Expired (&gt;15 Years)</option>
                          <option value="scrap">Severe Rust / Accidental Scrap</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">RC Availability Status *</label>
                        <select
                          value={walkInFormData.rcStatus}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, rcStatus: e.target.value as any }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        >
                          <option value="original">Original Physical RC Book / Card</option>
                          <option value="mparivahan">mParivahan / DigiLocker Digital RC</option>
                          <option value="lost">Lost / Misplaced RC (Affidavit/FIR)</option>
                          <option value="scrap_unregistered">Scrap / End-of-Life Unregistered</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Chassis / Frame Number (Optional)</label>
                        <input
                          type="text"
                          placeholder="17-digit VIN"
                          value={walkInFormData.chassisNumber}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, chassisNumber: e.target.value.toUpperCase() }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono uppercase text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Engine Number (Optional)</label>
                        <input
                          type="text"
                          placeholder="Engine block number"
                          value={walkInFormData.engineNumber}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, engineNumber: e.target.value.toUpperCase() }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono uppercase text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* KYC & WEIGHBRIDGE COMMERCIALS */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">3. KYC Compliance &amp; Weighbridge Pricing</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Aadhaar Number (12 Digits) *</label>
                        <input
                          type="text"
                          required
                          maxLength={12}
                          pattern="[0-9]{12}"
                          placeholder="12 numeric digits"
                          value={walkInFormData.aadhaarNumber}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">PAN Card Number (10 Chars) *</label>
                        <input
                          type="text"
                          required
                          maxLength={10}
                          pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
                          placeholder="ABCDE1234F"
                          value={walkInFormData.panNumber}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase().slice(0, 10) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono uppercase font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Actual Weighbridge Weight (kg) *</label>
                        <input
                          type="number"
                          required
                          min={50}
                          value={walkInFormData.actualWeightKg}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, actualWeightKg: Number(e.target.value) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Price per KG (₹/kg) *</label>
                        <input
                          type="number"
                          required
                          step={0.1}
                          min={20}
                          max={35}
                          value={walkInFormData.ratePerKg}
                          onChange={e => setWalkInFormData(prev => ({ ...prev, ratePerKg: Number(e.target.value) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between font-bold text-emerald-950 items-center">
                      <span>Calculated Valuation Payout:</span>
                      <span className="font-mono text-base font-extrabold text-emerald-800">
                        ₹{Math.round((walkInFormData.actualWeightKg || 0) * (walkInFormData.ratePerKg || 0)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Counter Notes / Weighbridge Slip Number</label>
                      <input
                        type="text"
                        placeholder="e.g. Weighbridge Slip #WB-8812, Cash counter intake"
                        value={walkInFormData.remarks}
                        onChange={e => setWalkInFormData(prev => ({ ...prev, remarks: e.target.value }))}
                        className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                    Register Walk-In Customer &amp; Generate Token
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PHYSICAL COD ISSUANCE & EDIT MODAL */}
          {showIssueCodModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Issue / Modify Certificate of Deposit (CD/CoD)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Official CMVR MoRTH &amp; DigiELV Marketplace (digielv.com) compliant Certificate
                    </p>
                  </div>
                  <button onClick={() => setShowIssueCodModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleSavePhysicalCod} className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">1. CoD Certificate Identifiers</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">CoD Certificate Number *</label>
                        <input
                          type="text"
                          required
                          value={codFormData.codNumber}
                          onChange={e => setCodFormData(prev => ({ ...prev, codNumber: e.target.value.toUpperCase() }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900 uppercase"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">DigiELV Reference ID</label>
                        <input
                          type="text"
                          value={codFormData.digielvRef}
                          onChange={e => setCodFormData(prev => ({ ...prev, digielvRef: e.target.value.toUpperCase() }))}
                          placeholder="e.g. DELV-2026-9812"
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono text-slate-900 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Issue Date *</label>
                        <input
                          type="date"
                          required
                          value={codFormData.issueDate}
                          onChange={e => setCodFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">RVSF Authorized Facility *</label>
                        <input
                          type="text"
                          required
                          value={codFormData.rvsfName}
                          onChange={e => setCodFormData(prev => ({ ...prev, rvsfName: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">2. Vehicle Attributes &amp; Specifications</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Vehicle Category *</label>
                        <select
                          value={codFormData.category}
                          onChange={e => {
                            const cat = e.target.value as '2W' | '4W';
                            setCodFormData(prev => ({
                              ...prev,
                              category: cat,
                              registrationFeeBenefit: cat === '2W'
                                ? '100% Waived (₹0 under MoRTH CMVR - std. ₹300 waived)'
                                : '100% Waived (₹0 under MoRTH CMVR - std. ₹600–₹1,000 waived)',
                              oemDiscountMinPercent: cat === '4W' ? 4 : 3,
                              oemDiscountMaxPercent: cat === '4W' ? 6 : 5
                            }));
                          }}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                        >
                          <option value="4W">4-Wheeler (Car / LMV / Transport)</option>
                          <option value="2W">2-Wheeler (Motorcycle / Scooter)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Vehicle Manufacturing Year *</label>
                        <input
                          type="number"
                          required
                          min="1950"
                          max="2026"
                          placeholder="e.g. 2004"
                          value={codFormData.vehicleYear}
                          onChange={e => setCodFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">BS Emission Norms Category *</label>
                        <select
                          required
                          value={codFormData.bsCategory}
                          onChange={e => setCodFormData(prev => ({ ...prev, bsCategory: e.target.value as any }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900 text-xs"
                        >
                          <option value="Pre-BS">Pre-BS (Manufactured before 2000)</option>
                          <option value="BS-I">BS-I (Bharat Stage I, 2000–2005)</option>
                          <option value="BS-II">BS-II (Bharat Stage II, 2001–2010)</option>
                          <option value="BS-III">BS-III (Bharat Stage III, 2005–2017)</option>
                          <option value="BS-IV">BS-IV (Bharat Stage IV, 2010–2020)</option>
                          <option value="BS-VI">BS-VI (Bharat Stage VI, 2020 Onwards)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Vehicle Registration Number *</label>
                        <input
                          type="text"
                          required
                          value={codFormData.vehicleReg}
                          onChange={e => setCodFormData(prev => ({ ...prev, vehicleReg: e.target.value.toUpperCase() }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono uppercase font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Make &amp; Model *</label>
                        <input
                          type="text"
                          required
                          value={codFormData.vehicleModel}
                          onChange={e => setCodFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Frame / Chassis VIN *</label>
                        <input
                          type="text"
                          required
                          value={codFormData.chassisNo}
                          onChange={e => setCodFormData(prev => ({ ...prev, chassisNo: e.target.value.toUpperCase() }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono uppercase font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Engine Number *</label>
                        <input
                          type="text"
                          required
                          value={codFormData.engineNo}
                          onChange={e => setCodFormData(prev => ({ ...prev, engineNo: e.target.value.toUpperCase() }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono uppercase font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">3. Government Policy Concession Parameters</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">
                          Road Tax Waiver in Percentage (%) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="1"
                            max="50"
                            step="1"
                            value={codFormData.roadTaxWaiverPercent}
                            onChange={e => setCodFormData(prev => ({ ...prev, roadTaxWaiverPercent: Number(e.target.value) }))}
                            className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                          />
                          <span className="absolute right-3 top-2 font-bold text-slate-500">%</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block leading-tight">
                          Note: Road tax is calculated based on the new vehicle's price and is not a fixed flat discount.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 mb-1">
                          Registration Fees (Govt CMVR Policy) *
                        </label>
                        <select
                          value={codFormData.registrationFeeBenefit}
                          onChange={e => setCodFormData(prev => ({ ...prev, registrationFeeBenefit: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 text-xs"
                        >
                          <option value="100% Waived (₹0 under MoRTH CMVR Rule 115 - std. ₹300 waived)">
                            100% Waived (₹0 - 2W std. ₹300 waived)
                          </option>
                          <option value="100% Waived (₹0 under MoRTH CMVR Rule 115 - std. ₹600–₹1,000 waived)">
                            100% Waived (₹0 - 4W std. ₹600–₹1,000 waived)
                          </option>
                          <option value="100% Waived (₹0 under MoRTH CMVR Rule 115)">
                            100% Waived (₹0 under CMVR Rule 115)
                          </option>
                        </select>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Strictly configured per Govt Policy for each respective category
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">
                          OEM Min Discount (%) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="0"
                            max="20"
                            step="0.5"
                            placeholder="Min %"
                            value={codFormData.oemDiscountMinPercent}
                            onChange={e => setCodFormData(prev => ({ ...prev, oemDiscountMinPercent: Number(e.target.value) }))}
                            className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                          />
                          <span className="absolute right-3 top-2 font-bold text-slate-500">%</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Minimum discount offered by vehicle manufacturer
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 mb-1">
                          OEM Max Discount (%) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="0"
                            max="25"
                            step="0.5"
                            placeholder="Max %"
                            value={codFormData.oemDiscountMaxPercent}
                            onChange={e => setCodFormData(prev => ({ ...prev, oemDiscountMaxPercent: Number(e.target.value) }))}
                            className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                          />
                          <span className="absolute right-3 top-2 font-bold text-slate-500">%</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Maximum discount offered by vehicle manufacturer
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Estimated Reference Concession (₹)</label>
                        <input
                          type="number"
                          value={codFormData.taxConcessionValue}
                          onChange={e => setCodFormData(prev => ({ ...prev, taxConcessionValue: Number(e.target.value) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Target Asking / Trading Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={codFormData.askingPrice}
                          onChange={e => setCodFormData(prev => ({ ...prev, askingPrice: Number(e.target.value) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">4. Certificate Holder &amp; Marketplace Trading</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Original Owner Full Name *</label>
                        <input
                          type="text"
                          required
                          value={codFormData.ownerName}
                          onChange={e => setCodFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Owner Contact Mobile (Strictly 10 Digits) *</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          value={codFormData.sellerMobile}
                          onChange={e => setCodFormData(prev => ({ ...prev, sellerMobile: formatMobile10(e.target.value) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 mb-1">Society &amp; Residential Address *</label>
                      <input
                        type="text"
                        required
                        value={codFormData.sellerSociety}
                        onChange={e => setCodFormData(prev => ({ ...prev, sellerSociety: e.target.value }))}
                        className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Tax Concession Benefit Value (₹) *</label>
                        <input
                          type="number"
                          required
                          value={codFormData.taxConcessionValue}
                          onChange={e => setCodFormData(prev => ({ ...prev, taxConcessionValue: Number(e.target.value) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Target Asking / Trading Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={codFormData.askingPrice}
                          onChange={e => setCodFormData(prev => ({ ...prev, askingPrice: Number(e.target.value) }))}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    {/* MARKETPLACE TOGGLE SWITCH */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <strong className="block text-slate-900">List on DigiELV &amp; Public Marketplace</strong>
                        <span className="text-[11px] text-slate-500">Allow verified prospective vehicle buyers to view and bid on this certificate</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={codFormData.listOnMarketplace}
                          onChange={e => setCodFormData(prev => ({ ...prev, listOnMarketplace: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                    Save Certificate of Deposit &amp; Update System
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* FULL LISTING EDIT MODAL (CRUD) */}
          {editingLeadModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Modify Listing: {editingLeadModal.tokenId}
                    </h3>
                    <p className="text-[11px] text-slate-500">Comprehensive CRUD edit of resident and vehicle attributes</p>
                  </div>
                  <button onClick={() => setEditingLeadModal(null)} className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleSaveEditLead} className="space-y-4 text-xs">
                  {/* RESIDENT PARTICULARS */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">Resident &amp; Society Details</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Owner Name *</label>
                        <input
                          type="text"
                          required
                          value={editingLeadModal.ownerName}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, ownerName: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Mobile (Strictly 10 Digits) *</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          value={editingLeadModal.mobile}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, mobile: formatMobile10(e.target.value) }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Society Name *</label>
                        <select
                          value={editingLeadModal.society}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, society: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        >
                          {societiesList.map(s => <option key={s} value={s}>{s}</option>)}
                          <option value="Direct Walk-In (Non-Society Resident)">Direct Walk-In (Non-Society Resident)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Flat / Wing *</label>
                        <input
                          type="text"
                          required
                          value={editingLeadModal.flatNo}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, flatNo: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* VEHICLE DETAILS */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">Vehicle Specifications</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Category *</label>
                        <select
                          value={editingLeadModal.category}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, category: e.target.value as any }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold"
                        >
                          <option value="2W">2-Wheeler</option>
                          <option value="4W">4-Wheeler</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Brand *</label>
                        <input
                          type="text"
                          required
                          value={editingLeadModal.brand}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, brand: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Model *</label>
                        <input
                          type="text"
                          required
                          value={editingLeadModal.model}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, model: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Registration Number *</label>
                        <input
                          type="text"
                          required
                          value={editingLeadModal.regNumber}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, regNumber: e.target.value.toUpperCase() }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono uppercase font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Registration Year *</label>
                        <input
                          type="number"
                          required
                          value={editingLeadModal.regYear}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, regYear: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono text-slate-900 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* COMMERCIALS & STATUS */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider block">Weighbridge Data &amp; Status</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Actual Weight (kg) *</label>
                        <input
                          type="number"
                          required
                          min={50}
                          value={editingLeadModal.actualWeightKg || editingLeadModal.estWeightKg}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, actualWeightKg: Number(e.target.value) }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Rate per KG (₹) *</label>
                        <input
                          type="number"
                          required
                          step={0.1}
                          value={editingLeadModal.ratePerKg}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, ratePerKg: Number(e.target.value) }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 mb-1">Workflow Status *</label>
                        <select
                          value={editingLeadModal.status}
                          onChange={e => setEditingLeadModal(prev => prev ? ({ ...prev, status: e.target.value as any }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold"
                        >
                          <option value="Registered">Registered</option>
                          <option value="Inspected & Weighed">Inspected &amp; Weighed</option>
                          <option value="Payment Transferred">Payment Transferred</option>
                          <option value="CoD Issued">CoD Issued</option>
                          <option value="Rejected / Offer Declined">Rejected / Offer Declined</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between font-bold text-emerald-950 items-center">
                      <span>Calculated Final Valuation:</span>
                      <span className="font-mono text-base font-extrabold text-emerald-800">
                        ₹{Math.round((editingLeadModal.actualWeightKg || editingLeadModal.estWeightKg) * editingLeadModal.ratePerKg).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all">
                    Save Changes &amp; Log History
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* BATCH SOCIETY MIGRATION TOOL MODAL */}
          {showSocietyMigrationModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-purple-700" />
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        Batch Society Migration &amp; Global Cleanup Tool
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Merge unverified society records into a verified registered society name
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowSocietyMigrationModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleExecuteSocietyMigration} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      1. Select Source / Unverified Society to Migrate *
                    </label>
                    <select
                      required
                      value={migrationSourceSociety}
                      onChange={e => setMigrationSourceSociety(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-bold"
                    >
                      <option value="">-- Choose unverified society name to replace --</option>
                      {Array.from(new Set([...societiesList, ...leads.map(l => l.society)])).filter(Boolean).map(soc => (
                        <option key={soc} value={soc}>{soc} ({leads.filter(l => l.society === soc).length} leads)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      2. Select Target Verified Society Name *
                    </label>
                    <select
                      required
                      value={migrationTargetSociety}
                      onChange={e => setMigrationTargetSociety(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-bold"
                    >
                      <option value="">-- Choose verified society --</option>
                      {societiesList.filter(s => s !== migrationSourceSociety).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      <option value="NEW_CUSTOM">➕ Type New Verified Society Name</option>
                    </select>
                  </div>

                  {migrationTargetSociety === 'NEW_CUSTOM' && (
                    <div>
                      <label className="block font-bold text-slate-900 mb-1">
                        Type Exact New Verified Society Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vaishnodevi Sky Co-Op Housing Society Ltd"
                        value={migrationCustomTarget}
                        onChange={e => setMigrationCustomTarget(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900"
                      />
                    </div>
                  )}

                  {migrationSourceSociety && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1 text-purple-950">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block">Impact Analysis:</span>
                      <div>Associated Vehicle Leads: <strong>{leads.filter(l => l.society === migrationSourceSociety || l.customSociety === migrationSourceSociety).length} records</strong></div>
                      <div>Associated CoDs: <strong>{codList.filter(c => c.sellerSociety && c.sellerSociety.includes(migrationSourceSociety)).length} certificates</strong></div>
                      <div>Managed Society Accounts: <strong>{managedSocieties.filter(s => s.societyName === migrationSourceSociety).length} account</strong></div>
                      <p className="text-[10px] text-purple-800 mt-1 italic">
                        Note: Once applied, "{migrationSourceSociety}" will be permanently purged from all global dropdowns, filters, and records.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!migrationSourceSociety || !migrationTargetSociety}
                    className="w-full py-3 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Execute Batch Migration &amp; Purge Old Society
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* OFFICIAL COD CERTIFICATE MODAL VIEW */}
          {viewingCodCertificate && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-300 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-700" />
                    <div>
                      <h3 className="font-extrabold text-base text-slate-950">
                        Official Certificate of Deposit (CoD)
                      </h3>
                      <span className="text-xs text-slate-500">Government of Gujarat &amp; MoRTH Authorized</span>
                    </div>
                  </div>
                  <button onClick={() => setViewingCodCertificate(null)} className="text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer">✕</button>
                </div>

                <div className="p-6 border-2 border-slate-300 rounded-2xl bg-slate-50/50 space-y-4 font-mono text-xs text-slate-900">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Certificate No:</span>
                      <strong className="text-base text-emerald-800 font-bold">{viewingCodCertificate.codNumber}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Issue Date:</span>
                      <strong className="text-slate-900">{viewingCodCertificate.issueDate}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Vehicle Model:</span>
                      <strong className="text-slate-950 text-sm">{viewingCodCertificate.vehicleModel}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Registration Number:</span>
                      <strong className="text-slate-950 text-sm">{viewingCodCertificate.vehicleReg}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-100/70 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Vehicle Year:</span>
                      <strong className="text-slate-950 text-sm font-mono">{viewingCodCertificate.vehicleYear || '2004'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">BS Emission Norms:</span>
                      <strong className="text-emerald-800 text-xs font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 inline-block">
                        {viewingCodCertificate.bsCategory || 'BS-II'}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Chassis / VIN:</span>
                      <strong className="text-slate-950">{viewingCodCertificate.chassisNo}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Engine Number:</span>
                      <strong className="text-slate-950">{viewingCodCertificate.engineNo || 'Verified at Yard'}</strong>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-[10px] text-slate-500 block">Original Vehicle Owner &amp; Resident:</span>
                    <strong className="text-slate-950 text-sm">{viewingCodCertificate.ownerName}</strong>
                    <span className="text-[11px] text-slate-600 block">{viewingCodCertificate.sellerSociety}</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-900 block font-bold">Road Tax Waiver Benefit:</span>
                      <strong className="text-emerald-800 text-base font-extrabold block">
                        {viewingCodCertificate.roadTaxWaiverPercent || 25}%
                      </strong>
                      <span className="text-[9px] text-slate-600 block leading-tight font-sans">
                        Calculated on new vehicle price
                      </span>
                    </div>

                    <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200">
                      <span className="text-[10px] text-indigo-900 block font-bold">OEM Discount Range:</span>
                      <strong className="text-indigo-900 text-xs font-bold block pt-1">
                        Min {viewingCodCertificate.oemDiscountMinPercent || 4}% – Max {viewingCodCertificate.oemDiscountMaxPercent || 6}%
                      </strong>
                      <span className="text-[9px] text-slate-600 block leading-tight font-sans mt-0.5">
                        Voluntary manufacturer discount
                      </span>
                    </div>

                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-700 block font-bold">Registration Fees:</span>
                      <strong className="text-emerald-900 text-xs font-bold block pt-1">
                        {viewingCodCertificate.registrationFeeBenefit || '100% Waived (₹0)'}
                      </strong>
                      <span className="text-[9px] text-slate-600 block leading-tight font-sans mt-0.5">
                        MoRTH CMVR Rule 115
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-[11px] font-sans">
                    <span className="text-emerald-950 font-bold">Authorized RVSF: {viewingCodCertificate.rvsfName}</span>
                    <span className="text-emerald-800 font-extrabold">DigiELV Certified</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print Certificate
                  </button>
                  <button
                    onClick={() => setViewingCodCertificate(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT PRICING & WEIGHT MODAL */}
          {editingPricingLead && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-bold text-base text-slate-900">Modify Measured Weight &amp; Rate</h3>
                  <button onClick={() => setEditingPricingLead(null)} className="text-slate-400 font-bold">✕</button>
                </div>
                <form onSubmit={handleUpdateLeadPricing} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Actual Measured Weight (kg)</label>
                    <input type="number" required min={50} value={editActualWeightInput} onChange={e => setEditActualWeightInput(Number(e.target.value))} className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">Rate per KG (₹/kg)</label>
                    <input type="number" required step={0.1} min={20} max={35} value={editRatePerKgInput} onChange={e => setEditRatePerKgInput(Number(e.target.value))} className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold" />
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between font-bold text-emerald-950">
                    <span>New Valuation Payout:</span>
                    <span className="font-mono text-sm">₹{Math.round(editActualWeightInput * editRatePerKgInput).toLocaleString('en-IN')}</span>
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md">Update Valuation &amp; Log History</button>
                </form>
              </div>
            </div>
          )}

          {/* LEAD DETAIL VIEW & HISTORY MODAL */}
          {activeLeadModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-bold text-base text-slate-900">Lead Detail &amp; Status Change Log</h3>
                  <button onClick={() => setActiveLeadModal(null)} className="text-slate-400 font-bold">✕</button>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl space-y-2 font-mono">
                    <p><strong>Token ID:</strong> <span className="text-emerald-700 font-bold">{activeLeadModal.tokenId}</span></p>
                    <p><strong>Owner:</strong> {activeLeadModal.ownerName} ({activeLeadModal.society}, {activeLeadModal.flatNo})</p>
                    <div className="flex items-center gap-2 flex-wrap pt-0.5 pb-0.5">
                      <strong>Customer Mobile:</strong> 
                      <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border">{activeLeadModal.mobile}</span>
                      {activeLeadModal.mobile && activeLeadModal.mobile !== 'N/A (Society Resolution)' && (
                        <>
                          <a
                            href={`tel:${activeLeadModal.mobile.replace(/[^0-9]/g, '')}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer"
                          >
                            <Phone className="w-3 h-3" /> Call
                          </a>
                          <a
                            href={`https://wa.me/91${activeLeadModal.mobile.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${activeLeadModal.ownerName}, regarding your scrap vehicle registration ${activeLeadModal.tokenId} at Shree Ambica Automotive.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </a>
                        </>
                      )}
                    </div>
                    <p><strong>Vehicle:</strong> {activeLeadModal.brand} {activeLeadModal.model} ({activeLeadModal.regNumber})</p>
                    <p><strong>Valuation:</strong> ₹{activeLeadModal.estPayout.toLocaleString('en-IN')} ({activeLeadModal.actualWeightKg || activeLeadModal.estWeightKg}kg @ ₹{activeLeadModal.ratePerKg}/kg)</p>
                  </div>
                  <h4 className="font-bold text-slate-900 border-b pb-1">Status Transition History</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(activeLeadModal.statusHistory || []).map(h => (
                      <div key={h.id} className="p-2.5 bg-slate-100 rounded-lg border text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{h.fromStatus} → {h.toStatus}</span>
                          <span className="text-slate-500 font-normal">{h.timestamp}</span>
                        </div>
                        <p className="text-slate-600">{h.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ADD SOCIETY MODAL */}
      {showAddSocietyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Society to Scrappage Drive</h3>
              <button onClick={() => setShowAddSocietyModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddSociety} className="space-y-4">
              <input
                type="text"
                required
                placeholder="e.g. Royal Heights, Vaishnodevi Road"
                value={newSocietyInput}
                onChange={(e) => setNewSocietyInput(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900"
              />
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                Add Society
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 5: PLATFORM ADMIN (GOD ADMIN) OWNER PORTAL */}
      {activeTab === 'godAdmin' && (
        <main className="grow max-w-6xl mx-auto px-4 py-8 space-y-8 w-full">
          <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 border border-slate-800">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-extrabold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-500 uppercase tracking-widest inline-flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" /> Platform Owner / GOD Admin
              </span>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500 uppercase tracking-widest inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Full Access Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Platform Admin (GOD Admin) Account Management Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Super Admin Control: Create, edit, modify, and delete login credentials for Society Committees and Authorized RVSF Vendors. Monitor onboarding progress and platform data.
            </p>
          </div>

          {!isGodAdminAuthenticated ? (
            /* GOD ADMIN SIGN IN FORM */
            <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-xl space-y-4">
              <div className="text-center border-b pb-3 space-y-1">
                <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-6 h-6 text-amber-700" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-950">GOD Admin Authentication</h2>
                <p className="text-xs text-slate-600 font-medium">Platform Owner credentials required</p>
              </div>

              {godAdminAuthError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl">
                  {godAdminAuthError}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (godAdminEmailInput.trim().toLowerCase() === 'suratflat@gmail.com' && godAdminPasswordInput === '@shish123') {
                    setIsGodAdminAuthenticated(true);
                    localStorage.setItem('vnd_god_admin_auth', 'true');
                    setGodAdminAuthError('');
                  } else {
                    setGodAdminAuthError('Invalid GOD Admin Email or Password.');
                  }
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">GOD Admin Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={godAdminEmailInput}
                    onChange={e => setGodAdminEmailInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 font-mono font-bold text-slate-950"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-slate-950 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={godAdminPasswordInput}
                    onChange={e => setGodAdminPasswordInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 font-bold text-slate-950"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all">
                  Sign In GOD Admin Portal
                </button>
              </form>
            </div>
          ) : (
            /* GOD ADMIN DASHBOARD & ACCOUNTS CRUD */
            <div className="space-y-8">
              {/* SYSTEM OVERVIEW METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
                  <div className="text-2xl font-extrabold text-amber-700 font-mono">{managedSocieties.length}</div>
                  <div className="text-xs text-slate-700 font-bold mt-1">Managed Society Logins</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
                  <div className="text-2xl font-extrabold text-amber-700 font-mono">{managedVendors.length}</div>
                  <div className="text-xs text-slate-700 font-bold mt-1">Managed Vendor Partners</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
                  <div className="text-2xl font-extrabold text-amber-700 font-mono">{leads.length}</div>
                  <div className="text-xs text-slate-700 font-bold mt-1">Total Scrap Vehicles Registered</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs">
                  <button
                    onClick={() => {
                      setIsGodAdminAuthenticated(false);
                      localStorage.removeItem('vnd_god_admin_auth');
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl transition-all"
                  >
                    Logout GOD Admin
                  </button>
                </div>
              </div>

              {/* MANAGED SOCIETY ACCOUNTS CRUD */}
              <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-700" /> Managed Housing Society Committee Accounts
                    </h2>
                    <p className="text-xs text-slate-600 font-medium">Create and edit logins for Society Chairmen (Pramukh) and Secretaries with complete profile data</p>
                  </div>
                  <button
                    onClick={handleOpenCreateSociety}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" /> + Create New Society Login
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 font-bold border-b text-slate-900">
                      <tr>
                        <th className="p-3">Society Name &amp; Reg No</th>
                        <th className="p-3">Address &amp; District</th>
                        <th className="p-3">Login Email / Password</th>
                        <th className="p-3">Chairman &amp; Secretary</th>
                        <th className="p-3">First Login Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {managedSocieties.map(acc => (
                        <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-slate-950">
                            <div>{acc.societyName}</div>
                            <span className="text-[10px] font-mono text-slate-600">Reg: {acc.regNo}</span>
                          </td>
                          <td className="p-3 text-slate-700 max-w-xs">
                            <div className="truncate">{acc.address}</div>
                            <span className="text-[10px] text-slate-500 font-bold">{acc.district}</span>
                          </td>
                          <td className="p-3 font-mono">
                            <div className="font-bold text-slate-900">{acc.loginEmail}</div>
                            <span className="text-[10px] text-slate-500">Pass: {acc.password}</span>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-900 font-bold">Ch: {acc.chairmanName} ({acc.chairmanMobile})</div>
                            <div className="text-slate-600 text-[10px]">Sec: {acc.secretaryName} ({acc.secretaryMobile})</div>
                          </td>
                          <td className="p-3">
                            {acc.isFirstLoginCompleted ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-extrabold text-[10px] rounded border border-emerald-300">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-950 font-extrabold text-[10px] rounded border border-amber-300">
                                Pending First Login Setup
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditSociety(acc)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-[11px] rounded-lg border border-slate-300 cursor-pointer transition-all"
                            >
                              Edit Profile
                            </button>
                            <button
                              onClick={() => handleDeleteSocietyAccount(acc.id, acc.societyName)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-900 font-bold text-[11px] rounded-lg border border-red-200 cursor-pointer transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MANAGED VENDOR ACCOUNTS CRUD */}
              <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                      <UserCog className="w-5 h-5 text-amber-700" /> Managed RVSF Vendor Accounts
                    </h2>
                    <p className="text-xs text-slate-600 font-medium">Create and edit logins for Authorized Vehicle Scrapper Partners with complete yard credentials</p>
                  </div>
                  <button
                    onClick={handleOpenCreateVendor}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" /> + Create New Vendor Login
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 font-bold border-b text-slate-900">
                      <tr>
                        <th className="p-3">Vendor Official Name &amp; RVSF No</th>
                        <th className="p-3">Yard Address &amp; Mobile</th>
                        <th className="p-3">Contact Person &amp; GSTIN</th>
                        <th className="p-3">Login Email / Password</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {managedVendors.map(v => (
                        <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-slate-950">
                            <div>{v.vendorName}</div>
                            <span className="text-[10px] font-mono text-slate-600">RVSF Reg: {v.rvsfRegNo}</span>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-900 font-medium max-w-xs truncate">{v.address}</div>
                            <span className="text-[10px] font-mono font-bold text-emerald-800">Phone: {v.mobile}</span>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-900 font-bold">{v.contactPerson}</div>
                            <span className="text-[10px] font-mono text-slate-600">GST: {v.gstin}</span>
                          </td>
                          <td className="p-3 font-mono">
                            <div className="font-bold text-slate-900">{v.loginEmail}</div>
                            <span className="text-[10px] text-slate-500">Pass: {v.password}</span>
                          </td>
                          <td className="p-3">
                            {v.isFirstLoginCompleted ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-extrabold text-[10px] rounded border border-emerald-300">
                                Active Partner
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-950 font-extrabold text-[10px] rounded border border-amber-300">
                                Pending Profile Setup
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditVendor(v)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-[11px] rounded-lg border border-slate-300 cursor-pointer transition-all"
                            >
                              Edit Profile
                            </button>
                            <button
                              onClick={() => handleDeleteVendorAccount(v.id, v.vendorName)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-900 font-bold text-[11px] rounded-lg border border-red-200 cursor-pointer transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* REGISTERED CITIZEN USERS & VEHICLES MANAGEMENT (GOD ADMIN) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-700" /> Platform Registered Users &amp; Vehicle Records ({leads.length})
                    </h2>
                    <p className="text-xs text-slate-600 font-medium">
                      Super Admin capabilities: View, search, edit user profile details, contact info, vehicle specs, weight/rate, and status across all societies
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      placeholder="Search user, mobile, reg no..."
                      value={godUserSearch}
                      onChange={e => setGodUserSearch(e.target.value)}
                      className="text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 w-48 font-medium"
                    />
                    <select
                      value={godUserSocietyFilter}
                      onChange={e => setGodUserSocietyFilter(e.target.value)}
                      className="text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                    >
                      <option value="ALL">All Societies</option>
                      {societiesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 font-bold border-b text-slate-900">
                      <tr>
                        <th className="p-3">User / Token</th>
                        <th className="p-3">Contact Mobile</th>
                        <th className="p-3">Society &amp; Flat</th>
                        <th className="p-3">Vehicle Details</th>
                        <th className="p-3">Weight &amp; Valuation</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {leads
                        .filter(l => {
                          const matchSearch = (l.ownerName || '').toLowerCase().includes(godUserSearch.toLowerCase()) ||
                                              (l.mobile || '').includes(godUserSearch) ||
                                              (l.regNumber || '').toLowerCase().includes(godUserSearch.toLowerCase()) ||
                                              (l.tokenId || '').toLowerCase().includes(godUserSearch.toLowerCase());
                          const matchSoc = godUserSocietyFilter === 'ALL' || l.society === godUserSocietyFilter;
                          return matchSearch && matchSoc;
                        })
                        .map(lead => (
                          <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <strong className="block text-slate-950 font-bold">{lead.ownerName}</strong>
                              <span className="font-mono text-[10px] text-emerald-800 font-bold">{lead.tokenId}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-mono font-bold text-slate-900 block">{lead.mobile}</span>
                              {lead.mobile && lead.mobile !== 'N/A (Society Resolution)' && (
                                <div className="flex items-center gap-1 mt-1">
                                  <a href={`tel:${lead.mobile.replace(/[^0-9]/g, '')}`} className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] rounded font-bold inline-flex items-center gap-1 cursor-pointer">
                                    <Phone className="w-2.5 h-2.5" /> Call
                                  </a>
                                  <a href={`https://wa.me/91${lead.mobile.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${lead.ownerName}, message from Platform Admin regarding your vehicle ${lead.brand} ${lead.model} (${lead.regNumber}).`)}`} target="_blank" rel="noopener noreferrer" className="px-1.5 py-0.5 bg-green-600 hover:bg-green-700 text-white text-[10px] rounded font-bold inline-flex items-center gap-1 cursor-pointer">
                                    <MessageSquare className="w-2.5 h-2.5" /> WhatsApp
                                  </a>
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-900">{lead.society}</div>
                              <span className="text-[10px] text-slate-600 font-medium">Flat: {lead.flatNo}</span>
                            </td>
                            <td className="p-3">
                              <div className="text-slate-900 font-semibold">{lead.brand} {lead.model}</div>
                              <span className="font-mono text-[10px] text-slate-600">{lead.regNumber} ({lead.category})</span>
                            </td>
                            <td className="p-3">
                              <div className="font-mono font-bold text-slate-900">{lead.actualWeightKg || lead.estWeightKg} kg</div>
                              <span className="font-mono text-emerald-800 font-extrabold text-[11px]">₹{lead.estPayout.toLocaleString('en-IN')}</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800 border">
                                {lead.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditUser(lead)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-[11px] rounded-lg border border-amber-300 cursor-pointer transition-all inline-flex items-center gap-1"
                              >
                                Edit User
                              </button>
                              <button
                                onClick={() => handleDeleteUserLead(lead.id, lead.ownerName)}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-900 font-bold text-[11px] rounded-lg border border-red-200 cursor-pointer transition-all"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* GOD ADMIN MODAL: CREATE / EDIT SOCIETY COMMITTEE ACCOUNT */}
          {showSocietyModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-300 space-y-4 my-8">
                <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-700" />
                    <h3 className="font-extrabold text-base text-slate-950">
                      {societyModalMode === 'create' ? 'Create New Housing Society Login' : 'Edit Society Committee Profile & Credentials'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {societyModalMode === 'create' && (
                      <button
                        type="button"
                        onClick={handleAutoSuggestSocietyData}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] rounded-lg border border-amber-300 transition-all cursor-pointer"
                      >
                        ⚡ Auto-Suggest Sample Info
                      </button>
                    )}
                    <button onClick={() => setShowSocietyModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
                  </div>
                </div>

                <form onSubmit={handleSaveSocietyAccount} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Society Registered Official Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vaishnodevi Sky Co-Op Housing Society Ltd."
                      value={societyFormData.societyName}
                      onChange={e => setSocietyFormData(prev => ({ ...prev, societyName: e.target.value }))}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Registration Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="SUR/HSG/2012/9904"
                        value={societyFormData.regNo}
                        onChange={e => setSocietyFormData(prev => ({ ...prev, regNo: e.target.value }))}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">District / RTO Jurisdiction *</label>
                      <input
                        type="text"
                        required
                        placeholder="RTO Surat (GJ-05)"
                        value={societyFormData.district}
                        onChange={e => setSocietyFormData(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Society Registered Full Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Vaishnodevi Road, Jahangirpura, Surat - 395005"
                      value={societyFormData.address}
                      onChange={e => setSocietyFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-medium"
                    />
                  </div>

                  {/* CREDENTIALS SECTION */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                    <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wider block">
                      Account Login Credentials
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-extrabold text-slate-950 mb-1">Login Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="society.name@gujarat.gov.in"
                          value={societyFormData.loginEmail}
                          onChange={e => setSocietyFormData(prev => ({ ...prev, loginEmail: e.target.value }))}
                          className="w-full p-2 border border-slate-400 rounded-xl bg-white text-slate-950 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block font-extrabold text-slate-950">Password *</label>
                          <button
                            type="button"
                            onClick={() => setShowSocPassword(!showSocPassword)}
                            className="text-[10px] text-amber-900 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            {showSocPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {showSocPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <input
                          type={showSocPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={societyFormData.password}
                          onChange={e => setSocietyFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full p-2 border border-slate-400 rounded-xl bg-white text-slate-950 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* COMMITTEE BEARERS DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Chairman (Pramukh) Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Manishbhai Patel"
                        value={societyFormData.chairmanName}
                        onChange={e => setSocietyFormData(prev => ({ ...prev, chairmanName: e.target.value }))}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Chairman Mobile (Strictly 10-Digit)</label>
                      <input
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        placeholder="9825000000"
                        value={societyFormData.chairmanMobile}
                        onChange={e => setSocietyFormData(prev => ({ ...prev, chairmanMobile: formatMobile10(e.target.value) }))}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Secretary Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Bhavin Mehta"
                        value={societyFormData.secretaryName}
                        onChange={e => setSocietyFormData(prev => ({ ...prev, secretaryName: e.target.value }))}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Secretary Mobile (Strictly 10-Digit)</label>
                      <input
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        placeholder="9898000000"
                        value={societyFormData.secretaryMobile}
                        onChange={e => setSocietyFormData(prev => ({ ...prev, secretaryMobile: formatMobile10(e.target.value) }))}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="socFirstLoginToggle"
                      checked={societyFormData.isFirstLoginCompleted}
                      onChange={e => setSocietyFormData(prev => ({ ...prev, isFirstLoginCompleted: e.target.checked }))}
                      className="accent-amber-600 rounded"
                    />
                    <label htmlFor="socFirstLoginToggle" className="font-bold text-slate-800 cursor-pointer text-xs">
                      Mark First-Login Key Data as Completed
                    </label>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setShowSocietyModal(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {societyModalMode === 'create' ? 'Create Society Login' : 'Save Society Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* GOD ADMIN MODAL: CREATE / EDIT VENDOR ACCOUNT */}
          {showVendorModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-300 space-y-4 my-8">
                <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-amber-700" />
                    <h3 className="font-extrabold text-base text-slate-950">
                      {vendorModalMode === 'create' ? 'Create New RVSF Vendor Login' : 'Edit Vendor Partner Profile & Credentials'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {vendorModalMode === 'create' && (
                      <button
                        type="button"
                        onClick={handleAutoSuggestVendorData}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] rounded-lg border border-amber-300 transition-all cursor-pointer"
                      >
                        ⚡ Auto-Suggest Sample Info
                      </button>
                    )}
                    <button onClick={() => setShowVendorModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
                  </div>
                </div>

                <form onSubmit={handleSaveVendorAccount} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Vendor Official Enterprise Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SHREE AMBICA AUTOMOTIVE PVT LTD"
                      value={vendorFormData.vendorName}
                      onChange={e => setVendorFormData(prev => ({ ...prev, vendorName: e.target.value }))}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">RVSF Authorization Reg No *</label>
                      <input
                        type="text"
                        required
                        placeholder="GJ-RVSF-SURAT-004"
                        value={vendorFormData.rvsfRegNo}
                        onChange={e => setVendorFormData(prev => ({ ...prev, rvsfRegNo: e.target.value }))}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">GSTIN Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="24AAAAA0000A1Z5"
                        value={vendorFormData.gstin}
                        onChange={e => setVendorFormData(prev => ({ ...prev, gstin: e.target.value }))}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Yard / Registered Office Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="PLOT NO 122 TOLL NAKA, B K AMBICA TATA, AMBOLI, KAMREJ, SURAT-394180"
                      value={vendorFormData.address}
                      onChange={e => setVendorFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-medium"
                    />
                  </div>

                  {/* CREDENTIALS SECTION */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                    <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wider block">
                      Vendor Portal Credentials
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-extrabold text-slate-950 mb-1">Login Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="vendor@ambica.com"
                          value={vendorFormData.loginEmail}
                          onChange={e => setVendorFormData(prev => ({ ...prev, loginEmail: e.target.value }))}
                          className="w-full p-2 border border-slate-400 rounded-xl bg-white text-slate-950 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block font-extrabold text-slate-950">Password *</label>
                          <button
                            type="button"
                            onClick={() => setShowVndPassword(!showVndPassword)}
                            className="text-[10px] text-amber-900 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            {showVndPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {showVndPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <input
                          type={showVndPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={vendorFormData.password}
                          onChange={e => setVendorFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full p-2 border border-slate-400 rounded-xl bg-white text-slate-950 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CONTACT PERSON */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Yard Director / Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yard Director & Operations"
                        value={vendorFormData.contactPerson}
                        onChange={e => setVendorFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Contact Mobile Number (Strictly 10-Digit) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        placeholder="7043493333"
                        value={vendorFormData.mobile}
                        onChange={e => setVendorFormData(prev => ({ ...prev, mobile: formatMobile10(e.target.value) }))}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="vndFirstLoginToggle"
                      checked={vendorFormData.isFirstLoginCompleted}
                      onChange={e => setVendorFormData(prev => ({ ...prev, isFirstLoginCompleted: e.target.checked }))}
                      className="accent-amber-600 rounded"
                    />
                    <label htmlFor="vndFirstLoginToggle" className="font-bold text-slate-800 cursor-pointer text-xs">
                      Mark First-Login Key Data as Completed
                    </label>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setShowVendorModal(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {vendorModalMode === 'create' ? 'Create Vendor Login' : 'Save Vendor Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* GOD ADMIN MODAL: EDIT REGISTERED CITIZEN USER & VEHICLE RECORD */}
          {editingUserLead && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-300 space-y-4 my-8">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-amber-700" />
                    <div>
                      <h3 className="font-extrabold text-base text-slate-950">
                        Edit Registered Citizen User &amp; Vehicle
                      </h3>
                      <span className="text-[11px] font-mono text-emerald-800 font-bold">
                        Token ID: {editingUserLead.tokenId}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setEditingUserLead(null)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
                </div>

                <form onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
                  {/* USER PERSONAL DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Owner Full Name *</label>
                      <input
                        type="text"
                        required
                        value={editingUserLead.ownerName}
                        onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, ownerName: e.target.value }) : null)}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Customer Mobile Number (Strictly 10-Digit) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        value={editingUserLead.mobile}
                        onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, mobile: formatMobile10(e.target.value) }) : null)}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* SOCIETY & FLAT */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Housing Society *</label>
                      <input
                        type="text"
                        required
                        value={editingUserLead.society}
                        onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, society: e.target.value }) : null)}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Flat / Wing No *</label>
                      <input
                        type="text"
                        required
                        value={editingUserLead.flatNo}
                        onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, flatNo: e.target.value }) : null)}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                      />
                    </div>
                  </div>

                  {/* VEHICLE SPECS */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider block">
                      Vehicle Specifications
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-950 mb-1">Category</label>
                        <select
                          value={editingUserLead.category}
                          onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, category: e.target.value as '2W' | '4W' }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold"
                        >
                          <option value="4W">4-Wheeler</option>
                          <option value="2W">2-Wheeler</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-950 mb-1">Brand</label>
                        <input
                          type="text"
                          required
                          value={editingUserLead.brand}
                          onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, brand: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-950 mb-1">Model</label>
                        <input
                          type="text"
                          required
                          value={editingUserLead.model}
                          onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, model: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-950 mb-1">Registration Number *</label>
                        <input
                          type="text"
                          required
                          value={editingUserLead.regNumber}
                          onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, regNumber: e.target.value.toUpperCase() }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-950 mb-1">Registration Year</label>
                        <input
                          type="text"
                          value={editingUserLead.regYear}
                          onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, regYear: e.target.value }) : null)}
                          className="w-full p-2 border border-slate-300 rounded-xl bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* WEIGHT, RATE & STATUS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-950 mb-1">Measured Weight (kg)</label>
                      <input
                        type="number"
                        min={50}
                        value={editingUserLead.actualWeightKg || editingUserLead.estWeightKg}
                        onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, actualWeightKg: Number(e.target.value) }) : null)}
                        className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-950 mb-1">Rate per KG (₹/kg)</label>
                      <input
                        type="number"
                        step={0.1}
                        min={20}
                        max={35}
                        value={editingUserLead.ratePerKg}
                        onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, ratePerKg: Number(e.target.value) }) : null)}
                        className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-950 mb-1">Current Status</label>
                      <select
                        value={editingUserLead.status}
                        onChange={e => setEditingUserLead(prev => prev ? ({ ...prev, status: e.target.value as any }) : null)}
                        className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                      >
                        <option value="Registered">Registered</option>
                        <option value="Inspected & Weighed">Inspected &amp; Weighed</option>
                        <option value="Payment Transferred">Payment Transferred</option>
                        <option value="CoD Issued">CoD Issued</option>
                        <option value="Rejected / Offer Declined">Rejected / Offer Declined</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between font-bold text-emerald-950">
                    <span>Recalculated Cash Payout:</span>
                    <span className="font-mono text-sm">
                      ₹{Math.round(((editingUserLead.actualWeightKg || editingUserLead.estWeightKg) || 0) * (editingUserLead.ratePerKg || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setEditingUserLead(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Save User Record Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* FIRST LOGIN SOCIETY SETUP MODAL */}
          {showSocietyFirstLoginModal && firstLoginSociety && (
            <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-300 space-y-4 my-8">
                <div className="border-b pb-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-extrabold text-base text-slate-950">First-Time Society Profile Setup</h3>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    As required on your first login, please complete and verify the key official details for your society.
                  </p>
                </div>

                <form onSubmit={handleSaveSocietyFirstLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Society Registered Official Name *</label>
                    <input
                      type="text"
                      required
                      value={firstLoginSociety.societyName}
                      onChange={e => setFirstLoginSociety(prev => prev ? ({ ...prev, societyName: e.target.value }) : null)}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Registration Number *</label>
                      <input
                        type="text"
                        required
                        value={firstLoginSociety.regNo}
                        onChange={e => setFirstLoginSociety(prev => prev ? ({ ...prev, regNo: e.target.value }) : null)}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">District / Jurisdiction *</label>
                      <input
                        type="text"
                        required
                        value={firstLoginSociety.district}
                        onChange={e => setFirstLoginSociety(prev => prev ? ({ ...prev, district: e.target.value }) : null)}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Society Registered Full Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={firstLoginSociety.address}
                      onChange={e => setFirstLoginSociety(prev => prev ? ({ ...prev, address: e.target.value }) : null)}
                      placeholder="Plot No., Road, Area, Surat - Pincode"
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Chairman / Pramukh Name *</label>
                      <input
                        type="text"
                        required
                        value={firstLoginSociety.chairmanName}
                        onChange={e => setFirstLoginSociety(prev => prev ? ({ ...prev, chairmanName: e.target.value }) : null)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Chairman Mobile (Strictly 10-Digit) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        value={firstLoginSociety.chairmanMobile}
                        onChange={e => setFirstLoginSociety(prev => prev ? ({ ...prev, chairmanMobile: formatMobile10(e.target.value) }) : null)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Secretary Name *</label>
                      <input
                        type="text"
                        required
                        value={firstLoginSociety.secretaryName}
                        onChange={e => setFirstLoginSociety(prev => prev ? ({ ...prev, secretaryName: e.target.value }) : null)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Secretary Mobile (Strictly 10-Digit) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        value={firstLoginSociety.secretaryMobile}
                        onChange={e => setFirstLoginSociety(prev => prev ? ({ ...prev, secretaryMobile: formatMobile10(e.target.value) }) : null)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSocietyFirstLoginModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
                    >
                      Save &amp; Enter Committee Portal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* FIRST LOGIN VENDOR SETUP MODAL */}
          {showVendorFirstLoginModal && firstLoginVendor && (
            <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-300 space-y-4 my-8">
                <div className="border-b pb-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-extrabold text-base text-slate-950">First-Time Vendor Profile Setup</h3>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Please complete and confirm your official RVSF yard and authorization credentials.
                  </p>
                </div>

                <form onSubmit={handleSaveVendorFirstLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Vendor Enterprise Name *</label>
                    <input
                      type="text"
                      required
                      value={firstLoginVendor.vendorName}
                      onChange={e => setFirstLoginVendor(prev => prev ? ({ ...prev, vendorName: e.target.value }) : null)}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">RVSF Authorization Reg No *</label>
                      <input
                        type="text"
                        required
                        value={firstLoginVendor.rvsfRegNo}
                        onChange={e => setFirstLoginVendor(prev => prev ? ({ ...prev, rvsfRegNo: e.target.value }) : null)}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">GSTIN Number *</label>
                      <input
                        type="text"
                        required
                        value={firstLoginVendor.gstin}
                        onChange={e => setFirstLoginVendor(prev => prev ? ({ ...prev, gstin: e.target.value }) : null)}
                        className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Yard / Registered Office Full Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={firstLoginVendor.address}
                      onChange={e => setFirstLoginVendor(prev => prev ? ({ ...prev, address: e.target.value }) : null)}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Director / Contact Person *</label>
                      <input
                        type="text"
                        required
                        value={firstLoginVendor.contactPerson}
                        onChange={e => setFirstLoginVendor(prev => prev ? ({ ...prev, contactPerson: e.target.value }) : null)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Contact Mobile Number (Strictly 10-Digit) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        value={firstLoginVendor.mobile}
                        onChange={e => setFirstLoginVendor(prev => prev ? ({ ...prev, mobile: formatMobile10(e.target.value) }) : null)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 text-slate-950 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVendorFirstLoginModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
                    >
                      Save &amp; Enter Vendor Portal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EDIT SOCIETY PROFILE MODAL FOR LOGGED-IN OFFICERS */}
          {showEditSocietyProfileModal && currentOfficer && (
            <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-300 space-y-4 my-8">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-extrabold text-base text-slate-950">Update Society Profile &amp; Bearers</h3>
                  </div>
                  <button onClick={() => setShowEditSocietyProfileModal(false)} className="text-slate-400 font-bold">✕</button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setManagedSocieties(prev => prev.map(s => {
                    if (s.id === currentOfficer.accountId || s.societyName === currentOfficer.societyName) {
                      return {
                        ...s,
                        societyName: nocSocietyName,
                        regNo: nocSocietyRegNo,
                        chairmanName: nocChairmanName,
                        secretaryName: nocSecretaryName
                      };
                    }
                    return s;
                  }));
                  setCurrentOfficer(prev => prev ? ({
                    ...prev,
                    societyName: nocSocietyName,
                    societyRegNo: nocSocietyRegNo,
                    name: prev.designation === 'Secretary' ? nocSecretaryName : nocChairmanName
                  }) : null);
                  setShowEditSocietyProfileModal(false);
                  alert('Society details updated successfully!');
                }} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Society Registered Name *</label>
                    <input
                      type="text"
                      required
                      value={nocSocietyName}
                      onChange={e => setNocSocietyName(e.target.value)}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 font-bold text-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-slate-950 mb-1">Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={nocSocietyRegNo}
                      onChange={e => setNocSocietyRegNo(e.target.value)}
                      className="w-full p-2.5 border border-slate-400 rounded-xl bg-slate-50 font-mono font-bold text-slate-950"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Chairman / Pramukh *</label>
                      <input
                        type="text"
                        required
                        value={nocChairmanName}
                        onChange={e => setNocChairmanName(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-semibold text-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Chairman ID Proof</label>
                      <input
                        type="text"
                        value={nocChairmanIdProof}
                        onChange={e => setNocChairmanIdProof(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-mono text-slate-950"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Secretary Name *</label>
                      <input
                        type="text"
                        required
                        value={nocSecretaryName}
                        onChange={e => setNocSecretaryName(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-semibold text-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block font-extrabold text-slate-950 mb-1">Secretary ID Proof</label>
                      <input
                        type="text"
                        value={nocSecretaryIdProof}
                        onChange={e => setNocSecretaryIdProof(e.target.value)}
                        className="w-full p-2 border border-slate-400 rounded-xl bg-slate-50 font-mono text-slate-950"
                      />
                    </div>
                  </div>
                  <div className="pt-3 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEditSocietyProfileModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-800 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      )}

      {/* GLOBAL IN-APP DELETE CONFIRMATION MODAL (Restores Delete Across Society, Vendor, & God Admin Panels) */}
      {confirmDeleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-100 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="grow">
                <h3 className="font-extrabold text-base text-slate-950">
                  {confirmDeleteModal.title || 'Confirm Deletion'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {confirmDeleteModal.message}
                </p>
              </div>
            </div>

            {confirmDeleteModal.itemDetails && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-800 break-all">
                {confirmDeleteModal.itemDetails}
              </div>
            )}

            <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 flex items-center gap-2 text-[11px] text-amber-900 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Warning: This administrative action is permanent and cannot be undone.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDeleteModal.onConfirm()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmDeleteModal.confirmLabel || 'Permanently Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 text-slate-400 text-xs py-6 text-center border-t border-slate-800 mt-12 shrink-0 space-y-1">
        <p className="font-extrabold text-slate-200">Gujarat Vehicle Scrappage Policy &amp; Society RTO NOC Portal · SHREE AMBICA AUTOMOTIVE PVT LTD (Govt Authorized RVSF)</p>
        <p className="text-[11px] text-slate-500 font-mono">Registered Office &amp; Yard: PLOT NO 122 TOLL NAKA, B K AMBICA TATA, AMBOLI, KAMREJ, SURAT-394180 · Contact Mobile: 7043493333</p>
      </footer>

    </div>
  );
}
