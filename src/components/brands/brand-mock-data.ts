// ==============================================================================
// EKA GROWTH OS — BRAND INTELLIGENCE & ADVERTISING DATA ENGINE
// ==============================================================================

export interface BrandProfile {
  id: string;
  name: string;
  category: string;
  avatar: string;
  monthlyBudget: number;
  totalSpent: number;
  totalReach: string;
  avgEngagement: string;
  conversions: number;
  roas: string;
}

export const ACTIVE_BRANDS: BrandProfile[] = [
  {
    id: "fabindia",
    name: "FabIndia Living",
    category: "Sustainable Handloom & Home",
    avatar: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=120&auto=format&fit=crop&q=80",
    monthlyBudget: 350000,
    totalSpent: 242800,
    totalReach: "1.84M",
    avgEngagement: "8.4%",
    conversions: 4820,
    roas: "4.2×",
  },
  {
    id: "forest-essentials",
    name: "Forest Essentials",
    category: "Ayurvedic Luxury Wellness",
    avatar: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=120&auto=format&fit=crop&q=80",
    monthlyBudget: 500000,
    totalSpent: 384000,
    totalReach: "2.65M",
    avgEngagement: "9.1%",
    conversions: 7120,
    roas: "4.8×",
  },
  {
    id: "nicobar",
    name: "Nicobar Modern Indic",
    category: "Contemporary Cultural Aesthetics",
    avatar: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=120&auto=format&fit=crop&q=80",
    monthlyBudget: 250000,
    totalSpent: 168000,
    totalReach: "1.12M",
    avgEngagement: "7.9%",
    conversions: 3240,
    roas: "3.9×",
  },
];

export interface Campaign {
  id: string;
  title: string;
  format: "short_video_reel" | "story_card" | "creator_collab" | "collection_sponsor";
  objective: "Reach & Awareness" | "TG Engagement" | "Product Conversions" | "Video Views";
  status: "active" | "scheduled" | "completed" | "paused";
  thumbnail: string;
  videoDuration?: string;
  spend: number;
  budget: number;
  reach: string;
  engagementRate: string;
  conversions: number;
  ctr: string;
  cpa: string;
  tgSegment: string;
  roas: string;
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-01",
    title: "Varanasi Silk: The Sacred Loom Series",
    format: "short_video_reel",
    objective: "Video Views",
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    videoDuration: "0:28",
    spend: 84500,
    budget: 120000,
    reach: "680K",
    engagementRate: "9.8%",
    conversions: 1840,
    ctr: "3.4%",
    cpa: "₹45.90",
    tgSegment: "Conscious Urban Indic (24-38)",
    roas: "4.6×",
  },
  {
    id: "camp-02",
    title: "Temple Brassware Ritual Aesthetics",
    format: "short_video_reel",
    objective: "Product Conversions",
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    videoDuration: "0:34",
    spend: 72000,
    budget: 100000,
    reach: "540K",
    engagementRate: "8.6%",
    conversions: 1420,
    ctr: "2.9%",
    cpa: "₹50.70",
    tgSegment: "Mindful Home Seekers (26-45)",
    roas: "4.1×",
  },
  {
    id: "camp-03",
    title: "Sacred Geometry Living Spaces",
    format: "story_card",
    objective: "TG Engagement",
    status: "scheduled",
    thumbnail: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=600&auto=format&fit=crop&q=80",
    spend: 0,
    budget: 65000,
    reach: "Pending",
    engagementRate: "—",
    conversions: 0,
    ctr: "—",
    cpa: "—",
    tgSegment: "Architecture & Heritage Aficionados",
    roas: "—",
  },
  {
    id: "camp-04",
    title: "Kumaon Artisan Herbal Teas",
    format: "creator_collab",
    objective: "Reach & Awareness",
    status: "completed",
    thumbnail: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    spend: 86300,
    budget: 85000,
    reach: "620K",
    engagementRate: "7.4%",
    conversions: 1560,
    ctr: "2.6%",
    cpa: "₹55.30",
    tgSegment: "Gen Z Mindful Living (18-24)",
    roas: "3.8×",
  },
];

