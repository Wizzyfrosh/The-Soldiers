import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop:
 * 1. Resets window scroll position to the top whenever navigating to a new page/route
 *    (preventing the issue where clicking footer links leaves the user stuck at the bottom).
 * 2. Provides smooth scrolling when navigating to in-page section anchors (#hash).
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigation includes an anchor hash (e.g. #beliefs, #contact)
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId) || document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // When navigating to a new page/route, reset scroll to top immediately
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, hash]);

  return null;
};
