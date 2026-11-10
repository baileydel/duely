import check from '../assets/check.svg';
import checkWhite from '../assets/check-white.svg';

export default function CheckIcon({ size = 16, white = false }) {
  return <img className="check-icon" src={white ? checkWhite : check} alt="" width={size} height={size} />;
}
