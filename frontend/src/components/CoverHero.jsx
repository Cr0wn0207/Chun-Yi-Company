import './CoverHero.css';

export default function CoverHero({ title, subtitle, image }) {
  return (
    <div className="cover-hero" style={{ backgroundImage: `url(${image})` }}>
      <div className="cover-hero__overlay" aria-hidden />
      <div className="container cover-hero__inner">
        <h1 className="cover-hero__title">{title}</h1>
        <p className="cover-hero__subtitle">
          <span className="cover-hero__dot" aria-hidden />
          {subtitle}
        </p>
      </div>
    </div>
  );
}
