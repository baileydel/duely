import check from '../assets/check-white.svg';

/** The white tick inside a filled (done) circle. */
export default function CheckIcon({ size = 15 }) {
  return <img src={check} alt="" width={size} height={size} />;
}

