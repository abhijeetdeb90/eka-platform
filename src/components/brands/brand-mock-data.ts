// ==============================================================================
// EKA GROWTH OS & INTELLIGENCE LAYER — DATA ENGINE & GRAPH DEFINITION
// ==============================================================================
// Connecting: People × Interests × Culture × Content × Brands × Products × Intent × Outcomes
// ==============================================================================

export interface EkaScores {
  audienceMomentum: { score: number; velocity: string; description: string };
  culturalRelevance: { score: number; status: string; description: string };
  audienceAffinity: { score: number; segment: string; description: string };
  campaignMomentum: { score: number; trend: "Accelerating" | "Steady" | "Decaying"; description: string };
  opportunityIndex: { score: number; category: string; description: string };
}

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
  scores: EkaScores;
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
    scores: {
      audienceMomentum: { score: 94, velocity: "+32% MoM", description: "High velocity interest migration toward certified handloom silk & brass" },
      culturalRelevance: { score: 96, status: "Verified Lineage", description: "Direct artisan partnerships with zero appropriation flags" },
      audienceAffinity: { score: 89, segment: "Conscious Urban Indic", description: "Strongest resonance among 24–38 design-forward households" },
      campaignMomentum: { score: 91, trend: "Accelerating", description: "Engagement velocity is compounding across short-form loom reels" },
      opportunityIndex: { score: 9.4, category: "Varanasi Living Sanctuary", description: "High unfilled demand for non-chemical home sanctuary textiles" },
    },
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
    scores: {
      audienceMomentum: { score: 96, velocity: "+41% MoM", description: "Explosive growth in cold-pressed botanical ritual formulations" },
      culturalRelevance: { score: 98, status: "Rigvedic Rooted", description: "Deep alignment with Charaka Samhita source nodes" },
      audienceAffinity: { score: 92, segment: "Diaspora Heritage Seekers", description: "Overwhelming demand from North America & UAE for authentic Kumkumadi" },
      campaignMomentum: { score: 94, trend: "Accelerating", description: "Morning dinacharya routines driving 4.8× ROAS" },
      opportunityIndex: { score: 8.9, category: "Sacred Acoustic Bath", description: "Unserved overlap between sound therapy and herbal wellness" },
    },
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
    scores: {
      audienceMomentum: { score: 88, velocity: "+26% MoM", description: "Steady expansion in contemporary tropical Indic minimalism" },
      culturalRelevance: { score: 91, status: "Modern Reinterpretation", description: "Aesthetic synthesis of island heritage and urban living" },
      audienceAffinity: { score: 86, segment: "Gen Z Mindful Living", description: "High repeat saves for stoneware dining and relaxed linen" },
      campaignMomentum: { score: 85, trend: "Steady", description: "Solid conversion baseline with room for creator collaborations" },
      opportunityIndex: { score: 9.1, category: "Minimalist Tea Rituals", description: "Demand surge for Indian ceramic tea sets and slow-pour rituals" },
    },
  },
];

// ==============================================================================
// 1. CULTURAL TREND RADAR SIGNALS
// ==============================================================================
// Culture → Emerging Interest → Audience Signal → Category Opportunity → Campaign
export interface TrendRadarSignal {
  id: string;
  culturalShift: string;
  emergingInterest: string;
  audienceSignal: string;
  targetDemographic: string;
  momentumScore: number; // 0-100
  momentumVelocity: string;
  categoryOpportunity: string;
  brandOpportunity: string;
  recommendedCampaign: string;
  suggestedBudget: string;
  projectedRoas: string;
  whyItResonates: string;
}

