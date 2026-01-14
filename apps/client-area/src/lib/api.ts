import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token from cookies on client
function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : null;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// ============================================
// USER / AUTH
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  phoneNumber: string | null;
  emailVerified: Date | null;
  image: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export function useUser() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => fetchWithAuth('/auth/me'),
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name?: string; phoneNumber?: string }) =>
      fetchWithAuth('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

// ============================================
// DASHBOARD
// ============================================

export interface DashboardStats {
  activeServices: number;
  projectsInProgress: number;
  pendingInvoices: number;
  totalSpent: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => fetchWithAuth('/dashboard/stats'),
  });
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['dashboard', 'notifications'],
    queryFn: () => fetchWithAuth('/dashboard/notifications'),
  });
}

// ============================================
// PROJECTS
// ============================================

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  type: string;
  estimatedCost: number | null;
  totalCost: number | null;
  startDate: string | null;
  estimatedEndDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => fetchWithAuth('/projects/my-projects'),
  });
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

export function useProjectStats() {
  return useQuery<ProjectStats>({
    queryKey: ['projects', 'stats'],
    queryFn: () => fetchWithAuth('/projects/my-stats'),
  });
}

export interface ProjectRequest {
  name: string;
  type: string;
  description: string;
  budget?: string;
  timeline?: string;
}

export function useRequestProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProjectRequest) =>
      fetchWithAuth('/projects/request', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}

// ============================================
// SERVICES
// ============================================

export interface Service {
  id: string;
  name: string;
  description: string | null;
  status: string;
  monthlyPrice: number;
  billingCycle: string;
  nextBillingDate: string | null;
  createdAt: string;
  service: {
    id: string;
    name: string;
    category: string;
  };
}

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => fetchWithAuth('/services/client-services'),
  });
}

// ============================================
// INVOICES / BILLING
// ============================================

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export function useInvoices() {
  return useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: () => fetchWithAuth('/dashboard/invoices'),
  });
}

// ============================================
// PAYMENTS
// ============================================

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  externalId: string | null;
  createdAt: string;
  invoice?: {
    id: string;
    invoiceNumber: string;
  };
}

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: () => fetchWithAuth('/dashboard/payments'),
  });
}

// ============================================
// SAVED PAYMENT METHODS
// ============================================

export interface SavedPaymentMethod {
  id: string;
  type: 'CARD' | 'MOBILE_MONEY';
  isDefault: boolean;
  nickname: string | null;
  // Card fields
  cardLast4: string | null;
  cardBrand: string | null;
  cardExpMonth: number | null;
  cardExpYear: number | null;
  cardHolderName: string | null;
  // Mobile money fields
  mobileNumber: string | null;
  mobileProvider: string | null;
  createdAt: string;
}

export function useSavedPaymentMethods() {
  return useQuery<SavedPaymentMethod[]>({
    queryKey: ['payment-methods'],
    queryFn: () => fetchWithAuth('/payment-methods'),
  });
}

export interface AddCardPaymentMethod {
  cardLast4: string;
  cardBrand: 'VISA' | 'MASTERCARD';
  cardExpMonth: number;
  cardExpYear: number;
  cardHolderName: string;
  nickname?: string;
  isDefault?: boolean;
}

export function useAddCardPaymentMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddCardPaymentMethod) =>
      fetchWithAuth('/payment-methods/card', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

export interface AddMobileMoneyPaymentMethod {
  mobileNumber: string;
  mobileProvider: 'ECOCASH' | 'ONEMONEY' | 'INNBUCKS';
  nickname?: string;
  isDefault?: boolean;
}

export function useAddMobileMoneyPaymentMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddMobileMoneyPaymentMethod) =>
      fetchWithAuth('/payment-methods/mobile-money', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/payment-methods/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth(`/payment-methods/${id}/default`, {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}
