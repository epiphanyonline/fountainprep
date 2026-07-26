import { ProductShell, AyoNote } from "../../components/ProductShell";

export default function ProfilePage() {
  return (
    <ProductShell active="profile">
      <header className="profile-hero section-pad"><p className="eyebrow">Your journey</p><h1>Ideas worth returning to.</h1><p>Not scores. Not streaks. The thoughts and stories that are becoming part of how you see the world.</p></header>
      <section className="section-pad narrow-section"><AyoNote>You often notice the quiet preparation behind visible courage.</AyoNote></section>
      <section className="section-pad profile-grid">
        <article className="profile-stat"><span>1</span><p>Journey in progress</p></article><article className="profile-stat"><span>4</span><p>Reflections saved</p></article><article className="profile-stat"><span>3</span><p>Ideas remembered</p></article>
      </section>
      <section className="section-pad"><div className="section-heading"><div><p className="eyebrow">Recent reflections</p><h2>Your words</h2></div></div><div className="reflection-list"><blockquote>“Courage can begin in the ordinary things nobody sees.”<cite>David · The Shepherd</cite></blockquote><blockquote>“Fear does not always remove ability. Sometimes it only stops us from using it.”<cite>David · The Valley</cite></blockquote></div></section>
    </ProductShell>
  );
}