export const TREND_RADAR_SIGNALS: TrendRadarSignal[] = [
  {
    id: "trend-01",
    culturalShift: "Return to Ancient Acoustics & Nada Yoga",
    emergingInterest: "Vedic Sound Therapy & Bronze Singing Bowls",
    audienceSignal: "Search & view time for temple acoustic resonance reels surged +310% in last 30 days.",
    targetDemographic: "Gen Z & Young Urban Professionals (18–32)",
    momentumScore: 98,
    momentumVelocity: "+310% MoM",
    categoryOpportunity: "Sound Therapy Tools & Hand-Cast Bell Metal",
    brandOpportunity: "Position hand-hammered Kansa bronze as daily nervous system grounding instruments.",
    recommendedCampaign: "Launch a 7-day 'Acoustic Sanctuary' reel series featuring Master Bell-casters of Kerala.",
    suggestedBudget: "₹65,000",
    projectedRoas: "5.1×",
    whyItResonates: "Urban seekers experiencing screen burnout view acoustic resonance as instant non-pharmacological calm.",
  },
  {
    id: "trend-02",
    culturalShift: "Slow Living & Chemical-Free Dining Rituals",
    emergingInterest: "Ayurvedic Kansa (Bronze) Tableware & Slow Cooking",
    audienceSignal: "'I'd consider this' and 'Explore Maker' clicks on artisan cookware jumped 2.8× over ceramic sets.",
    targetDemographic: "Conscious Urban Indic Households (26–42)",
    momentumScore: 94,
    momentumVelocity: "+180% MoM",
    categoryOpportunity: "Pure Hand-Hammered Bell Metal Dining Sets",
    brandOpportunity: "Introduce heirloom dining sets with certificates of non-lead metallurgical purity.",
    recommendedCampaign: "Creator collab with holistic Ayurvedic chefs demonstrating morning thali rituals.",
    suggestedBudget: "₹85,000",
    projectedRoas: "4.7×",
    whyItResonates: "Kitchens are reclaiming sacred status; eating from bronze is recognized for alkalizing food properties.",
  },
  {
    id: "trend-03",
    culturalShift: "Sacred Geography Pilgrimage & Mindful Travel",
    emergingInterest: "Himalayan Forest Monasteries & High-Altitude Ashrams",
    audienceSignal: "Dwell time on High Himalaya hermit field journals averages 6.8 minutes with 38% bookmark rate.",
    targetDemographic: "Diaspora & Urban Solo Travelers (22–38)",
    momentumScore: 91,
    momentumVelocity: "+145% MoM",
    categoryOpportunity: "Lightweight Ethically Sourced Travel Sanctuary Kits",
    brandOpportunity: "Bundle organic merino wool dhyana shawls with natural cedar incense for portable meditation.",
    recommendedCampaign: "Short-form video documentary: 'The Silent Hermitages of Spiti' with integrated travel gear.",
    suggestedBudget: "₹50,000",
    projectedRoas: "4.2×",
    whyItResonates: "Rejection of commercial tourism in favor of deep quietude and spiritual self-discovery.",
  },
  {
    id: "trend-04",
    culturalShift: "Natural Dye Revival & Handloom Transparency",
    emergingInterest: "Hardwickia & Pomegranate Peel Natural Dyed Silks",
    audienceSignal: "82% of seekers watching natural dye extraction reels click through to source provenance passports.",
    targetDemographic: "Conscious Luxury & Textile Aficionados (28–50)",
    momentumScore: 93,
    momentumVelocity: "+220% MoM",
    categoryOpportunity: "Zero-Chemical Certified Living Heritage Apparel",
    brandOpportunity: "Release numbered limited-edition sarees with NFC chip tracking back to specific artisan looms.",
    recommendedCampaign: "Split-screen micro-reels showing raw pomegranate peel transforming into luminous gold silk.",
    suggestedBudget: "₹1,10,000",
    projectedRoas: "4.9×",
    whyItResonates: "Disgust with synthetic fast-fashion microplastics coupled with aesthetic reverence for earth pigments.",
  },
];

// ==============================================================================
// 2. CREATOR + ARTISAN MARKETPLACE
// ==============================================================================
export interface CreatorPartner {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  tradition: string;
  location: string;
  followersCount: string;
  audienceOverlap: number; // Percentage overlap with brand TG
  engagementQuality: string;
  epistemicTier: "Tier 1: Master Lineage" | "Tier 2: Field Scholar" | "Tier 3: Practitioner";
  topCategories: string[];
  historicalRoas: string;
  collaborationsCompleted: number;
  availableFor: ("Short Video Reels" | "Story Sponsorship" | "Product Co-Design" | "Field Workshops")[];
}

