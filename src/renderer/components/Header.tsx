import React, { forwardRef } from 'react';
import logoWhite from '../public/logo-white.png';
import logoPrincipal from '../public/logo-principal.png';
import UserSearchModal from './UserSearchModal';

interface Props {
  onLogout: () => void;
}

const Header = forwardRef<HTMLDivElement, Props>(({ onLogout }, ref) => {
  const [isDark, setIsDark] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains('dark'));
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Ajusta el tamano segun el modo
  const logoSrc = isDark ? logoWhite : logoPrincipal;
  const logoClass = isDark
    ? 'h-14 sm:h-24 md:h-32 w-auto'
    : 'h-8 sm:h-10 md:h-12 w-auto';

  return (
    <>
      <header
        ref={ref}
        className="w-full flex-shrink-0 border-b border-green-200 bg-white px-4 py-2 shadow-md dark:border-gray-700 dark:bg-gray-900 sm:px-8 sm:py-3"
      >
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0">
          <div className="flex items-center gap-3 max-h-10">
            <img
              src={logoSrc}
              alt="AWER Logo"
              className={`${logoClass} object-contain drop-shadow-xl transition-all`}
            />
          </div>
          <div className="mt-2 flex gap-2 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-white px-4 py-1 text-sm font-semibold text-emerald-700 shadow transition hover:bg-emerald-50 dark:border-emerald-800 dark:bg-gray-900 dark:text-emerald-300 dark:hover:bg-emerald-950 sm:px-5 sm:py-2 sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 sm:h-5 sm:w-5"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <span className="hidden sm:inline">Buscar usuario</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-red-500 bg-white px-4 py-1 text-sm font-semibold text-red-600 shadow transition hover:bg-red-100 dark:border-red-700 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950 sm:px-5 sm:py-2 sm:text-base"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>
      <UserSearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
});

export default Header;
