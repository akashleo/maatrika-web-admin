export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number[];
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface AnalyticsData {
  salesByMonth: { month: string; sales: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; sales: number }[];
  revenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}
