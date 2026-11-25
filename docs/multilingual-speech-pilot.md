# FountainTalk multilingual speech pilot — stage 2

No changes to production, main, academy access routes, bookings, payments or English narration. No database script has been applied.

## Set up an isolated preview or local environment first
1. Provision an isolated Supabase development project. Review and test `docs/sql/fountaintalk-pronunciation-pilot.sql`, then convert it into a verified migration. It adds only two private tables and one service-role-only atomic quota function. CLI/migration and database verification are pending.
2. Use the development project's NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and server-only SUPABASE_SERVICE_ROLE_KEY. Never use production data or expose secrets.
3. Set FOUNTAINTALK_SPEECH_PILOT_USERS to comma-separated development user UUIDs and FOUNTAINTALK_SPEECH_REVIEWERS to the subset authorised to approve pronunciation.
4. Set ORINODE_API_KEY for Yoruba/Igbo/Hausa. Use the current developer API at https://api.maraba.ai/api/developer/v1/tts/ documented at https://maraba.ai/developer/docs/. It selects a voice by language (yo/ig/ha), returns base64 WAV and supports sandbox keys; sandbox/mock output is deliberately not playable as real teaching audio. Confirm live access, pricing and education/audio reuse licensing with the provider before activation.
5. For French, Spanish and Mandarin configure AZURE_SPEECH_KEY and AZURE_SPEECH_REGION. Spanish course content is not yet implemented.
6. Set FOUNTAINTALK_MULTILINGUAL_SPEECH=true and NEXT_PUBLIC_FOUNTAINTALK_MULTILINGUAL_SPEECH=true only in preview/local. Both default off. The service refuses paid generation if the database quota is unavailable. Cap: 100 attempted paid requests per pilot user per UTC day (approved playback does not count). Set provider spending limits too.

## Reviewer workflow
Open /admin/pronunciation-library, authenticate with a listed reviewer account, enter the exact phrase with tone marks, listen to fresh AI audio or the latest approved recording, preview a WAV/MP3 correction, provide a review note, confirm pronunciation and recording rights, and publish. New revisions take precedence over old ones; historical revisions remain in the database and metadata list. No learner recordings. Pilot clips are deliberately small (1.5 MB max) and stored in the service-only database for atomic publication; move to private object storage with a versioned audit trail before scale. This screen is not linked into the production admin menu. No rollback button yet: a reviewer can republish a verified previous recording.

Explicit target-phrase playback and correction/replay routes prefer a published review, then existing curriculum audio (where available), then specialist generated audio. English explanations stay on the original narration service. The approved-only lookup returns 404 if no approved revision exists. Slow playback uses 0.75 browser playback speed. Matching preserves tone marks; this is not automatic tone or pronunciation scoring.

## Before release
Run npm ci, npm test, npm run build and preview-only end-to-end tests. Verify RLS/direct Data API denial, reviewer/pilot allowlists, quota concurrency, correct MIME, provider mock rejection, exact tonal lookup, existing curriculum audio fallback, reviewed precedence, normal/slow playback, and no regressions in live tutoring and finance narration. Native tutors must validate generated pronunciation. Test interruption/cancellation sequencing, access entitlements and speech assessment before general learner release. Commercial licensing, provider credentials, live audio, database and full build have not yet been verified. No merging or production deployment until approved.
