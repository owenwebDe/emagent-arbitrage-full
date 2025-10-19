# Complete Frontend Files for Arbitrage Scanner

Copy each file's content to the corresponding location in your frontend project.

---

## File: src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
```

---

## File: src/types/index.ts

```typescript
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface Exchange {
  id: string;
  name: string;
  displayName: string;
  type: 'CEX' | 'DEX';
  isActive: boolean;
  logoUrl?: string;
}

export interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  isActive: boolean;
}

export interface ArbitrageOpportunity {
  id: string;
  tradingPair: TradingPair;
  buyExchange: Exchange;
  sellExchange: Exchange;
  buyPrice: string;
  sellPrice: string;
  spreadPercentage: string;
  estimatedProfit: string;
  profitAfterFees: string;
  marketType: 'SPOT' | 'FUTURES' | 'DEX';
  buyVolume?: string;
  sellVolume?: string;
  fundingRate?: string;
  detectedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface Trade {
  id: string;
  userId: string;
  opportunityId: string;
  buyExchange: string;
  sellExchange: string;
  tradingPair: string;
  buyPrice: string;
  sellPrice: string;
  amount: string;
  spreadPercentage: string;
  grossProfit: string;
  totalFees: string;
  netProfit: string;
  status: 'PENDING' | 'BUY_PLACED' | 'BUY_FILLED' | 'SELL_PLACED' | 'SELL_FILLED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  errorMessage?: string;
  executedAt: string;
  completedAt?: string;
}

export interface UserFilters {
  minSpreadPercentage: number;
  minProfit?: number;
  exchangeFilter: string[];
  pairFilter: string[];
  marketTypeFilter: ('SPOT' | 'FUTURES' | 'DEX')[];
}

export interface Statistics {
  totalOpportunities: number;
  avgSpread: number;
  avgProfit: number;
  topPairs: Array<{ symbol: string; count: number }>;
  topExchanges: Array<{ name: string; count: number }>;
}
```

---

## File: src/services/api.ts

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

// Use relative URL for API calls - will be proxied by Next.js
const BACKEND_URL = '';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.api.post('/api/auth/refresh', { refreshToken });
              const { accessToken } = response.data.data;
              localStorage.setItem('accessToken', accessToken);
              
              // Retry original request
              if (error.config) {
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return this.api.request(error.config);
              }
            }
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/api/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, username: string, password: string) {
    const response = await this.api.post('/api/auth/register', { email, username, password });
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/api/auth/logout');
    return response.data;
  }

  async getMe() {
    const response = await this.api.get('/api/auth/me');
    return response.data;
  }

  // Opportunities endpoints
  async getOpportunities(params?: {
    symbol?: string;
    minSpread?: number;
    limit?: number;
    marketType?: string;
  }) {
    const response = await this.api.get('/api/arbitrage/opportunities', { params });
    return response.data;
  }

  async getOpportunityById(id: string) {
    const response = await this.api.get(`/api/arbitrage/opportunities/${id}`);
    return response.data;
  }

  // Statistics endpoints
  async getSummary() {
    const response = await this.api.get('/api/arbitrage/summary');
    return response.data;
  }

  async getStatistics(timeRange: 'hour' | 'day' | 'week' = 'day') {
    const response = await this.api.get('/api/arbitrage/statistics', {
      params: { timeRange },
    });
    return response.data;
  }

  // Filters endpoints
  async getUserFilters() {
    const response = await this.api.get('/api/arbitrage/filters');
    return response.data;
  }

  async updateUserFilters(filters: any) {
    const response = await this.api.put('/api/arbitrage/filters', filters);
    return response.data;
  }

  // Trades endpoints
  async getTrades() {
    const response = await this.api.get('/api/trades');
    return response.data;
  }

  async getTradeById(id: string) {
    const response = await this.api.get(`/api/trades/${id}`);
    return response.data;
  }

  async executeTrade(opportunityId: string, amount: number) {
    const response = await this.api.post('/api/trades/execute', {
      opportunityId,
      amount,
    });
    return response.data;
  }

  async getTradeStats() {
    const response = await this.api.get('/api/trades/stats');
    return response.data;
  }
}

export const apiService = new ApiService();
```

---

## File: src/contexts/AuthContext.tsx

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { User } from '@/types';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await apiService.getMe();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await apiService.register(email, username, password);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      
      toast.success('Registration successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.info('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## File: src/contexts/SocketContext.tsx

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { ArbitrageOpportunity } from '@/types';

// Use the actual backend server URL for WebSocket
const WS_URL = 'http://127.0.0.1:5000';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  opportunities: ArbitrageOpportunity[];
  subscribeToOpportunities: () => void;
  unsubscribeFromOpportunities: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    const socketInstance = io(WS_URL, {
      auth: {
        token: token || '',
      },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketInstance.on('opportunities:update', (data: { data: ArbitrageOpportunity[] }) => {
      setOpportunities(data.data);
    });

    socketInstance.on('trade:update', (data: any) => {
      console.log('Trade update:', data);
    });

    socketInstance.on('alert:notification', (data: any) => {
      console.log('Alert:', data);
    });

    socketInstance.on('system:message', (data: any) => {
      console.log('System message:', data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribeToOpportunities = () => {
    if (socket && connected) {
      socket.emit('subscribe:opportunities', {});
    }
  };

  const unsubscribeFromOpportunities = () => {
    if (socket && connected) {
      socket.emit('unsubscribe:opportunities');
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        opportunities,
        subscribeToOpportunities,
        unsubscribeFromOpportunities,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
```

---

Due to character limits, I'll create this as a downloadable document. Let me create individual files for all components in the next message.
