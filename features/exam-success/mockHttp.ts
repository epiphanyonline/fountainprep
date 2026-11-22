/**
 * Framework-neutral HTTP boundary for the future mock API.
 *
 * This module is deliberately NOT imported by a Next.js route. Before mounting
 * it, provide a real server-authenticated, transactional Supabase adapter on
 * a SEPARATE staging project and complete all staging security tests.
 *
 * Never construct a store using browser-supplied learner IDs, service-role keys
 * must remain server-side, and never return stored answer keys before submission.
 */
import { resumeMock, type ResumableExamStore } from "./mockResume";
import {
  ExamAccessError,
  finishMock,
  saveMockAnswer,
  startMock,
} from "./mockService";

type Action = "start" | "save" | "resume" | "submit";
type RequestBody = Record<string, unknown>;
const allowedActions = new Set<Action>(["start", "save", "resume", "submit"]);
const maxBodyBytes = 4096;

function isRecord(value: unknown): value is RequestBody {
  return typeof value === "object" && value !== null &&
    !Array.isArray(value);
}
function validId(value: unknown): value is string {
  return typeof value === "string" &&
    /^[A-Za-z0-9_-]{1,128}$/.test(value);
}
function errorResponse(code: string, status: number): Response {
  return Response.json({ error: code }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
function success(value: unknown, status = 200): Response {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/** Must be invoked only by a trusted server-authenticated store factory. */
export async function handleExamRequest(
  request: Request,
  store: ResumableExamStore,
): Promise<Response> {
  if (request.method !== "POST") return errorResponse("method_not_allowed", 405);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return errorResponse("unsupported_media_type", 415);
  }
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > maxBodyBytes) return errorResponse("payload_too_large", 413);
  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > maxBodyBytes) {
      return errorResponse("payload_too_large", 413);
    }
    body = JSON.parse(raw) as unknown;
  } catch {
    return errorResponse("malformed_json", 400);
  }
  if (!isRecord(body) || !allowedActions.has(body.action as Action)) {
    return errorResponse("invalid_request", 400);
  }

  try {
    // The learner identity comes entirely from store.authenticatedLearnerId().
    // Extra userId or learnerId JSON properties are never consulted.
    if (body.action === "start") {
      if (!validId(body.paperId) || !validId(body.requestId)) {
        return errorResponse("invalid_request", 400);
      }
      return success(await startMock(store, body.paperId, body.requestId), 201);
    }
    if (body.action === "save") {
      if (!validId(body.attemptId) || !validId(body.questionId) ||
          !validId(body.requestId) ||
          !(body.optionId === null || validId(body.optionId))) {
        return errorResponse("invalid_request", 400);
      }
      const saved = await saveMockAnswer(store, {
        attemptId: body.attemptId,
        questionId: body.questionId,
        requestId: body.requestId,
        optionId: body.optionId,
      });
      const status = saved === "saved" ? 200 :
        saved === "closed" ? 409 :
        saved === "forbidden" ? 403 : 400;
      return success({ status: saved }, status);
    }
    if (body.action === "resume") {
      if (!validId(body.attemptId)) return errorResponse("invalid_request", 400);
      // Answer keys are never included by the store's resume projection.
      return success(await resumeMock(store, body.attemptId));
    }
    if (!validId(body.attemptId) || !validId(body.requestId)) {
      return errorResponse("invalid_request", 400);
    }
    return success(await finishMock(store, body.attemptId, body.requestId));
  } catch (error) {
    if (error instanceof ExamAccessError) {
      if (error.reason === "unauthenticated") return errorResponse(error.reason, 401);
      if (error.reason === "unavailable") return errorResponse(error.reason, 404);
      return errorResponse(error.reason, 400);
    }
    // Database/adapter exceptions must not disclose SQL, other learner data
    // or answer keys. Server error logging is added at the route boundary.
    return errorResponse("request_failed", 500);
  }
}