export interface AudienceSegment {
  id: string;
  name: string;
  demographic: string;
  size: string;
  growth: string;
  affinityScore: number; // 0-100
  whoTheyAre: string;
  whatTheyCareAbout: string[];
  whatTheyWatch: string[];
  whatTheyEngageWith: string[];
  topProductsInterested: string[];
  bestFormat: string;
  bestTime: string;
}

export const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: "seg-01",
    name: "Conscious Urban Indic",
    demographic: "24–38 yrs • Metros & Tier 1 (BLR, BOM, DEL, HYD)",
    size: "840K",
    growth: "+24% MoM",
    affinityScore: 94,
    whoTheyAre: "Tech and creative professionals rediscovering Indic roots, natural living, and mindful spatial design.",
    whatTheyCareAbout: ["Fair-trade artisanal pay", "Non-synthetic raw materials", "Sacred home sanctuaries", "Traceable craftsmanship"],
    whatTheyWatch: ["Varanasi loom macro-shots", "Morning dhyana spaces", "Terracotta pottery techniques"],
    whatTheyEngageWith: ["Artisan Q&A livestreams", "Living room ritual tours", "Epistemic source cards"],
    topProductsInterested: ["Organic Khadi throws", "Kansa bronze serveware", "Handmade dhoop cones"],
    bestFormat: "Vertical Short-Form Video (20–40s)",
    bestTime: "8:00 PM – 10:30 PM IST",
  },
  {
    id: "seg-02",
    name: "Gen Z Mindful Living",
    demographic: "18–24 yrs • Pan-India + Tier 2 College Towns",
    size: "580K",
    growth: "+38% MoM",
    affinityScore: 89,
    whoTheyAre: "Students and young professionals seeking calm, digital detox, aesthetic meditation nooks, and soundscapes.",
    whatTheyCareAbout: ["Mental wellness & anxiety relief", "Aesthetic indie Indian craft", "Sacred ambient music", "Ethical consumption"],
    whatTheyWatch: ["Singing bowl sound therapy reels", "Monastery rain loops", "Clay incense burner styling"],
    whatTheyEngageWith: ["Polls on mindful habits", "Short audio chants with English translations", "Creator micro-vlogs"],
    topProductsInterested: ["Handcrafted meditation cushions", "Aromatherapy oils", "Clay tea kulhads"],
    bestFormat: "Ambient Lo-Fi Video Reels with Audio",
    bestTime: "10:00 PM – 12:30 AM IST",
  },
  {
    id: "seg-03",
    name: "Diaspora Heritage Seekers",
    demographic: "28–48 yrs • US, UK, Canada, UAE, Singapore",
    size: "420K",
    growth: "+19% MoM",
    affinityScore: 92,
    whoTheyAre: "Global South Asians wanting authentic connection to festivals, Vedic rituals, classical arts, and ancestral stories.",
    whatTheyCareAbout: ["Authentic cultural transmission for children", "High-craft festive decor", "Sanskrit etymology", "Rare temple brass"],
    whatTheyWatch: ["Step-by-step puja explanations", "Temple architecture walk-throughs", "Heritage handloom documentaries"],
    whatTheyEngageWith: ["Deep-dive editorial stories", "Curated festive gift hampers", "Philosophical commentaries"],
    topProductsInterested: ["Panchaloha temple bells", "Pure mulberry silk sarees", "Pattachitra wall scrolls"],
    bestFormat: "Editorial Story Cards & Documentaries",
    bestTime: "6:00 AM – 9:00 AM EST (US)",
  },
  {
    id: "seg-04",
    name: "Architecture & Sacred Geometry Enthusiasts",
    demographic: "30–55 yrs • Design, Architecture, Heritage Conservation",
    size: "310K",
    growth: "+14% MoM",
    affinityScore: 96,
    whoTheyAre: "Architects, interior stylists, and cultural scholars exploring Vastu, temple proportion systems, and indigenous materials.",
    whatTheyCareAbout: ["Architectural proportion systems", "Lime plaster & stone preservation", "Sacred acoustics", "Hand-carved woodwork"],
    whatTheyWatch: ["Hoysala temple star-geometry breakdowns", "Chola bronze casting process", "Chettinad mansion restoration"],
    whatTheyEngageWith: ["Epistemic Tier 1 research papers", "Architect blueprints", "Field photography journals"],
    topProductsInterested: ["Architectural stone reliefs", "Teakwood sanctuary furniture", "Brass vastu yantras"],
    bestFormat: "Split-screen Blueprint to Reality Video",
    bestTime: "12:00 PM – 3:00 PM IST",
  },
];

