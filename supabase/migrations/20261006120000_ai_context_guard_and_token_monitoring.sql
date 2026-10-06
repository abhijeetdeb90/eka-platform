-- ==============================================================================
-- EKA PLATFORM — AI TOKEN MONITORING & QUESTION CORPUS MIGRATION
-- Specification: Section 33 (AI Token / Context Utilization Architecture)
-- ==============================================================================

-- 1. AI Token Telemetry & Context Health Logs
CREATE TABLE IF NOT EXISTS public.ai_token_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
    task_type TEXT NOT NULL DEFAULT 'ask_eka', -- 'ask_eka', 'reflection', 'rag_retrieval', 'dev_agent', 'admin_synthesis'
    estimated_input_tokens INT NOT NULL DEFAULT 0,
    actual_prompt_tokens INT DEFAULT 0,
    actual_completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'guard_intercepted', 'context_overflow', 'compressed')),
    guard_triggered BOOLEAN NOT NULL DEFAULT false,
    compression_applied BOOLEAN NOT NULL DEFAULT false,
    retrieved_objects_count INT NOT NULL DEFAULT 0,
    retrieved_sources_count INT NOT NULL DEFAULT 0,
    retrieval_size_bytes INT NOT NULL DEFAULT 0,
    largest_retrieved_object_id TEXT,
    largest_retrieved_size_tokens INT DEFAULT 0,
    cost_estimate_usd NUMERIC(10, 6) DEFAULT 0.000000,
    user_id UUID,
    error_message TEXT,
    failure_reason TEXT,
    breakdown JSONB DEFAULT '{
        "system_instructions_tokens": 0,
        "knowledge_retrieval_tokens": 0,
        "conversation_memory_tokens": 0,
        "repository_files_tokens": 0,
        "user_query_tokens": 0
    }'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_token_logs_created_at ON public.ai_token_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_token_logs_status ON public.ai_token_logs(status);
CREATE INDEX IF NOT EXISTS idx_ai_token_logs_task_type ON public.ai_token_logs(task_type);
CREATE INDEX IF NOT EXISTS idx_ai_token_logs_request_id ON public.ai_token_logs(request_id);

-- 2. 10,000+ Question Corpus Schema (Section 33.8)
CREATE TABLE IF NOT EXISTS public.question_corpus (
    id TEXT PRIMARY KEY,
    canonical_question TEXT NOT NULL,
    normalized_question TEXT NOT NULL,
    intent_category TEXT NOT NULL CHECK (intent_category IN (
        'what_is',
        'origin',
        'practice',
        'meaning',
        'regional_variation',
        'sources',
        'comparison',
        'visitor_guidance',
        'philosophy',
        'custodians'
    )),
    primary_entity TEXT NOT NULL,
    related_entities TEXT[] DEFAULT '{}',
    canonical_knowledge_object_id TEXT REFERENCES public.knowledge_objects(id) ON DELETE SET NULL,
    suggested_followups TEXT[] DEFAULT '{}',
    complexity_tier TEXT DEFAULT 'general' CHECK (complexity_tier IN ('introductory', 'general', 'scholarly', 'esoteric')),
    regional_locus TEXT,
    tags TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT true,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_question_corpus_intent ON public.question_corpus(intent_category);
CREATE INDEX IF NOT EXISTS idx_question_corpus_entity ON public.question_corpus(primary_entity);
CREATE INDEX IF NOT EXISTS idx_question_corpus_ko_id ON public.question_corpus(canonical_knowledge_object_id);
CREATE INDEX IF NOT EXISTS idx_question_corpus_normalized ON public.question_corpus(normalized_question);

-- 3. RLS Security Policies
ALTER TABLE public.ai_token_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_corpus ENABLE ROW LEVEL SECURITY;

-- Question corpus is read-accessible to all, writable by studio admins
CREATE POLICY "Public read access to question corpus"
    ON public.question_corpus FOR SELECT
    USING (true);

CREATE POLICY "Admin write access to question corpus"
    ON public.question_corpus FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'founder', 'editor', 'scholar')
        )
    );

