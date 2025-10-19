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
