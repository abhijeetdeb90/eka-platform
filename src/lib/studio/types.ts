// ==============================================================================
// EKA STUDIO — INTERNAL CONTROL PLANE TYPES & DOMAIN MODELS (v1.0)
// ==============================================================================

export type StudioRole =
  | "Founder"
  | "Super Admin"
  | "Content Admin"
  | "Knowledge Editor"
  | "Verifier"
  | "Community Moderator"
  | "Creator Manager"
  | "Support"
  | "Enterprise Admin"
  | "Analyst"
  | "Read Only";

export type StudioPermission =
  | "content:create"
  | "content:edit"
  | "content:publish"
  | "content:archive"
  | "content:delete"
  | "knowledge:create"
  | "knowledge:edit"
  | "knowledge:verify"
  | "knowledge:restore"
  | "knowledge:archive"
  | "graph:edit"
  | "taxonomy:edit"
  | "homepage:edit"
  | "navigation:edit"
  | "media:upload"
  | "media:delete"
  | "users:moderate"
  | "users:manage_roles"
  | "enterprise:manage"
  | "api_keys:manage"
  | "monetization:manage"
  | "config:edit"
  | "flags:edit"
  | "audit:view"
  | "system:diagnostics"
  | "backups:manage";

export type EpistemicTier =
  | "documented_tradition"
  | "interpretation"
  | "opinion"
  | "living_practice"
  | "modern_adaptation";

export type VerificationStatus =
  | "Draft"
  | "Under Review"
  | "Community Verified"
  | "Expert Verified"
  | "Source Verified"
  | "Published"
  | "Disputed"
  | "Archived";

export interface PrimaryReference {
  title: string;
  citation: string;
  access_uri?: string;
  author?: string;
  publisher?: string;
  year?: string;
}

export interface VerificationRecord {
  id: string;
  who: string;
  role: string;
  when: string;
  decision: "approved" | "rejected" | "disputed" | "status_change";
  previous_status?: VerificationStatus;
  new_status: VerificationStatus;
  evidence?: string;
  notes?: string;
}

export interface CommunityValidation {
  count: number;
  status: "pending" | "corroborated" | "disputed";
  confirmations: Array<{
    user_id: string;
    community: string;
    confirmed_at: string;
    comment?: string;
  }>;
}

export interface ExpertValidation {
  status: "pending" | "endorsed" | "disputed";
  reviews: Array<{
    reviewer_id: string;
    name: string;
    affiliation: string;
    status: "endorsed" | "concerns_raised";
    notes: string;
    reviewed_at: string;
  }>;
}

export interface InterpretationItem {
  school: string;
  scholar?: string;
  explanation: string;
  source_citation?: string;
}

export interface RegionalVariation {
  region: string;
  community: string;
  variation_details: string;
}

export interface ProvenanceMetadata {
  source_name?: string;
  source_type: "canonical_scripture" | "academic" | "oral_lineage" | "field_ethnography" | "practitioner";
  publisher?: string;
  author?: string;
  url?: string;
  publication_date?: string;
  retrieval_date?: string;
  citation?: string;
  evidence?: string;
  contributor?: string;
  confidence_score: number;
  is_ai_generated: boolean;
  notes?: string;
}

export interface CanonicalKnowledgeObject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  type:
    | "Tradition"
    | "Practice"
    | "Ritual"
    | "Festival"
    | "Concept"
    | "Text"
    | "Figure"
    | "Place"
    | "Community"
    | "Business"
    | "Experience";
  category: string;
  tradition: string;
  religion_worldview: string;
  community: string;
  geography: {
    origin_region?: string;
    cultural_locus?: string;
    country?: string;
    coordinates?: [number, number];
    global_diaspora?: boolean;
  };
  language: {
    liturgical?: string;
    vernacular: string[];
  };
  time_period: {
    historical_era?: string;
    approx_centuries?: string;
    continuity: string;
  };
  event?: string;
  practice?: string;
  person?: string;
  place?: string;
  business?: string;
  sources: string[];
  primary_references: PrimaryReference[];
  evidence: string[];
  citations: string[];
  verification_status: VerificationStatus;
  verification_records: VerificationRecord[];
  community_validation: CommunityValidation;
  expert_validation: ExpertValidation;
  interpretation: InterpretationItem[];
  regional_variations: RegionalVariation[];
  confidence: number;
  provenance: ProvenanceMetadata;
  related_objects: string[];
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  status: "draft" | "review" | "published" | "archived";
  is_archived: boolean;
}

export interface KnowledgeObjectVersion {
  id: string;
  knowledge_object_id: string;
  version_number: number;
  title: string;
  snapshot: CanonicalKnowledgeObject;
  diff_summary: string;
  changed_by: string;
  change_reason: string;
  created_at: string;
}