export interface PromotionContent {
  id: string;
  title: string;
  type: "reel" | "story" | "product" | "collab";
  mediaUrl: string;
  organicEngagement: string;
  organicViews: string;
  conversionPotential: "Very High" | "High" | "Medium";
  recommendedBudget: string;
  projectedReach: string;
}

export const PROMOTABLE_CONTENT: PromotionContent[] = [
  {
    id: "promo-1",
    title: "The 400-Year-Old Loom of Maheshwar",
    type: "reel",
    mediaUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    organicEngagement: "14.2%",
    organicViews: "48.2K",
    conversionPotential: "Very High",
    recommendedBudget: "₹25,000",
    projectedReach: "340K – 420K",
  },
  {
    id: "promo-2",
    title: "Sacred Geometry of Thanjavur Living Spaces",
    type: "story",
    mediaUrl: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=600&auto=format&fit=crop&q=80",
    organicEngagement: "11.8%",
    organicViews: "32.1K",
    conversionPotential: "High",
    recommendedBudget: "₹18,000",
    projectedReach: "210K – 280K",
  },
  {
    id: "promo-3",
    title: "Hand-Hammered Kansa Bronze Dinner Set",
    type: "product",
    mediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    organicEngagement: "9.4%",
    organicViews: "24.6K",
    conversionPotential: "Very High",
    recommendedBudget: "₹35,000",
    projectedReach: "450K – 560K",
  },
  {
    id: "promo-4",
    title: "Chitrakoot Natural Dyeing: Artisan Collaboration",
    type: "collab",
    mediaUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    organicEngagement: "16.1%",
    organicViews: "62.4K",
    conversionPotential: "Very High",
    recommendedBudget: "₹40,000",
    projectedReach: "520K – 680K",
  },
];

export interface BrandCRMLead {
  id: string;
  name: string;
  city: string;
  segment: string;
  stage: "New Inquiry" | "Sample Requested" | "Converted Customer" | "Heritage Patron";
  sourceCampaign: string;
  ltv: string;
  ordersCount: number;
  lastActive: string;
  interestTags: string[];
}

export const BRAND_CRM_LEADS: BrandCRMLead[] = [
  {
    id: "crm-1",
    name: "Dr. Ananya Roy",
    city: "Bangalore",
    segment: "Conscious Urban Indic",
    stage: "Heritage Patron",
    sourceCampaign: "Varanasi Silk Reel",
    ltv: "₹46,200",
    ordersCount: 4,
    lastActive: "2 hours ago",
    interestTags: ["Handloom Mulberry", "Temple Brass", "Organic Indigo"],
  },
  {
    id: "crm-2",
    name: "Vikram Malhotra",
    city: "Mumbai",
    segment: "Architecture & Sacred Geometry",
    stage: "Converted Customer",
    sourceCampaign: "Temple Brassware",
    ltv: "₹28,500",
    ordersCount: 2,
    lastActive: "Yesterday",
    interestTags: ["Kansa Bronze", "Vastu Statues"],
  },
  {
    id: "crm-3",
    name: "Tara Srinivasan",
    city: "San Jose, CA",
    segment: "Diaspora Heritage Seekers",
    stage: "Sample Requested",
    sourceCampaign: "Sacred Geometry Living",
    ltv: "₹14,000",
    ordersCount: 1,
    lastActive: "3 days ago",
    interestTags: ["Panchaloha Bells", "Festive Kits"],
  },
  {
    id: "crm-4",
    name: "Kabir Mehta",
    city: "Delhi NCR",
    segment: "Gen Z Mindful Living",
    stage: "New Inquiry",
    sourceCampaign: "Kumaon Artisan Teas",
    ltv: "₹3,400",
    ordersCount: 1,
    lastActive: "5 hours ago",
    interestTags: ["Meditation Cushions", "Clay Kulhads"],
  },
];
