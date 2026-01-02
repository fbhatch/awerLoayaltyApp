import React from "react";
import { Branch } from "../api/auth";
import Spinner from "../components/Spinner";
import { useCompany } from "../context/CompanyContext";

interface Props {
  onSelect: (pos: Branch) => void;
  onCancel: () => void;
}

const PosSelect: React.FC<Props> = ({ onSelect, onCancel }) => {
  const { branches } = useCompany();
  const [search, setSearch] = React.useState("");
  const [highlight, setHighlight] = React.useState<number>(-1);

  const poses = branches;

  // ESC para volver rápido
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const filtered = React.useMemo(
    () => poses.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [poses, search]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((idx) => (idx + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((idx) => (idx - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[highlight >= 0 ? highlight : 0];
      if (target) onSelect(target);
    }
  };

  if (!poses.length)
    return (
      <div className="min-h-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 text-center">
          <Spinner className="mx-auto" />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Cargando puntos de venta…
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-6">
      {/* Card principal */}
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden animate-fade-in relative">
        {/* Encabezado visual + Botón volver */}
        <div className="relative">
          {/* Botón volver – flotante y centrado en Y */}
          <button
            onClick={onCancel}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full 
             bg-white dark:bg-gray-800 
             border border-green-300 dark:border-green-600 
             p-2 shadow 
             hover:bg-green-50 dark:hover:bg-gray-700 
             transition"
            aria-label="Volver"
            title="Volver al inicio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5 text-green-700 dark:text-green-300"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="h-24 sm:h-28 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 dark:from-green-700 dark:via-emerald-700 dark:to-green-800 rounded-t-3xl" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 shadow-xl flex items-center justify-center">
              {/* Ícono POS */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-10 w-10 text-green-600 dark:text-green-400"
              >
                <path d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v7.5A2.25 2.25 0 0 1 18.75 16.5H5.25A2.25 2.25 0 0 1 3 14.25v-7.5Z" />
                <path d="M3.75 18.375A1.875 1.875 0 0 1 5.625 16.5h12.75a1.875 1.875 0 0 1 1.875 1.875c0 .414-.336.75-.75.75H4.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-5 sm:px-8 pt-14 pb-6">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Seleccione el punto de venta
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Hay {filtered.length} resultados {search ? `para "${search}"` : "disponibles"}
            </p>
          </div>

          {/* Buscador */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlight(-1);
                }}
                onKeyDown={handleKey}
                placeholder="Buscar por nombre…"
                className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Buscar punto de venta"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Limpiar búsqueda"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Estado de error */}
          {/* Lista de POS con scroll personalizado */}
          <div
            role="listbox"
            aria-label="Resultados de puntos de venta"
            className="max-h-72 overflow-y-auto brand-scroll rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900"
          >
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-600 dark:text-gray-300">
                No hay resultados. Intenta con otro término.
              </div>
            ) : (
              filtered.map((p, idx) => (
                <button
                  key={p.id}
                  role="option"
                  aria-selected={idx === highlight}
                  onMouseEnter={() => setHighlight(idx)}
                  onClick={() => onSelect(p)}
                  className={`w-full text-left px-5 py-4 transition-all focus:outline-none ${idx === highlight
                    ? "bg-green-50 dark:bg-green-950/40"
                    : "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                  {/* Layout flex con wrap */}
                  <div className="flex flex-wrap sm:flex-nowrap sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Icono oculto en xs */}
                      <div className="hidden sm:flex h-10 w-10 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-gray-900 items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 text-green-700 dark:text-green-300"
                        >
                          <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v1.5H3.75V6Z" />
                          <path
                            fillRule="evenodd"
                            d="M3.75 9.75h16.5v7.5A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25v-7.5Zm4.5 3a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 whitespace-normal sm:truncate">
                          {p.name}
                        </p>
                        {"address" in p && (p as any).address && (
                          <p className="hidden sm:block text-xs text-gray-600 dark:text-gray-400 truncate">
                            {(p as any).address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Chip: se alinea al lado si hay espacio, abajo si no */}
                    <div className="mt-2 sm:mt-0 sm:ml-auto self-start sm:self-center">
                      <div className="text-xs px-2 py-1 rounded-full border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 w-max">
                        Seleccionar
                      </div>
                    </div>
                  </div>
                </button>

              ))
            )}
          </div>

          {/* Hint */}
          {/* <div className="mt-6 rounded-2xl border border-dashed border-green-300 dark:border-green-700 bg-green-50/60 dark:bg-green-950/40 px-4 py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            Tip: podés navegar la lista con ↑/↓ y confirmar con Enter (Esc para volver).
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PosSelect;
