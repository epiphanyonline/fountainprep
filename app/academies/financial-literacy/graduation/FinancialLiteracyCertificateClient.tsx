"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

import { supabase } from "@/app/lib/supabase";
import {
  financialLiteracyPremiumBlueprint,
} from "@/app/data/academies/personal-finance/premiumBlueprint";

type GraduationRecord = {
  learnerId: string;
  learnerName: string;
  completedAt: string;
  score?: number | null;
  certificateId?: string;
};

function formatDate(
  iso: string,
) {
  const date =
    new Date(iso);

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

function makeCertificateId(
  learnerId: string,
  completedAt: string,
) {
  const source =
    `${learnerId}|${completedAt}`;

  let hash = 0;

  for (
    let index = 0;
    index < source.length;
    index += 1
  ) {
    hash =
      (hash * 31 +
        source.charCodeAt(index)) >>>
      0;
  }

  return `FP-FL-${hash
    .toString(36)
    .toUpperCase()
    .padStart(7, "0")}`;
}

async function readGraduationFromSupabase(
  requestedLearnerId: string | null,
): Promise<GraduationRecord | null> {
  if (!requestedLearnerId) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("student_academy_graduations")
    .select(
      [
        "student_id",
        "learner_name",
        "graduated_at",
        "total_points",
        "certificate_id",
      ].join(", "),
    )
    .eq("student_id", requestedLearnerId)
    .eq("academy_code", "personal-finance")
    .eq("programme_id", "money-foundation")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
  return null;
}

const graduation =
  data as unknown as {
    student_id: string;
    learner_name: string;
    graduated_at: string;
    total_points: number | null;
    certificate_id: string;
  };

return {
  learnerId: graduation.student_id,
  learnerName: graduation.learner_name,
  completedAt: graduation.graduated_at,
  score: Number(
    graduation.total_points ?? 0,
  ),
  certificateId:
    graduation.certificate_id,
};
}

