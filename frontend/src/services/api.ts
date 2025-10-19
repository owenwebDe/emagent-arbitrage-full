import axios, { AxiosInstance, AxiosError } from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
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
