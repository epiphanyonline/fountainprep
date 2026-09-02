"use client";

import Link from "next/link";
import FinancialEducationAyoFlow from "@/app/financial-education/FinancialEducationAyoFlow";
import FinancialEducationFlowProgress from "@/app/financial-education/FinancialEducationFlowProgress";

export default function FinancialLiteracyExperience() {
  const startHref = "/fountaintalk/classroom/wealth?guest=1";

  return (
    <main className="journeyPage">
      <div className="ambientGlow glowOne" aria-hidden="true" />
      <div className="ambientGlow glowTwo" aria-hidden="true" />
      <div className="meshGrid" aria-hidden="true" />

      <section className="journeyShell">
        <FinancialEducationFlowProgress
          steps={[
            { label: "Welcome", state: "done" },
            { label: "Choose", state: "current" },
            { label: "Learn", state: "upcoming" },
            { label: "Graduate", state: "upcoming" },
          ]}
          nextLabel="Financial Literacy classroom"
        />

        <div className="journeyBrand">
          <span>FOUNTAIN PREP</span>
          <i />
          <strong>FINANCIAL LITERACY</strong>
        </div>

        <header className="journeyIntro ayoLiteracyIntro">
          <span>YOUR FINANCIAL LITERACY JOURNEY</span>
          <h1>
            Learn the rules.
            <em> Understand how value is built.</em>
          </h1>
          <p>
            Continue into the guided Financial Literacy classroom, or first
            explore the real decisions behind extraordinary wealth creation.
            Whichever route you choose, Ayo will guide the next step.
          </p>
        </header>

        <div className="pathGrid">
          <Link href={startHref} className="pathCard primaryPath ayoLiteracyClassroom">
            <div className="cardGlow" />

            <div className="pathTop">
              <span className="purpleBadge">
                <i />
                RECOMMENDED NEXT
              </span>
              <b>01</b>
            </div>

            <div className="pathHero">
              <div className="pathIcon classroomIcon" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M9 7h6M9 11h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <small>GUIDED CLASSROOM WITH AYO</small>
                <h2>Start Financial Literacy</h2>
              </div>
            </div>

            <p className="pathDescription">
              Enter the structured learning experience and build your financial
              understanding step by step. Your first Foundation lesson is open.
            </p>

            <div className="pathFeature">
              <span>FIRST EXPERIENCE</span>
              <strong>Money Is a Game — Know the Rules</strong>
              <small>Start immediately · No payment details required</small>
            </div>

            <div className="pathFacts">
              <span>Guided by Ayo</span>
              <span>First lesson free</span>
              <span>Progress saved</span>
            </div>

            <div className="pathAction purpleAction">
              <span>
                <small>YOUR RECOMMENDED NEXT STEP</small>
                <strong>START FINANCIAL LITERACY</strong>
              </span>
              <b>→</b>
            </div>
          </Link>

          <Link href="/academies/biography" className="pathCard biographyPath ayoLiteracyBiography">
            <div className="cardGlow" />

            <div className="pathTop">
              <span className="goldBadge">
                <i />
                OPTIONAL FIRST
              </span>
              <b>02</b>
            </div>

            <div className="pathHero">
              <div className="pathIcon biographyIcon" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3 20 7.5 12 12 4 7.5 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M6.5 10.5V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <small>REAL WEALTH-BUILDING JOURNEYS</small>
                <h2>Biography of Greatness</h2>
              </div>
            </div>

            <p className="pathDescription">
              Study how remarkable wealth creators began, built ownership,
              navigated pivotal decisions and allocated capital over time.
            </p>

            <div className="pathFeature biographyFeature">
              <span>LEARN FROM THE JOURNEY</span>
              <strong>Origins → Ownership → Capital → Legacy</strong>
              <small>Explore the decisions behind extraordinary outcomes</small>
            </div>

            <div className="pathFacts">
              <span>Real case studies</span>
              <span>Business ownership</span>
              <span>Capital decisions</span>
            </div>

            <div className="pathAction goldAction">
              <span>
                <small>OPTIONAL EXPERIENCE</small>
                <strong>EXPLORE BIOGRAPHY FIRST</strong>
              </span>
              <b>→</b>
            </div>
          </Link>
        </div>

        <FinancialEducationAyoFlow
          title="You’re one step away from the classroom."
          text="I recommend starting Financial Literacy now. Your first Foundation experience is open, and I’ll guide you through it. If you want to explore Biography of Greatness first, you can do that too — I’ll still show you what comes next."
          tourSteps={[
            {
              selector: ".ayoLiteracyIntro",
              title: "Welcome inside Financial Literacy.",
              text: "From here, you can proceed to the financial education classroom or spend some time to study the biography of greatness. we’re going to start building the foundation for understanding investment and wealth building asset classes. I’ll be with you throughout the journey.",
            },
            {
              selector: ".ayoLiteracyClassroom",
              title: "Let’s begin with the foundation.",
              text: "This is the route I recommend. Your first Foundation experience is called Money Is a Game — Know the Rules. We’ll start by looking at some of the basic rules behind money, value and financial decisions before gradually moving into assets, investing and wealth creation. Your first experience is open, with no payment details required. When you enter the classroom, I’ll meet you there and guide the lesson.",
            },
            {
              selector: ".ayoLiteracyBiography",
              title: "Or begin with some inspiration.",
              text: "If you’d prefer some inspiration before the classroom, you can explore Biography of Greatness first. We’ll examine real wealth-building journeys — not simply how much someone became worth, but what they built, what they owned, the important decisions they made and how they used capital along the way. When you finish, I’ll bring you back to your learning journey.",
            },
            {
              selector: ".ayoLiteracyClassroom",
              title: "I’m ready when you are.",
              text: "So, you’re ready. My recommendation is to start Financial Literacy and let’s build from the foundation together. Or, if Biography has caught your attention, explore that first. There’s no wrong door here — whichever one you choose, I’ll show you what comes next.",
            },
          ]}
        />
      </section>

      <style jsx>{`
        :global(html,body){margin:0;background:#090610;color:#f8f5ff}
        :global(body){overflow-x:hidden}
        .journeyPage{
          position:relative;min-height:calc(100vh - 78px);display:grid;place-items:center;
          overflow:hidden;padding:42px 20px 64px;
          background:
            radial-gradient(circle at 16% 12%,rgba(109,40,217,.17),transparent 31%),
            radial-gradient(circle at 88% 78%,rgba(184,123,34,.10),transparent 28%),
            linear-gradient(180deg,#100a18 0%,#090610 58%,#07050b 100%);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          box-sizing:border-box;
        }
        .meshGrid{
          position:absolute;inset:0;pointer-events:none;opacity:.17;
          background-image:radial-gradient(rgba(255,255,255,.22) .65px,transparent .65px);
          background-size:18px 18px;
          mask-image:linear-gradient(to bottom,black,transparent 90%);
        }
        .ambientGlow{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
        .glowOne{width:480px;height:480px;left:-180px;top:10%;background:rgba(109,40,217,.14)}
        .glowTwo{width:420px;height:420px;right:-170px;bottom:4%;background:rgba(181,125,44,.09)}
        .journeyShell{
          position:relative;z-index:2;width:min(1220px,100%);display:grid;gap:29px;padding:38px 44px 42px;
          border:1px solid rgba(255,255,255,.09);border-radius:34px;
          background:linear-gradient(155deg,rgba(26,17,38,.95),rgba(14,9,23,.96));
          box-shadow:0 44px 110px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.055);
          box-sizing:border-box;animation:premiumEnter .58s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes premiumEnter{from{opacity:0;transform:translateY(22px) scale(.985)}to{opacity:1;transform:none}}
        .journeyBrand{display:flex;align-items:center;justify-content:center;gap:9px;color:#c5a8ff;font-size:9px;font-weight:950;letter-spacing:.12em}
        .journeyBrand i{width:28px;height:1px;background:rgba(255,255,255,.25)}
        .journeyBrand strong{color:#91859a}
        .journeyIntro{max-width:930px;margin:0 auto;text-align:center}
        .journeyIntro>span{color:#a78bfa;font-size:9px;font-weight:950;letter-spacing:.13em}
        .journeyIntro h1{margin:11px 0 14px;font-size:clamp(46px,5.1vw,72px);line-height:.96;font-weight:900;letter-spacing:-.058em}
        .journeyIntro h1 em{display:block;color:#c6a4ff;font-family:Georgia,"Times New Roman",serif;font-weight:400;font-style:italic;letter-spacing:-.045em}
        .journeyIntro p{max-width:760px;margin:auto;color:#aaa0b5;font-size:15px;line-height:1.7}
        .pathGrid{display:grid;grid-template-columns:1.08fr .92fr;gap:24px}
        .pathCard{
          position:relative;overflow:hidden;min-width:0;min-height:460px;display:flex;flex-direction:column;
          padding:30px;border:1px solid;border-radius:27px;color:#fff;text-decoration:none;box-sizing:border-box;
          transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease;
        }
        @media(hover:hover) and (pointer:fine){
          .pathCard:hover{transform:translateY(-7px)}
          .primaryPath:hover{border-color:rgba(185,150,255,.52);box-shadow:0 26px 60px rgba(76,29,149,.22)}
          .biographyPath:hover{border-color:rgba(233,194,119,.48);box-shadow:0 26px 60px rgba(120,75,18,.18)}
        }
        .primaryPath{
          border-color:rgba(167,139,250,.27);
          background:radial-gradient(circle at 10% 3%,rgba(124,58,237,.23),transparent 34%),linear-gradient(145deg,rgba(73,34,119,.27),rgba(255,255,255,.025));
          box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 20px 48px rgba(76,29,149,.13);
        }
        .biographyPath{
          border-color:rgba(223,184,111,.25);
          background:radial-gradient(circle at 10% 3%,rgba(194,132,39,.18),transparent 34%),linear-gradient(145deg,rgba(112,69,18,.22),rgba(255,255,255,.025));
          box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 20px 48px rgba(101,64,20,.11);
        }
        .cardGlow{position:absolute;width:220px;height:220px;right:-70px;top:-80px;border-radius:50%;background:rgba(255,255,255,.035);filter:blur(2px);pointer-events:none}
        .pathTop{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .pathTop>span{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid;border-radius:999px;font-size:8px;font-weight:950;letter-spacing:.09em}
        .pathTop>span i{width:6px;height:6px;border-radius:50%}
        .purpleBadge{color:#d5c1ff;border-color:rgba(167,139,250,.28)!important;background:rgba(124,58,237,.13)}
        .purpleBadge i{background:#a78bfa;box-shadow:0 0 0 5px rgba(167,139,250,.08)}
        .goldBadge{color:#f3d79f;border-color:rgba(223,184,111,.26)!important;background:rgba(181,116,28,.12)}
        .goldBadge i{background:#e2b45d;box-shadow:0 0 0 5px rgba(226,180,93,.08)}
        .pathTop>b{color:#766d7d;font-size:11px;letter-spacing:.14em}
        .pathHero{position:relative;display:grid;grid-template-columns:72px minmax(0,1fr);gap:18px;align-items:center;margin-top:25px;padding:18px;border:1px solid rgba(255,255,255,.09);border-radius:20px;background:rgba(255,255,255,.035)}
        .pathIcon{width:72px;height:72px;display:grid;place-items:center;border-radius:20px;color:#fff}
        .classroomIcon{background:linear-gradient(145deg,#7c3aed,#4c1d95);box-shadow:0 14px 30px rgba(109,40,217,.28)}
        .biographyIcon{background:linear-gradient(145deg,#b7791f,#704516);box-shadow:0 14px 30px rgba(151,91,16,.24)}
        .pathHero small{color:#a78bfa;font-size:8px;font-weight:950;letter-spacing:.11em}
        .biographyPath .pathHero small{color:#e1bc78}
        .pathHero h2{margin:6px 0 0;font-size:clamp(25px,2.2vw,32px);line-height:1.04;letter-spacing:-.04em}
        .pathDescription{margin:20px 2px 0;color:#b6acbd;font-size:14px;line-height:1.65}
        .pathFeature{display:grid;gap:4px;margin-top:19px;padding:15px 16px;border:1px solid rgba(167,139,250,.16);border-radius:15px;background:rgba(124,58,237,.07)}
        .pathFeature span{color:#a78bfa;font-size:7px;font-weight:950;letter-spacing:.11em}
        .pathFeature strong{font-size:12px}
        .pathFeature small{color:#8f8497;font-size:9px}
        .biographyFeature{border-color:rgba(223,184,111,.14);background:rgba(181,116,28,.055)}
        .biographyFeature span{color:#dfb66d}
        .pathFacts{display:flex;flex-wrap:wrap;gap:7px;margin-top:17px}
        .pathFacts span{padding:6px 9px;border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#b9afc0;background:rgba(255,255,255,.035);font-size:8px;font-weight:800}
        .pathAction{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:auto;padding:0 18px;border-radius:15px;color:#fff;box-shadow:0 13px 28px rgba(0,0,0,.2)}
        .purpleAction{background:linear-gradient(135deg,#7c3aed,#5b21b6)}
        .goldAction{background:linear-gradient(135deg,#b7650d,#874407)}
        .pathAction>span{display:grid;gap:2px}.pathAction small{font-size:7px;font-weight:850;letter-spacing:.08em;opacity:.72}.pathAction strong{font-size:11px;letter-spacing:.035em}.pathAction>b{font-size:22px}
        @media(max-width:840px){
          .journeyPage{place-items:start center;padding:20px 10px 44px}
          .journeyShell{padding:20px;gap:22px;border-radius:25px}
          .journeyIntro h1{font-size:44px}
          .journeyIntro p{font-size:13px}
          .pathGrid{grid-template-columns:1fr;gap:17px}
          .pathCard{min-height:420px;padding:23px}
        }
        @media(max-width:520px){
          .journeyShell{padding:14px;border-radius:21px}
          .journeyBrand{font-size:8px}
          .journeyIntro h1{font-size:37px}
          .journeyIntro p{font-size:12px}
          .pathCard{min-height:390px;padding:18px;border-radius:21px}
          .pathHero{grid-template-columns:58px minmax(0,1fr);gap:13px;padding:14px}
          .pathIcon{width:58px;height:58px;border-radius:16px}
          .pathIcon :global(svg){width:25px;height:25px}
          .pathHero h2{font-size:23px}
          .pathDescription{font-size:12px}
          .pathFeature{padding:13px}
          .pathAction{min-height:58px;padding:0 14px}
        }
        @media(prefers-reduced-motion:reduce){.journeyShell{animation:none}}
      `}</style>
    </main>
  );
}
