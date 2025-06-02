// TypeScript interfaces for Smart Choice Engine

export interface Customer {
  id: number;
  name: string;
  email: string;
  segment: string;
  totalPurchases: number;
  avgOrderValue: string;
  favoriteCategories: string[];
  lastActive: string;
  location: string;
  behaviorScore: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
}

export interface Recommendation {
  productId: number;
  name: string;
  price: number;
  image: string;
  recommendationScore: number;
  reason: string;
  algorithms: string[];
}

export interface RecommendationResponse {
  customerId: number;
  customer: Customer;
  recommendations: Recommendation[];
  generatedAt: string;
}
