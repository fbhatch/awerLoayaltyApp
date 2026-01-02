import React from "react";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import Tooltip from "../components/Tooltip";
import {
  fetchUsersByDni,
  fetchUserByDniEmail,
  fetchPointsConfig,
  UserProfile,
} from "../api/points";
import { usePointsConfig } from "../context/PointsConfigContext";

interface Props {
  onBack: () => void;
  onNext: (profile: UserProfile) => void;
}

const PointsStep1: React.FC<Props> = ({ onBack, onNext }) => {
  const [dni, setDni] = React.useState("");
  const [emails, setEmails] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { unitAmount, pointsPerUnit, setUnitAmount, pointsActive, setPointsPerUnit, setExpirationType, setPointsActive } = usePointsConfig();
  const [configLoading, setConfigLoading] = React.useState(true);

  React.useEffect(() => {
    fetchPointsConfig()
      .then(({ unitAmount, pointsPerUnit, expirationType, pointsActive }) => {
        setUnitAmount(unitAmount);
        setPointsPerUnit(pointsPerUnit);
        setExpirationType(expirationType);
        setPointsActive(pointsActive);
      })
      .catch((error: any) => {
        if (error.response?.status !== 401) {
          setToast("Ocurrió un error");
          setTimeout(() => {
            setToast(null);
            onBack();
          }, 3000);
        }
      })
      .finally(() => setConfigLoading(false));
  }, [onBack, setUnitAmount, setPointsPerUnit, setExpirationType, setPointsActive]);

  const configInvalid = !unitAmount || !pointsPerUnit || !pointsActive;

  const showError = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = () => {
    if (!dni) return;
    setLoading(true);
    fetchUsersByDni(dni)
      .then((res) => {
        if (res.length === 0) {
          showError("DNI no encontrado");
        } else if (res.length === 1) {
          onNext(res[0]);
        } else {
          setEmails(res.map((u) => u.email));
        }
      })
      .catch((e) => {
        console.log(e)
        showError(e.response.data.displayMessage || e.message || "Ocurrió un error");
      })
      .finally(() => setLoading(false));
  };

  const handleSelectEmail = (email: string) => {
    setLoading(true);
    fetchUserByDniEmail(dni, email)
      .then(onNext)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  };

  if (loading)
    return (
      <div className="min-h-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 text-center">
          <Spinner className="mx-auto" />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Buscando usuario…</p>
        </div>
      </div>
    );

  if (configLoading)
    return (
      <div className="min-h-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 text-center">
          <Spinner className="mx-auto" />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Procesando…</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-6">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl animate-fade-in relative overflow-visible">
        <div className="relative">
          <button
            onClick={onBack}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 p-2 shadow hover:bg-green-200 dark:hover:bg-gray-700 transition"
            aria-label="Volver"
            title="Volver al inicio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-green-700 dark:text-green-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="h-24 sm:h-28 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 dark:from-green-700 dark:via-emerald-700 dark:to-green-800 rounded-t-3xl" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 shadow-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-green-600 dark:text-green-400">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7.5 8.25A8.25 8.25 0 0 1 12 12.75a8.25 8.25 0 0 1 7.5 7.5.75.75 0 0 1-.75.75h-13.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 pt-14 pb-6">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">Cargar datos del usuario</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300">Ingresá el DNI del cliente para continuar</p>
          </div>

          {configInvalid && (
            <div className="mb-4 flex items-start justify-between rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-200">
              <p className="text-sm">
                Su empresa aún no configuró la cantidad de puntos a otorgar por cada monto de compra.
              </p>
              <Tooltip message="Para configurarlo, ingrese en https://gestion.awerreviews.com. Luego diríjase al menú 'Fidelización' en el panel lateral, seleccione 'Awer Loyalty' y, dentro de 'Niveles y acciones', establezca la configuración correspondiente.">
                <button
                  type="button"
                  className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border border-yellow-400 text-xs font-bold text-yellow-700 dark:border-yellow-600 dark:text-yellow-200"
                >
                  ?
                </button>
              </Tooltip>
            </div>
          )}

          <div className="w-full">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="DNI del cliente"
              value={dni}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D+/g, "");
                setDni(onlyDigits);
                setEmails([]);
              }}
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="DNI del cliente"
            />
          </div>

          {emails.length > 1 && (
            <div className="mt-5">
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">Seleccioná el correo del cliente</p>
              <ul className="space-y-2">
                {emails.map((e) => (
                  <li key={e}>
                    <button
                      onClick={() => handleSelectEmail(e)}
                      className="w-full text-left px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      {e}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 flex items-center justify-end">
            <button
              onClick={handleSearch}
              disabled={!dni}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 shadow transition"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} type="error" />}
    </div>
  );
};

export default PointsStep1;

