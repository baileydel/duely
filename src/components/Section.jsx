/** A titled section with the underlined italic heading, used on Help and the study guide. */
export default function Section({ id, title, children }) {
  return (
    <section className="section" aria-labelledby={id}>
      <h2 id={id} className="title">
        {title}
      </h2>
      {children}
    </section>
  );
}
