import React from "react";
import Toast from "../components/Toast";
import userIcon from "../assets/user-default.svg";
import { CouponData } from "../api/points";

interface Props {
  coupon: CouponData;
  success: boolean;
  message?: string;
  onGoHome: () => void;
}

const CouponRedeemResult: React.FC<Props> = ({ coupon, success, message, onGoHome }) => {
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

  React.useEffect(() => {
    if (!message) return;
    const toastType = success ? "success" : "error";
    setToast({ message, type: toastType });
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [message, success]);

  const status = success
    ? {
      title: "Cupón consumido con éxito",
      subtitle: "El beneficio ya quedó registrado para el cliente.",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
      iconBg: "bg-emerald-500/20 text-emerald-500",
      buttonClass: "bg-emerald-600 hover:bg-emerald-500",
    }
    : {
      title: "No pudimos consumir el cupón",
      subtitle: "Revisa las condiciones o intenta nuevamente.",
      badgeClass: "bg-red-100 text-red-900 border-red-300",
      iconBg: "bg-red-500/20 text-red-500",
      buttonClass: "bg-gray-600 hover:bg-gray-500",
    };

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-6">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="relative">
          <div className="h-24 sm:h-28 bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 dark:from-indigo-700 dark:via-purple-700 dark:to-violet-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border text-xs font-semibold ${status.badgeClass}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                {success ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              {success ? "Cupón aplicado" : "Cupón no utilizado"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white text-center drop-shadow-lg">{status.title}</h1>
            <p className="text-sm text-white/80 text-center">{status.subtitle}</p>
          </div>
        </div>
        <div className="px-5 sm:px-10 pt-8 sm:pt-10 pb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-28 h-28 rounded-3xl border border-indigo-100 dark:border-indigo-800 overflow-hidden shadow-lg bg-white dark:bg-gray-900">
              {coupon.couponBox.imageUrl ? (
                <img src={coupon.couponBox.imageUrl} alt={coupon.couponBox.title} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-indigo-600 dark:text-indigo-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12">
                    <path d="M9.813 4.196a1.5 1.5 0 0 1 2.373 0l7.39 9.237c.712.89.086 2.209-1.187 2.209H3.61c-1.273 0-1.899-1.32-1.187-2.209l7.39-9.237Z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-500 dark:text-indigo-300">Cupón</p>
              <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{coupon.couponBox.title}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{coupon.couponBox.description}</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-700 text-xs text-indigo-700 dark:text-indigo-200">
                <span>{coupon.couponUsage.pointsCost.toLocaleString()} pts</span>
                <span className="text-gray-400">•</span>
                <span>Uso único</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3 bg-gray-50 dark:bg-gray-800/40">
              <span className={`h-10 w-10 rounded-2xl flex items-center justify-center ${status.iconBg}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                  {success ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
              </span>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Resultado</p>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{status.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{message || status.subtitle}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3 bg-gray-50 dark:bg-gray-800/40">
              <span className={`h-10 w-10 rounded-2xl flex items-center justify-center ${status.iconBg}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 1 0-3-3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a3 3 0 0 0-3 3v9l3-1.5 3 1.5V9a3 3 0 0 0-3-3Z" />
                </svg>
              </span>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cliente</p>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white break-all">{coupon.user.email}</p>
                {coupon.user.dni && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">DNI: {coupon.user.dni}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={coupon.user.avatar || userIcon}
                alt={coupon.user.email}
                onError={(event) => {
                  if (event.currentTarget.src !== userIcon) {
                    event.currentTarget.src = userIcon;
                  }
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Detalle del usuario</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 break-all">{coupon.user.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {success ? "El cupón ya fue marcado como utilizado." : "No realizamos cambios en su estado."}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onGoHome}
              className={`w-full sm:w-auto rounded-full px-8 py-3 font-extrabold text-white ${status.buttonClass} shadow-lg transition`}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default CouponRedeemResult;
