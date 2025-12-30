import React from "react";
import { useCompany } from "../context/CompanyContext";

interface Props {
  onChangePos: () => void;
  onLoadPoints: () => void;
  onRedeemCoupon: () => void;
}

const Home: React.FC<Props> = ({ onChangePos, onLoadPoints, onRedeemCoupon }) => {
  const { branches, companyLogo, companyName } = useCompany();
  const posId = localStorage.getItem("pos");
  let posName = "Punto de Venta";
  if (posId) {
    const branch = branches.find((b) => String(b.id) === posId);
    if (branch) posName = branch.name;
  }

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-6">
      {/* Card principal */}
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Encabezado visual */}
        <div className="relative">
          <div className="h-24 sm:h-28 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 dark:from-green-700 dark:via-emerald-700 dark:to-green-800" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 shadow-xl flex items-center justify-center p-1">
              {companyLogo ? (
                <img
                  src={companyLogo.startsWith('http') ? companyLogo : `https:${companyLogo}`}
                  alt={companyName || 'Logo'}
                  className="h-full w-full object-contain rounded-xl border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-10 w-10 text-green-600 dark:text-green-400"
                >
                  <path d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v7.5A2.25 2.25 0 0 1 18.75 16.5H5.25A2.25 2.25 0 0 1 3 14.25v-7.5Z" />
                  <path d="M3.75 18.375A1.875 1.875 0 0 1 5.625 16.5h12.75a1.875 1.875 0 0 1 1.875 1.875c0 .414-.336.75-.75.75H4.5a.75.75 0 0 1-.75-.75Z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-5 sm:px-8 pt-14 pb-6">
          {/* Título y POS */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              {posName}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Panel principal de acreditación de puntos
            </p>
          </div>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Cargar puntos */}
            <button
              onClick={onLoadPoints}
              className="group w-full rounded-2xl px-5 py-4 sm:py-5 text-left border border-green-500/60 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 text-green-700 dark:text-green-300 shadow transition-all"
              aria-label="Cargar puntos"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 border border-green-200 dark:border-gray-700 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v7.5h7.5a.75.75 0 0 1 0 1.5h-7.5v7.5a.75.75 0 0 1-1.5 0v-7.5h-7.5a.75.75 0 0 1 0-1.5h7.5v-7.5A.75.75 0 0 1 12 2.25Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-extrabold">Cargar puntos</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Ingresar DNI, datos y monto de compra</p>
                </div>
              </div>
            </button>

            {/* Canjear cupon */}
            <button
              onClick={onRedeemCoupon}
              className="group w-full rounded-2xl px-5 py-4 sm:py-5 text-left border border-indigo-500/60 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-200 shadow transition-all"
              aria-label="Canjear cupon"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 border border-indigo-200 dark:border-indigo-700 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-9Z" />
                    <path fillRule="evenodd" d="M8.25 9A.75.75 0 0 1 9 8.25h6a.75.75 0 0 1 0 1.5H9A.75.75 0 0 1 8.25 9Zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-extrabold">Canjear cupon</p>
                  <p className="text-xs sm:text-sm text-indigo-900/80 dark:text-indigo-100/90">
                    Ingresar el codigo del cliente asociado al cupon
                  </p>
                </div>
              </div>
            </button>

            {/* Cambiar punto de venta */}
            {!posId && (
              <button
                onClick={onChangePos}
                className="group w-full rounded-2xl px-5 py-4 sm:py-5 text-left border border-gray-200 dark:border-gray-700 bg-gray-50 hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white shadow transition-all"
                aria-label="Cambiar punto de venta"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 border border-green-200 dark:border-gray-700 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v1.5H3.75V6Z" />
                      <path fillRule="evenodd" d="M3.75 9.75h16.5v7.5A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25v-7.5Zm4.5 3a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-extrabold">Cambiar punto de venta</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Seleccioná otro POS disponible</p>
                  </div>
                </div>
              </button>
            )}

            {/* Configuración (placeholder sin handler) */}
            {/* <button
              type="button"
              className="group w-full rounded-2xl px-5 py-4 sm:py-5 text-left border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-900 dark:text-white shadow transition-all"
              aria-label="Configuración"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 border border-green-200 dark:border-gray-700 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path fillRule="evenodd" d="M10.5 4.995V3.75a.75.75 0 1 1 1.5 0v1.245a7.5 7.5 0 0 1 5.01 2.21l.88-.88a.75.75 0 1 1 1.06 1.061l-.88.88a7.5 7.5 0 0 1 2.21 5.01h1.245a.75.75 0 1 1 0 1.5h-1.245a7.5 7.5 0 0 1-2.21 5.01l.88.88a.75.75 0 1 1-1.06 1.061l-.88-.88a7.5 7.5 0 0 1-5.01 2.21V21.75a.75.75 0 1 1-1.5 0v-1.245a7.5 7.5 0 0 1-5.01-2.21l-.88.88a.75.75 0 1 1-1.06-1.061l.88-.88a7.5 7.5 0 0 1-2.21-5.01H2.25a.75.75 0 1 1 0-1.5h1.245a7.5 7.5 0 0 1 2.21-5.01l-.88-.88A.75.75 0 0 1 5.886 5.12l.88.88a7.5 7.5 0 0 1 5.01-2.005Zm0 3.255a5.25 5.25 0 1 0 2.999.96l-.01-.006A5.228 5.228 0 0 0 10.5 8.25Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-extrabold">Configuración</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Preferencias y apariencia</p>
                </div>
              </div>
            </button> */}

            {/* Ayuda y soporte */}
            <button
              onClick={() => window.awer?.openExternal?.("https://gestion.awerreviews.com/app/support")}
              className="group w-full rounded-2xl px-5 py-4 sm:py-5 text-left border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-900 dark:text-white shadow transition-all"
              aria-label="Ayuda y soporte"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 border border-green-200 dark:border-gray-700 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path
                      fillRule="evenodd"
                      d="M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0Zm11.172-3.03a2.625 2.625 0 0 0-4.517 1.822.75.75 0 0 1-1.5 0 4.125 4.125 0 0 1 7.1-2.856c.715.715 1.1 1.67 1.1 2.651 0 1.82-1.35 3.216-2.548 3.99-.298.195-.581.376-.8.565-.208.18-.48.476-.48.923a.75.75 0 0 1-1.5 0c0-1.114.66-1.83 1.19-2.283.28-.242.6-.444.912-.644 1.005-.66 2.126-1.694 2.126-3.551 0-.6-.237-1.176-.583-1.617ZM12 17.25a.938.938 0 1 0 0 1.875.938.938 0 0 0 0-1.875Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-extrabold">Ayuda y soporte</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Guías rápidas y preguntas frecuentes
                  </p>
                </div>
              </div>
            </button>

          </div>
          {/* Sugerencia / hint */}
          <div className="mt-6 rounded-2xl border border-dashed border-green-300 dark:border-green-700 bg-green-50/60 dark:bg-green-950/40 px-4 py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            Consejo: podés alternar modo claro/oscuro desde el botón de configuración del pie de página.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