export default function
FinancialLiteracyCertificateClient() {
  const searchParams =
    useSearchParams();

  const requestedLearnerId =
    searchParams.get(
      "learner",
    );

  const preview =
    searchParams.get(
      "preview",
    ) === "1";

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    record,
    setRecord,
  ] =
    useState<GraduationRecord | null>(
      null,
    );

  useEffect(() => {
    let cancelled =
      false;

    async function load() {
      /*
       Graduation eligibility is deliberately separate
       from ordinary lesson/course completion.

       The academy should create this marker only after
       the learner satisfies the final graduation rule.
       That prevents a Foundation-course completion from
       accidentally producing an Academy graduation
       certificate.
      */
      let graduation:
        GraduationRecord | null =
          null;

      try {
        graduation =
          await readGraduationFromSupabase(
            requestedLearnerId,
          );
      } catch (error) {
        console.error(
          "Unable to load graduation record:",
          error,
        );
      }

      if (!cancelled) {
        setRecord(
          graduation,
        );
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    requestedLearnerId,
  ]);

  const stages =
    useMemo(
      () =>
        financialLiteracyPremiumBlueprint.stages.map(
          (stage) =>
            stage.title,
        ),
      [],
    );

  if (loading) {
    return (
      <main className="loading">
        Preparing your
        graduation record...
        <Styles />
      </main>
    );
  }

  const previewRecord:
    GraduationRecord = {
      learnerId:
        "preview-learner",
      learnerName:
        "Learner Name",
      completedAt:
        new Date().toISOString(),
      score: 88,
    };

  const activeRecord =
    record ??
    (preview
      ? previewRecord
      : null);

  if (!activeRecord) {
    return (
      <main className="lockedPage">
        <section className="lockedCard">
          <div className="lockSeal">
            ◈
          </div>

          <span className="eyebrow">
            FINANCIAL LITERACY
            ACADEMY
          </span>

          <h1>
            Your graduation
            certificate is not
            available yet.
          </h1>

          <p>
            Certificates are issued
            only after the complete
            Financial Literacy
            graduation requirements
            have been satisfied.
            Completing an individual
            lesson, course or
            simulation does not by
            itself issue the Academy
            certificate.
          </p>

          <div className="lockedActions">
            <Link
              href="/academies/financial-literacy"
              className="primary"
            >
              Continue Financial
              Literacy →
            </Link>

            <Link
              href="/academies/financial-literacy/graduation?preview=1"
              className="secondary"
            >
              Preview certificate
              design
            </Link>
          </div>
        </section>

        <Styles />
      </main>
    );
  }

  const certificateId =
    activeRecord.certificateId ??
    makeCertificateId(
      activeRecord.learnerId,
      activeRecord.completedAt,
    );

  return (
    <main className="certificatePage">
      <div className="screenToolbar">
        <Link
          href="/academies/financial-literacy"
        >
          ← Financial Literacy
        </Link>

        <div>
          {preview &&
          !record ? (
            <span className="previewBadge">
              DESIGN PREVIEW
            </span>
          ) : null}

          <button
            onClick={() =>
              window.print()
            }
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <section className="certificate">
        <div className="outerFrame">
          <div className="innerFrame">
            <header className="certificateHeader">
              <div className="mark">
                <span>
                  ✦
                </span>
              </div>

              <div className="wordmark">
                <strong>
                  Fountain
                  <b>Prep</b>
                </strong>

                <span>
                  FINANCIAL
                  EDUCATION
                </span>
              </div>
            </header>

            <div className="certificateBody">
              <div className="certificateEyebrow">
                CERTIFICATE OF
                GRADUATION
              </div>

              <h1>
                Financial Literacy
                Academy
              </h1>

              <p className="awarded">
                This certificate is
                awarded to
              </p>

              <h2>
                {
                  activeRecord.learnerName
                }
              </h2>

              <div className="nameRule" />

              <p className="statement">
                in recognition of
                successful completion
                of FountainPrep&apos;s
                Financial Literacy
                learning pathway,
                including financial
                foundations, money
                management, asset
                literacy, financial
                resilience, markets,
                investing and
                long-term financial
                decision-making.
              </p>

              <div className="masteryRibbon">
                <span>
                  FINANCIAL
                  FOUNDATIONS
                </span>
                <i />
                <span>
                  ASSET LITERACY
                </span>
                <i />
                <span>
                  INVESTING
                </span>
                <i />
                <span>
                  LONG-TERM
                  DECISION-MAKING
                </span>
              </div>

              <div className="stagePanel">
                <span>
                  LEARNING PATHWAY
                  COMPLETED
                </span>

                <div>
                  {stages.map(
                    (
                      stage,
                      index,
                    ) => (
                      <article
                        key={
                          stage
                        }
                      >
                        <b>
                          {String(
                            index +
                              1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </b>

                        <strong>
                          {stage}
                        </strong>
                      </article>
                    ),
                  )}
                </div>
              </div>
            </div>

            <footer className="certificateFooter">
              <div className="issued">
                <span>
                  DATE OF
                  COMPLETION
                </span>

                <strong>
                  {formatDate(
                    activeRecord.completedAt,
                  )}
                </strong>
              </div>

              <div className="seal">
                <div>
                  <span>
                    FP
                  </span>
                </div>

                <small>
                  FINANCIAL
                  LITERACY
                  ACADEMY
                </small>
              </div>

              <div className="certificateNumber">
                <span>
                  CERTIFICATE ID
                </span>

                <strong>
                  {certificateId}
                </strong>
              </div>
            </footer>

            <div className="credentialNote">
              FountainPrep Financial
              Literacy Academy is an
              educational programme.
              This certificate confirms
              completion of the
              FountainPrep learning
              pathway and is not a
              regulated financial
              qualification or licence
              to provide financial
              advice.
            </div>
          </div>
        </div>
      </section>

      <div className="afterCertificate">
        <h3>
          You completed the
          pathway.
        </h3>

        <p>
          Keep the certificate for
          your records, add the
          learning achievement to
          your professional profile,
          and continue practising
          sound financial reasoning.
        </p>

        <div>
          <button
            className="primaryButton"
            onClick={() =>
              window.print()
            }
          >
            Print / Save
            Certificate
          </button>

          <Link
            href="/academies/financial-literacy"
            className="secondaryButton"
          >
            Return to Academy
          </Link>
        </div>
      </div>

      <Styles />
    </main>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
      }

      .loading,
      .lockedPage,
      .certificatePage {
        min-height: 100vh;
        font-family:
          Inter,
          Arial,
          sans-serif;
        color: #211331;
        background:
          radial-gradient(
            circle at 75% 0%,
            rgba(124, 58, 237, .11),
            transparent 30%
          ),
          #faf8fd;
      }

      .loading {
        display: grid;
        place-items: center;
        color: #75657f;
      }

      .lockedPage {
        display: grid;
        place-items: center;
        padding: 60px 20px;
      }

      .lockedCard {
        width: min(
          760px,
          100%
        );
        padding: 48px;
        border:
          1px solid
          #e3d8e9;
        border-radius:
          28px;
        background: #fff;
        text-align: center;
        box-shadow:
          0 28px 80px
          rgba(
            50,
            25,
            70,
            .09
          );
      }

      .lockSeal {
        width: 72px;
        height: 72px;
        margin:
          0 auto 18px;
        display: grid;
        place-items: center;
        border-radius:
          50%;
        background:
          linear-gradient(
            145deg,
            #6d28d9,
            #9b6cf0
          );
        color: #fff;
        font-size: 28px;
      }

      .eyebrow,
      .certificateEyebrow {
        color: #7c3aed;
        font-size: 9px;
        font-weight: 950;
        letter-spacing:
          .14em;
      }

      .lockedCard h1 {
        margin:
          10px auto;
        max-width:
          620px;
        font-size:
          clamp(
            38px,
            5vw,
            58px
          );
        line-height: 1;
        letter-spacing:
          -.055em;
      }

      .lockedCard p {
        max-width:
          620px;
        margin:
          0 auto;
        color: #74657e;
        line-height: 1.7;
      }

      .lockedActions {
        margin-top: 24px;
        display: flex;
        justify-content:
          center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .lockedActions a {
        padding:
          13px 18px;
        border-radius:
          999px;
        text-decoration:
          none;
        font-size: 11px;
        font-weight: 900;
      }

      .lockedActions
      .primary {
        color: #fff;
        background:
          linear-gradient(
            135deg,
            #6d28d9,
            #8b5cf6
          );
      }

      .lockedActions
      .secondary {
        color: #684f78;
        border:
          1px solid
          #e2d7e8;
        background: #fff;
      }

      .screenToolbar {
        width:
          min(
            1180px,
            calc(
              100% - 32px
            )
          );
        margin: auto;
        padding:
          24px 0;
        display: flex;
        justify-content:
          space-between;
        align-items:
          center;
        gap: 16px;
      }

      .screenToolbar a {
        color: #6f5c7b;
        text-decoration:
          none;
        font-size: 11px;
        font-weight: 850;
      }

      .screenToolbar>div {
        display: flex;
        align-items:
          center;
        gap: 8px;
      }

      .previewBadge {
        padding:
          7px 10px;
        border-radius:
          999px;
        background:
          #f0e9f8;
        color: #7c3aed;
        font-size: 8px;
        font-weight: 950;
      }

      .screenToolbar
      button {
        border: 0;
        border-radius:
          999px;
        padding:
          10px 15px;
        background:
          #211331;
        color: #fff;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .certificate {
        width:
          min(
            1180px,
            calc(
              100% - 32px
            )
          );
        margin: auto;
        background: #fff;
        box-shadow:
          0 28px 90px
          rgba(
            48,
            23,
            67,
            .13
          );
      }

      .outerFrame {
        padding: 14px;
        border:
          3px solid
          #2e183f;
      }

      .innerFrame {
        min-height:
          760px;
        position: relative;
        padding:
          42px 54px 28px;
        overflow: hidden;
        border:
          1px solid
          #a67ae4;
        background:
          linear-gradient(
            135deg,
            rgba(
              124,
              58,
              237,
              .035
            ),
            transparent
            34%
          ),
          #fff;
      }

      .innerFrame::before,
      .innerFrame::after {
        content: "";
        position:
          absolute;
        width: 280px;
        height: 280px;
        border-radius:
          50%;
        border:
          1px solid
          rgba(
            124,
            58,
            237,
            .11
          );
      }

      .innerFrame::before {
        top: -160px;
        right: -120px;
        box-shadow:
          0 0 0 28px
          rgba(
            124,
            58,
            237,
            .025
          ),
          0 0 0 58px
          rgba(
            124,
            58,
            237,
            .018
          );
      }

      .innerFrame::after {
        bottom: -185px;
        left: -120px;
      }

      .certificateHeader {
        position: relative;
        z-index: 1;
        display: flex;
        align-items:
          center;
        gap: 12px;
      }

      .mark {
        width: 48px;
        height: 48px;
        display: grid;
        place-items:
          center;
        border-radius:
          13px;
        background:
          linear-gradient(
            145deg,
            #211331,
            #6d28d9
          );
        color: #fff;
        font-size: 21px;
      }

      .wordmark strong,
      .wordmark span {
        display: block;
      }

      .wordmark strong {
        font-size: 29px;
        line-height: 1;
        letter-spacing:
          -.05em;
      }

      .wordmark strong b {
        color: #7c3aed;
      }

      .wordmark span {
        margin-top: 4px;
        color: #907d9c;
        font-size: 7px;
        font-weight: 950;
        letter-spacing:
          .15em;
      }

      .certificateBody {
        position: relative;
        z-index: 1;
        padding:
          58px 0 32px;
        text-align: center;
      }

      .certificateBody h1 {
        margin:
          8px 0 22px;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size:
          clamp(
            50px,
            7vw,
            82px
          );
        font-weight: 400;
        line-height: .96;
        letter-spacing:
          -.045em;
      }

      .awarded {
        margin: 0;
        color: #8b7b94;
        font-size: 12px;
      }

      .certificateBody h2 {
        margin:
          10px 0 8px;
        font-size:
          clamp(
            34px,
            5vw,
            56px
          );
        letter-spacing:
          -.045em;
      }

      .nameRule {
        width: min(
          520px,
          72%
        );
        height: 1px;
        margin:
          0 auto 18px;
        background:
          linear-gradient(
            90deg,
            transparent,
            #8b5cf6,
            transparent
          );
      }

      .statement {
        max-width:
          760px;
        margin:
          0 auto;
        color: #6f6277;
        font-family:
          Georgia,
          "Times New Roman",
          serif;
        font-size: 15px;
        line-height: 1.7;
      }

      .masteryRibbon {
        max-width:
          840px;
        margin:
          28px auto 0;
        padding:
          13px 16px;
        display: flex;
        justify-content:
          center;
        align-items:
          center;
        gap: 13px;
        border-radius:
          999px;
        background:
          #211331;
        color: #fff;
      }

      .masteryRibbon
      span {
        font-size: 7px;
        font-weight: 950;
        letter-spacing:
          .1em;
      }

      .masteryRibbon i {
        width: 3px;
        height: 3px;
        border-radius:
          50%;
        background:
          #b993e5;
      }

      .stagePanel {
        max-width:
          920px;
        margin:
          25px auto 0;
        padding:
          18px 20px;
        border:
          1px solid
          #e7deeb;
        border-radius:
          18px;
        background:
          rgba(
            250,
            247,
            253,
            .72
          );
      }

      .stagePanel>span {
        display: block;
        margin-bottom:
          11px;
        color: #8c7b96;
        font-size: 7px;
        font-weight: 950;
        letter-spacing:
          .13em;
      }

      .stagePanel>div {
        display: grid;
        grid-template-columns:
          repeat(
            4,
            1fr
          );
        gap: 7px;
      }

      .stagePanel article {
        padding:
          9px 10px;
        display: flex;
        align-items:
          center;
        gap: 7px;
        border-radius:
          10px;
        background: #fff;
        text-align: left;
      }

      .stagePanel b {
        color: #7c3aed;
        font-size: 8px;
      }

      .stagePanel strong {
        font-size: 8px;
        line-height: 1.25;
      }

      .certificateFooter {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns:
          1fr auto 1fr;
        gap: 25px;
        align-items: end;
        padding-top: 20px;
      }

      .issued span,
      .issued strong,
      .certificateNumber
      span,
      .certificateNumber
      strong {
        display: block;
      }

      .issued span,
      .certificateNumber
      span {
        color: #94849d;
        font-size: 7px;
        font-weight: 950;
        letter-spacing:
          .12em;
      }

      .issued strong,
      .certificateNumber
      strong {
        margin-top: 5px;
        font-size: 12px;
      }

      .certificateNumber {
        text-align: right;
      }

      .seal {
        display: grid;
        justify-items:
          center;
        gap: 5px;
      }

      .seal>div {
        width: 76px;
        height: 76px;
        display: grid;
        place-items:
          center;
        border-radius:
          50%;
        border:
          2px solid
          #7c3aed;
        box-shadow:
          inset
          0 0 0 4px
          #fff,
          inset
          0 0 0 5px
          #bea1e2;
        color: #7c3aed;
        font-family:
          Georgia,
          serif;
        font-size: 24px;
        font-weight: 700;
      }

      .seal small {
        color: #7d6d86;
        font-size: 6px;
        font-weight: 950;
        letter-spacing:
          .12em;
        text-align: center;
      }

      .credentialNote {
        position: relative;
        z-index: 1;
        margin-top: 22px;
        padding-top: 12px;
        border-top:
          1px solid
          #eee8f1;
        color: #a093a7;
        font-size: 7px;
        line-height: 1.5;
        text-align: center;
      }

      .afterCertificate {
        width:
          min(
            850px,
            calc(
              100% - 32px
            )
          );
        margin:
          34px auto 70px;
        text-align: center;
      }

      .afterCertificate h3 {
        margin: 0;
        font-size: 28px;
        letter-spacing:
          -.04em;
      }

      .afterCertificate p {
        color: #74657e;
        line-height: 1.65;
      }

      .afterCertificate>div {
        display: flex;
        justify-content:
          center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .primaryButton,
      .secondaryButton {
        padding:
          12px 17px;
        border-radius:
          999px;
        text-decoration:
          none;
        font-size: 10px;
        font-weight: 900;
      }

      .primaryButton {
        border: 0;
        color: #fff;
        background:
          linear-gradient(
            135deg,
            #6d28d9,
            #8b5cf6
          );
        cursor: pointer;
      }

      .secondaryButton {
        color: #6f5a7c;
        border:
          1px solid
          #e2d7e8;
        background: #fff;
      }

      @media(
        max-width:
        760px
      ) {
        .screenToolbar {
          align-items:
            flex-start;
        }

        .screenToolbar>div {
          flex-direction:
            column;
          align-items:
            flex-end;
        }

        .innerFrame {
          min-height:
            0;
          padding:
            28px 20px
            22px;
        }

        .certificateBody {
          padding-top:
            40px;
        }

        .certificateBody h1 {
          font-size: 47px;
        }

        .certificateBody h2 {
          font-size: 34px;
        }

        .masteryRibbon {
          border-radius:
            18px;
          flex-wrap: wrap;
        }

        .stagePanel>div {
          grid-template-columns:
            repeat(
              2,
              1fr
            );
        }

        .certificateFooter {
          grid-template-columns:
            1fr;
          text-align: center;
        }

        .certificateNumber {
          text-align: center;
        }

        .seal {
          grid-row: 1;
        }

        .lockedCard {
          padding: 32px 20px;
        }
      }

      @media print {
        @page {
          size: A4 landscape;
          margin: 0;
        }

        body {
          background: #fff;
        }

        .screenToolbar,
        .afterCertificate {
          display: none !important;
        }

        .certificatePage {
          min-height: 0;
          background: #fff;
        }

        .certificate {
          width: 100%;
          margin: 0;
          box-shadow: none;
        }

        .outerFrame {
          min-height:
            100vh;
        }

        .innerFrame {
          min-height:
            calc(
              100vh - 28px
            );
        }
      }
    `}</style>
  );
}
