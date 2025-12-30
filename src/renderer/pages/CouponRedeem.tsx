import React from "react";

interface Props {
  onBack: () => void;
}

const CouponRedeem: React.FC<Props> = ({ onBack }) => {
  const [couponCode, setCouponCode] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);
  const [messageType, setMessageType] = React.useState<'error' | 'success' | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = couponCode.trim().toUpperCase();
    setMessage(null);
    setMessageType(null);

    if (!normalized) {
      setMessage("Ingresa un codigo alfanumerico valido.");
      setMessageType('error');
      return;
    }

    if (!/^[A-Z0-9-]+$/.test(normalized)) {
      setMessage("Solo se permiten letras, numeros y guiones medios.");
      setMessageType('error');
      return;
    }

    setCouponCode(normalized);
    setMessage(`Codigo ${normalized} listo para acreditar el cupon.`);
    setMessageType('success');
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-6">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="relative">
          <button
            onClick={onBack}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-indigo-300 dark:border-indigo-600 p-2 shadow hover:bg-indigo-100 dark:hover:bg-gray-700 transition"
            aria-label="Volver"
            title="Volver al inicio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-indigo-700 dark:text-indigo-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="h-24 sm:h-28 bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 dark:from-indigo-700 dark:via-purple-700 dark:to-violet-700 rounded-t-3xl" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-700 shadow-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-indigo-600 dark:text-indigo-300">
                <path d="M9.813 4.196a1.5 1.5 0 0 1 2.373 0l7.39 9.237c.712.89.086 2.209-1.187 2.209H3.61c-1.273 0-1.899-1.32-1.187-2.209l7.39-9.237Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 pt-14 pb-8">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-300">Canjear cupon de cliente</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Ingresar codigo del cupon</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Ingresa el codigo alfanumerico asociado al cliente para continuar con el canje.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200" htmlFor="couponCode">
              Codigo del cupon
            </label>
            <input
              id="couponCode"
              type="text"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="Ej: AWER-ABC123"
              className="w-full rounded-2xl border border-indigo-200 dark:border-indigo-600 bg-white dark:bg-gray-900 px-4 py-3 text-base font-semibold tracking-widest text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              maxLength={32}
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Solo caracteres alfanumericos y guiones medios.</p>
            <button
              type="submit"
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wide py-3 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              Registrar codigo
            </button>
          </form>

          {message && (
            <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${messageType === 'success' ? 'border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-200' : 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponRedeem;
