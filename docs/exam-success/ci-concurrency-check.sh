#!/usr/bin/env bash
# Disposable CI PostgreSQL only. Never run with Fountain Prep production keys.
set -euo pipefail

user_id='00000000-0000-4000-8000-000000000001'
paper_id="$(psql -Atq -v ON_ERROR_STOP=1 -c "select id from public.exam_papers where title='Synthetic published'")"
if [[ -z "$paper_id" ]]; then echo "No synthetic published paper" >&2; exit 1; fi

# Two independent PostgreSQL sessions race with the same start idempotency key.
psql -Atq -v ON_ERROR_STOP=1 -c "select exam_private.start_test_attempt('$user_id','$paper_id','parallel-start')" > /tmp/exam-start-a &
pid_a=$!
psql -Atq -v ON_ERROR_STOP=1 -c "select exam_private.start_test_attempt('$user_id','$paper_id','parallel-start')" > /tmp/exam-start-b &
pid_b=$!
wait "$pid_a"
wait "$pid_b"
attempt_a="$(tr -d '[:space:]' < /tmp/exam-start-a)"
attempt_b="$(tr -d '[:space:]' < /tmp/exam-start-b)"
[[ "$attempt_a" = "$attempt_b" && -n "$attempt_a" ]] || {
 echo "Concurrent starts created different attempts" >&2; exit 1;
}
count="$(psql -Atq -v ON_ERROR_STOP=1 -c "select count(*) from public.exam_attempts where learner_user_id='$user_id' and start_request_key='parallel-start'")"
[[ "$count" = 1 ]] || { echo "Concurrent start created $count rows" >&2; exit 1; }

# Two sessions submit the same attempt. The row lock must ensure one result.
psql -Atq -v ON_ERROR_STOP=1 -c "select * from exam_private.submit_test_attempt('$user_id','$attempt_a')" > /tmp/exam-submit-a &
pid_a=$!
psql -Atq -v ON_ERROR_STOP=1 -c "select * from exam_private.submit_test_attempt('$user_id','$attempt_a')" > /tmp/exam-submit-b &
pid_b=$!
wait "$pid_a"
wait "$pid_b"
count="$(psql -Atq -v ON_ERROR_STOP=1 -c "select count(*) from public.exam_results where attempt_id='$attempt_a'")"
[[ "$count" = 1 ]] || { echo "Concurrent submit created $count results" >&2; exit 1; }
grep -Eq '^[0-9]+[.]?[0-9]*\|[0-9]+[.]?[0-9]*\|[tf]$' /tmp/exam-submit-a
grep -Eq '^[0-9]+[.]?[0-9]*\|[0-9]+[.]?[0-9]*\|[tf]$' /tmp/exam-submit-b
[[ "$(grep -c '|f$' /tmp/exam-submit-a /tmp/exam-submit-b | awk -F: '{s+=$2} END {print s}')" = 1 ]] || {
 echo "Expected exactly one first-time submit" >&2; exit 1;
}
[[ "$(grep -c '|t$' /tmp/exam-submit-a /tmp/exam-submit-b | awk -F: '{s+=$2} END {print s}')" = 1 ]] || {
 echo "Expected exactly one idempotent retry" >&2; exit 1;
}
echo "Concurrent starts and submissions each produced exactly one durable record"
