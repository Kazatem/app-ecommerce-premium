import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Só criar cliente se as variáveis estiverem configuradas corretamente
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Função helper para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabase !== null && 
         supabaseUrl && 
         supabaseAnonKey && 
         !supabaseUrl.includes('placeholder') &&
         supabaseUrl.startsWith('https://')
}

// Função para criar tabelas automaticamente
export const createTables = async () => {
  if (!supabase) {
    console.log('Supabase não configurado - usando dados de exemplo')
    return false
  }

  try {
    // Criar tabela de usuários
    const { error: usersError } = await supabase.rpc('create_users_table', {})
    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Erro ao criar tabela users:', usersError)
    }

    // Criar tabela de produtos
    const { error: productsError } = await supabase.rpc('create_products_table', {})
    if (productsError && !productsError.message.includes('already exists')) {
      console.error('Erro ao criar tabela products:', productsError)
    }

    // Criar tabela de pedidos
    const { error: ordersError } = await supabase.rpc('create_orders_table', {})
    if (ordersError && !ordersError.message.includes('already exists')) {
      console.error('Erro ao criar tabela orders:', ordersError)
    }

    // Criar tabela de avaliações
    const { error: reviewsError } = await supabase.rpc('create_reviews_table', {})
    if (reviewsError && !reviewsError.message.includes('already exists')) {
      console.error('Erro ao criar tabela reviews:', reviewsError)
    }

    console.log('Tabelas criadas/verificadas com sucesso!')
    return true
  } catch (error) {
    console.error('Erro ao criar tabelas:', error)
    return false
  }
}

// Tipos para as tabelas que vamos criar
export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price: number
  image_url: string
  category: string
  rating: number
  reviews_count: number
  discount_percentage: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  city?: string
  is_reseller: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  quantity: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string
  has_photo: boolean
  ai_response?: string
  created_at: string
}