export const CREATOR_PARTNERS: CreatorPartner[] = [
  {
    id: "cr-01",
    name: "Pt. Rameshwar Mishra",
    handle: "@banaras.heritage.loom",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    tradition: "7th Generation Master Kadhua Weaver",
    location: "Varanasi, Uttar Pradesh",
    followersCount: "148K",
    audienceOverlap: 88,
    engagementQuality: "14.8% (Exceptional)",
    epistemicTier: "Tier 1: Master Lineage",
    topCategories: ["Pure Mulberry Silk", "Zari Gold Thread", "Sacred Geometry"],
    historicalRoas: "5.4×",
    collaborationsCompleted: 18,
    availableFor: ["Short Video Reels", "Product Co-Design", "Story Sponsorship"],
  },
  {
    id: "cr-02",
    name: "Dr. Vidya Shankar",
    handle: "@vedic.acoustics",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    tradition: "Sanskrit Epigraphist & Nada Yoga Practitioner",
    location: "Mysuru, Karnataka",
    followersCount: "210K",
    audienceOverlap: 84,
    engagementQuality: "12.2% (Very High)",
    epistemicTier: "Tier 2: Field Scholar",
    topCategories: ["Temple Acoustics", "Bronze Singing Bowls", "Mantra Science"],
    historicalRoas: "4.9×",
    collaborationsCompleted: 24,
    availableFor: ["Short Video Reels", "Field Workshops", "Story Sponsorship"],
  },
  {
    id: "cr-03",
    name: "Meenakshi Sundaram",
    handle: "@thanjavur.living.bronze",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    tradition: "Chola Lost-Wax Metal Caster",
    location: "Swamimalai, Tamil Nadu",
    followersCount: "94K",
    audienceOverlap: 92,
    engagementQuality: "16.1% (Exceptional)",
    epistemicTier: "Tier 1: Master Lineage",
    topCategories: ["Panchaloha Statuary", "Temple Lamps", "Sacred Alloys"],
    historicalRoas: "5.8×",
    collaborationsCompleted: 12,
    availableFor: ["Product Co-Design", "Short Video Reels"],
  },
  {
    id: "cr-04",
    name: "Aarav Sen",
    handle: "@spiti.monastery.quiet",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    tradition: "Himalayan Field Filmmaker & Sound Archivist",
    location: "Kaza, Spiti Valley",
    followersCount: "320K",
    audienceOverlap: 79,
    engagementQuality: "11.4% (High)",
    epistemicTier: "Tier 3: Practitioner",
    topCategories: ["Mindful Travel", "Himalayan Wool", "Soundscapes"],
    historicalRoas: "4.1×",
    collaborationsCompleted: 31,
    availableFor: ["Short Video Reels", "Story Sponsorship"],
  },
];

// ==============================================================================
// 3. CLOSED-LOOP ATTRIBUTION PIPELINE
// ==============================================================================
// Discovery → Attention → Engagement → Intent → CRM → Purchase → Retention → LTV
export interface AttributionTouchpoint {
  stage: string;
  volume: string;
  conversionToNext: string;
  keyAction: string;
  culturalInsight: string;
}

export const CLOSED_LOOP_ATTRIBUTION: AttributionTouchpoint[] = [
  {
    stage: "1. Discovery",
    volume: "1,840,000",
    conversionToNext: "38.2%",
    keyAction: "Organic Short-Form Reel Impression in Seeker Feed",
    culturalInsight: "Artisan hands crafting raw silk at dawn had lowest skip rate (1.4%).",
  },
  {
    stage: "2. Attention",
    volume: "702,880",
    conversionToNext: "65.4%",
    keyAction: "Watched > 15s or 100% completion with sound ON",
    culturalInsight: "Lo-Fi ambient loom shuttle sound held attention 2.4× longer than voiceovers.",
  },
  {
    stage: "3. Engagement",
    volume: "459,680",
    conversionToNext: "31.2%",
    keyAction: "Like, Save to Sanctuary, Share, or Tap Provenance Passport",
    culturalInsight: "Seekers inspected the Epistemic Tier certificate before engaging with brand.",
  },
  {
    stage: "4. Commercial Intent",
    volume: "143,420",
    conversionToNext: "61.6%",
    keyAction: "'I'd consider this' or 'Explore Maker' tap on StoryCard",
    culturalInsight: "High intent signaled without interrupting contemplative browsing flow.",
  },
  {
    stage: "5. Brand CRM Lead",
    volume: "88,340",
    conversionToNext: "5.45%",
    keyAction: "Sample kit requested, VIP waitlist joined, or email subscribed",
    culturalInsight: "Seekers willing to wait 2–3 weeks for verified hand-hammered products.",
  },
  {
    stage: "6. Purchase",
    volume: "4,820",
    conversionToNext: "42.8%",
    keyAction: "Verified online order or artisan studio booking",
    culturalInsight: "Average Order Value (AOV) was ₹6,420, 2.1× higher than non-EKA channels.",
  },
  {
    stage: "7. Retention & LTV",
    volume: "2,063 Patrons",
    conversionToNext: "₹24,800 Avg LTV",
    keyAction: "Re-order within 90 days or upgraded to Heritage Patron",
    culturalInsight: "Patrons receive seasonal provenance notes directly from the weaving family.",
  },
];

