# FountainTalk multilingual speech pilot

This branch does not reopen academy routes or alter payments, live lessons, database schemas or the shared English narration API.

## Provider configuration (server only)
- ORINODE_API_KEY: African-language synthesis (Yoruba, Hausa, Igbo).
- ORINODE_IGBO_VOICE: exact voice ID confirmed with provider; no unverified ID is sent.
- AZURE_SPEECH_KEY and AZURE_SPEECH_REGION: Mandarin, French, Spanish.
- FOUNTAINTALK_SPEECH_PILOT_USERS: comma-separated authenticated Supabase user UUIDs, initially staff testers only.
- FOUNTAINTALK_MULTILINGUAL_SPEECH=true: enable the pilot server endpoint.
- NEXT_PUBLIC_FOUNTAINTALK_MULTILINGUAL_SPEECH=true: enable pilot client playback, set only on isolated preview/local builds. This is a build-time setting.

Both flags default off. Do not enable on production. Keys stay server-side. Verify provider terms, quotas, privacy requirements and commercial licensing before enabling. Provider docs: https://maraba.ai/products/orinode-tts/ and https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech

## Scope
The pilot routes explicitly identified target phrases to specialist providers and retains the existing English explanation voice. Existing curriculum recordings remain preferred. The version-controlled override registry allows a reviewed local recording to supersede curriculum audio on explicit replay controls. No arbitrary external URLs. Slow generated playback uses browser playbackRate 0.75. No claim of verified pronunciation or native-speaker equivalence; speech-to-text answer matching is not pronunciation scoring.

Spanish has a voice profile only, not a new course or enabled programme. Mixed-language free conversation, persistent audio caching, admin review/upload UI, robust distributed request quotas, cancellation sequencing and pronunciation assessment require later implementation. Pilot allowlist is not a production entitlement or quota system; set low provider spending limits and never enable publicly before adding distributed rate limiting.

## Verification before launch
Run npm ci, npm test, npm run build. Verify feature-off behaviour and unchanged financial literacy/live lessons. With preview-only flags and approved staff test users, validate authentication rejection, both providers, six locales, missing keys, replay, slow playback, reviewed audio precedence, correct tone markings, timeout and failure handling. Native-speaking reviewers must validate audio and approve corrected assets before learner release. Do not merge or deploy without approval.
