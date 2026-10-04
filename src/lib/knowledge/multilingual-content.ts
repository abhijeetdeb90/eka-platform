// ==============================================================================
// EKA MULTILINGUAL & REGIONAL CULTURAL CONTENT ENGINE
// ==============================================================================
// One Canonical Entity -> Multiple Localized Representations.
// Adheres strictly to EKA Safeguard:
// Trusted Source → Canonical EKA Content → Human/Verified Review → Translation → Language QA → Published
// ==============================================================================

import type { SupportedLocale, RegionalContext } from "@/lib/i18n/types";
import {
  getKnowledgeObjectBySlug,
  type EkaKnowledgeObject,
} from "./knowledge-graph";

export type TranslationStatus =
  | "draft"
  | "ai_translated"
  | "human_reviewed"
  | "verified"
  | "published";

export interface LocalizedCulturalRepresentation {
  canonicalSlug: string;
  languageCode: string;
  localizedName: string;
  localizedTitle: string;
  localizedOneLiner: string;
  localizedSummary: string;
  regionLabel: string;
  categoryLabel: string;
  traditions: string[];
  places: string[];
  keyTerminology: Array<{ term: string; meaning: string; language: string }>;
  translationStatus: TranslationStatus;
  verificationStatus: "verified" | "review_needed" | "community_dispute";
  reviewedBy: string;
  lastQaDate: string;
}

export const CULTURAL_TRANSLATIONS_MAP: Record<
  string,
  Partial<Record<string, LocalizedCulturalRepresentation>>
