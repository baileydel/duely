import { useEffect } from 'react';

/** Big serif page heading. The gold squiggle under it comes from styles.css. */
export default function PageTitle({ children, docTitle, small = false }) {
  useEffect(() => {
    document.title = docTitle ? `${docTitle} · duely` : 'duely';
  }, [docTitle]);

  return (
    <h1 className={small ? 'page-title page-title--small' : 'page-title'}>
      <span>{children}</span>
    </h1>
  );
}
