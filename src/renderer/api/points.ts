import axiosClient from './axiosClient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dni: string;
  avatar?: string;
  points: number;
  level: string;
  nextLevel: string;
  pointsToNext: number;
  totalRedeemed?: number;
  expiringPoints?: number;
  expiringDate?: string;
  availablePoints?: number;
  isEmailVerified?: boolean;
  hasPointsPassword?: boolean;
  pointsToExpire?: number | null;
  expireDate?: [number, number, number] | null;
}

export interface PointsConfig {
  unitAmount: number | null;
  pointsPerUnit: number | null;
  expirationType: string | null;
  pointsActive: boolean;
}

export interface CouponBranch {
  type: string;
  id: number;
  companyId: number;
  companyName: string;
  name: string;
  address: string;
  province: string | null;
  country: string | null;
}

export interface CouponUsage {
  used: boolean;
  dateUsed: string | null;
  dateCreated: number[];
  code?: string;
  branch: {
    id: number;
    name: string;
  };
  pointsCost: number;
}

export interface CouponBox {
  title: string;
  description: string;
  imageUrl: string;
  dateFrom: number[];
  dateTo: number[];
  stock: number;
  branches: CouponBranch[];
  active: boolean;
  legal: string;
}

export interface CouponUser {
  id: number;
  email: string;
  dni: string;
  avatar?: string | null;
}

export interface CouponData {
  couponUsage: CouponUsage;
  couponBox: CouponBox;
  user: CouponUser;
  availableForBranch: boolean;
}

let currentUser: UserProfile | null = null;

export async function fetchPointsConfig(): Promise<PointsConfig> {
  const { data } = await axiosClient.get<{
    unitAmount?: number | null;
    pointsPerUnit?: number | null;
    expirationType?: string | null;
    hasPurchaseActive?: boolean;
  }>("/awer-core/reward/config");
  return {
    unitAmount: data.unitAmount ?? null,
    pointsPerUnit: data.pointsPerUnit ?? null,
    expirationType: data.expirationType ?? null,
    pointsActive: data.hasPurchaseActive ?? false,
  };
}

export interface ApiUser {
  name: string;
  surname: string;
  dni: string | null;
  pointsToNextLevel: number;
  nextLevel: string;
  userPoints: number;
  availablePoints?: number;
  userLevel: string;
  email: string;
  avatar?: string | null;
  pointsToExpire?: number | null;
  expireDate?: [number, number, number] | null;
  totalRedeemedPoints?: number;
  isEmailVerified?: boolean;
  hasPointsPassword?: boolean;
}

function mapUser(u: ApiUser): UserProfile {
  let expiringPoints: number | undefined;
  let expiringDate: string | undefined;
  if (u.pointsToExpire && u.expireDate) {
    const [y, m, d] = u.expireDate;
    const expiration = new Date(y, m - 1, d);
    const diffDays = Math.ceil(
      (expiration.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 4) {
      expiringPoints = u.pointsToExpire;
      expiringDate = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    }
  }
  return {
    id: `${u.dni ?? ''}-${u.email}`,
    name: `${u.name} ${u.surname}`.trim(),
    email: u.email,
    dni: u.dni ?? '',
    avatar: u.avatar ?? undefined,
    points: u.userPoints,
    level: u.userLevel,
    nextLevel: u.nextLevel,
    pointsToNext: u.pointsToNextLevel,
    totalRedeemed: u.totalRedeemedPoints ? u.totalRedeemedPoints : 0,
    expiringPoints,
    expiringDate,
    availablePoints: u.availablePoints ?? undefined,
    isEmailVerified: u.isEmailVerified ?? false,
    hasPointsPassword: u.hasPointsPassword ?? false,
    pointsToExpire: typeof u.pointsToExpire === 'number' ? u.pointsToExpire : null,
    expireDate: u.expireDate ?? null,
  };
}

export async function fetchUsersByDni(dni: string, points = true): Promise<UserProfile[]> {
  const { data } = await axiosClient.get<ApiUser[]>(
    '/awer-core/reward/ext/user',
    { params: { dni, points } }
  );
  const profiles = data.map(mapUser);
  if (profiles.length === 1) {
    currentUser = profiles[0];
  }
  return profiles;
}

export async function fetchUserByEmail(email: string, points = true): Promise<UserProfile> {
  const { data } = await axiosClient.get<ApiUser[]>(
    '/awer-core/reward/ext/user',
    { params: { email, points } }
  );
  const user = data[0];
  if (!user) throw new Error('Usuario no registrado en el programa de puntos');
  const profile = mapUser(user);
  currentUser = profile;
  return profile;
}

export async function fetchUserByDniEmail(
  dni: string,
  email: string,
  points = true,
): Promise<UserProfile> {
  const { data } = await axiosClient.get<ApiUser[]>(
    '/awer-core/reward/ext/user',
    { params: { dni, email, points } }
  );
  const user = data[0];
  if (!user) throw new Error('Usuario no registrado en el programa de puntos');
  const profile = mapUser(user);
  currentUser = profile;
  return profile;
}

export async function fetchCouponUserDetail(
  dni: string,
  email: string
): Promise<ApiUser> {
  const { data } = await axiosClient.get<ApiUser[]>(
    '/awer-core/reward/ext/user',
    {
      params: {
        dni,
        email,
        points: false,
      },
    },
  );
  const user = data[0];
  if (!user) throw new Error('Usuario no registrado en el programa de puntos');
  return user;
}

export async function addPoints(amount: number): Promise<UserProfile> {
  if (!currentUser) {
    throw new Error('Usuario no cargado');
  }

  const branchId = localStorage.getItem('pos');
  if (!branchId) {
    throw new Error('INVALID_POS');
  }

  const { data } = await axiosClient.post<ApiUser>(
    '/awer-core/reward/ext/purchase-points',
    amount,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        branchId,
        dni: currentUser.dni,
      },
    },
  );

  const profile = mapUser(data);
  currentUser = profile;
  return profile;
}

export async function fetchCouponData(
  code: string,
  branchId: number
): Promise<CouponData> {
  const { data } = await axiosClient.get<CouponData>(
    '/awer-core/reward/ext/coupon',
    {
      params: {
        code,
        branchId,
      },
    },
  );
  return data;
}

export async function redeemCoupon(
  branchId: number,
  couponCode: string
): Promise<void> {
  const normalized = couponCode.toLowerCase();
  await axiosClient.get(
    `/awer-core/branches/${branchId}/coupons/${encodeURIComponent(normalized)}`,
  );
}

