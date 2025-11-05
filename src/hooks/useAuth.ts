"use client"

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Interface para usuário local (quando Supabase não está configurado)
interface LocalUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    phone?: string
    city?: string
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | LocalUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se há usuário logado
    const getUser = async () => {
      try {
        if (isSupabaseConfigured() && supabase) {
          // Usar Supabase se configurado
          const { data: { user } } = await supabase.auth.getUser()
          setUser(user)
        } else {
          // Verificar usuário local no localStorage
          const localUser = localStorage.getItem('localUser')
          if (localUser) {
            setUser(JSON.parse(localUser))
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao verificar usuário')
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Escutar mudanças de autenticação do Supabase se configurado
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, userData?: { 
    full_name?: string 
    phone?: string 
    city?: string 
  }) => {
    try {
      setError(null)
      setLoading(true)

      if (isSupabaseConfigured() && supabase) {
        // Usar Supabase se configurado
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData
          }
        })

        if (error) {
          // Tratamento específico para diferentes tipos de erro
          if (error.message.includes('User already registered')) {
            throw new Error('Este email já está cadastrado. Tente fazer login ou recuperar sua senha.')
          }
          throw error
        }

        // Criar perfil do usuário na tabela personalizada
        if (data.user && userData) {
          try {
            await supabase
              .from('users')
              .insert([{
                id: data.user.id,
                email: data.user.email,
                full_name: userData.full_name || '',
                phone: userData.phone || '',
                city: userData.city || '',
                is_reseller: false
              }])
          } catch (profileError) {
            // Erro silencioso para criação de perfil
          }
        }

        return data
      } else {
        // Sistema local para demonstração
        const localUser: LocalUser = {
          id: Date.now().toString(),
          email,
          user_metadata: userData
        }

        // Salvar no localStorage
        localStorage.setItem('localUser', JSON.stringify(localUser))
        setUser(localUser)

        return { user: localUser }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      if (isSupabaseConfigured() && supabase) {
        // Usar Supabase se configurado
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          // Tratamento específico para email não confirmado
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Seu email ainda não foi confirmado. Verifique sua caixa de entrada e clique no link de confirmação que enviamos.')
          }
          // Tratamento para credenciais inválidas
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.')
          }
          throw error
        }
        return data
      } else {
        // Sistema local para demonstração - aceitar qualquer login
        const localUser: LocalUser = {
          id: Date.now().toString(),
          email,
          user_metadata: {
            full_name: email.split('@')[0] // Usar parte do email como nome
          }
        }

        // Salvar no localStorage
        localStorage.setItem('localUser', JSON.stringify(localUser))
        setUser(localUser)

        return { user: localUser }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)

      if (isSupabaseConfigured() && supabase) {
        // Usar Supabase se configurado
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      } else {
        // Sistema local - remover do localStorage
        localStorage.removeItem('localUser')
      }
      
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout')
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)

      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
      } else {
        // Sistema local - simular envio de email
        console.log('Email de recuperação enviado para:', email)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao resetar senha')
      throw err
    }
  }

  const resendConfirmation = async (email: string) => {
    try {
      setError(null)
      setLoading(true)

      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email
        })
        
        if (error) throw error
        
        return { success: true, message: 'Email de confirmação reenviado com sucesso!' }
      } else {
        // Sistema local - simular reenvio
        return { success: true, message: 'Email de confirmação reenviado!' }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reenviar confirmação'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendConfirmation,
    isAuthenticated: !!user
  }
}