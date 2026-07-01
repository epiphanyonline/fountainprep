import { scheduleStyles } from './ScheduleStyles'

export function ScheduleLoading({ message = 'Loading schedule...' }: { message?: string }) {
  return (
    <main className="page">
      <section className="hero loadingHero">
        <p className="eyebrow">Fountain Prep Schedule</p>
        <h1>Preparing your weekly timetable...</h1>
        <p className="subtitle">{message}</p>
      </section>

      <style>{scheduleStyles}</style>
    </main>
  )
}