-- AI Token logs: service/authenticated insertion, admin read
CREATE POLICY "Authenticated users can record token telemetry"
    ON public.ai_token_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can inspect AI token logs"
    ON public.ai_token_logs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'founder')
        )
    );

-- 4. Seed Canonical Question Corpus Entries (Sample grounding set)
INSERT INTO public.question_corpus (id, canonical_question, normalized_question, intent_category, primary_entity, related_entities, canonical_knowledge_object_id, suggested_followups, regional_locus, tags)
VALUES
    ('q_diwali_variations', 'How does Diwali differ between Tamil Nadu, Bengal, and Jain traditions?', 'how does diwali differ between tamil nadu bengal and jain traditions', 'regional_variation', 'Diwali', ARRAY['Deepavali', 'Kali Puja', 'Mahavira Nirvana'], 'ko_diwali_deepavali', ARRAY['Why do Tamilians wake up before dawn on Deepavali for oil bath?', 'What is the significance of Kali Puja on Amavasya night?'], 'South Asia & Global', ARRAY['diwali', 'deepavali', 'kali-puja', 'jainism', 'regional-variations']),
    ('q_aranmula_mirror', 'What is the secret metallurgy behind the Aranmula Kannadi metal mirror?', 'what is the secret metallurgy behind the aranmula kannadi metal mirror', 'practice', 'Aranmula Kannadi', ARRAY['Metallurgy', 'Vishwakarma Guild', 'Bronze Alloy'], 'ko_aranmula_kannadi', ARRAY['Why does the mirror lack a silver refracting layer?', 'Who are the custodian families of Aranmula?'], 'Kerala', ARRAY['craft', 'metallurgy', 'kerala', 'aranmula', 'living-guild']),
    ('q_bishnoi_rules', 'How do the 29 rules of the Bishnoi protect the Thar desert ecology?', 'how do the 29 rules of the bishnoi protect the thar desert ecology', 'philosophy', 'Bishnoi 29 Rules', ARRAY['Guru Jambheshwar', 'Khejri Tree', 'Desert Ecology'], 'ko_bishnoi_dharma', ARRAY['What was the Khejarli sacrifice in 1730?', 'Why is cutting green Khejri trees forbidden?'], 'Rajasthan', ARRAY['ecology', 'desert', 'bishnoi', 'conservation', 'sacred-nature']),
    ('q_patan_patola', 'Explain the double-ikat geometry and history of Patan Patola', 'explain the double ikat geometry and history of patan patola', 'practice', 'Patan Patola', ARRAY['Salvi Weavers', 'Double Ikat', 'Silk Weaving'], 'ko_patan_patola', ARRAY['Why is Patan Patola dyed before weaving?', 'How long does one saree take to weave?'], 'Gujarat', ARRAY['textiles', 'ikat', 'patan', 'gujarat', 'heritage-craft']),
    ('q_sandhyavandanam_twilight', 'What is the significance of the Gayatri and twilight junctures in Sandhyavandanam?', 'what is the significance of the gayatri and twilight junctures in sandhyavandanam', 'meaning', 'Sandhyavandanam', ARRAY['Gayatri Mantra', 'Solar Juncture', 'Pranayama'], 'ko_sandhyavandanam', ARRAY['Why is Sandhya practiced three times a day?', 'What does Arghya water offering symbolize?'], 'Pan-Indian', ARRAY['ritual', 'vedic', 'gayatri', 'meditation', 'twilight']),
    ('q_bhakti_singing', 'How did the Bhakti movement transform communal singing and vernacular poetry?', 'how did the bhakti movement transform communal singing and vernacular poetry', 'origin', 'Bhakti Movement', ARRAY['Alvars', 'Warkari', 'Sankirtan', 'Kabir'], 'ko_bhakti_movement', ARRAY['How did Tukaram and Namdev democratize devotion?', 'What is the significance of the Pandharpur Vari foot pilgrimage?'], 'Subcontinent', ARRAY['bhakti', 'poetry', 'kirtan', 'egalitarian', 'saints'])
ON CONFLICT (id) DO NOTHING;