> = {
  // 1. BIHU (Bohag Bihu, Assam)
  "bohag-bihu": {
    as: {
      canonicalSlug: "bohag-bihu",
      languageCode: "as",
      localizedName: "বিহু (বোহাগ বিহু)",
      localizedTitle: "বিহু — অসমৰ এক জীৱন্ত সাংস্কৃতিক উৎসৱ",
      localizedOneLiner: "অসমৰ কৃষিভিত্তিক নৱবৰ্ষ আৰু প্ৰকৃতিৰ উছাহৰ মহোৎসৱ, যিয়ে সাতবিহু আৰু সমন্বয়ৰ প্ৰতীক বহন কৰে।",
      localizedSummary:
        "বোহাগ বিহু (ৰঙালী বিহু) অসমৰ জাতীয় জীৱনৰ প্ৰাণ। ব'হাগ মাহৰ সংক্ৰান্তিৰ পৰা আৰম্ভ হোৱা এই উৎসৱ প্ৰকৃতিৰ নৱৰূপ আৰু শস্যোৎসৱৰ আনন্দৰ প্ৰতীক। গৰু বিহু, মানুহ বিহু, গোঁসাই বিহু, তাঁতৰ বিহু আদিৰে গঠিত সাতবিহুৰ জৰিয়তে অসমৰ বিভিন্ন জাতি-জনগোষ্ঠীৰ সমন্বয় প্ৰতিফলিত হয়। ঢোল, পেঁপা, গগনা আৰু বিহু নৃত্যৰ জৰিয়তে অসমীয়া সমাজে প্ৰকৃতি আৰু জীৱনৰ উদযাপন কৰে।",
      regionLabel: "অসম (Assam)",
      categoryLabel: "সাংস্কৃতিক মহোৎসৱ (Living Festival)",
      traditions: ["গৰু বিহু", "ৰঙালী বিহু", "হুঁচৰি", "বিহু নাচ", "ভোকা বিহু"],
      places: ["মাজুলী", "শিৱসাগৰ", "তেজপুৰ", "গুৱাহাটী", "লখিমপুৰ"],
      keyTerminology: [
        { term: "গামোচা", meaning: "স্নেহ, সন্মান আৰু শ্ৰদ্ধাৰ প্ৰতীকস্বৰূপ ফুলাম বস্ত্ৰ", language: "Assamese" },
        { term: "পেঁপা", meaning: "ম'হৰ শিঙেৰে নিৰ্মিত পৰম্পৰাগত সুৰীয়া বাদ্যযন্ত্ৰ", language: "Assamese" },
        { term: "হুঁচৰি", meaning: "ঘৰে ঘৰে গৈ আশীৰ্বাদ দিয়া বিহু দলৰ পৰম্পৰাগত গীত-মাত", language: "Assamese" },
        { term: "ঢোল", meaning: "বিহু নৃত্যৰ মূল তালবাদ্য", language: "Assamese" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "Assamese Cultural Heritage Editorial Board",
      lastQaDate: "2026-10-01",
    },
    hi: {
      canonicalSlug: "bohag-bihu",
      languageCode: "hi",
      localizedName: "बोहाग बिहू",
      localizedTitle: "बिहू — असम का एक जीवंत सांस्कृतिक उत्सव",
      localizedOneLiner: "असमिया नववर्ष और बसंत आगमन का प्रकृति-केंद्रित पावन लोकपर्व, जो सद्भाव और ऊर्जा का प्रतीक है।",
      localizedSummary:
        "बोहाग बिहू (रोंगाली बिहू) असमिया संस्कृति का प्राण है। यह पर्व असमिया नववर्ष और वसंत ऋतु के आगमन पर सात दिनों तक मनाया जाता है। गाय पूजा (गोरु बिहू), परिजनों के प्रति श्रद्धा (मानुह बिहू) और सामूहिक हुंचरी गायन के साथ यह संपूर्ण पूर्वोत्तर के सामाजिक सद्भाव को एक सूत्र में पिरोता है। ढोल, पेपा और पारंपरिक गामोचा इस उत्सव की आत्मा हैं।",
      regionLabel: "असम (Assam)",
      categoryLabel: "लोक उत्सव (Harvest Festival)",
      traditions: ["गोरु बिहू", "रोंगाली बिहू", "हुंचरी गायन", "बिहू नृत्य"],
      places: ["माजुली", "शिवसागर", "गुवाहाटी"],
      keyTerminology: [
        { term: "गामोचा", meaning: "असमिया सम्मान और अपनत्व का प्रतीक पारंपरिक वस्त्र", language: "Assamese" },
        { term: "पेपा", meaning: "भैंस के सींग से बनी मधुर ध्वनि वाली पारंपरिक बांसुरी", language: "Assamese" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "EKA National Cultural Editorial Board",
      lastQaDate: "2026-10-01",
    },
    en: {
      canonicalSlug: "bohag-bihu",
      languageCode: "en",
      localizedName: "Bohag Bihu (Rongali Bihu)",
      localizedTitle: "Bihu — A Living Cultural Festival of Assam",
      localizedOneLiner: "The agrarian New Year and springtime pastoral renewal marking indigenous unity across the Brahmaputra valley.",
      localizedSummary:
        "Bohag Bihu (Rongali Bihu) is the defining celebration of Assam, heralding the Assamese New Year and the onset of the agricultural cycle. Observed through the Seven Bihus (Sat Bihu), from cattle veneration to house-to-house Husori choral blessings, it integrates Tai-Ahom, Indo-Aryan, and Tibeto-Burman traditions through buffalo-horn pepa music, dhol rhythms, and handwoven red-and-white gamusa textiles.",
      regionLabel: "Assam, India",
      categoryLabel: "Living Festival & Agro-Cosmology",
      traditions: ["Goru Bihu", "Manuh Bihu", "Husori Choral blessings", "Mukoli Bihu Dance"],
      places: ["Majuli River Island", "Sivasagar", "Brahmaputra Valley"],
      keyTerminology: [
        { term: "Gamusa", meaning: "Handwoven red-and-white cloth representing reverence and blessing", language: "Assamese" },
        { term: "Pepa", meaning: "Double-reed buffalo-horn hornpipe with bamboo stop", language: "Assamese" },
      ],
      translationStatus: "published",
      verificationStatus: "verified",
      reviewedBy: "EKA Curatorial Board",
      lastQaDate: "2026-09-30",
    },
    ta: {
      canonicalSlug: "bohag-bihu",
      languageCode: "ta",
      localizedName: "பிஹு (அசாம்)",
      localizedTitle: "பிஹு — அசாமின் வாழும் கலாச்சார திருவிழா",
      localizedOneLiner: "அசாமிய புத்தாண்டு மற்றும் வசந்த கால அறுவடைத் திருநாள், பிரம்மபுத்திரா பள்ளத்தாக்கின் ஒற்றுமையின் சின்னம்.",
      localizedSummary:
        "போஹாக் பிஹு என்பது அசாமின் முக்கிய கலாச்சார திருவிழா. இது புத்தாண்டு மற்றும் விவசாய சுழற்சியின் தொடக்கத்தைக் குறிக்கிறது. மாடுகள் வழிபாடு முதல் பாரம்பரிய பிஹு நடனம் வரை பல சமூகங்களை ஒன்றிணைக்கும் அழகிய மரபு.",
      regionLabel: "அசாம் (Assam)",
      categoryLabel: "கலாச்சாரத் திருவிழா",
      traditions: ["ரொங்காலி பிஹு", "ஹுசோரி பாடல்", "பிஹு நடனம்"],
      places: ["மஜூலி தீவு", "குவஹாத்தி"],
      keyTerminology: [
        { term: "கமோசா", meaning: "மரியாதையை குறிக்கும் கைத்தறி ஆடை", language: "Assamese" },
      ],
      translationStatus: "human_reviewed",
      verificationStatus: "verified",
      reviewedBy: "EKA Dravidian Studies Desk",
      lastQaDate: "2026-10-02",
    },
    bn: {
      canonicalSlug: "bohag-bihu",
      languageCode: "bn",
      localizedName: "বোহাগ বিহু",
      localizedTitle: "বিহু — আসামের এক জীবন্ত সাংস্কৃতিক মহোৎসব",
      localizedOneLiner: "আসামের কৃষিভিত্তিক নববর্ষ ও ঋতু পরিবর্তনের প্রতীক, যা সম্প্রীতির মেলবন্ধন ঘটায়।",
      localizedSummary:
        "বোহাগ বিহু আসামের প্রাণস্পন্দন। বসন্তের আগমনে এই উৎসব পালিত হয়। গবাদিপশু পূজা, গুরুজনদের আশীর্বাদ গ্রহণ ও ঢোল-পেঁপার সুরের মূর্ছনায় মুখরিত হয় সমগ্র ব্রহ্মপুত্র উপত্যকা।",
      regionLabel: "আসাম (Assam)",
      categoryLabel: "কৃষি ও সাংস্কৃতিক উৎসব",
      traditions: ["গরু বিহু", "রঙালি বিহু", "হুঁচরি গান"],
      places: ["মাজুলী", "শিলচর", "গুয়াহাটি"],
      keyTerminology: [
        { term: "গামোছা", meaning: "শ্রদ্ধা ও স্নেহের প্রতীক হিসেবে উপহার দেওয়া বস্ত্র", language: "Assamese" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "EKA Eastern Heritage Desk",
      lastQaDate: "2026-10-02",
    },
  },

  // 2. PONGAL & TAMIL TRADITIONS (Tamil Nadu)
  pongal: {
    ta: {
      canonicalSlug: "pongal",
      languageCode: "ta",
      localizedName: "பொங்கல் திருநாள்",
      localizedTitle: "பொங்கல் — தமிழ்நாட்டின் வாழும் அறுவடைத் திருநாள்",
      localizedOneLiner: "இயற்கை, சூரியன் மற்றும் கால்நடைகளுக்கு நன்றி செலுத்தும் தமிழர்களின் உன்னத அறுவடைப் பெருவிழா.",
      localizedSummary:
        "பொங்கல் என்பது தமிழ் நிலத்தின் இயற்கை நன்றியுணர்வை வெளிப்படுத்தும் முதன்மைத் திருவிழா. போகி, தைப்பொங்கல், மாட்டுப் பொங்கல், காணும் பொங்கல் என நான்கு நாட்கள் கொண்டாடப்படுகிறது. புதுப்பானையில் புது நெல்லரிசி, பால், வெல்லம் இட்டு 'பொங்கலோ பொங்கல்' என முழங்கி சூரிய பகவானுக்கு படையலிட்டு உழவுக்கும் உழவர்க்கும் நன்றி செலுத்தும் பண்பாட்டு அடையாளம்.",
      regionLabel: "தமிழ்நாடு (Tamil Nadu)",
      categoryLabel: "அறுவடைத் திருவிழா (Harvest Celebration)",
      traditions: ["தைப்பொங்கல்", "மாட்டுப் பொங்கல்", "ஜல்லிக்கட்டு", "போகி"],
      places: ["மதுரை", "தஞ்சாவூர்", "திருநெல்வேலி", "காஞ்சிபுரம்"],
      keyTerminology: [
        { term: "பொங்கலோ பொங்கல்", meaning: "வளம் பொங்கி வழியட்டும் என்ற வாழ்த்து முழக்கம்", language: "Tamil" },
        { term: "கோலம்", meaning: "அரிசி மாவால் வாசலில் இடப்படும் புனித வடிவியல் கலை", language: "Tamil" },
        { term: "ஜல்லிக்கட்டு", meaning: "நாட்டு மாடுகளின் வீரத்தை போற்றும் ஏறுதழுவுதல் மரபு", language: "Tamil" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "Tamil Heritage Academic Panel",
      lastQaDate: "2026-10-01",
    },
    en: {
      canonicalSlug: "pongal",
      languageCode: "en",
      localizedName: "Pongal",
      localizedTitle: "Pongal — The Living Harvest Celebration of Tamil Nadu",
      localizedOneLiner: "A four-day agro-solar celebration honoring nature, cattle, and the first harvest across Tamil lineages.",
      localizedSummary:
        "Pongal marks the sun's transition into Uttarayana and serves as Tamil Nadu's cardinal festival of gratitude to cosmic forces and farm animals. Across four distinct days — Bhogi, Thai Pongal, Mattu Pongal, and Kaanum Pongal — clay pots overflow with boiling milk and freshly harvested rice, consecrated with kolam sacred geometry and pastoral Jallikattu bull stewardship.",
      regionLabel: "Tamil Nadu, India",
      categoryLabel: "Living Harvest & Solar Cosmology",
      traditions: ["Thai Pongal boiling ritual", "Mattu Pongal cattle blessing", "Jallikattu", "Kolam geometry"],
      places: ["Madurai", "Thanjavur", "Kanchipuram", "Chettinad"],
      keyTerminology: [
        { term: "Pongalo Pongal", meaning: "May prosperity and wisdom overflow", language: "Tamil" },
        { term: "Kolam", meaning: "Sacred floor geometric diagrams drawn with rice flour", language: "Tamil" },
      ],
      translationStatus: "published",
      verificationStatus: "verified",
      reviewedBy: "EKA Curatorial Board",
      lastQaDate: "2026-10-01",
    },
    hi: {
      canonicalSlug: "pongal",
      languageCode: "hi",
      localizedName: "पोंगल",
      localizedTitle: "पोंगल — तमिलनाडु का पावन फसल उत्सव",
      localizedOneLiner: "सूर्य देव, प्रकृति और पशुधन के प्रति कृतज्ञता व्यक्त करने वाला चार दिवसीय पावन पर्व।",
      localizedSummary:
        "पोंगल तमिलनाडु का प्रमुख लोकपर्व है, जो मकर संक्रांति के समय मनाया जाता है। मिट्टी की मटकी में नए चावल, गुड़ और दूध से पोंगल खीर बनाई जाती है और प्रकृति के प्रति आभार व्यक्त किया जाता है। मट्टू पोंगल के दिन बैलों और गायों की विशेष पूजा की जाती है।",
      regionLabel: "तमिलनाडु (Tamil Nadu)",
      categoryLabel: "कृषि पर्व (Harvest Festival)",
      traditions: ["थाई पोंगल", "मट्टू पोंगल", "कोलम रंगोली", "जल्लीकट्टू"],
      places: ["मदुरै", "तंजாவूर", "कांचीपुरम"],
      keyTerminology: [
        { term: "कोलम", meaning: "चावल के आटे से बनाई जाने वाली पवित्र ज्यामितीय रंगोली", language: "Tamil" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "EKA National Cultural Editorial Board",
      lastQaDate: "2026-10-01",
    },
    as: {
      canonicalSlug: "pongal",
      languageCode: "as",
      localizedName: "পোংগল (তামিলনাডু)",
      localizedTitle: "পোংগল — তামিলনাডুৰ শস্য চপোৱা মহোৎসৱ",
      localizedOneLiner: "সূৰ্য দেৱতা, প্ৰকৃতি আৰু গৰু-ম'হৰ প্ৰতি কৃতজ্ঞতা প্ৰকাশ কৰা তামিল সমাজৰ ভোগালী উৎসৱ।",
      localizedSummary:
        "পোংগল হৈছে দক্ষিণ ভাৰতৰ তামিলনাডুৰ প্ৰধান কৃষিভিত্তিক উৎসৱ। অসমৰ ভোগালী বিহুৰ দৰেই পোংগলতো ন-ধানৰ চাউলেৰে সুস্বাদু পায়স প্ৰস্তুত কৰি সূৰ্য আৰু গৰু-ম'হক উপাসনা কৰা হয়।",
      regionLabel: "তামিলনাডু (Tamil Nadu)",
      categoryLabel: "কৃষি মহোৎসৱ",
      traditions: ["থাই পোংগল", "মাট্টু পোংগল", "কোলম অংকন"],
      places: ["মাদুৰাই", "তাঞ্জাভুৰ"],
      keyTerminology: [
        { term: "কোলম", meaning: "চাউলৰ গুড়িৰে চোতালত অঁকা মাংগলিক আল্পনা", language: "Tamil" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "Assamese Cultural Heritage Editorial Board",
      lastQaDate: "2026-10-02",
    },
  },

  // 3. DIWALI (Pan-India)
  diwali: {
    en: {
      canonicalSlug: "diwali",
      languageCode: "en",
      localizedName: "Diwali (Deepavali)",
      localizedTitle: "Diwali — The Pan-Indic Festival of Lights",
      localizedOneLiner: "The pan-indic celebration of illumination over ignorance, documented across diverse regional and spiritual lineages.",
      localizedSummary:
        "Diwali is observed across South Asia with deep regional diversity: Rama's return to Ayodhya in Northern traditions, dawn Ganga Snanam in Tamil Nadu, Kali Puja in Bengal, Mahavira's Nirvana in Jainism, Bandi Chhor Divas in Sikhism, and Mha Puja in Nepal. Rather than a monolithic rite, EKA documents its multifaceted sacred manifestations.",
      regionLabel: "Pan-India & Global Diaspora",
      categoryLabel: "Living Festival & Epistemic Tradition",
      traditions: ["Terracotta Diya lighting", "Ganga Snanam", "Lakshmi Puja", "Kali Puja", "Bandi Chhor Divas"],
      places: ["Ayodhya", "Varanasi", "Amritsar", "Madurai", "Kolkata"],
      keyTerminology: [
        { term: "Diya", meaning: "Handmade terracotta oil lamp dispelling darkness", language: "Sanskrit" },
        { term: "Ganga Snanam", meaning: "Sacred dawn medicinal bath in Tamil tradition", language: "Tamil" },
      ],
      translationStatus: "published",
      verificationStatus: "verified",
      reviewedBy: "EKA Curatorial Board",
      lastQaDate: "2026-09-28",
    },
    hi: {
      canonicalSlug: "diwali",
      languageCode: "hi",
      localizedName: "दीपावली",
      localizedTitle: "दीपावली — प्रकाश, सद्भाव और चेतना का महापर्व",
      localizedOneLiner: "अज्ञान पर ज्ञान और अंधकार पर प्रकाश की विजय का पावन उत्सव, जो भारत की विविध परंपराओं में रचा-बसा है।",
      localizedSummary:
        "दीपावली भारतीय संस्कृति का सबसे पावन प्रकाश पर्व है। अयोध्या में श्रीराम के आगमन से लेकर, काशी के देव दीपावली, जैन धर्म में भगवान महावीर के निर्वाण, सिख परंपरा में बंदी छोड़ दिवस और बंगाल में काली पूजा तक, यह पर्व क्षेत्रीय विविधताओं से समृद्ध है। मिट्टी के दीये और रंगोली इसकी शाश्वत पहचान हैं।",
      regionLabel: "सम्पूर्ण भारत (Pan-India)",
      categoryLabel: "महापर्व (Grand Festival)",
      traditions: ["मिट्टी के दीये प्रज्वलन", "लक्ष्मी-गणेश पूजन", "चौपड़ा पूजन", "गोवर्धन पूजा"],
      places: ["अयोध्या", "काशी (वाराणसी)", "अमृतसर", "कोलकाता"],
      keyTerminology: [
        { term: "दीपक", meaning: "मिट्टी का पारंपरिक तेल का दीया", language: "Sanskrit" },
        { term: "तमसो मा ज्योतिर्गमय", meaning: "अंधकार से प्रकाश की ओर ले चलो", language: "Sanskrit" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "EKA National Cultural Editorial Board",
      lastQaDate: "2026-10-01",
    },
    as: {
      canonicalSlug: "diwali",
      languageCode: "as",
      localizedName: "দীপাৱলী",
      localizedTitle: "দীপাৱলী — পোহৰ আৰু সদ্ভাৱৰ পৱিত্ৰ উৎসৱ",
      localizedOneLiner: "মাটিৰ চাকিৰ পোহৰেৰে আন্ধাৰ নাশ কৰি শান্তি আৰু সমৃদ্ধি আহ্বান কৰা এক সৰ্বজনীন মহোৎসৱ।",
      localizedSummary:
        "দীপাৱলী হৈছে পোহৰৰ মহোৎসৱ। মাটিৰ চাকিৰে ঘৰ-চোতাল আলোকিত কৰি মা লক্ষ্মীৰ আৰাধনা আৰু অন্ধকাৰৰ বিৰুদ্ধে আলোকৰ জয় উদযাপন কৰা হয়। অসমৰ সমাজত কাতি বিহুৰ চাকি আৰু দীপাৱলীৰ চাকিৰ মাজত এক সুন্দৰ আত্মিক সমন্বয় দেখা যায়।",
      regionLabel: "সমগ্ৰ ভাৰত (Pan-India)",
      categoryLabel: "পোহৰৰ উৎসৱ",
      traditions: ["মাটিৰ চাকি প্ৰজ্বলন", "লক্ষ্মী পূজা", "গোৱৰ্ধন পূজা"],
      places: ["গুৱাহাটী", "বাৰাণসী", "অযোধ্যা"],
      keyTerminology: [
        { term: "চাকি", meaning: "মাটিৰে গঢ়া তেলৰ পৱিত্ৰ দীপ", language: "Assamese" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "Assamese Cultural Heritage Editorial Board",
      lastQaDate: "2026-10-02",
    },
    ta: {
      canonicalSlug: "diwali",
      languageCode: "ta",
      localizedName: "தீபாவளி",
      localizedTitle: "தீபாவளி — ஒளியின் மங்களகரமான திருவிழா",
      localizedOneLiner: "அதிகாலை கங்கா ஸ்நானம், எண்ணெய் தேய்த்துக் குளித்தல் மற்றும் மங்கள விளக்குகளின் திருநாள்.",
      localizedSummary:
        "தமிழ் மரபில் தீபாவளி என்பது அதிகாலை கங்கா ஸ்நானத்துடன் தொடங்குகிறது. நல்லெண்ணெய் தேய்த்துக் குளித்து, புத்தாடை அணிந்து, லேகியம் உண்டு, தீபங்களை ஏற்றி மகிழும் தொன்மையான தமிழ் மரபு.",
      regionLabel: "தமிழ்நாடு மற்றும் அகில உலகம்",
      categoryLabel: "மங்கள ஒளித் திருவிழா",
      traditions: ["கங்கா ஸ்நானம்", "தீபாவளி லேகியம்", "அகல் விளக்கு"],
      places: ["மதுரை", "சென்னை", "காஞ்சிபுரம்"],
      keyTerminology: [
        { term: "கங்கா ஸ்நானம்", meaning: "புனித நீராடலாகக் கருதப்படும் அதிகாலை எண்ணெய் குளியல்", language: "Tamil" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "Tamil Heritage Academic Panel",
      lastQaDate: "2026-10-02",
    },
  },

  // 4. MAJULI SATTRA CULTURE (Assam)
  "majuli-sattra-culture": {
    as: {
      canonicalSlug: "majuli-sattra-culture",
      languageCode: "as",
      localizedName: "মাজুলীৰ সত্ৰীয়া সংস্কৃতি",
      localizedTitle: "মাজুলীৰ সত্ৰীয়া সংস্কৃতি — নদীদ্বীপৰ আধ্যাত্মিক পৰম্পৰা",
      localizedOneLiner: "শ্ৰীমন্ত শংকৰদেৱৰ নৱবৈষ্ণৱ ধৰ্ম আৰু সত্ৰীয়া নৃত্য-গীতৰ ৫শ বছৰীয়া ঐতিহ্যবাহী সজীৱ সংগ্ৰহালয়।",
      localizedSummary:
        "বিশ্বৰ সৰ্ববৃহৎ নদীদ্বীপ মাজুলী অসমৰ আধ্যাত্মিক হৃৎপিণ্ডস্বৰূপ। পঞ্চদশ শতিকাত মহাপুৰুষ শ্ৰীমন্ত শংকৰদেৱ আৰু মাধৱদেৱে স্থাপন কৰা সত্ৰসমূহ অসমীয়া সমাজৰ কলা, সাহিত্য, সত্ৰীয়া নৃত্য, অংকীয়া ভাওনা আৰু মুখাশিল্পৰ মূল কেন্দ্ৰ। ঔনিয়াটী, দক্ষিণপাট, কমলাবাৰী আৰু চামগুৰি সত্ৰই এই পৰম্পৰা অটুট ৰাখিছে।",
      regionLabel: "মাজুলী, অসম (Assam)",
      categoryLabel: "আধ্যাত্মিক আৰু সত্ৰীয়া ঐতিহ্য",
      traditions: ["অংকীয়া ভাওনা", "সত্ৰীয়া নৃত্য", "মুখাশিল্প", "বৰগীত", "নাম-কীৰ্তন"],
      places: ["চামগুৰি সত্ৰ", "কমলাবাৰী সত্ৰ", "ঔনিয়াটী সত্ৰ", "দক্ষিণপাট সত্ৰ"],
      keyTerminology: [
        { term: "সত্ৰ", meaning: "অসমীয়া নৱবৈষ্ণৱ সংস্কৃতি আৰু ধৰ্মচর্চাৰ ঐতিহাসিক মঠ", language: "Assamese" },
        { term: "ভাওনা", meaning: "শংকৰদেৱ সৃষ্ট পৌৰাণিক ঐতিহ্যবাহী নাট্য প্ৰদৰ্শন", language: "Assamese" },
        { term: "মুখা", meaning: "বাঁহ, মাটি আৰু কাপোৰেৰে নিৰ্মিত চামগুৰি সত্ৰৰ পৌৰাণিক মুখা", language: "Assamese" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "Assamese Cultural Heritage Editorial Board",
      lastQaDate: "2026-10-01",
    },
    en: {
      canonicalSlug: "majuli-sattra-culture",
      languageCode: "en",
      localizedName: "Majuli Sattra Monastic Culture",
      localizedTitle: "Majuli Sattra Culture — Living Monasticism of the River Island",
      localizedOneLiner: "The 500-year neo-Vaishnavite cultural sanctuaries pioneering classical Sattriya dance, manuscript preservation, and bamboo-clay maskcraft.",
      localizedSummary:
        "Majuli, the world's largest populated river island in the Brahmaputra, is home to medieval monastic institutions (Sattras) founded by polymath saint Srimanta Sankardeva in the 15th-16th centuries. Communities at Kamalabari, Auniati, and Samaguri practice devotional celibate monasticism, Ankiya Bhaona open-air theatre, and heirloom mukha (mask) sculpting.",
      regionLabel: "Majuli, Assam",
      categoryLabel: "Riverine Monasticism & Sacred Arts",
      traditions: ["Sattriya Classical Dance", "Ankiya Bhaona", "Samaguri Bamboo Mask Craft", "Borgeet Chants"],
      places: ["Samaguri Sattra", "Kamalabari Sattra", "Auniati Sattra", "Dakhinpat Sattra"],
      keyTerminology: [
        { term: "Sattra", meaning: "Monastic center of Assamese Vaishnavite arts and philosophy", language: "Assamese" },
        { term: "Bhaona", meaning: "Sacred dramatization using brajavali language and rhythmic khol", language: "Assamese" },
      ],
      translationStatus: "published",
      verificationStatus: "verified",
      reviewedBy: "EKA Curatorial Board",
      lastQaDate: "2026-09-29",
    },
    hi: {
      canonicalSlug: "majuli-sattra-culture",
      languageCode: "hi",
      localizedName: "माजुली सत्र संस्कृति",
      localizedTitle: "माजुली सत्र संस्कृति — ब्रह्मपुत्र के द्वीप की आध्यात्मिक धारा",
      localizedOneLiner: "श्रीमंत शंकरदेव द्वारा स्थापित 500 वर्ष पुरानी सत्र परंपरा, जो शास्त्रीय सत्रिया नृत्य और मुखौटा कला का केंद्र है।",
      localizedSummary:
        "असम का माजुली द्वीप वैष्णव भक्ति और कला का अनुपम संगम है। 15वीं सदी में संत शंकरदेव ने यहाँ सत्रों की स्थापना की। सामगुरी सत्र के हस्तनिर्मित मुखौटे और कमलाबाड़ी सत्र का सत्रिया नृत्य भारत की अद्वितीय अमूर्त सांस्कृतिक धरोहर हैं।",
      regionLabel: "माजुली, असम",
      categoryLabel: "मठ परंपरा और शास्त्रीय कलाएं",
      traditions: ["सत्रिया नृत्य", "अंकिया भावना", "सामगुरी मुखौटा कला"],
      places: ["सामगुरी सत्र", "कमलाबाड़ी सत्र", "औनियाटी सत्र"],
      keyTerminology: [
        { term: "सत्र", meaning: "असम के पारंपरिक वैष्णव आध्यात्मिक व सांस्कृतिक केंद्र", language: "Assamese" },
      ],
      translationStatus: "verified",
      verificationStatus: "verified",
      reviewedBy: "EKA National Cultural Editorial Board",
      lastQaDate: "2026-10-01",
    },
  },
};

/**
 * Universal content retriever across the knowledge graph
 * Follows strict resolution:
 * Explicit language -> English fallback -> Canonical knowledge object
 */
export function getContent(params: {
  entity: string;
  language?: string;
  region?: string;
}): {
  canonicalSlug: string;
  localizedName: string;
  localizedTitle: string;
  localizedOneLiner: string;
  localizedSummary: string;
  region: string;
  category: string;
  traditions: string[];
  places: string[];
  keyTerminology: Array<{ term: string; meaning: string; language: string }>;
  translationStatus: TranslationStatus;
  verificationStatus: "verified" | "review_needed" | "community_dispute";
  isFallback: boolean;
  activeLanguage: string;
} {
  const { entity, language = "en", region } = params;
  const canonicalObj = getKnowledgeObjectBySlug(entity);

  // Normalize language key (e.g. "as-IN" -> "as")
  const langKey = language.split("-")[0]?.toLowerCase() || "en";

  // Check localized translations map
  const entityTranslations = CULTURAL_TRANSLATIONS_MAP[entity];
  const directMatch = entityTranslations?.[langKey];

  if (directMatch) {
    return {
      canonicalSlug: directMatch.canonicalSlug,
      localizedName: directMatch.localizedName,
      localizedTitle: directMatch.localizedTitle,
      localizedOneLiner: directMatch.localizedOneLiner,
      localizedSummary: directMatch.localizedSummary,
      region: directMatch.regionLabel,
      category: directMatch.categoryLabel,
      traditions: directMatch.traditions,
      places: directMatch.places,
      keyTerminology: directMatch.keyTerminology,
      translationStatus: directMatch.translationStatus,
      verificationStatus: directMatch.verificationStatus,
      isFallback: false,
      activeLanguage: langKey,
    };
  }

  // Fallback to English translation if available
  const englishMatch = entityTranslations?.["en"];
  if (englishMatch) {
    return {
      canonicalSlug: englishMatch.canonicalSlug,
      localizedName: englishMatch.localizedName,
      localizedTitle: englishMatch.localizedTitle,
      localizedOneLiner: englishMatch.localizedOneLiner,
      localizedSummary: englishMatch.localizedSummary,
      region: englishMatch.regionLabel,
      category: englishMatch.categoryLabel,
      traditions: englishMatch.traditions,
      places: englishMatch.places,
      keyTerminology: englishMatch.keyTerminology,
      translationStatus: englishMatch.translationStatus,
      verificationStatus: englishMatch.verificationStatus,
      isFallback: true,
      activeLanguage: "en",
    };
  }

  // Canonical base object fallback
  if (canonicalObj) {
    return {
      canonicalSlug: canonicalObj.slug,
      localizedName: canonicalObj.culturalDimensions.identity.canonicalName,
      localizedTitle: `${canonicalObj.entity} — Living Cultural Tradition`,
      localizedOneLiner: canonicalObj.oneLiner,
      localizedSummary: canonicalObj.summary,
      region: canonicalObj.culturalDimensions.identity.regions[0] || "Global",
      category: canonicalObj.type,
      traditions: canonicalObj.culturalDimensions.practices.rituals,
      places: canonicalObj.culturalDimensions.geography.places,
      keyTerminology: canonicalObj.culturalDimensions.language.keyTerminology,
      translationStatus: "published",
      verificationStatus: "verified",
      isFallback: true,
      activeLanguage: "en",
    };
  }

  // Graceful empty fallback (never crashes UI)
  return {
    canonicalSlug: entity,
    localizedName: entity,
    localizedTitle: entity,
    localizedOneLiner: "Cultural entity in curation",
    localizedSummary: "Verified knowledge representation is currently in active curation.",
    region: region || "Global",
    category: "Heritage",
    traditions: [],
    places: [],
    keyTerminology: [],
    translationStatus: "draft",
    verificationStatus: "review_needed",
    isFallback: true,
    activeLanguage: langKey,
  };
}
