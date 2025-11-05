"use client"

import { useState, useEffect } from 'react'
import { supabase, Product, User, Order, Review, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Verificar se Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        setProducts([])
        setLoading(false)
        return
      }

      // Tentar primeiro com nome em português, depois em inglês
      let data, error
      try {
        const result = await supabase
          .from('Produtos')
          .select('*')
          .order('created_at', { ascending: false })
        data = result.data
        error = result.error
      } catch (err) {
        // Se falhar, tentar com nome em inglês
        const result = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        data = result.data
        error = result.error
      }

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
      setProducts([]) // Fallback para array vazio
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Verificar se Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase não configurado')
      }

      // Tentar primeiro com nome em português, depois em inglês
      let data, error
      try {
        const result = await supabase
          .from('Produtos')
          .insert([product])
          .select()
          .single()
        data = result.data
        error = result.error
      } catch (err) {
        // Se falhar, tentar com nome em inglês
        const result = await supabase
          .from('products')
          .insert([product])
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) throw error
      setProducts(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Erro ao adicionar produto:', err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto')
      throw err
    }
  }

  return { products, loading, error, fetchProducts, addProduct }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      setOrders([])
      setLoading(false)
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      // Verificar se Supabase está configurado e usuário logado
      if (!isSupabaseConfigured() || !supabase || !user) {
        setOrders([])
        setLoading(false)
        return
      }

      // Tentar primeiro com nome em português, depois em inglês
      let data, error
      try {
        const result = await supabase
          .from('Pedidos')
          .select(`
            *,
            Produtos (name, price, image_url),
            Usuarios (full_name, email)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        data = result.data
        error = result.error
      } catch (err) {
        // Se falhar, tentar com nomes em inglês
        try {
          const result = await supabase
            .from('orders')
            .select(`
              *,
              products (name, price, image_url),
              users (full_name, email)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          data = result.data
          error = result.error
        } catch (err2) {
          // Se ainda falhar, tentar sem joins
          const result = await supabase
            .from('Pedidos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          data = result.data
          error = result.error
        }
      }

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos')
      setOrders([]) // Fallback para array vazio
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      // Verificar se Supabase está configurado e usuário logado
      if (!isSupabaseConfigured() || !supabase || !user) {
        throw new Error('Usuário não autenticado')
      }

      const orderWithUser = {
        ...order,
        user_id: user.id
      }

      // Tentar primeiro com nome em português, depois em inglês
      let data, error
      try {
        const result = await supabase
          .from('Pedidos')
          .insert([orderWithUser])
          .select()
          .single()
        data = result.data
        error = result.error
      } catch (err) {
        // Se falhar, tentar com nome em inglês
        const result = await supabase
          .from('orders')
          .insert([orderWithUser])
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) throw error
      setOrders(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido')
      throw err
    }
  }

  return { orders, loading, error, fetchOrders, createOrder }
}

export function useReviews(productId?: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (productId) {
      fetchReviews(productId)
    }
  }, [productId])

  const fetchReviews = async (prodId: string) => {
    try {
      setLoading(true)
      
      // Verificar se Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        setReviews([])
        setLoading(false)
        return
      }

      // Tentar primeiro com nome em português, depois em inglês
      let data, error
      try {
        const result = await supabase
          .from('Avaliacoes')
          .select(`
            *,
            Usuarios (full_name)
          `)
          .eq('product_id', prodId)
          .order('created_at', { ascending: false })
        data = result.data
        error = result.error
      } catch (err) {
        // Se falhar, tentar com nomes em inglês
        const result = await supabase
          .from('reviews')
          .select(`
            *,
            users (full_name)
          `)
          .eq('product_id', prodId)
          .order('created_at', { ascending: false })
        data = result.data
        error = result.error
      }

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar avaliações')
      setReviews([]) // Fallback para array vazio
    } finally {
      setLoading(false)
    }
  }

  const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'user_id'>) => {
    try {
      // Verificar se Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase não configurado')
      }

      // Verificar se usuário está logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const reviewWithUser = {
        ...review,
        user_id: user.id
      }

      // Tentar primeiro com nome em português, depois em inglês
      let data, error
      try {
        const result = await supabase
          .from('Avaliacoes')
          .insert([reviewWithUser])
          .select()
          .single()
        data = result.data
        error = result.error
      } catch (err) {
        // Se falhar, tentar com nome em inglês
        const result = await supabase
          .from('reviews')
          .insert([reviewWithUser])
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) throw error
      setReviews(prev => [data, ...prev])
      
      // Atualizar rating do produto
      await updateProductRating(review.product_id)
      
      return data
    } catch (err) {
      console.error('Erro ao adicionar avaliação:', err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar avaliação')
      throw err
    }
  }

  const updateProductRating = async (productId: string) => {
    try {
      if (!isSupabaseConfigured() || !supabase) return

      // Calcular nova média de rating - tentar primeiro em português
      let reviewsData
      try {
        const result = await supabase
          .from('Avaliacoes')
          .select('rating')
          .eq('product_id', productId)
        reviewsData = result.data
      } catch (err) {
        // Se falhar, tentar em inglês
        const result = await supabase
          .from('reviews')
          .select('rating')
          .eq('product_id', productId)
        reviewsData = result.data
      }

      if (reviewsData && reviewsData.length > 0) {
        const avgRating = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length
        const reviewsCount = reviewsData.length

        // Atualizar produto - tentar primeiro em português
        try {
          await supabase
            .from('Produtos')
            .update({ 
              rating: Math.round(avgRating * 10) / 10,
              reviews_count: reviewsCount 
            })
            .eq('id', productId)
        } catch (err) {
          // Se falhar, tentar em inglês
          await supabase
            .from('products')
            .update({ 
              rating: Math.round(avgRating * 10) / 10,
              reviews_count: reviewsCount 
            })
            .eq('id', productId)
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar rating do produto:', err)
    }
  }

  return { reviews, loading, error, fetchReviews, addReview }
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Verificar se Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        setUsers([])
        setLoading(false)
        return
      }

      // Tentar primeiro com nome em português, depois em inglês
      let data, error
      try {
        const result = await supabase
          .from('Usuarios')
          .select('*')
          .order('created_at', { ascending: false })
        data = result.data
        error = result.error
      } catch (err) {
        // Se falhar, tentar com nome em inglês
        const result = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
        data = result.data
        error = result.error
      }

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários')
      setUsers([]) // Fallback para array vazio
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Verificar se Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('Supabase não configurado')
      }

      // Tentar primeiro com nome em português, depois em inglês
      let data, error
      try {
        const result = await supabase
          .from('Usuarios')
          .insert([user])
          .select()
          .single()
        data = result.data
        error = result.error
      } catch (err) {
        // Se falhar, tentar com nome em inglês
        const result = await supabase
          .from('users')
          .insert([user])
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) throw error
      setUsers(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Erro ao criar usuário:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário')
      throw err
    }
  }

  return { users, loading, error, fetchUsers, createUser }
}