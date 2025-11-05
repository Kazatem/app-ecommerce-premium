"use client"

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, User, Star, MessageCircle, TrendingUp, Package, Heart, Filter, Grid, List, Plus, Loader2, LogOut, Sparkles, Zap, Gift, Crown, CreditCard, Settings, Menu, X, MapPin, Truck, Shield, ChevronDown, Bell, Percent, Eye, RotateCcw, Compare, Tag, Award, Clock } from 'lucide-react'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import Cart from '@/components/Cart'
import Checkout from '@/components/Checkout'
import AuthModal from '@/components/AuthModal'
import SubscriptionModal from '@/components/SubscriptionModal'

interface CartItem extends Product {
  quantity: number
}

interface Coupon {
  id: string
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minValue: number
  expiresAt: string
  description: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'offer' | 'order' | 'system'
  read: boolean
  createdAt: string
}

export default function KazaTemImports() {
  const [activeTab, setActiveTab] = useState('home')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Novos estados para funcionalidades avançadas
  const [favorites, setFavorites] = useState<string[]>([])
  const [viewedProducts, setViewedProducts] = useState<string[]>([])
  const [compareProducts, setCompareProducts] = useState<Product[]>([])
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null)
  const [showChatBot, setShowChatBot] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot', timestamp: string}>>([])
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [showFilters, setShowFilters] = useState(false)
  
  // Estados simulados para funcionalidades
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isReseller, setIsReseller] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('kaza-favorites')
    const savedViewed = localStorage.getItem('kaza-viewed')
    const savedPoints = localStorage.getItem('kaza-points')
    const savedNotifications = localStorage.getItem('kaza-notifications')
    const savedAuth = localStorage.getItem('kaza-auth')
    const savedReseller = localStorage.getItem('kaza-reseller')
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedViewed) setViewedProducts(JSON.parse(savedViewed))
    if (savedPoints) setLoyaltyPoints(parseInt(savedPoints))
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications))
    if (savedAuth) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedAuth))
    }
    if (savedReseller) setIsReseller(JSON.parse(savedReseller))
    
    // Adicionar notificações de exemplo
    if (!savedNotifications) {
      const welcomeNotifications: Notification[] = [
        {
          id: '1',
          title: '🎉 Bem-vindo à Kaza Tem!',
          message: 'Aproveite 15% OFF na primeira compra com o cupom BEMVINDO15',
          type: 'offer',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: '⭐ Programa de Fidelidade',
          message: 'Ganhe pontos a cada compra e troque por descontos exclusivos!',
          type: 'system',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]
      setNotifications(welcomeNotifications)
      localStorage.setItem('kaza-notifications', JSON.stringify(welcomeNotifications))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('kaza-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('kaza-viewed', JSON.stringify(viewedProducts))
  }, [viewedProducts])

  useEffect(() => {
    localStorage.setItem('kaza-points', loyaltyPoints.toString())
  }, [loyaltyPoints])

  const categories = ["Todos", "Cama", "Mesa", "Banho", "Decoração", "Enxoval"]

  // Cupons disponíveis
  const availableCoupons: Coupon[] = [
    {
      id: '1',
      code: 'BEMVINDO15',
      discount: 15,
      type: 'percentage',
      minValue: 100,
      expiresAt: '2024-12-31',
      description: '15% OFF na primeira compra'
    },
    {
      id: '2',
      code: 'FRETE50',
      discount: 50,
      type: 'fixed',
      minValue: 200,
      expiresAt: '2024-12-31',
      description: 'R$ 50 OFF no frete'
    },
    {
      id: '3',
      code: 'PREMIUM20',
      discount: 20,
      type: 'percentage',
      minValue: 300,
      expiresAt: '2024-12-31',
      description: '20% OFF para revendedores'
    }
  ]

  // Produtos de exemplo
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: "Jogo de Cama Casal Premium",
      description: "Jogo de cama 100% algodão com 4 peças",
      price: 299.00,
      original_price: 399.00,
      image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      category: "Cama",
      discount_percentage: 25,
      rating: 4.8,
      reviews_count: 124,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: "Toalha de Mesa Bordada",
      description: "Toalha de mesa com bordado artesanal",
      price: 189.00,
      original_price: 249.00,
      image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      category: "Mesa",
      discount_percentage: 24,
      rating: 4.6,
      reviews_count: 89,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: "Kit Toalhas de Banho Luxo",
      description: "Kit com 4 toalhas de banho premium",
      price: 159.00,
      original_price: 199.00,
      image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
      category: "Banho",
      discount_percentage: 20,
      rating: 4.7,
      reviews_count: 156,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      name: "Edredom King Size Premium",
      description: "Edredom king size com enchimento de fibra",
      price: 449.00,
      original_price: 599.00,
      image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      category: "Cama",
      discount_percentage: 25,
      rating: 4.9,
      reviews_count: 203,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      name: "Conjunto de Pratos Porcelana",
      description: "Conjunto de pratos em porcelana fina",
      price: 329.00,
      original_price: 429.00,
      image_url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop",
      category: "Mesa",
      discount_percentage: 23,
      rating: 4.5,
      reviews_count: 78,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '6',
      name: "Cortina Blackout Elegante",
      description: "Cortina blackout com tecido premium",
      price: 219.00,
      original_price: 289.00,
      image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      category: "Decoração",
      discount_percentage: 24,
      rating: 4.4,
      reviews_count: 92,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '7',
      name: "Lençol Solteiro Percal 200 Fios",
      description: "Lençol de solteiro em percal 200 fios",
      price: 129.00,
      original_price: 179.00,
      image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop",
      category: "Cama",
      discount_percentage: 28,
      rating: 4.6,
      reviews_count: 67,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '8',
      name: "Jogo Americano Rattan",
      description: "Conjunto de 6 jogos americanos em rattan",
      price: 89.00,
      original_price: 119.00,
      image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
      category: "Mesa",
      discount_percentage: 25,
      rating: 4.3,
      reviews_count: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '9',
      name: "Tapete de Banheiro Antiderrapante",
      description: "Tapete de banheiro com base antiderrapante",
      price: 79.00,
      original_price: 99.00,
      image_url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop",
      category: "Banho",
      discount_percentage: 20,
      rating: 4.4,
      reviews_count: 112,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '10',
      name: "Almofada Decorativa Veludo",
      description: "Almofada decorativa em veludo com enchimento",
      price: 69.00,
      original_price: 89.00,
      image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      category: "Decoração",
      discount_percentage: 22,
      rating: 4.5,
      reviews_count: 89,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '11',
      name: "Kit Enxoval Bebê Completo",
      description: "Kit enxoval completo para bebê com 15 peças",
      price: 399.00,
      original_price: 549.00,
      image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
      category: "Enxoval",
      discount_percentage: 27,
      rating: 4.9,
      reviews_count: 234,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '12',
      name: "Cobertor Casal Microfibra",
      description: "Cobertor casal em microfibra macia",
      price: 179.00,
      original_price: 229.00,
      image_url: "https://images.unsplash.com/photo-1631049035182-249067d7618e?w=400&h=400&fit=crop",
      category: "Cama",
      discount_percentage: 22,
      rating: 4.7,
      reviews_count: 156,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  // Filtrar e ordenar produtos
  const filteredProducts = sampleProducts
    .filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesCategory && matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  // Calcular total de itens no carrinho
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Funções para favoritos
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Função para adicionar produto visualizado
  const addToViewed = (productId: string) => {
    setViewedProducts(prev => {
      const filtered = prev.filter(id => id !== productId)
      return [productId, ...filtered].slice(0, 10) // Manter apenas os 10 mais recentes
    })
  }

  // Função para comparar produtos
  const toggleCompare = (product: Product) => {
    setCompareProducts(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.filter(p => p.id !== product.id)
      } else if (prev.length < 3) {
        return [...prev, product]
      } else {
        // Substituir o primeiro se já tem 3
        return [product, ...prev.slice(0, 2)]
      }
    })
  }

  // Função para aplicar cupom
  const applyCoupon = (couponCode: string) => {
    const coupon = availableCoupons.find(c => c.code === couponCode)
    if (coupon) {
      setActiveCoupon(coupon)
      // Adicionar notificação de sucesso
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: '🎉 Cupom Aplicado!',
        message: `Cupom ${couponCode} aplicado com sucesso!`,
        type: 'offer',
        read: false,
        createdAt: new Date().toISOString()
      }
      setNotifications(prev => [newNotification, ...prev])
    }
  }

  const addToCart = (product: Product) => {
    // Adicionar aos produtos visualizados
    addToViewed(product.id)
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
    
    // Ganhar pontos de fidelidade
    const points = Math.floor(product.price / 10) // 1 ponto a cada R$ 10
    setLoyaltyPoints(prev => prev + points)
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId)
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      )
    }
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setAuthModalMode('login')
      setIsAuthModalOpen(true)
      return
    }
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleCheckoutConfirm = (orderData: any) => {
    console.log('Pedido confirmado:', orderData)
    setCartItems([]) // Limpar carrinho
    setIsCheckoutOpen(false)
    
    // Ganhar pontos bônus pela compra
    const bonusPoints = Math.floor(orderData.total / 5) // Pontos bônus
    setLoyaltyPoints(prev => prev + bonusPoints)
    
    // Adicionar notificação de pedido confirmado
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: '✅ Pedido Confirmado!',
      message: `Seu pedido foi confirmado e está sendo processado. Você ganhou ${bonusPoints} pontos!`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setIsReseller(false)
    setUser(null)
    setCartItems([])
    localStorage.removeItem('kaza-auth')
    localStorage.removeItem('kaza-reseller')
  }

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('kaza-auth', JSON.stringify(userData))
    setIsAuthModalOpen(false)
  }

  const handleSubscribe = () => {
    setIsReseller(true)
    localStorage.setItem('kaza-reseller', JSON.stringify(true))
    setIsSubscriptionModalOpen(false)
    
    // Adicionar notificação de sucesso
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: '🎉 Bem-vindo ao Premium!',
      message: 'Você agora é um Revendedor Premium! Aproveite todos os benefícios.',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Aplicar desconto do cupom
  let discount = 0
  if (activeCoupon) {
    if (activeCoupon.type === 'percentage') {
      discount = cartTotal * (activeCoupon.discount / 100)
    } else {
      discount = activeCoupon.discount
    }
  }
  
  const shipping = cartTotal > 200 ? 0 : 15
  const finalTotal = cartTotal - discount + shipping

  // Marcar notificação como lida
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-black shadow-lg border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d439aaf6-3e33-4151-a5cf-667ea56ff1b5.png" 
                alt="Logo Kaza Tem Imports" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-black text-yellow-500">
                KAZA TEM
              </span>
              <div className="text-xs text-yellow-400 font-medium">IMPORTS</div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-r-md hover:bg-yellow-400 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Location - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 text-white/80 hover:text-yellow-400 cursor-pointer">
              <MapPin className="w-4 h-4" />
              <div className="text-sm">
                <div className="text-xs text-gray-400">Enviar para</div>
                <div className="font-medium">São Paulo</div>
              </div>
            </div>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button 
                  className="relative p-2 text-white/80 hover:text-yellow-400 transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadNotifications}
                    </div>
                  )}
                </button>
                
                {/* Dropdown de Notificações */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Nenhuma notificação
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'offer' ? 'bg-green-500' :
                                notification.type === 'order' ? 'bg-blue-500' :
                                'bg-gray-500'
                              }`} />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {notification.title}
                                </h4>
                                <p className="text-gray-600 text-sm mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  {new Date(notification.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Loyalty Points */}
            {isAuthenticated && loyaltyPoints > 0 && (
              <div className="hidden md:flex items-center space-x-2 bg-yellow-500/20 px-3 py-2 rounded-full border border-yellow-500/30">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-200 font-bold text-sm">{loyaltyPoints} pts</span>
              </div>
            )}

            {/* Cart */}
            <button 
              className="relative p-2 text-white/80 hover:text-yellow-400 transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </div>
              )}
            </button>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm text-white font-medium">
                    Olá, {user?.name || 'Usuário'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {isReseller ? 'Revendedor Premium' : 'Membro'}
                    {isReseller && <Crown className="inline w-3 h-3 ml-1 text-yellow-400" />}
                  </div>
                </div>
                
                <button 
                  className="p-2 text-white/80 hover:text-yellow-400 transition-colors"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <User className="w-6 h-6" />
                </button>
                <button 
                  className="p-2 text-white/60 hover:text-red-400 transition-colors"
                  onClick={handleSignOut}
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  className="text-white/90 hover:text-yellow-400 font-medium transition-colors"
                  onClick={() => {
                    setAuthModalMode('login')
                    setIsAuthModalOpen(true)
                  }}
                >
                  Entrar
                </button>
                <button 
                  className="bg-yellow-500 text-black px-4 py-2 rounded-md font-bold hover:bg-yellow-400 transition-colors"
                  onClick={() => {
                    setAuthModalMode('register')
                    setIsAuthModalOpen(true)
                  }}
                >
                  Criar conta
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-r-md">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black border-t border-yellow-500/20 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <div className="text-sm">
                  <div className="text-xs text-gray-400">Enviar para</div>
                  <div className="font-medium">São Paulo</div>
                </div>
              </div>
              {isAuthenticated && loyaltyPoints > 0 && (
                <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-2 rounded-full border border-yellow-500/30">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-200 font-bold text-sm">{loyaltyPoints} pontos</span>
                </div>
              )}
              <div className="border-t border-gray-700 pt-4">
                <button 
                  className="w-full text-left text-white hover:text-yellow-400 py-2"
                  onClick={() => setActiveTab('home')}
                >
                  Início
                </button>
                <button 
                  className="w-full text-left text-white hover:text-yellow-400 py-2"
                  onClick={() => setActiveTab('products')}
                >
                  Produtos
                </button>
                <button 
                  className="w-full text-left text-white hover:text-yellow-400 py-2"
                  onClick={() => setActiveTab('favorites')}
                >
                  Favoritos ({favorites.length})
                </button>
                <button 
                  className="w-full text-left text-white hover:text-yellow-400 py-2"
                  onClick={() => setActiveTab('reseller')}
                >
                  Seja Revendedor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )

  const renderNavigation = () => (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex space-x-8">
            {[
              { id: 'home', label: 'Início' },
              { id: 'products', label: 'Produtos' },
              { id: 'favorites', label: `Favoritos (${favorites.length})` },
              { id: 'compare', label: `Comparar (${compareProducts.length})` },
              { id: 'reseller', label: 'Seja Revendedor' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'support', label: 'Suporte' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'text-black border-b-2 border-yellow-500'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Subscription Status */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              {isReseller ? (
                <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700 font-bold text-sm">Premium</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="flex items-center space-x-2 bg-black text-yellow-500 px-4 py-2 rounded-md font-bold text-sm hover:bg-gray-800 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )

  const renderProductCard = (product: Product) => {
    // Preços especiais para revendedores (20% de desconto)
    const resellerPrice = isReseller ? product.price * 0.8 : product.price
    const showResellerPrice = isReseller && resellerPrice !== product.price
    const isFavorite = favorites.includes(product.id)
    const isInCompare = compareProducts.some(p => p.id === product.id)

    return (
      <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
        <div className="relative">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'}
            alt={product.name}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => addToViewed(product.id)}
          />
          
          {product.discount_percentage > 0 && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {product.discount_percentage}% OFF
              </span>
            </div>
          )}
          
          {showResellerPrice && (
            <div className="absolute top-2 right-2">
              <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center space-x-1">
                <Crown className="w-3 h-3" />
                <span>ESPECIAL</span>
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button 
              onClick={() => toggleFavorite(product.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => toggleCompare(product)}
              className={`p-2 rounded-full transition-colors ${
                isInCompare 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Compare className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating || 0}</span>
              <span className="text-xs text-gray-500">({product.reviews_count || 0})</span>
            </div>
          </div>
          
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2 mb-3">
            {showResellerPrice ? (
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <span className="text-lg font-bold text-black">
                    {formatPrice(resellerPrice)}
                  </span>
                </div>
                <span className="text-xs text-gray-500 line-through">
                  Público: {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-black">
                {formatPrice(product.price)}
              </span>
            )}
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
            <Truck className="w-4 h-4" />
            <span>Frete grátis</span>
          </div>
          
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-yellow-500 text-black py-2 rounded-md font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    )
  }

  const renderHome = () => (
    <div className="space-y-8">
      {/* Cupons Banner */}
      {availableCoupons.length > 0 && (
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Percent className="w-8 h-8 text-green-200" />
              <div>
                <h3 className="text-xl font-bold">Cupons Disponíveis!</h3>
                <p className="text-green-200">Economize ainda mais nas suas compras</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {availableCoupons.slice(0, 2).map((coupon) => (
                <button
                  key={coupon.id}
                  onClick={() => applyCoupon(coupon.code)}
                  className="bg-white text-green-700 px-4 py-2 rounded-md font-bold hover:bg-green-50 transition-colors"
                >
                  {coupon.code}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white rounded-lg overflow-hidden">
        <div className="px-8 py-16 lg:px-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
              Enxoval dos
              <span className="block text-yellow-500">
                Seus Sonhos
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-gray-300 leading-relaxed">
              Produtos premium de cama, mesa e banho com qualidade garantida e preços exclusivos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setActiveTab('products')}
                className="bg-yellow-500 text-black px-8 py-4 rounded-md font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2"
              >
                <Gift className="w-5 h-5" />
                <span>Ver Produtos</span>
              </button>
              
              <button 
                onClick={() => isAuthenticated ? setIsSubscriptionModalOpen(true) : setActiveTab('reseller')}
                className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-md font-bold text-lg hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center space-x-2"
              >
                <Crown className="w-5 h-5" />
                <span>Seja Revendedor</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.filter(cat => cat !== 'Todos').map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setActiveTab('products')
              }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center border border-gray-200"
            >
              <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span className="font-medium text-gray-900">{category}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Produtos em Destaque</h2>
          <button 
            onClick={() => setActiveTab('products')}
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Ver todos →
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            <span className="ml-3 text-gray-600">Carregando produtos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map(renderProductCard)}
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      {viewedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Eye className="w-6 h-6 text-gray-600" />
              <span>Visualizados Recentemente</span>
            </h2>
            <button 
              onClick={() => setViewedProducts([])}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm"
            >
              Limpar histórico
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts
              .filter(product => viewedProducts.includes(product.id))
              .slice(0, 4)
              .map(renderProductCard)}
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Por que escolher a Kaza Tem?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: "Compra Protegida",
              description: "Sua compra protegida do pagamento à entrega"
            },
            {
              icon: Truck,
              title: "Frete Grátis",
              description: "Frete grátis em compras acima de R$ 200"
            },
            {
              icon: Crown,
              title: "Qualidade Premium",
              description: "Produtos selecionados com qualidade garantida"
            },
            {
              icon: Award,
              title: "Programa de Fidelidade",
              description: "Ganhe pontos e troque por descontos"
            }
          ].map(({ icon: Icon, title, description }, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filtros:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                    selectedCategory === category
                      ? 'border-yellow-500 text-black bg-yellow-100'
                      : 'border-gray-300 hover:border-yellow-500 hover:text-yellow-600 bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="relevance">Mais Relevantes</option>
              <option value="price-low">Menor Preço</option>
              <option value="price-high">Maior Preço</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="newest">Mais Novos</option>
            </select>
            
            {isReseller && (
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-full border border-yellow-300">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-700 font-bold text-sm">Preços Especiais</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">
                Resultados para "{searchTerm}"
              </h3>
              <p className="text-gray-600 text-sm">
                {filteredProducts.length} produto(s) encontrado(s)
                {selectedCategory !== 'Todos' && ` na categoria "${selectedCategory}"`}
              </p>
            </div>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Limpar busca ✕
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          <span className="ml-3 text-gray-600">Carregando produtos...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto encontrado'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `Não encontramos produtos para "${searchTerm}"`
              : 'Tente selecionar uma categoria diferente'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-yellow-500 text-black px-6 py-2 rounded-md font-medium hover:bg-yellow-400 transition-colors"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredProducts.map(renderProductCard)}
        </div>
      )}
    </div>
  )

  const renderFavorites = () => {
    const favoriteProducts = sampleProducts.filter(product => favorites.includes(product.id))
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-red-200 fill-current" />
            <h1 className="text-3xl font-black">Meus Favoritos</h1>
          </div>
          <p className="text-red-100">
            {favorites.length} produto(s) na sua lista de desejos
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-gray-600 mb-4">
              Adicione produtos aos favoritos clicando no coração
            </p>
            <button
              onClick={() => setActiveTab('products')}
              className="bg-yellow-500 text-black px-6 py-2 rounded-md font-medium hover:bg-yellow-400 transition-colors"
            >
              Explorar Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map(renderProductCard)}
          </div>
        )}
      </div>
    )
  }

  const renderCompare = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8">
        <div className="flex items-center space-x-3 mb-4">
          <Compare className="w-8 h-8 text-blue-200" />
          <h1 className="text-3xl font-black">Comparar Produtos</h1>
        </div>
        <p className="text-blue-100">
          Compare até 3 produtos lado a lado
        </p>
      </div>

      {compareProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Compare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Nenhum produto para comparar
          </h3>
          <p className="text-gray-600 mb-4">
            Adicione produtos à comparação clicando no ícone de comparar
          </p>
          <button
            onClick={() => setActiveTab('products')}
            className="bg-yellow-500 text-black px-6 py-2 rounded-md font-medium hover:bg-yellow-400 transition-colors"
          >
            Explorar Produtos
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="relative mb-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <button
                    onClick={() => toggleCompare(product)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-bold">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoria:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avaliação:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating || 0}</span>
                    </div>
                  </div>
                  {product.discount_percentage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desconto:</span>
                      <span className="text-green-600 font-bold">{product.discount_percentage}% OFF</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-4 bg-yellow-500 text-black py-2 rounded-md font-bold hover:bg-yellow-400 transition-colors"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderReseller = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-6 bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Crown className="w-8 h-8 text-yellow-500" />
          <span className="text-yellow-500 font-bold text-lg">PROGRAMA VIP</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-black mb-4">
          Torne-se um
          <span className="block text-yellow-500">
            Revendedor Elite
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
          Ganhe renda extra vendendo produtos premium. Use nosso app como catálogo e acompanhe seus ganhos em tempo real.
        </p>
        
        <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30 max-w-sm mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <CreditCard className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-white">Apenas {formatPrice(9.90)}/mês</span>
          </div>
          <p className="text-yellow-200 text-sm">
            Cancele quando quiser • Sem fidelidade
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { 
            icon: TrendingUp, 
            title: "Renda Extra", 
            description: "Comissões de até 30% em cada venda"
          },
          { 
            icon: Package, 
            title: "Catálogo Premium", 
            description: "Acesso a mais de 1000 produtos"
          },
          { 
            icon: Crown, 
            title: "Preços Especiais", 
            description: "20% de desconto para revenda"
          },
          { 
            icon: Zap, 
            title: "Suporte VIP", 
            description: "Atendimento prioritário 24/7"
          },
          { 
            icon: Sparkles, 
            title: "Dashboard", 
            description: "Relatórios em tempo real"
          },
          { 
            icon: Gift, 
            title: "Material", 
            description: "Imagens e textos promocionais"
          }
        ].map(({ icon: Icon, title, description }, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pronto para Começar?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {isAuthenticated 
            ? 'Assine o plano Revendedor Premium e comece a ganhar renda extra hoje mesmo!'
            : 'Faça login ou crie sua conta para acessar o plano Revendedor Premium'
          }
        </p>
        
        {isAuthenticated ? (
          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-black text-yellow-500 px-8 py-4 rounded-md font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <Crown className="w-5 h-5" />
            <span>Assinar por {formatPrice(9.90)}/mês</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setAuthModalMode('login')
                setIsAuthModalOpen(true)
              }}
              className="px-6 py-3 border-2 border-black text-black rounded-md font-medium hover:bg-black hover:text-white transition-colors"
            >
              Fazer Login
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register')
                setIsAuthModalOpen(true)
              }}
              className="bg-yellow-500 text-black px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors"
            >
              Criar Conta Grátis
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderDashboard = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-gray-600 mb-6">Você precisa estar logado para acessar o dashboard</p>
          <button
            onClick={() => {
              setAuthModalMode('login')
              setIsAuthModalOpen(true)
            }}
            className="bg-yellow-500 text-black px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      )
    }

    const totalSales = cartTotal
    const commission = isReseller ? totalSales * 0.2 : 0

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">
                Dashboard {isReseller ? 'Premium' : 'Elite'}
              </h1>
              <p className="text-gray-300">
                {isReseller ? 'Painel do Revendedor Premium' : 'Bem-vindo ao seu painel'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{cartItems.length}</div>
              <div className="text-gray-300 text-sm">itens no carrinho</div>
            </div>
          </div>
        </div>

        {/* Loyalty Points Card */}
        {loyaltyPoints > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Programa de Fidelidade</h3>
                  <p className="text-purple-100">Seus pontos acumulados</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black">{loyaltyPoints}</div>
                <div className="text-purple-200 text-sm">pontos</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-purple-100 text-sm">
                💡 Troque seus pontos por descontos especiais! A cada 100 pontos = R$ 10 OFF
              </p>
            </div>
          </div>
        )}

        {/* Subscription Status */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isReseller ? 'bg-yellow-500' : 'bg-gray-400'
                }`}>
                  {isReseller ? (
                    <Crown className="w-6 h-6 text-black" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {isReseller ? 'Revendedor Premium' : 'Usuário Comum'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isReseller 
                      ? 'Você tem acesso a todos os benefícios premium'
                      : 'Upgrade para Premium e ganhe renda extra'
                    }
                  </p>
                </div>
              </div>
              
              {!isReseller && (
                <button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="bg-black text-yellow-500 px-4 py-2 rounded-md font-bold hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Total do Carrinho", 
              value: formatPrice(totalSales), 
              change: "+15%",
              icon: TrendingUp,
              color: "bg-green-500"
            },
            { 
              title: isReseller ? "Comissão" : "Total Gasto", 
              value: formatPrice(commission || totalSales), 
              change: "+12%",
              icon: Crown,
              color: "bg-yellow-500"
            },
            { 
              title: "Produtos", 
              value: cartItems.reduce((sum, item) => sum + item.quantity, 0).toString(), 
              change: "+8%",
              icon: Package,
              color: "bg-blue-500"
            },
            { 
              title: "Favoritos", 
              value: favorites.length.toString(), 
              change: "+5%",
              icon: Heart,
              color: "bg-red-500"
            }
          ].map(({ title, value, change, icon: Icon, color }, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  {change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Atividade Recente</span>
          </h3>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma atividade recente</p>
              <p className="text-gray-500 text-sm mt-1">Adicione produtos ao carrinho para ver atividades</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-gray-600 text-sm">
                        Quantidade: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                    {isReseller && (
                      <div className="text-sm text-green-600 font-medium">
                        Comissão: {formatPrice(item.price * item.quantity * 0.2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderSupport = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Zap className="w-8 h-8 text-yellow-500" />
          <span className="text-yellow-500 font-bold text-lg">IA AVANÇADA</span>
        </div>
        
        <h1 className="text-3xl font-black mb-2">Suporte Inteligente</h1>
        <p className="text-xl text-gray-300">Nossa IA está aqui para ajudar você 24/7</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-black p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-white">Assistente Kaza IA</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-gray-300 text-sm">Online agora</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-80 p-6 overflow-y-auto bg-gray-50">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <div className="bg-white rounded-lg p-4 max-w-md shadow-sm border border-gray-200">
              <p className="text-gray-800">Olá! 👋 Sou o assistente da Kaza Tem Imports. Como posso ajudar você hoje?</p>
            </div>
          </div>
          
          {/* Mensagens do chat */}
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex items-start space-x-3 mt-4 ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' ? 'bg-blue-500' : 'bg-yellow-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Zap className="w-4 h-4 text-black" />
                )}
              </div>
              <div className={`rounded-lg p-4 max-w-md shadow-sm border ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-800 border-gray-200'
              }`}>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <button className="bg-yellow-500 text-black p-3 rounded-md hover:bg-yellow-400 transition-colors">
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Perguntas Frequentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "Como funciona o programa de fidelidade?", a: "Ganhe pontos a cada compra e troque por descontos. 100 pontos = R$ 10 OFF!" },
            { q: "Como usar os cupons de desconto?", a: "Digite o código do cupom no checkout ou clique nos cupons disponíveis na página inicial." },
            { q: "Como funciona o plano de revendedor?", a: "Por apenas R$ 9,90/mês você tem acesso a preços especiais e comissões." },
            { q: "Posso cancelar a qualquer momento?", a: "Sim! Não há fidelidade. Cancele quando quiser." },
            { q: "Qual a comissão dos revendedores?", a: "As comissões variam de 10% a 30% dependendo do produto." },
            { q: "Como acompanhar minhas vendas?", a: "Use o Dashboard para ver vendas e relatórios em tempo real." }
          ].map(({ q, a }, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-600 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'home': return renderHome()
      case 'products': return renderProducts()
      case 'favorites': return renderFavorites()
      case 'compare': return renderCompare()
      case 'reseller': return renderReseller()
      case 'support': return renderSupport()
      default: return renderHome()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      {renderNavigation()}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={finalTotal}
        onConfirm={handleCheckoutConfirm}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLogin={handleLogin}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        initialPlan="reseller"
        onSubscribe={handleSubscribe}
      />

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatBot(!showChatBot)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-yellow-500 text-black rounded-full shadow-lg hover:bg-yellow-400 transition-colors flex items-center justify-center z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-black text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d439aaf6-3e33-4151-a5cf-667ea56ff1b5.png" 
                  alt="Logo Kaza Tem Imports" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-black text-yellow-500">
                  KAZA TEM
                </span>
              </div>
              <p className="text-gray-400 text-sm">Produtos premium de cama, mesa e banho com qualidade garantida.</p>
            </div>
            
            {[
              { title: "Produtos", items: ["Cama", "Mesa", "Banho", "Decoração"] },
              { title: "Empresa", items: ["Sobre", "Contato", "Carreiras", "Blog"] },
              { title: "Suporte", items: ["Central de Ajuda", "Chat IA", "Política", "Termos"] }
            ].map(({ title, items }, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-bold text-white">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Kaza Tem Imports. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}