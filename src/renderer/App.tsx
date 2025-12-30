import React from 'react';
import LoginUser from './pages/LoginUser';
import BrandSelect from './pages/BrandSelect';
import Home from './pages/Home';
import PointsStep1 from './pages/PointsStep1';
import PointsStep2 from './pages/PointsStep2';
import PointsStepFinal from './pages/PointsStepFinal';
import PosSelect from './pages/PosSelect';
import CouponRedeem from './pages/CouponRedeem';

import { Brand, Branch, fetchCurrentUser, fetchBranches } from './api/auth';

import { UserProfile } from './api/points';
import Spinner from './components/Spinner';
import Header from './components/Header';
import Footer from './components/Footer';
import { useCompany } from './context/CompanyContext';
import UpdateNotice from './components/UpdateNotice';

type Screen = 'loading' | 'login1' | 'login2' | 'home' | 'pos' | 'points1' | 'points2' | 'points3' | 'coupon';

const App: React.FC = () => {
  const [screen, setScreen] = React.useState<Screen>('loading');
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [added, setAdded] = React.useState(0);
  const [expires, setExpires] = React.useState('');
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      return stored ?? 'dark';
    } catch {
      return 'dark';
    }
  });
  const { setCompanyId, setCompanyName, setCompanyLogo, setBranches } = useCompany();

  React.useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) setTheme(stored);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  React.useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setScreen('login1');
        return;
      }
      try {
        const { companyId } = await fetchCurrentUser();
        setCompanyId(companyId);
        const { companyName, companyLogo, branches } = await fetchBranches(companyId);
        setCompanyName(companyName);
        setCompanyLogo(companyLogo);
        setBranches(branches);
      } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_POS') {
          alert('El punto de venta configurado no corresponde a la empresa o está suspendido');
        }
        handleLogout();
        return;
      }
      const stored = localStorage.getItem('pos');
      if (!stored) {
        setScreen('pos');
        return;
      }
      setScreen('home');
    };
    init();
  }, []);

  const handleLogged = () => {
    const stored = localStorage.getItem('pos');
    if (!stored) setScreen('pos');
    else setScreen('home');
  };

  const handleBrand = (brand: Brand) => {
    localStorage.setItem('brand', brand.id);
    const stored = localStorage.getItem('pos');
    if (!stored) setScreen('pos');
    else setScreen('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setCompanyId(null);
    setCompanyName('');
    setCompanyLogo('');
    setBranches([]);

    setScreen('login1');
  };

  const handleChangePos = () => setScreen('pos');
  const handleStartPoints = () => setScreen('points1');
  const handleStartCoupon = () => setScreen('coupon');

  const handleSelectPos = (pos: Branch) => {
    localStorage.setItem('pos', String(pos.id));
    setScreen('home');
  };

  const handleCancelPos = () => setScreen('home');

  const handlePointsNext1 = (p: UserProfile) => {
    setProfile(p);
    setScreen('points2');
  };
  const handlePointsNext2 = (p: UserProfile, a: number, e: string) => {
    setProfile(p);
    setAdded(a);
    setExpires(e);
    setScreen('points3');
  };
  const handleBackPoints1 = () => setScreen('home');
  const handleBackPoints2 = () => setScreen('points1');
  const handleBackPoints3 = () => setScreen('points1');
  const handleClosePoints = () => setScreen('home');
  const handleBackCoupon = () => setScreen('home');

  if (screen === 'loading')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
        <UpdateNotice />
      </div>
    );

  let content: React.ReactNode = null;
  if (screen === 'login1')
    content = <LoginUser onLogin={handleLogged} />;
  else if (screen === 'login2')
    content = <BrandSelect onSelect={handleBrand} onLogout={handleLogout} />;
  else if (screen === 'home')
    content = (
      <Home
        onChangePos={handleChangePos}
        onLoadPoints={handleStartPoints}
        onRedeemCoupon={handleStartCoupon}
      />
    );
  else if (screen === 'pos')
    content = <PosSelect onSelect={handleSelectPos} onCancel={handleCancelPos} />;
  else if (screen === 'points1')
    content = <PointsStep1 onBack={handleBackPoints1} onNext={handlePointsNext1} />;
  else if (screen === 'points2' && profile)
    content = (
      <PointsStep2
        profile={profile}
        onBack={handleBackPoints2}
        onNext={handlePointsNext2}
        onError={handleBackPoints1}
      />
    );
  else if (screen === 'points3' && profile)
    content = (
      <PointsStepFinal
        profile={profile}
        added={added}
        expires={expires}
        onBack={handleBackPoints3}
        onClose={handleClosePoints}
      />
    );
  else if (screen === 'coupon')
    content = <CouponRedeem onBack={handleBackCoupon} />;

  const isAuth = screen === 'login1' || screen === 'login2';

  return (
    <div className="h-screen flex flex-col bg-transparent overflow-hidden">
      {!isAuth && <Header onLogout={handleLogout} />}
      <main className="flex-1 overflow-y-auto brand-scroll">{content}</main>
      {!isAuth && <Footer theme={theme} onToggle={toggleTheme} />}
      <UpdateNotice />
    </div>
  );
};

export default App;
