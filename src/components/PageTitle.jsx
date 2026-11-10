import { useEffect } from 'react';
import squiggle from '../assets/squiggle.svg';

/** Big serif page heading with the hand-drawn gold underline. */
export default function PageTitle({ children, docTitle }) {
  useEffect(() => {
    document.title = docTitle ? `${docTitle} · duely` : 'duely';
  }, [docTitle]);

  return (
    <h1 className="page-title">
      <span className="page-title__text">
        {children}
        <img className="squiggle" src={squiggle} alt="" />
      </span>
    </h1>
  );
}
