"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type TutorEvent = {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  timezone: string;
  meeting_link: string;
  status: string;
  created_at: string;
};

type EventInvite = {
  id: string;
  event_id: string;
  tutor_name: string;
  tutor_email: string;
  email_status: string;
  attendance_status: string;
  sent_at: string | null;
};

type EventWithSummary = TutorEvent & {
  invited_count: number;
  sent_count: number;
  failed_count: number;
  confirmed_count: number;
};

type GeneralCommunication = {
  id: string;
  communication_type: string;
  subject: string;
  heading: string | null;
  message: string;
  button_text: string | null;
  button_url: string | null;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  status: string;
  created_at: string;
};

type OrientationTutor = {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  approval_status: string;
  orientation_completed: boolean;
  orientation_score: number | null;
  orientation_completed_at: string | null;
};

export default function AdminCommunicationsPage() {
  const [events, setEvents] = useState<EventWithSummary[]>([]);
  const [invites, setInvites] = useState<EventInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventWithSummary | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<
    "events" | "general" | "orientation"
  >("events");
  const [generalCommunications, setGeneralCommunications] = useState<
    GeneralCommunication[]
  >([]);
  const [generalLoading, setGeneralLoading] = useState(true);
  const [orientationTutors, setOrientationTutors] = useState<
    OrientationTutor[]
  >([]);
  const [orientationLoading, setOrientationLoading] = useState(true);
  const [sendingOrientation, setSendingOrientation] = useState(false);
  const [sendingTutorId, setSendingTutorId] = useState<string | null>(null);
  const [showPendingTutors, setShowPendingTutors] = useState(false);
  const [showCompletedTutors, setShowCompletedTutors] = useState(false)

  async function loadEvents() {
    setLoading(true);
    setMessage("");

    const { data: eventRows, error: eventError } = await supabase
      .from("tutor_events")
      .select(
        `
        id,
        event_type,
        title,
        description,
        event_date,
        start_time,
        end_time,
        timezone,
        meeting_link,
        status,
        created_at
      `,
      )
      .order("event_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (eventError) {
      setMessage(eventError.message);
      setLoading(false);
      return;
    }

    const eventIds = (eventRows ?? []).map((event) => event.id);

    let inviteRows: EventInvite[] = [];

    if (eventIds.length > 0) {
      const { data, error } = await supabase
        .from("tutor_event_invites")
        .select(
          `
          id,
          event_id,
          tutor_name,
          tutor_email,
          email_status,
          attendance_status,
          sent_at
        `,
        )
        .in("event_id", eventIds)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      inviteRows = (data ?? []) as EventInvite[];
    }

    const enrichedEvents = (eventRows ?? []).map((event) => {
      const relatedInvites = inviteRows.filter(
        (invite) => invite.event_id === event.id,
      );

      return {
        ...event,
        invited_count: relatedInvites.length,
        sent_count: relatedInvites.filter(
          (invite) => invite.email_status === "SENT",
        ).length,
        failed_count: relatedInvites.filter(
          (invite) => invite.email_status === "FAILED",
        ).length,
        confirmed_count: relatedInvites.filter(
          (invite) => invite.attendance_status === "CONFIRMED",
        ).length,
      };
    });

    setInvites(inviteRows);
    setEvents(enrichedEvents);
    setLoading(false);
  }

  async function loadGeneralCommunications() {
    setGeneralLoading(true);

    const { data, error } = await supabase
      .from("tutor_communications")
      .select(
        `
        id,
        communication_type,
        subject,
        heading,
        message,
        button_text,
        button_url,
        recipient_count,
        sent_count,
        failed_count,
        status,
        created_at
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setGeneralLoading(false);
      return;
    }

    setGeneralCommunications((data ?? []) as GeneralCommunication[]);
    setGeneralLoading(false);
  }

  async function loadOrientationTutors() {
    setOrientationLoading(true);

    const { data: tutorRows, error: tutorError } = await supabase
      .from("tutor_profiles")
      .select(
        `
        id,
        user_id,
        full_name,
        approval_status,
        orientation_completed,
        orientation_score,
        orientation_completed_at
      `,
      )
      .eq("approval_status", "approved")
      .order("full_name", { ascending: true });

    if (tutorError) {
      setMessage(tutorError.message);
      setOrientationLoading(false);
      return;
    }

    const userIds = Array.from(
      new Set(
        (tutorRows ?? [])
          .map((tutor) => tutor.user_id)
          .filter(Boolean),
      ),
    );

    const emailMap = new Map<string, string | null>();

    if (userIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, email")
        .in("id", userIds);

      if (profileError) {
        console.warn(
          "Unable to load tutor email addresses:",
          profileError.message,
        );
      }

      for (const profile of profileRows ?? []) {
        emailMap.set(profile.id, profile.email ?? null);
      }
    }

    const tutorsWithEmails: OrientationTutor[] = (tutorRows ?? []).map(
      (tutor) => ({
        id: tutor.id,
        user_id: tutor.user_id,
        full_name: tutor.full_name,
        email: emailMap.get(tutor.user_id) ?? null,
        approval_status: tutor.approval_status,
        orientation_completed: tutor.orientation_completed ?? false,
        orientation_score: tutor.orientation_score ?? null,
        orientation_completed_at: tutor.orientation_completed_at ?? null,
      }),
    );

    setOrientationTutors(tutorsWithEmails);
    setOrientationLoading(false);
  }

  useEffect(() => {
    loadEvents();
    loadGeneralCommunications();
    loadOrientationTutors();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) => {
      return (
        event.title.toLowerCase().includes(query) ||
        event.event_type.toLowerCase().includes(query) ||
        event.status.toLowerCase().includes(query)
      );
    });
  }, [events, search]);

  const upcomingCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return events.filter(
      (event) => event.event_date >= today && event.status === "SCHEDULED",
    ).length;
  }, [events]);

  const completedCount = useMemo(
    () => events.filter((event) => event.status === "COMPLETED").length,
    [events],
  );

  const cancelledCount = useMemo(
    () => events.filter((event) => event.status === "CANCELLED").length,
    [events],
  );

  const completedOrientationTutors = useMemo(
    () => orientationTutors.filter((tutor) => tutor.orientation_completed),
    [orientationTutors],
  );

  const pendingOrientationTutors = useMemo(
    () =>
      orientationTutors.filter(
        (tutor) => !tutor.orientation_completed && Boolean(tutor.email),
      ),
    [orientationTutors],
  );

  const orientationCompletionRate = useMemo(() => {
    if (orientationTutors.length === 0) return 0;
    return Math.round(
      (completedOrientationTutors.length / orientationTutors.length) * 100,
    );
  }, [completedOrientationTutors.length, orientationTutors.length]);

  async function sendOrientationReminder(tutorIds?: string[]) {
    const selectedCount = tutorIds?.length ?? pendingOrientationTutors.length;

    if (selectedCount === 0) {
      setMessage(
        "There are no approved tutors waiting to complete orientation.",
      );
      return;
    }

    const confirmed = window.confirm(
      tutorIds?.length === 1
        ? "Send an orientation reminder to this tutor?"
        : `Send orientation reminders to ${selectedCount} pending tutor${
            selectedCount === 1 ? "" : "s"
          }?`,
    );

    if (!confirmed) return;

    try {
      setMessage("");

      if (tutorIds?.length === 1) {
        setSendingTutorId(tutorIds[0]);
      } else {
        setSendingOrientation(true);
      }

      const response = await fetch("/api/admin/tutor-orientation-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tutorIds }),
      });

      const responseText = await response.text();
      let result: { error?: string; message?: string } = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Unable to send orientation reminders. Server returned ${response.status}.`,
        );
      }

      setMessage(result.message || "Orientation reminder emails were sent.");
      await loadOrientationTutors();
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send orientation reminder emails.",
      );
    } finally {
      setSendingOrientation(false);
      setSendingTutorId(null);
    }
  }

  async function resendInvitations(event: EventWithSummary) {
    const confirmed = window.confirm(
      `Resend invitations for "${event.title}"?`,
    );

    if (!confirmed) return;

    try {
      setResendingId(event.id);
      setMessage("");

      const response = await fetch("/api/admin/tutor-event-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
        }),
      });

      const responseText = await response.text();

      let result: {
        error?: string;
        message?: string;
        sent?: number;
        failed?: number;
      } = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Unable to resend invitations. Server returned ${response.status}.`,
        );
      }

      setMessage(
        result.message || `Invitations resent successfully for ${event.title}.`,
      );

      await loadEvents();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to resend invitations.",
      );
    } finally {
      setResendingId(null);
    }
  }

  async function updateEventStatus(
    event: EventWithSummary,
    status: "COMPLETED" | "CANCELLED",
  ) {
    const action = status === "COMPLETED" ? "complete" : "cancel";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${event.title}"?`,
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("tutor_events")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", event.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      status === "COMPLETED"
        ? `${event.title} marked as completed.`
        : `${event.title} cancelled.`,
    );

    await loadEvents();
  }

  function getEventInvites(eventId: string) {
    return invites.filter((invite) => invite.event_id === eventId);
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="heroTop">
          <div>
            <p className="eyebrow">Fountain Prep Administration</p>

            <h1>Communications centre</h1>

            <p className="subtitle">
              Manage tutor webinars, orientations, training sessions, seminars
              and important announcements.
            </p>
          </div>

          <Link href="/admin/tutors" className="createButton">
            Create New Invitation
          </Link>
        </div>

        <div className="kpiGrid">
          <Kpi label="Total Events" value={String(events.length)} />
          <Kpi label="Upcoming" value={String(upcomingCount)} />
          <Kpi label="Completed" value={String(completedCount)} />
          <Kpi label="Cancelled" value={String(cancelledCount)} />
        </div>
      </section>

      <section className="content">
        <div
          className="communicationTabs"
          role="tablist"
          aria-label="Communication sections"
        >
          <button
            type="button"
            className={
              activeTab === "events" ? "tabButton active" : "tabButton"
            }
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
          <button
            type="button"
            className={
              activeTab === "general" ? "tabButton active" : "tabButton"
            }
            onClick={() => setActiveTab("general")}
          >
            General Communications
          </button>

          <button
            type="button"
            className={
              activeTab === "orientation" ? "tabButton active" : "tabButton"
            }
            onClick={() => setActiveTab("orientation")}
          >
            Tutor Orientation
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        {activeTab === "events" ? (
          <>
            {loading && <p className="message">Loading communications...</p>}

            <div className="toolbar">
              <input
                type="text"
                placeholder="Search by title, event type or status..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <span>
                {filteredEvents.length} event
                {filteredEvents.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="eventGrid">
              {filteredEvents.map((event) => (
                <article key={event.id} className="eventCard">
                  <div className="cardHeader">
                    <div>
                      <div className="badgeRow">
                        <span className="typeBadge">
                          {formatEventType(event.event_type)}
                        </span>

                        <StatusBadge status={event.status} />
                      </div>

                      <h2>{event.title}</h2>

                      <p className="eventDescription">
                        {event.description ||
                          "No additional description was provided."}
                      </p>
                    </div>

                    <div className="dateBox">
                      <span>Date</span>
                      <strong>{formatEventDate(event.event_date)}</strong>
                    </div>
                  </div>

                  <div className="eventDetails">
                    <Detail
                      label="Time"
                      value={`${formatTime(event.start_time)}${
                        event.end_time ? ` – ${formatTime(event.end_time)}` : ""
                      }`}
                    />

                    <Detail label="Timezone" value={event.timezone} />

                    <Detail
                      label="Invited"
                      value={String(event.invited_count)}
                    />

                    <Detail
                      label="Emails sent"
                      value={String(event.sent_count)}
                    />

                    <Detail
                      label="Confirmed"
                      value={String(event.confirmed_count)}
                    />

                    <Detail label="Failed" value={String(event.failed_count)} />
                  </div>

                  <div className="actions">
                    <a
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="joinButton"
                    >
                      Open Meeting
                    </a>

                    <button
                      type="button"
                      className="secondaryButton"
                      onClick={() => setSelectedEvent(event)}
                    >
                      View Invitees
                    </button>

                    <button
                      type="button"
                      className="secondaryButton"
                      disabled={resendingId === event.id}
                      onClick={() => resendInvitations(event)}
                    >
                      {resendingId === event.id
                        ? "Resending..."
                        : "Resend Emails"}
                    </button>

                    {event.status === "SCHEDULED" && (
                      <>
                        <button
                          type="button"
                          className="completeButton"
                          onClick={() => updateEventStatus(event, "COMPLETED")}
                        >
                          Mark Completed
                        </button>

                        <button
                          type="button"
                          className="cancelButton"
                          onClick={() => updateEventStatus(event, "CANCELLED")}
                        >
                          Cancel Event
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}

              {!loading && filteredEvents.length === 0 && (
                <div className="emptyState">
                  <h2>No communications found</h2>

                  <p>
                    Create your first tutor webinar, orientation or training
                    invitation from the tutor approval page.
                  </p>

                  <Link href="/admin/tutors">Invite Approved Tutors</Link>
                </div>
              )}
            </div>
          </>
        ) : activeTab === "general" ? (
          <section className="generalPanel">
            <div className="orientationIntro">
              <div>
                <p className="eyebrow">Tutor communication</p>
                <h2>General communications</h2>
                <p>
                  View announcements, orientation reminders and other non-event
                  emails sent to approved tutors.
                </p>
              </div>
            </div>

            {generalLoading ? (
              <p className="message">Loading general communications...</p>
            ) : (
              <div className="generalCommunicationGrid">
                {generalCommunications.map((communication) => (
                  <article
                    key={communication.id}
                    className="generalCommunicationCard"
                  >
                    <div className="generalCommunicationHeader">
                      <div>
                        <div className="badgeRow">
                          <span className="typeBadge">
                            General Communication
                          </span>
                          <StatusBadge status={communication.status} />
                        </div>

                        <h2>{communication.subject}</h2>

                        {communication.heading && (
                          <h3>{communication.heading}</h3>
                        )}
                      </div>

                      <div className="dateBox">
                        <span>Sent</span>
                        <strong>
                          {formatCommunicationDate(communication.created_at)}
                        </strong>
                      </div>
                    </div>

                    <p className="eventDescription">
                      {communication.message}
                    </p>

                    <div className="generalDetails">
                      <Detail
                        label="Recipients"
                        value={String(communication.recipient_count)}
                      />
                      <Detail
                        label="Sent"
                        value={String(communication.sent_count)}
                      />
                      <Detail
                        label="Failed"
                        value={String(communication.failed_count)}
                      />
                    </div>

                    {communication.button_url && (
                      <div className="actions">
                        <a
                          href={communication.button_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="joinButton"
                        >
                          {communication.button_text || "Open Link"}
                        </a>
                      </div>
                    )}
                  </article>
                ))}

                {generalCommunications.length === 0 && (
                  <div className="emptyState">
                    <h2>No general communications yet</h2>
                    <p>
                      General announcements and tutor reminder emails will
                      appear here after they are sent.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="orientationPanel">
            <div className="orientationIntro">
              <div>
                <p className="eyebrow">Tutor onboarding</p>
                <h2>Orientation completion</h2>
                <p>
                  Track approved tutors and remind those who have not completed
                  the required Fountain Prep orientation.
                </p>
              </div>

              <button
                type="button"
                className="orientationPrimaryButton"
                disabled={
                  sendingOrientation || pendingOrientationTutors.length === 0
                }
                onClick={() => sendOrientationReminder()}
              >
                {sendingOrientation
                  ? "Sending reminders..."
                  : `Remind All Pending (${pendingOrientationTutors.length})`}
              </button>
            </div>

            {orientationLoading ? (
              <p className="message">Loading tutor orientation progress...</p>
            ) : (
              <>
                <div className="orientationKpiGrid">
                  <Kpi
                    label="Approved Tutors"
                    value={String(orientationTutors.length)}
                  />
                  <Kpi
                    label="Completed"
                    value={String(completedOrientationTutors.length)}
                  />
                  <Kpi
                    label="Pending"
                    value={String(pendingOrientationTutors.length)}
                  />
                  <Kpi
                    label="Completion Rate"
                    value={`${orientationCompletionRate}%`}
                  />
                </div>

                <div className="orientationActions">
  <button
    type="button"
    className="secondaryButton"
    onClick={() => setShowPendingTutors((current) => !current)}
  >
    {showPendingTutors
      ? "Hide Pending Tutors"
      : `View Pending Tutors (${pendingOrientationTutors.length})`}
  </button>

  <button
    type="button"
    className="secondaryButton"
    onClick={() => setShowCompletedTutors((current) => !current)}
  >
    {showCompletedTutors
      ? "Hide Completed Tutors"
      : `View Completed Tutors (${completedOrientationTutors.length})`}
  </button>
</div>

{showPendingTutors && (
  <div className="pendingTutorList">
    {pendingOrientationTutors.map((tutor) => (
      <div className="pendingTutorRow" key={tutor.id}>
        <div>
          <strong>{tutor.full_name}</strong>
          <span>{tutor.email || "Email not available"}</span>
        </div>

        <div className="pendingTutorMeta">
          <small>Orientation pending</small>

          <button
            type="button"
            className="secondaryButton"
            disabled={sendingTutorId === tutor.id}
            onClick={() => sendOrientationReminder([tutor.id])}
          >
            {sendingTutorId === tutor.id
              ? "Sending..."
              : "Send Reminder"}
          </button>
        </div>
      </div>
    ))}

    {pendingOrientationTutors.length === 0 && (
      <div className="emptyState">
        <h2>Everyone has completed orientation</h2>

        <p>
          There are no approved tutors waiting for a reminder.
        </p>
      </div>
    )}
  </div>
)}

{showCompletedTutors && (
  <div className="completedTutorList">
    {completedOrientationTutors.map((tutor) => (
      <div className="pendingTutorRow" key={tutor.id}>
        <div>
          <strong>{tutor.full_name}</strong>
          <span>{tutor.email || "Email not available"}</span>
        </div>

        <div className="completedTutorMeta">
          <small>Orientation completed</small>

          <span>
            Score:{" "}
            <strong>
              {tutor.orientation_score !== null
                ? `${tutor.orientation_score}%`
                : "Not recorded"}
            </strong>
          </span>

          <span>
            Completed:{" "}
            <strong>
              {tutor.orientation_completed_at
                ? new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(
                    new Date(tutor.orientation_completed_at),
                  )
                : "Date not recorded"}
            </strong>
          </span>
        </div>
      </div>
    ))}

    {completedOrientationTutors.length === 0 && (
      <div className="emptyState">
        <h2>No completed orientations yet</h2>

        <p>
          Tutors who complete orientation will appear here.
        </p>
      </div>
    )}
  </div>
)}
              </>
            )}
          </section>
        )}
      </section>

      {selectedEvent && (
        <div className="modalOverlay">
          <div className="modalCard">
            <div className="modalHeader">
              <div>
                <p className="eyebrow">Event invitees</p>
                <h2>{selectedEvent.title}</h2>
              </div>

              <button
                type="button"
                className="closeButton"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>

            <div className="inviteeList">
              {getEventInvites(selectedEvent.id).map((invite) => (
                <div key={invite.id} className="inviteeRow">
                  <div>
                    <strong>{invite.tutor_name}</strong>
                    <span>{invite.tutor_email}</span>
                  </div>

                  <div className="inviteeStatuses">
                    <small
                      className={`emailStatus ${invite.email_status.toLowerCase()}`}
                    >
                      {invite.email_status}
                    </small>

                    <small className="attendanceStatus">
                      {formatEventType(invite.attendance_status)}
                    </small>
                  </div>
                </div>
              ))}

              {getEventInvites(selectedEvent.id).length === 0 && (
                <p className="noInvitees">
                  No tutor invitations were found for this event.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{styles}</style>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="kpiCard">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detailCard">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const clean = status.toLowerCase();

  return (
    <span className={`statusBadge ${clean}`}>{formatEventType(status)}</span>
  );
}

function formatEventType(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatEventDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${value}T12:00:00`));
  } catch {
    return value;
  }
}

function formatCommunicationDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatTime(value?: string | null) {
  if (!value) return "Not set";
  return value.slice(0, 5);
}

const styles = `
  .page {
    min-height: 100vh;
    padding: 34px 16px 90px;
    color: #21152d;
    background:
      radial-gradient(circle at 8% 0%, rgba(124,58,237,.14), transparent 30%),
      radial-gradient(circle at 92% 5%, rgba(13,148,136,.1), transparent 28%),
      linear-gradient(180deg, #fffaff 0%, #fbf8ff 45%, #f4edff 100%);
  }

  .hero,
  .content {
    width: min(1180px, 100%);
    margin: 0 auto;
  }

  .hero {
    padding: 38px;
    border-radius: 36px;
    background:
      radial-gradient(circle at top right, rgba(124,58,237,.18), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,.98), rgba(246,239,255,.96));
    border: 1px solid rgba(126,87,194,.14);
    box-shadow: 0 30px 90px rgba(71,43,117,.12);
  }

  .heroTop {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 13px;
    font-weight: 950;
  }

  h1 {
    margin: 14px 0 0;
    font-size: clamp(42px, 6vw, 72px);
    line-height: .97;
    letter-spacing: -.06em;
  }

  .subtitle {
    max-width: 720px;
    margin: 18px 0 0;
    color: #6f637e;
    font-size: 17px;
    line-height: 1.7;
  }

  .createButton {
    min-height: 50px;
    padding: 0 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 17px;
    color: white;
    background: linear-gradient(135deg, #0f766e, #0d9488);
    box-shadow: 0 16px 38px rgba(13,148,136,.22);
    font-weight: 950;
    text-decoration: none;
    white-space: nowrap;
  }

  .kpiGrid {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0,1fr));
    gap: 14px;
  }

  .kpiCard {
    padding: 19px;
    border-radius: 22px;
    background: rgba(255,255,255,.94);
    border: 1px solid rgba(126,87,194,.12);
  }

  .kpiCard span,
  .kpiCard strong {
    display: block;
  }

  .kpiCard span {
    color: #7a7088;
    font-size: 13px;
    font-weight: 850;
  }

  .kpiCard strong {
    margin-top: 8px;
    font-size: 30px;
    line-height: 1;
  }

  .content {
    margin-top: 24px;
  }

  .message {
    padding: 17px 18px;
    border-radius: 18px;
    background: white;
    color: #6f637e;
    font-weight: 850;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .toolbar input {
    width: min(460px,100%);
    padding: 15px 18px;
    border: 1px solid #ddd6fe;
    border-radius: 15px;
    background: white;
    font-size: 16px;
    outline: none;
  }

  .toolbar span {
    color: #6b7280;
    font-weight: 700;
  }

  .eventGrid {
    display: grid;
    gap: 20px;
  }

  .eventCard {
    padding: 28px;
    border-radius: 30px;
    background: rgba(255,255,255,.95);
    border: 1px solid rgba(126,87,194,.12);
    box-shadow: 0 22px 62px rgba(71,43,117,.08);
  }

  .cardHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  .badgeRow {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .typeBadge,
  .statusBadge {
    padding: 8px 11px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
  }

  .typeBadge {
    color: #6d28d9;
    background: #f3e8ff;
  }

  .statusBadge.scheduled {
    color: #027a48;
    background: #ecfdf3;
  }

  .statusBadge.completed {
    color: #1d4ed8;
    background: #eff6ff;
  }

  .statusBadge.cancelled {
    color: #b42318;
    background: #fef3f2;
  }

  .eventCard h2 {
    margin: 14px 0 0;
    font-size: clamp(27px,3vw,40px);
    line-height: 1.05;
    letter-spacing: -.04em;
  }

  .eventDescription {
    max-width: 760px;
    margin: 12px 0 0;
    color: #6f637e;
    line-height: 1.65;
  }

  .dateBox {
    min-width: 190px;
    padding: 16px;
    border-radius: 18px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,.12);
  }

  .dateBox span,
  .dateBox strong {
    display: block;
  }

  .dateBox span {
    color: #7a7088;
    font-size: 12px;
    font-weight: 850;
  }

  .dateBox strong {
    margin-top: 7px;
  }

  .eventDetails {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(6,minmax(0,1fr));
    gap: 10px;
  }

  .detailCard {
    padding: 14px;
    border-radius: 16px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,.1);
  }

  .detailCard span,
  .detailCard strong {
    display: block;
  }

  .detailCard span {
    color: #7a7088;
    font-size: 12px;
    font-weight: 800;
  }

  .detailCard strong {
    margin-top: 6px;
    font-size: 14px;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  .actions a,
  .actions button {
    min-height: 44px;
    padding: 0 15px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 950;
    cursor: pointer;
    text-decoration: none;
  }

  .joinButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    color: white;
    background: linear-gradient(135deg,#7c3aed,#6d28d9);
  }

  .secondaryButton,
  .completeButton {
    color: #351e55;
    background: white;
    border: 1px solid rgba(124,58,237,.16);
  }

  .secondaryButton:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  .cancelButton {
    color: #b42318;
    background: #fff7f7;
    border: 1px solid rgba(180,35,24,.18);
  }

  .emptyState {
    padding: 34px;
    text-align: center;
    border-radius: 28px;
    background: white;
    border: 1px solid rgba(126,87,194,.12);
  }

  .emptyState h2 {
    margin: 0;
  }

  .emptyState p {
    color: #6f637e;
  }

  .emptyState a {
    display: inline-flex;
    margin-top: 10px;
    color: #6d28d9;
    font-weight: 950;
  }

  .modalOverlay {
    position: fixed;
    inset: 0;
    z-index: 6000;
    display: grid;
    place-items: center;
    padding: 18px;
    background: rgba(25,14,39,.5);
    backdrop-filter: blur(10px);
  }

  .modalCard {
    width: min(700px,100%);
    max-height: calc(100vh - 36px);
    overflow-y: auto;
    padding: 30px;
    border-radius: 28px;
    background: white;
    box-shadow: 0 35px 100px rgba(0,0,0,.2);
  }

  .modalHeader {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .modalHeader h2 {
    margin: 8px 0 0;
    font-size: 30px;
  }

  .closeButton {
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 50%;
    background: #f3e8ff;
    color: #6d28d9;
    font-size: 26px;
    cursor: pointer;
  }

  .inviteeList {
    display: grid;
    gap: 10px;
    margin-top: 24px;
  }

  .inviteeRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 18px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,.1);
  }

  .inviteeRow strong,
  .inviteeRow span {
    display: block;
  }

  .inviteeRow span {
    margin-top: 4px;
    color: #6f637e;
    font-size: 13px;
  }

  .inviteeStatuses {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .inviteeStatuses small {
    padding: 7px 9px;
    border-radius: 999px;
    font-weight: 900;
  }

  .emailStatus.sent {
    color: #027a48;
    background: #ecfdf3;
  }

  .emailStatus.failed {
    color: #b42318;
    background: #fef3f2;
  }

  .emailStatus.pending {
    color: #9a3412;
    background: #fff7ed;
  }

  .attendanceStatus {
    color: #6d28d9;
    background: #f3e8ff;
  }

  .noInvitees {
    color: #6f637e;
  }

  .communicationTabs {
    display: inline-flex;
    gap: 8px;
    margin-bottom: 20px;
    padding: 7px;
    border-radius: 18px;
    background: rgba(255,255,255,.86);
    border: 1px solid rgba(124,58,237,.12);
  }

  .tabButton {
    min-height: 44px;
    padding: 0 18px;
    border: 0;
    border-radius: 13px;
    color: #6f637e;
    background: transparent;
    font: inherit;
    font-weight: 900;
    cursor: pointer;
  }

  .tabButton.active {
    color: white;
    background: linear-gradient(135deg,#7c3aed,#6d28d9);
    box-shadow: 0 10px 24px rgba(124,58,237,.22);
  }

  .orientationPanel {
    padding: 30px;
    border-radius: 30px;
    background: rgba(255,255,255,.95);
    border: 1px solid rgba(126,87,194,.12);
    box-shadow: 0 22px 62px rgba(71,43,117,.08);
  }

  .orientationIntro {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 22px;
  }

  .orientationIntro h2 {
    margin: 10px 0 0;
    font-size: clamp(30px,4vw,48px);
    letter-spacing: -.04em;
  }

  .orientationIntro p:not(.eyebrow) {
    max-width: 690px;
    margin: 12px 0 0;
    color: #6f637e;
    line-height: 1.7;
  }

  .orientationPrimaryButton {
    min-height: 50px;
    padding: 0 20px;
    border: 0;
    border-radius: 16px;
    color: white;
    background: linear-gradient(135deg,#0f766e,#0d9488);
    box-shadow: 0 16px 38px rgba(13,148,136,.22);
    font: inherit;
    font-weight: 950;
    cursor: pointer;
    white-space: nowrap;
  }

  .orientationPrimaryButton:disabled,
  .pendingTutorRow button:disabled {
    opacity: .58;
    cursor: not-allowed;
  }

  .orientationKpiGrid {
    margin-top: 26px;
    display: grid;
    grid-template-columns: repeat(4,minmax(0,1fr));
    gap: 14px;
  }

  .orientationActions {
    margin-top: 22px;
  }

  .orientationActions button {
    min-height: 44px;
    padding: 0 16px;
    border-radius: 14px;
    font: inherit;
    font-weight: 950;
    cursor: pointer;
  }

  .completedTutorList {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

  .pendingTutorList {
    display: grid;
    gap: 10px;
    margin-top: 18px;
  }

  .pendingTutorRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    padding: 17px;
    border-radius: 18px;
    background: #fbf8ff;
    border: 1px solid rgba(124,58,237,.1);
  }

  .pendingTutorRow strong,
  .pendingTutorRow span {
    display: block;
  }

  .pendingTutorRow span {
    margin-top: 4px;
    color: #6f637e;
    font-size: 13px;
  }

  .pendingTutorMeta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  .pendingTutorMeta small {
    padding: 7px 10px;
    border-radius: 999px;
    color: #9a3412;
    background: #fff7ed;
    font-weight: 900;
  }

  .pendingTutorMeta button {
    min-height: 40px;
    padding: 0 14px;
    border-radius: 13px;
    font-size: 13px;
    font-weight: 950;
    cursor: pointer;
  }

  .generalPanel {
    padding: 30px;
    border-radius: 30px;
    background: rgba(255,255,255,.95);
    border: 1px solid rgba(126,87,194,.12);
    box-shadow: 0 22px 62px rgba(71,43,117,.08);
  }

  .generalCommunicationGrid {
    display: grid;
    gap: 18px;
    margin-top: 26px;
  }

  .generalCommunicationCard {
    padding: 26px;
    border-radius: 26px;
    background: #ffffff;
    border: 1px solid rgba(126,87,194,.12);
    box-shadow: 0 16px 42px rgba(71,43,117,.07);
  }

  .generalCommunicationHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 22px;
  }

  .generalCommunicationCard h2 {
    margin: 14px 0 0;
    font-size: clamp(25px, 3vw, 36px);
    line-height: 1.08;
    letter-spacing: -.04em;
  }

  .generalCommunicationCard h3 {
    margin: 10px 0 0;
    color: #6d28d9;
    font-size: 17px;
  }

  .generalDetails {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 10px;
  }

  .orientationActions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.completedTutorMeta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.completedTutorMeta small {
  padding: 7px 10px;
  border-radius: 999px;
  color: #027a48;
  background: #ecfdf3;
  font-weight: 900;
}

.completedTutorMeta span {
  color: #6f637e;
  font-size: 13px;
}

.completedTutorMeta strong {
  color: #21152d;
}

  @media (max-width: 900px) {
    .page {
      padding: 20px 10px 70px;
    }

    .hero {
      padding: 26px 20px;
    }

    .heroTop,
    .cardHeader,
    .inviteeRow,
    .orientationIntro,
    .pendingTutorRow,
    .generalCommunicationHeader {

      align-items: flex-start;
      flex-direction: column;
    }

    .createButton,
    .toolbar input {
      width: 100%;
      box-sizing: border-box;
    }

    .kpiGrid,
    .eventDetails,
    .orientationKpiGrid,
    .generalDetails {
      grid-template-columns: 1fr 1fr;
    }

    .orientationPrimaryButton {
      width: 100%;
    }

    .generalPanel {
      padding: 20px;
    }

    .pendingTutorMeta {
      width: 100%;
      justify-content: space-between;
    }

    .dateBox {
      width: 100%;
      box-sizing: border-box;
    }

    .actions {
      flex-direction: column;
    }

    .actions a,
    .actions button {
      width: 100%;
      box-sizing: border-box;
    }

    .inviteeStatuses {
      justify-content: flex-start;
    }
  }

  @media (max-width: 560px) {
    .toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .kpiGrid,
    .eventDetails,
    .orientationKpiGrid,
    .generalDetails {
      grid-template-columns: 1fr;
    }

    .communicationTabs {
      width: 100%;
    }

    .tabButton {
      flex: 1;
    }

    .orientationPanel {
      padding: 20px;
    }

    .pendingTutorMeta {
      align-items: stretch;
      flex-direction: column;
    }

    .eventCard,
    .modalCard {
      padding: 20px;
    }    

@media (max-width: 900px) {
  .completedTutorMeta {
    width: 100%;
    justify-content: flex-start;
  }
}
  }
`;