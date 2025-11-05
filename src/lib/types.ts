export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  image_url: string
  category: string
  discount_percentage: number
  rating?: number
  reviews_count?: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  quantity: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  created_at: string
}