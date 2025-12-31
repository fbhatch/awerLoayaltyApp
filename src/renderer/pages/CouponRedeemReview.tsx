import React from "react";
import Tooltip from "../components/Tooltip";
import userIcon from "../assets/user-default.svg";
import { CouponData } from "../api/points";

interface Props {
  coupon: CouponData;
  onBack: () => void;
  onCancel: () => void;
}

type ApiDateValue = number[] | string | null;

const parseApiDate = (value: ApiDateValue): Date | null => {
  if (!value) return null;
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day, hours = 0, minutes = 0, seconds = 0, nanos = 0] = value;
    const milliseconds = Math.floor(nanos / 1000000);
    return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const formatDateTime = (date: Date | null, withTime = true) => {
  if (!date) return "-";
  const pad = (value: number) => String(value).padStart(2, "0");
  const base = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  if (!withTime) return base;
  return `${base} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const CouponRedeemReview: React.FC<Props> = ({ coupon, onBack, onCancel }) => {
  const [branchesOpen, setBranchesOpen] = React.useState(false);
  const [branchId, setBranchId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("pos");
    if (!stored) return;
    const parsed = Number(stored);
    if (!Number.isNaN(parsed)) {
      setBranchId(parsed);
    }
  }, []);

  const handleConsume = () => {
    console.log("Consumir cupon (pendiente de implementacion)", coupon);
  };

  const now = new Date();
  const fromDate = parseApiDate(coupon.couponBox.dateFrom);
  const toDate = parseApiDate(coupon.couponBox.dateTo);
  const createdAt = parseApiDate(coupon.couponUsage.dateCreated);
  const usedAt = parseApiDate(coupon.couponUsage.dateUsed);

  const notStarted = !!(fromDate && now < fromDate);
  const expired = !!(toDate && now > toDate);

  const branchIsListed =
    coupon && branchId
      ? coupon.couponBox.branches.some((branch) => branch.id === branchId)
      : false;

  const disableReasons: string[] = [];
  if (branchId === null) {
    disableReasons.push("Selecciona un punto de venta antes de operar.");
  }
  if (!coupon.couponBox.active) {
    disableReasons.push("El cupon esta inactivo.");
  }
  if (notStarted) {
    disableReasons.push("El cupon todavia no esta vigente.");
  }
  if (expired) {
    disableReasons.push("El cupon esta vencido.");
  }
  if (coupon.couponUsage.used) {
    disableReasons.push("El cupon ya fue consumido.");
  }
  if (!coupon.availableForBranch) {
    disableReasons.push("Este punto de venta no puede consumir este cupon.");
  } else if (branchId && !branchIsListed) {
    disableReasons.push("Tu punto de venta no figura entre los habilitados.");
  }

  const consumeDisabled = disableReasons.length > 0;
  const disableMessage = disableReasons.join("\n");

  const validityPill = notStarted
    ? { text: "No vigente", className: "bg-yellow-100 text-yellow-900 border-yellow-300" }
    : expired
      ? { text: "Expirado", className: "bg-red-100 text-red-900 border-red-300" }
      : { text: "Vigente", className: "bg-green-100 text-green-900 border-green-300" };

  const activePill = coupon.couponBox.active
    ? { text: "Activo", className: "bg-emerald-100 text-emerald-900 border-emerald-300" }
    : { text: "Inactivo", className: "bg-red-100 text-red-900 border-red-300" };

  const availabilityPill = coupon.availableForBranch
    ? { text: "Disponible para este PDV", className: "bg-green-50 text-green-700 border-green-200" }
    : { text: "No disponible para este PDV", className: "bg-red-50 text-red-700 border-red-200" };

  const userStatusPill = coupon.couponUsage.used
    ? { text: "Consumido", className: "bg-red-100 text-red-900 border-red-300" }
    : { text: "Sin consumir", className: "bg-green-100 text-green-900 border-green-300" };

  const usageAccent = coupon.couponUsage.used
    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="relative">
          <button
            onClick={onBack}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-indigo-300 dark:border-indigo-600 p-2 shadow hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
            aria-label="Volver"
            title="Volver al paso anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-indigo-700 dark:text-indigo-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="h-24 sm:h-28 bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 dark:from-indigo-700 dark:via-purple-700 dark:to-violet-700 rounded-t-3xl" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-700 shadow-xl flex items-center justify-center overflow-hidden">
              {coupon.couponBox.imageUrl ? (
                <img
                  src={coupon.couponBox.imageUrl}
                  alt={coupon.couponBox.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-indigo-600 dark:text-indigo-300">
                  <path d="M9.813 4.196a1.5 1.5 0 0 1 2.373 0l7.39 9.237c.712.89.086 2.209-1.187 2.209H3.61c-1.273 0-1.899-1.32-1.187-2.209l7.39-9.237Z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 pt-14 pb-8">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-300">Revisar cupon</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              {coupon.couponBox.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{coupon.couponBox.description}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="flex-1 space-y-4">
                <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-4 py-3">
                  <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-200 uppercase tracking-wide">Estado actual</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${activePill.className}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {activePill.text}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${validityPill.className}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {validityPill.text}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${availabilityPill.className}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {availabilityPill.text}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-indigo-700/80 dark:text-indigo-200/80">
                    {coupon.couponBox.branches.length} sucursales habilitadas para este cupón.
                  </p>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/40 dark:to-gray-900 border border-indigo-100 dark:border-indigo-800 p-3 shadow-inner">
                    <dt className="text-xs font-semibold text-indigo-800 dark:text-indigo-200 uppercase tracking-wide flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 text-xs">
                        ⏱
                      </span>
                      Vigencia
                    </dt>
                    <dd className="mt-2 text-sm text-gray-900 dark:text-white space-y-0.5 font-semibold">
                      {fromDate ? <p>Desde {formatDateTime(fromDate)}</p> : <p>Sin fecha de inicio</p>}
                      {toDate ? <p>Hasta {formatDateTime(toDate)}</p> : <p>Sin fecha de fin</p>}
                      {notStarted && <p className="text-xs text-yellow-600 dark:text-yellow-300 font-normal">Aun no disponible</p>}
                      {expired && <p className="text-xs text-red-600 dark:text-red-300 font-normal">Cupon vencido</p>}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/40 dark:to-gray-900 border border-emerald-100 dark:border-emerald-800 p-3 shadow-inner">
                    <dt className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 uppercase tracking-wide flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200 text-xs">
                        📦
                      </span>
                      Stock disponible
                    </dt>
                    <dd className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <p className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                        {coupon.couponBox.stock.toLocaleString()}
                      </p>
                      <span className="text-xs">Unidades totales</span>
                    </dd>
                  </div>
                </dl>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sucursales habilitadas</p>
                  <button
                    type="button"
                    onClick={() => setBranchesOpen((prev) => !prev)}
                    className="group inline-flex w-full items-center justify-between rounded-2xl border border-amber-300 dark:border-amber-600 px-4 py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-200 bg-white dark:bg-gray-900 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 text-xs">
                        {coupon.couponBox.branches.length}
                      </span>
                      {branchesOpen ? "Ocultar puntos de venta" : "Ver puntos de venta"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`h-4 w-4 text-amber-600 dark:text-amber-300 transition ${branchesOpen ? "rotate-180" : ""}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25 12 15.75 4.5 8.25" />
                    </svg>
                  </button>
                  {branchesOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-1 brand-scroll mt-3">
                      {coupon.couponBox.branches.map((branch) => (
                        <article
                          key={branch.id}
                          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm flex gap-3 items-start"
                        >
                          <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-200 text-xs font-semibold">
                            {branch.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{branch.name}</p>
                            <p className="mt-1 leading-snug">{branch.address}</p>
                            {branch.province && (
                              <p className="text-[11px] text-gray-500 dark:text-gray-400">Provincia: {branch.province}</p>
                            )}
                            {branch.country && (
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{branch.country}</p>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-60 xl:w-72 space-y-3">
                <div className="rounded-3xl bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 overflow-hidden relative group cursor-zoom-in">
                  {coupon.couponBox.imageUrl ? (
                    <>
                      <img
                        src={coupon.couponBox.imageUrl}
                        alt={coupon.couponBox.title}
                        className="w-full object-cover h-60 sm:h-64 transition duration-200 group-hover:scale-105"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => window.open(coupon.couponBox.imageUrl, "_blank")}
                        className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/70 text-white px-3 py-1 text-xs font-semibold shadow"
                        title="Ver imagen en una nueva pestana"
                      >
                        Ampliar
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                          <path stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M5 19 19 5M8 5h11v11" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="h-60 sm:h-64 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">Sin imagen</div>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Haz clic en "Ampliar" para abrir la imagen en otra ventana.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-4 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-pre-line max-h-40 overflow-y-auto brand-scroll">
              {coupon.couponBox.legal || "Sin legales cargados."}
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-200 via-purple-200 to-violet-200 dark:from-indigo-800 dark:via-purple-800 dark:to-violet-900 border-2 border-indigo-400 dark:border-indigo-600 shadow-inner flex items-center justify-center">
                <img src={userIcon} alt="Usuario" className="w-10 h-10 opacity-80" />
                <div className="absolute inset-0 rounded-full ring-2 ring-white/40 dark:ring-black/30 pointer-events-none" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Cliente</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${userStatusPill.className}`}>
                    {userStatusPill.text}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{coupon.user.email}</p>
              </div>
              <button
                type="button"
                className="w-full sm:w-auto rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Ver ficha del usuario
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12M6 12h12M6 16h8" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fecha de acreditación</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{formatDateTime(createdAt)}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Costo en puntos</p>
                  <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
                    {coupon.couponUsage.pointsCost.toLocaleString()} pts
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 flex items-start gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${usageAccent}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Uso</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {coupon.couponUsage.used
                      ? `Consumido el ${formatDateTime(usedAt)}`
                      : "Aun no fue consumido"}
                  </p>
                </div>
              </div>
              {coupon.couponUsage.used && (
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
                      <circle cx="12" cy="11" r="2.5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sucursal asociada</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {coupon.couponUsage.branch.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{`ID ${coupon.couponUsage.branch.id}`}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancelar
            </button>
            {consumeDisabled && disableMessage ? (
              <Tooltip message={disableMessage}>
                <button
                  type="button"
                  disabled
                  className="w-full sm:w-auto rounded-full px-6 py-3 font-extrabold text-white bg-green-500 cursor-not-allowed opacity-70"
                >
                  Consumir
                </button>
              </Tooltip>
            ) : (
              <button
                type="button"
                onClick={handleConsume}
                className="w-full sm:w-auto rounded-full px-6 py-3 font-extrabold text-white bg-green-600 hover:bg-green-500 shadow-lg transition"
              >
                Consumir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponRedeemReview;
