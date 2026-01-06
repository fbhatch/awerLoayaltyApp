import React from 'react';
import Spinner from './Spinner';
import Tooltip from './Tooltip';
import userIcon from '../assets/user-default.svg';
import {
  UserProfile,
  fetchUsersByDni,
  fetchUserByEmail,
  fetchUserByDniEmail,
} from '../api/points';

interface Props {
  open: boolean;
  onClose: () => void;
}

const formatNumber = (value?: number | null) =>
  typeof value === 'number' ? value.toLocaleString() : '-';

const formatExpireDate = (value?: [number, number, number] | null) => {
  if (!value || value.length < 3) return '-';
  const [year, month, day] = value;
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(day)}/${pad(month)}/${year}`;
};

const getAxiosStatus = (error: unknown): number | undefined => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response?.status === 'number'
  ) {
    return (error as any).response.status;
  }
  return undefined;
};

const getSearchErrorMessage = (error: unknown) => {
  const status = getAxiosStatus(error);
  if (status === 404) {
    return 'Usuario no encontrado.';
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response?.data?.displayMessage === 'string'
  ) {
    return (error as any).response.data.displayMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrio un error al buscar el usuario';
};

const VERIFY_EMAIL_TOOLTIP =
  'El cliente debe ingresar a la plataforma de Awer Reviews, iniciar sesion y, desde el panel desplegable superior derecho, entrar en \"Configuracion\" para verificar su correo.';
const POINTS_PASSWORD_TOOLTIP =
  'Para configurar la contrasena de puntos es obligatorio que el usuario tenga DNI cargado y correo verificado. Se gestiona en la misma seccion de \"Configuracion\" (menu superior derecho).';
const DNI_TOOLTIP =
  'Ingresar el DNI del cliente (sin puntos) desde la seccion \"Configuracion\" del menu superior derecho en la plataforma de Awer Reviews.';
const tooltipIconClass =
  'inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] font-bold text-gray-500 dark:border-gray-600 dark:text-gray-300 cursor-help';

const UserSearchModal: React.FC<Props> = ({ open, onClose }) => {
  const [query, setQuery] = React.useState('');
  const [candidates, setCandidates] = React.useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
    setQuery('');
    setCandidates([]);
    setSelectedProfile(null);
    setError(null);
    setLoading(false);
    return undefined;
  }, [open]);

  const isEmailQuery = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed.includes('@')) return true;
    return /[a-zA-Z]/.test(trimmed);
  };

  const handleSearch = async () => {
    const value = query.trim();
    if (!value) {
      setError('Ingresa un DNI (sin puntos) o correo electronico');
      return;
    }

    const isEmail = isEmailQuery(value);
    const normalizedDni = isEmail ? null : value.replace(/\D+/g, '');

    if (!isEmail && !normalizedDni) {
      setError('Ingresa un DNI valido');
      return;
    }

    setLoading(true);
    setError(null);
    setCandidates([]);
    setSelectedProfile(null);

    try {
      if (isEmail) {
        const profile = await fetchUserByEmail(value.toLowerCase(), false);
        setSelectedProfile(profile);
      } else if (normalizedDni) {
        const users = await fetchUsersByDni(normalizedDni, false);
        if (users.length === 0) {
          setError('No se encontraron usuarios con ese DNI');
        } else if (users.length === 1) {
          setSelectedProfile(users[0]);
        } else {
          setCandidates(users);
        }
      }
    } catch (err) {
      setError(getSearchErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidate = async (user: UserProfile) => {
    setLoading(true);
    setError(null);

    try {
      const profile = await fetchUserByDniEmail(user.dni, user.email, false);
      setSelectedProfile(profile);
      setCandidates([]);
    } catch (err) {
      setError(getSearchErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const showProtectedUserData = Boolean(
    selectedProfile?.isEmailVerified && selectedProfile?.hasPointsPassword,
  );
  const expireDateLabel = selectedProfile?.expireDate
    ? formatExpireDate(selectedProfile.expireDate)
    : '-';
  const profileAvatar = selectedProfile?.avatar || userIcon;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-green-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Buscar usuario
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa un DNI (sin puntos) o correo electronico para ver los datos del cliente.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Cerrar busqueda de usuarios"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="DNI sin puntos o correo electronico"
            className="flex-1 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            aria-label="Buscar por DNI o correo"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
            disabled={loading}
          >
            Buscar
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {loading && (
          <div className="mt-8 flex justify-center">
            <Spinner />
          </div>
        )}

        {!loading && candidates.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Selecciona el usuario correspondiente al DNI ingresado.
            </p>
            <ul className="mt-3 space-y-2">
              {candidates.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectCandidate(user)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <div className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user.name || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email || 'Sin correo'}
                        </p>
                      </div>
                      <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
                        DNI: <span className="font-semibold text-gray-900 dark:text-gray-100">{user.dni || '-'}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && selectedProfile && (
          <div className="brand-scroll mt-6 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            <article className="rounded-3xl border border-gray-200 p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="mx-auto sm:mx-0">
                  <div className="relative h-24 w-24 rounded-[26px] border-4 border-white shadow-lg dark:border-gray-700 overflow-hidden">
                    <img
                      src={profileAvatar}
                      alt={selectedProfile.email}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        if (event.currentTarget.src !== userIcon) {
                          event.currentTarget.src = userIcon;
                        }
                      }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-center text-xs text-gray-500 dark:text-gray-400">
                    <span>DNI: {selectedProfile.dni || '-'}</span>
                    {!selectedProfile.dni && (
                      <Tooltip message={DNI_TOOLTIP} placement="left">
                        <span className={`${tooltipIconClass} ml-1`}>?</span>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xl font-black text-gray-900 dark:text-white">
                    {selectedProfile.name || 'Sin nombre'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                    {selectedProfile.email || 'Sin correo'}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 6v12m6-6H6" />
                    </svg>
                    Nivel actual: {selectedProfile.level || '-'}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                    Correo verificado
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <p
                      className={`text-lg font-bold ${
                        selectedProfile.isEmailVerified ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {selectedProfile.isEmailVerified ? 'Si' : 'No'}
                    </p>
                    {!selectedProfile.isEmailVerified && (
                      <Tooltip message={VERIFY_EMAIL_TOOLTIP} placement="left">
                        <span className={tooltipIconClass}>?</span>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Necesario para validar canjes.</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                    Contrasena de puntos
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <p
                      className={`text-lg font-bold ${
                        selectedProfile.hasPointsPassword ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {selectedProfile.hasPointsPassword ? 'Configurada' : 'No configurada'}
                    </p>
                    {!selectedProfile.hasPointsPassword && (
                      <Tooltip message={POINTS_PASSWORD_TOOLTIP} placement="right">
                        <span className={tooltipIconClass}>?</span>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Protege las operaciones del cliente.</p>
                </div>
              </div>

              {showProtectedUserData ? (
                <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                      Proximo nivel
                    </p>
                    <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">
                      {selectedProfile.nextLevel || '-'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Faltan {formatNumber(selectedProfile.pointsToNext ?? 0)} pts
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                      Puntos disponibles
                    </p>
                    <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                      {formatNumber(selectedProfile.availablePoints ?? selectedProfile.points)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                      Puntos por vencer
                    </p>
                    <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                      {formatNumber(selectedProfile.pointsToExpire)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Vencen el {expireDateLabel}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                      Total canjeado
                    </p>
                    <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                      {formatNumber(selectedProfile.totalRedeemed ?? 0)} pts
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 dark:border-amber-500 dark:bg-amber-900/20 dark:text-amber-100">
                  Para acceder al detalle de puntos, el cliente necesita correo verificado y contrasena de puntos configurada.
                </div>
              )}
            </article>
          </div>
        )}

        {!loading && !selectedProfile && candidates.length === 0 && !error && (
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Realiza una busqueda para ver los resultados.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserSearchModal;