export type GraphPredicate =
  | "ASSOCIATED_WITH"
  | "PRACTICED_IN"
  | "BELONGS_TO"
  | "LOCATED_IN"
  | "EXPLAINS"
  | "SUPPORTS"
  | "CODIFIED_IN"
  | "CELEBRATED_AT"
  | "OBSERVED_VIA"
  | "PRESERVES"
  | "DERIVED_FROM"
  | "DISPUTED_BY";

export interface KnowledgeRelationship {
  id: string;
  from_id: string;
  from_type: string;
  from_title?: string;
  predicate: GraphPredicate;
  to_id: string;
  to_type: string;
  to_title?: string;
  confidence: number;
  provenance: {
    source?: string;
    notes?: string;
  };
  notes?: string;
  is_disputed: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TaxonomyNode {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  kind: "culture" | "tradition" | "geography" | "heritage" | "practice" | "lifestyle";
  description?: string;
  sort_order: number;
  meta: Record<string, unknown>;
  children?: TaxonomyNode[];
  created_at?: string;
  updated_at?: string;
}

export type HomepageLayout =
  | "hero"
  | "grid"
  | "carousel"
  | "rail"
  | "list"
  | "featured_card";

export type HomepageDataSource =
  | "curated"
  | "trending"
  | "featured_knowledge"
  | "culture"
  | "geography"
  | "places"
  | "creators"
  | "communities"
  | "festivals"
  | "businesses";

export interface HomepageSection {
  id: string;
  title: string;
  subtitle?: string;
  layout: HomepageLayout;
  data_source: HomepageDataSource;
  config: {
    limit?: number;
    badge?: string;
    cta_text?: string;
    cta_link?: string;
    background_tint?: string;
    auto_rotate?: boolean;
  };
  selected_ids: string[];
  sort_order: number;
  is_visible: boolean;
  schedule_publish?: string | null;
  schedule_unpublish?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  badge?: string;
  icon?: string;
  children?: NavigationItem[];
  is_external?: boolean;
}

export interface NavigationMenu {
  id: string;
  location: "header" | "sidebar" | "footer" | "mobile_tab";
  title: string;
  items: NavigationItem[];
  is_active: boolean;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: "post" | "article" | "collection" | "page";
  description: string;
  body: string;
  media: Array<{
    url: string;
    type: "image" | "video" | "audio";
    alt?: string;
    caption?: string;
  }>;
  author_id?: string;
  creator_name?: string;
  category?: string;
  tags: string[];
  location?: string;
  language: string;
  tradition?: string;
  community?: string;
  sources: string[];
  related_objects: string[];
  seo_metadata: {
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    canonical_url?: string;
  };
  visibility: "public" | "members_only" | "private" | "unlisted";
  status: "draft" | "scheduled" | "published" | "archived";
  scheduled_publish_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  filename: string;
  file_type: "image" | "video" | "audio" | "document";
  url: string;
  thumbnail_url?: string;
  mime_type: string;
  size_bytes: number;
  copyright_status: "public_domain" | "creative_commons" | "licensed" | "owned" | "fair_use";
  license?: string;
  creator?: string;
  source?: string;
  alt_text?: string;
  caption?: string;
  usage_rights?: string;
  tags: string[];
  created_by?: string;
  created_at: string;
}

export interface StudioAuditLog {
  id: string;
  actor_id?: string;
  actor_name?: string;
  actor_role: StudioRole;
  action:
    | "login"
    | "create"
    | "edit"
    | "delete"
    | "publish"
    | "unpublish"
    | "verify"
    | "reject"
    | "restore"
    | "permission_change"
    | "api_key_create"
    | "api_key_revoke"
    | "enterprise_access"
    | "data_export"
    | "billing_change";
  target_type:
    | "knowledge_object"
    | "relationship"
    | "content"
    | "homepage_section"
    | "taxonomy"
    | "source"
    | "media"
    | "user"
    | "api_key"
    | "config";
  target_id?: string;
  target_title?: string;
  details: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface EnterpriseOrg {
  id: string;
  name: string;
  slug: string;
  plan: string;
  billing_status: string;
  seats_limit: number;
  seats_used: number;
  created_at: string;
}

export interface EnterpriseApiKey {
  id: string;
  org_id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  rate_limit_rpm: number;
  is_revoked: boolean;
  last_used_at?: string;
  created_at: string;
}

export interface AIAgentConfig {
  id: string;
  name: string;
  role: string;
  model: string;
  system_prompt: string;
  temperature: number;
  source_policies: string[];
  is_active: boolean;
  updated_at: string;
}

export interface KnowledgeDispute {
  id: string;
  knowledge_object_id: string;
  object_title?: string;
  filed_by: string;
  reason: string;
  evidence: string;
  status: "open" | "under_review" | "resolved" | "dismissed";
  resolution_notes?: string;
  resolved_by?: string;
  created_at: string;
  resolved_at?: string;
}
