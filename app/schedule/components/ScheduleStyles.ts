export const scheduleStyles = `
  .page {
    min-height: 100vh;
    padding: 44px 18px 90px;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 30%),
      linear-gradient(180deg, #ffffff, #fbf8ff 45%, #f4edff);
    color: #201230;
  }

  .hero,
  .layout {
    max-width: 1180px;
    margin: 0 auto;
  }

  .hero {
    padding: 46px;
    border-radius: 38px;
    background: linear-gradient(135deg, #ffffff, #f4edff);
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 30px 90px rgba(47, 25, 80, 0.1);
  }

  .loadingHero {
    margin-top: 40px;
  }

  .progressStepper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 26px;
  }

  .progressStepper span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(124, 58, 237, 0.14);
    color: #7a6d85;
    font-size: 0.86rem;
    font-weight: 900;
  }

  .progressStepper .done {
    color: #047857;
    background: rgba(236, 253, 245, 0.9);
    border-color: rgba(16, 185, 129, 0.22);
  }

  .progressStepper .current {
    color: #fff;
    background: linear-gradient(135deg, #6d28d9, #4c1d95);
    border-color: transparent;
    box-shadow: 0 12px 28px rgba(109, 40, 217, 0.2);
  }

  .eyebrow {
    margin: 0;
    color: #6d28d9;
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  h1 {
    margin: 14px 0 0;
    max-width: 880px;
    font-size: clamp(2.35rem, 6vw, 5rem);
    line-height: 0.92;
    letter-spacing: -0.07em;
  }

  .subtitle {
    max-width: 780px;
    margin: 18px 0 0;
    color: #5f516b;
    font-size: 1.08rem;
    line-height: 1.75;
  }

  .policyBox,
  .premiumInfo,
  .recurringExplainer {
    margin-top: 26px;
    padding: 18px 20px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(124, 58, 237, 0.14);
    display: grid;
    gap: 6px;
  }

  .policyBox strong,
  .premiumInfo strong,
  .recurringExplainer strong {
    color: #32114c;
  }

  .policyBox span,
  .premiumInfo p,
  .recurringExplainer p {
    margin: 0;
    color: #6d6078;
    line-height: 1.58;
  }

  .summaryGrid {
    margin-top: 26px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .summary {
    padding: 18px;
    border-radius: 22px;
    background: #ffffff;
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 14px 34px rgba(47, 25, 80, 0.06);
  }

  .summary span,
  .summary small {
    display: block;
    color: #7a6d85;
    font-size: 0.86rem;
  }

  .summary strong {
    display: block;
    margin-top: 6px;
    color: #271238;
    font-size: 1.06rem;
  }

  .layout {
    margin-top: 22px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 22px;
    align-items: start;
  }

  .mainCard,
  .sideCard {
    border-radius: 34px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(124, 58, 237, 0.12);
    box-shadow: 0 24px 70px rgba(47, 25, 80, 0.09);
  }

  .mainCard {
    padding: 30px;
  }

  .sideCard {
  padding: 26px;
  position: sticky;
  top: 96px;
  max-height: calc(100vh - 116px);
  overflow-y: auto;
  padding-bottom: 34px;
}

  .sectionHead h2,
  .sideCard h2 {
    margin: 8px 0 0;
    font-size: 1.75rem;
    letter-spacing: -0.04em;
  }

  .notice,
  .debugNote {
    margin-top: 18px;
    padding: 14px 16px;
    border-radius: 18px;
    line-height: 1.55;
  }

  .notice {
    color: #5b315f;
    background: #fff7ed;
    border: 1px solid rgba(251, 146, 60, 0.28);
  }

  .debugNote {
    color: #065f46;
    background: #ecfdf5;
    border: 1px solid rgba(16, 185, 129, 0.22);
    font-size: 0.9rem;
  }

  .frequencyBox {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .freq {
    border: 1px solid rgba(124, 58, 237, 0.14);
    border-radius: 22px;
    padding: 18px;
    background: #fff;
    color: #271238;
    text-align: left;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .freq:hover,
  .freq.active {
    transform: translateY(-1px);
    border-color: rgba(109, 40, 217, 0.48);
    box-shadow: 0 18px 40px rgba(109, 40, 217, 0.12);
  }

  .freq strong,
  .freq span {
    display: block;
  }

  .freq span {
    margin-top: 6px;
    color: #7a6d85;
  }

  .tutorList {
    margin-top: 24px;
    display: grid;
    gap: 18px;
  }

  .tutorPanel {
    padding: 22px;
    border-radius: 28px;
    border: 1px solid rgba(124, 58, 237, 0.12);
    background: linear-gradient(180deg, #ffffff, #fbf8ff);
    box-shadow: 0 16px 38px rgba(47, 25, 80, 0.06);
    transition: 0.2s ease;
  }

  .tutorPanel:hover,
  .tutorPanel.selected {
    border-color: rgba(109, 40, 217, 0.38);
    box-shadow: 0 24px 60px rgba(109, 40, 217, 0.12);
  }

  .tutorTop,
  .tutorActions,
  .timeDateHead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
  }

  .tutorIdentity {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .avatar,
  .avatarInitial {
    width: 64px;
    height: 64px;
    border-radius: 22px;
    object-fit: cover;
    flex: 0 0 auto;
  }

  .avatarInitial {
    display: grid;
    place-items: center;
    background: #efe4ff;
    color: #6d28d9;
    font-size: 1.65rem;
    font-weight: 950;
  }

  .tutorIdentity h3 {
    margin: 0;
    font-size: 1.25rem;
  }

  .tutorIdentity p {
    margin: 5px 0 0;
    color: #6d6078;
    font-weight: 750;
  }

  .availableBadge,
  .selectedBadge {
    padding: 9px 12px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 900;
  }

  .availableBadge {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid rgba(16, 185, 129, 0.18);
  }

  .selectedBadge {
    background: #6d28d9;
    color: #fff;
  }

  .tutorMeta {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tutorMeta span {
    padding: 8px 11px;
    border-radius: 999px;
    background: #faf6ff;
    border: 1px solid rgba(124, 58, 237, 0.12);
    color: #3d2652;
    font-size: 0.84rem;
    font-weight: 850;
  }

  .bioPreview {
    margin: 16px 0 0;
    color: #6d6078;
    line-height: 1.65;
  }

  .nextAvailable {
    margin-top: 16px;
    padding: 15px;
    border-radius: 20px;
    background: #f7f1ff;
    border: 1px solid rgba(124, 58, 237, 0.12);
    display: grid;
    gap: 5px;
  }

  .nextAvailable span,
  .nextAvailable small {
    color: #7a6d85;
    font-weight: 800;
  }

  .nextAvailable strong {
    color: #271238;
  }

  .tutorActions {
    margin-top: 16px;
  }

  .primarySmall,
  .outlineSmall {
    border-radius: 999px;
    padding: 13px 16px;
    font-weight: 950;
    cursor: pointer;
    border: 0;
  }

  .primarySmall {
    flex: 1;
    background: linear-gradient(135deg, #6d28d9, #4c1d95);
    color: white;
    box-shadow: 0 14px 30px rgba(109, 40, 217, 0.2);
  }

  .outlineSmall {
    background: white;
    color: #6d28d9;
    border: 1px solid rgba(124, 58, 237, 0.18);
  }

  .totalBox {
    margin-top: 18px;
    padding: 22px;
    border-radius: 26px;
    background: linear-gradient(135deg, #2b1042, #6d28d9);
    color: white;
  }

  .totalBox p {
    margin: 0;
    opacity: 0.82;
  }

  .totalBox strong {
    display: block;
    margin-top: 8px;
    font-size: 2.35rem;
  }

  .totalBox span {
    display: block;
    margin-top: 4px;
    opacity: 0.82;
  }

  .selectedBox,
  .timetableHelp {
    margin-top: 18px;
    padding: 16px;
    border-radius: 22px;
    background: #fff;
    border: 1px solid rgba(124, 58, 237, 0.12);
    display: grid;
    gap: 10px;
  }

  .timetableHelp {
    background: #faf6ff;
  }

  .timetableHelp strong {
    color: #32114c;
  }

  .timetableHelp span {
    color: #493553;
    font-weight: 750;
    line-height: 1.45;
  }

  .muted {
    color: #7a6d85;
    margin: 0;
    line-height: 1.55;
  }

  .selectedItem {
    padding: 14px;
    border-radius: 18px;
    background: #faf6ff;
  }

  .selectedItem small {
    color: #6d28d9;
    font-weight: 900;
  }

  .selectedItem strong {
    display: block;
    margin-top: 5px;
  }

  .selectedItem p {
    margin: 6px 0 0;
    color: #6d6078;
  }

  .selectedItem em {
    display: block;
    margin-top: 8px;
    color: #6d28d9;
    font-style: normal;
    font-weight: 850;
  }

  .datePills {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .datePills span {
    padding: 5px 8px;
    border-radius: 999px;
    background: #fff;
    color: #6d28d9;
    font-size: 0.76rem;
    font-weight: 800;
  }

  .primaryBtn,
  .secondaryBtn,
  .ghostBtn,
  .profileContinue {
    width: 100%;
    border: 0;
    border-radius: 999px;
    padding: 15px 18px;
    font-weight: 950;
    cursor: pointer;
  }

  .primaryBtn {
    margin-top: 16px;
    color: white;
    background: linear-gradient(135deg, #6d28d9, #4c1d95);
    box-shadow: 0 18px 38px rgba(109, 40, 217, 0.24);
  }

  .primaryBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  .secondaryBtn,
  .ghostBtn {
    margin-top: 12px;
    color: #6d28d9;
    background: #f5efff;
  }

  .ghostBtn {
    background: transparent;
  }

  .empty {
    margin-top: 24px;
    padding: 30px;
    border-radius: 28px;
    background: #faf6ff;
    border: 1px dashed rgba(124, 58, 237, 0.28);
  }

  .empty h3 {
    margin: 0;
  }

  .empty p {
    color: #6d6078;
    line-height: 1.65;
  }

  .timesOverlay {
    position: fixed;
    inset: 0;
    z-index: 80;
    background: rgba(32, 18, 48, 0.28);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: flex-end;
  }

  .timesPanel {
    width: min(560px, 100%);
    height: 100vh;
    background:
      radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 35%),
      #ffffff;
    border-left: 1px solid rgba(124, 58, 237, 0.16);
    box-shadow: -30px 0 80px rgba(47, 25, 80, 0.18);
    display: grid;
    grid-template-rows: auto 1fr auto;
    animation: slideIn 0.22s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(28px);
      opacity: 0.72;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .timesPanelTop {
    padding: 24px;
    border-bottom: 1px solid rgba(124, 58, 237, 0.1);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .timesPanelTop h2 {
    margin: 4px 0;
    font-size: 1.45rem;
    letter-spacing: -0.04em;
  }

  .timesPanelTop span {
    color: #7a6d85;
    font-weight: 850;
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .timesPanelBody {
    padding: 22px 24px;
    overflow-y: auto;
    display: grid;
    gap: 18px;
  }

  .timesPanelFooter {
    padding: 18px 24px 24px;
    border-top: 1px solid rgba(124, 58, 237, 0.1);
    background: rgba(255, 255, 255, 0.92);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .miniTimeline {
    margin-top: 8px;
    display: grid;
    gap: 8px;
  }

  .miniTimelineItem {
    padding: 12px;
    border-radius: 17px;
    background: #ffffff;
    border: 1px solid rgba(124, 58, 237, 0.12);
  }

  .miniTimelineItem span,
  .miniTimelineItem small {
    display: block;
    color: #7a6d85;
    font-size: 0.82rem;
    font-weight: 850;
  }

  .miniTimelineItem strong {
    display: block;
    margin: 4px 0;
    color: #271238;
  }

  .mutedTimeline {
    background: rgba(255, 255, 255, 0.72);
  }

  .timeDateGroup {
    padding: 16px;
    border-radius: 24px;
    background: rgba(250, 246, 255, 0.72);
    border: 1px solid rgba(124, 58, 237, 0.12);
  }

  .timeDateHead {
    align-items: flex-start;
  }

  .timeDateHead strong {
    color: #271238;
  }

  .timeDateHead p {
    margin: 4px 0 0;
    color: #7a6d85;
    font-size: 0.88rem;
    line-height: 1.45;
  }

  .timeDateHead span {
    color: #7a6d85;
    font-size: 0.86rem;
    font-weight: 850;
  }

  .timeGrid {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .timeChip {
    border: 1px solid rgba(124, 58, 237, 0.14);
    border-radius: 16px;
    padding: 12px;
    background: #faf6ff;
    color: #271238;
    cursor: pointer;
    text-align: left;
    transition: 0.18s ease;
  }

  .timeChip:hover,
  .timeChip.active {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #6d28d9, #4c1d95);
    color: white;
    border-color: transparent;
  }

  .timeChip span,
  .timeChip small {
    display: block;
  }

  .timeChip span {
    font-weight: 950;
  }

  .timeChip small {
    margin-top: 4px;
    opacity: 0.82;
    font-weight: 800;
  }

  .profileOverlay {
    position: fixed;
    inset: 0;
    z-index: 90;
    padding: 18px;
    background: rgba(27, 15, 42, 0.58);
    display: grid;
    place-items: center;
  }

  .profileModal {
    width: min(620px, 100%);
    max-height: 90vh;
    overflow: auto;
    padding: 24px;
    border-radius: 32px;
    background: white;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.25);
  }

  .profileTop {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .profileIdentity {
    display: flex;
    gap: 14px;
    align-items: center;
  }

  .profileIdentity h2 {
    margin: 0;
  }

  .profileIdentity p {
    margin: 4px 0 0;
    color: #7a6d85;
  }

  .profilePhoto,
  .profileInitial {
    width: 66px;
    height: 66px;
    border-radius: 22px;
    object-fit: cover;
  }

  .profileInitial {
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #6d28d9, #32114c);
    color: white;
    font-size: 1.5rem;
    font-weight: 950;
  }

  .closeProfile {
    border: 0;
    background: #f5efff;
    color: #32114c;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    cursor: pointer;
  }

  .profileBody {
    margin-top: 20px;
    display: grid;
    gap: 14px;
  }

  .profileBody div {
    padding: 16px;
    border-radius: 20px;
    background: #faf6ff;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .profileBody span {
    display: block;
    color: #6d28d9;
    font-size: 0.78rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .profileBody strong,
  .profileBody p {
    display: block;
    margin: 7px 0 0;
    line-height: 1.6;
  }

  .profileContinue {
    margin-top: 18px;
    background: #32114c;
    color: #fff;
  }

  @media (min-width: 921px) {
    .layout {
      min-height: calc(100vh - 126px);
    }

    .mainCard {
      max-height: calc(100vh - 126px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding-right: 22px;
    }

    .mainCard::-webkit-scrollbar,
    .sideCard::-webkit-scrollbar,
    .timesPanelBody::-webkit-scrollbar {
      width: 8px;
    }

    .mainCard::-webkit-scrollbar-track,
    .sideCard::-webkit-scrollbar-track,
    .timesPanelBody::-webkit-scrollbar-track {
      background: transparent;
    }

    .mainCard::-webkit-scrollbar-thumb,
    .sideCard::-webkit-scrollbar-thumb,
    .timesPanelBody::-webkit-scrollbar-thumb {
      background: rgba(124, 58, 237, 0.34);
      border-radius: 999px;
    }

    .primaryBtn {
  margin-top: 16px;
}
  }

  @media (max-width: 920px) {
    .page {
      padding: 18px 12px 70px;
    }

    .hero {
      padding: 28px 20px;
      border-radius: 30px;
    }

    .summaryGrid,
    .layout,
    .frequencyBox,
    .timeGrid {
      grid-template-columns: 1fr;
    }

    .tutorTop,
    .tutorActions {
      align-items: stretch;
      flex-direction: column;
    }

    .sideCard {
      position: sticky;
      bottom: 10px;
      z-index: 20;
      max-height: 62vh;
      overflow-y: auto;
      box-shadow: 0 20px 70px rgba(47, 25, 80, 0.2);
    }

    .mainCard,
    .sideCard {
      padding: 20px;
      border-radius: 28px;
    }

    h1 {
      font-size: 2.55rem;
    }
  }

  @media (max-width: 640px) {
    .timesOverlay {
      align-items: flex-end;
    }

    .timesPanel {
      width: 100%;
      height: 88vh;
      border-left: 0;
      border-radius: 28px 28px 0 0;
    }

    .timesPanelTop,
    .timesPanelBody,
    .timesPanelFooter {
      padding-left: 18px;
      padding-right: 18px;
    }

    .timesPanelFooter {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 520px) {
    .profileModal {
      padding: 18px;
      border-radius: 26px;
    }

    .profileTop {
      gap: 10px;
    }

    .profilePhoto,
    .profileInitial {
      width: 54px;
      height: 54px;
      border-radius: 18px;
    }
  }
`