import PageTitle from '../components/PageTitle.jsx';

export default function Help() {
  return (
    <>
      <div className="page-head">
        <div>
          <PageTitle docTitle="How it works">How it works</PageTitle>
          <p className="subtitle">Everything Duely does, on one page. About two minutes to read.</p>
        </div>
      </div>

      <section className="help-section" aria-labelledby="help-adding">
        <h2 id="help-adding" className="help-heading">
          Adding an assignment
        </h2>
        <ol>
          <li>
            Click <strong>+ Add one</strong> on the Due soon page, or <strong>Add</strong> up top.
          </li>
          <li>Say what it is, which class, and when it is due. Pick a class color or add a note if you want.</li>
          <li>
            Press <strong>Save</strong>. You land back on Due soon with the new row in its place.
          </li>
        </ol>
        <p className="help-aside">
          Left something required blank? Save does nothing except underline that field in red and tell you.
          Nothing is saved until all three are filled.
        </p>
      </section>

      <section className="help-section" aria-labelledby="help-finishing">
        <h2 id="help-finishing" className="help-heading">
          Finishing and undoing
        </h2>
        <ul>
          <li>
            The circle next to each row is <strong>Mark done</strong>. Click it and the row moves to Done, with a
            note and an undo link.
          </li>
          <li>
            <strong>undo</strong> puts it back exactly where it was. Every row in Done keeps its own undo.
          </li>
          <li>Done can be hidden with the link beside it.</li>
        </ul>
      </section>

      <section className="help-section" aria-labelledby="help-reading">
        <h2 id="help-reading" className="help-heading">
          Reading the list
        </h2>
        <ul>
          <li>
            Rows are grouped <strong>Overdue</strong>, <strong>This week</strong>, <strong>Later</strong>, soonest
            first inside each group.
          </li>
          <li>Overdue rows say how many days late in red words, not just a color.</li>
          <li>The dot by a class is the color you picked for it. The class name is always there too.</li>
        </ul>
      </section>

      <section className="help-section" aria-labelledby="help-guides">
        <h2 id="help-guides" className="help-heading">
          Study guides
        </h2>
        <ul>
          <li>
            Every assignment has a <strong>Study guide</strong> link. It plans out the days you have left, so you know
            what to do today.
          </li>
          <li>
            The assignment’s note is shown under the plan. Long notes are folded; <strong>show all</strong> opens
            the rest.
          </li>
        </ul>
      </section>

      <section className="help-section" aria-labelledby="help-faq">
        <h2 id="help-faq" className="help-heading">
          Common questions
        </h2>
        <dl className="faq">
          <dt>Can I change a due date?</dt>
          <dd>Not yet. For now, mark the old one done and add a new one.</dd>
          <dt>Is anything ever deleted?</dt>
          <dd>No. Done rows stay in Done until you undo them.</dd>
        </dl>
      </section>
    </>
  );
}