// ==============================================================================
// 4. BRAND BRAIN PRE-STORED STRATEGIC QUERIES
// ==============================================================================
export interface BrandBrainQA {
  query: string;
  category: "diagnosis" | "strategy" | "creative" | "audience";
  answer: string;
  suggestedAction: string;
  actionTab: string;
}

export const BRAND_BRAIN_KNOWLEDGE_BASE: BrandBrainQA[] = [
  {
    query: "Why did our last campaign underperform?",
    category: "diagnosis",
    answer: "Your 'Modern Festive Glaze' campaign achieved 420K impressions but only a 1.2% CTR. EKA Brand Brain analyzed the creative: 84% of seekers dropped off at second 4 because the video opened with agency studio lighting rather than the raw artisan workshop. In contrast, campaigns opening with master craftsmen at the loom achieved a 9.8% CTR. You were perceived as a generic commercial brand rather than an authentic cultural patron.",
    suggestedAction: "Re-edit creative to open with raw artisan macro-shots (First 3 seconds).",
    actionTab: "campaigns",
  },
  {
    query: "What should we promote next month?",
    category: "strategy",
    answer: "EKA Trend Radar detects a +310% surge in 'Vedic Acoustic Sanctuaries' leading into Kartik Deepotsav. Hand-hammered Kansa bronze dinnerware and pure copper water vessels are seeing 4.2× commercial intent. We recommend promoting the 'Heirloom Kansa Dining Set' bundled with an authentic artisan care guide.",
    suggestedAction: "Launch 'Sacred Dining Sanctuary' Autopilot Campaign.",
    actionTab: "autopilot",
  },
  {
    query: "Which audience should we target?",
    category: "audience",
    answer: "Target the 'Conscious Urban Indic' segment (24–38 yrs, Metros). They currently exhibit an Affinity Score of 94/100 for your handloom catalog, with an average cart value of ₹7,800. Their peak engagement window is 8:00–10:30 PM IST, and they convert 2.3× faster on short-form video reels than static carousel cards.",
    suggestedAction: "Configure target audience parameters in Campaigns Manager.",
    actionTab: "audience",
  },
  {
    query: "Give me 5 campaign concepts",
    category: "creative",
    answer: "Here are 5 data-grounded concepts aligned with active EKA cultural signals:\n1. 'The 400-Year Loom': Macro-focus on weaver fingers knotting silk warp.\n2. 'Sacred Morning Thali': 20s ASMR of brass bell ringing and hot ghee on kansa plate.\n3. 'Spiti High Silence': Merino wool shawl used at 14,000 ft in morning meditation.\n4. 'Pomegranate to Silk': Chemical-free dye extraction in stone vats.\n5. 'Night Sanctuaries': Candlelight reflecting off hand-cast temple lamps.",
    suggestedAction: "Select a concept to auto-generate video storyboard.",
    actionTab: "promote",
  },
  {
    query: "Turn this insight into a 15-second video",
    category: "creative",
    answer: "15-SECOND VIDEO STORYBOARD:\n• [0:00–0:03]: Extreme close-up of dark molten bronze poured into earthen clay mold. SFX: Hiss of steam.\n• [0:03–0:07]: Master artisan hammers bell metal rhythmically. No background music, only metallurgic resonance.\n• [0:07–0:11]: Transition to serene dining sanctuary. Evening lamp glow on finished dinnerware.\n• [0:11–0:15]: On-screen text: 'Forged by the 6th Generation. Verified Epistemic Lineage.' Subtle button: 'Explore Maker'.",
    suggestedAction: "Push storyboard to EKA Creative Studio.",
    actionTab: "promote",
  },
  {
    query: "Which product should we push to this audience?",
    category: "strategy",
    answer: "For your Gen Z Mindful Living audience (18–24), push the 'Handcrafted Kansa Tea Kulhad' (₹1,250). High-priced silk sarees create price friction, but artisanal tea vessels have a 12.8% impulse conversion rate and act as the gateway lead magnet into your brand's long-term CRM pipeline.",
    suggestedAction: "Allocate ₹30,000 Boost budget to Handcrafted Kulhads.",
    actionTab: "promote",
  },
];

// ==============================================================================
// 5. EXISTING DATA (CAMPAIGNS, AUDIENCE, CONTENT, CRM) PRESERVED
// ==============================================================================
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
  affinityScore: number;
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
