// TypeScript interfaces för Voyado Smart Recommendations
export interface Customer {
  id: number;
  name: string;
  age: number;
  location: string;
  totalPurchases: number;
  avgOrderValue: number;
  favoriteCategories: string[];
  lastActive: string;
  purchaseHistory: string[];
  behaviorScore: number;
  segment: string;
}

export interface Recommendation {
  id: number;
  name: string;
  category: string;
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
