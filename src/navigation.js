import { useNavigate } from 'react-router-dom';

export function useBackLink() {
  const navigate = useNavigate();
  return (event) => {
    if (window.history.state?.idx > 0) {
      event.preventDefault();
      navigate(-1);
    }
  };
}
