import PageTitle from '../components/PageTitle.jsx';
import Section from '../components/Section.jsx';

export default function Help() {
  return (
    <>
      <div className="page-head">
        <div>
          <PageTitle docTitle="How it works">How it works</PageTitle>
          <p className="subtitle">Everything duely does, on one page. About two minutes to read.</p>
        </div>
      </div>

      <Section id="help-adding" title="Adding an assignment">
        <ol className="steps">
          <li>
            Click <strong>+ Add assignment</strong> (or <strong>+ Add one</strong>) on Due soon, or{' '}
            <strong>Add</strong> up top.
          </li>
          <li>
            Say what it is, which class, when it is due, and which day you’ll work on it. Tap Today, Tomorrow or Day
            before it’s due, or pick any day up to the due date.
          </li>
          <li>
            Press <strong>Save</strong>. You land back on Due soon with the new row in its place.
          </li>
        </ol>
        <p className="muted line">
          Left something required blank? Save does nothing except underline that field in red and tell you. Nothing
          is saved until all four are filled.
        </p>
      </Section>

      <Section id="help-planning" title="Planning your days">
        <ul className="steps">
          <li>
            Every assignment has a day you plan to work on it. On that day it shows up under <strong>Today</strong> at
            the top of Due soon.
          </li>
          <li>
            Missed the day? It stays under Today until you mark it done, so it can’t slip by. Once the due date has
            passed, it moves up to <strong>Overdue</strong> instead.
          </li>
          <li>
            Each row says which day you’re working on it, and its time estimate if you gave one.
          </li>
        </ul>
      </Section>

      <Section id="help-finishing" title="Finishing and undoing">
        <ul className="steps">
          <li>
            The circle next to each row is <strong>Mark done</strong>. Click it and the row moves to Done, with a
            note and an undo link.
          </li>
          <li>
            <strong>undo</strong> puts it back exactly where it was. Every row in Done keeps its own undo.
          </li>
          <li>Done can be hidden with the link beside it.</li>
        </ul>
      </Section>

      <Section id="help-reading" title="Reading the list">
        <ul className="steps">
          <li>
            Rows are grouped <strong>Overdue</strong>, <strong>This week</strong>, <strong>Later</strong>, soonest
            first inside each group.
          </li>
          <li>Overdue rows say how many days late in red words, not just a color.</li>
          <li>The dot by a class is the color you picked for it. The class name is always there too.</li>
        </ul>
      </Section>

      <Section id="help-guides" title="Study guides">
        <ul className="steps">
          <li>
            Click an assignment’s name to open its study guide: the day you’re working on it, its time
            estimate, and its note.
          </li>
          <li>
            The assignment’s note is shown at the bottom. Long notes are folded; <strong>show all</strong> opens the
            rest.
          </li>
        </ul>
      </Section>

      <Section id="help-faq" title="Common questions">
        <dl className="faq">
          <dt>Can I change a due date?</dt>
          <dd>Not yet. For now, mark the old one done and add a new one.</dd>
          <dt>Is anything ever deleted?</dt>
          <dd>No. Done rows stay in Done until you undo them.</dd>
        </dl>
      </Section>
    </>
  );
}
