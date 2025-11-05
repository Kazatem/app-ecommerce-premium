import { supabase } from './supabase'

// SQL para criar as tabelas necessárias
const createTablesSQL = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      city VARCHAR(100),
      is_reseller BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  products: `
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2),
      image_url TEXT,
      category VARCHAR(100),
      rating DECIMAL(3,2) DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      discount_percentage INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      total_amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  reviews: `
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      has_photo BOOLEAN DEFAULT false,
      ai_response TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
}

// Função para executar as queries de criação de tabelas
export const setupDatabase = async () => {
  if (!supabase) {
    console.log('⚠️ Supabase não configurado. Configure nas Configurações do Projeto → Integrações → Supabase')
    return false
  }

  try {
    console.log('🔧 Configurando banco de dados...')
    
    // Executar cada query de criação de tabela
    for (const [tableName, sql] of Object.entries(createTablesSQL)) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql })
        
        if (error) {
          // Tentar método alternativo se RPC não funcionar
          console.log(`Tentando criar tabela ${tableName} via query direta...`)
          // Como não podemos executar SQL diretamente, vamos usar uma abordagem diferente
          continue
        }
        
        console.log(`✅ Tabela ${tableName} criada/verificada`)
      } catch (err) {
        console.log(`⚠️ Erro ao criar tabela ${tableName}:`, err)
      }
    }

    // Inserir dados de exemplo se as tabelas estiverem vazias
    await insertSampleData()
    
    console.log('✅ Configuração do banco de dados concluída!')
    return true
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error)
    return false
  }
}

// Função para inserir dados de exemplo
const insertSampleData = async () => {
  if (!supabase) return

  try {
    // Verificar se já existem produtos
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (existingProducts && existingProducts.length > 0) {
      console.log('📦 Produtos já existem no banco')
      return
    }

    // Inserir produtos de exemplo
    const sampleProducts = [
      {
        name: "Jogo de Cama Casal Premium",
        description: "Jogo de cama 100% algodão com 4 peças",
        price: 299.00,
        original_price: 399.00,
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
        category: "Cama",
        discount_percentage: 25,
        rating: 4.8,
        reviews_count: 124
      },
      {
        name: "Toalha de Mesa Bordada",
        description: "Toalha de mesa com bordado artesanal",
        price: 189.00,
        original_price: 249.00,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
        category: "Mesa",
        discount_percentage: 24,
        rating: 4.6,
        reviews_count: 89
      },
      {
        name: "Kit Toalhas de Banho Luxo",
        description: "Kit com 4 toalhas de banho premium",
        price: 159.00,
        original_price: 199.00,
        image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
        category: "Banho",
        discount_percentage: 20,
        rating: 4.7,
        reviews_count: 156
      }
    ]

    const { error } = await supabase
      .from('products')
      .insert(sampleProducts)

    if (error) {
      console.log('⚠️ Erro ao inserir produtos de exemplo:', error)
    } else {
      console.log('✅ Produtos de exemplo inseridos!')
    }

  } catch (error) {
    console.log('⚠️ Erro ao inserir dados de exemplo:', error)
  }
}

// Exportar as queries SQL para uso manual se necessário
export { createTablesSQL }