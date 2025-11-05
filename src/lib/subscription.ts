export interface SubscriptionPlan {
  id: string
  type: 'free' | 'reseller'
  name: string
  description: string
  price: number
  features: string[]
  isPopular?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    type: 'free',
    name: 'Gratuito',
    description: 'Para usuários que querem explorar nossos produtos',
    price: 0,
    features: [
      'Acesso ao catálogo completo',
      'Programa de fidelidade',
      'Suporte por email',
      'Cupons de desconto'
    ]
  },
  {
    id: 'reseller',
    type: 'reseller',
    name: 'Revendedor Premium',
    description: 'Para quem quer ganhar renda extra vendendo nossos produtos',
    price: 9.90,
    isPopular: true,
    features: [
      'Todos os benefícios do plano gratuito',
      'Preços especiais com 20% de desconto',
      'Comissões de até 30% por venda',
      'Dashboard avançado com relatórios',
      'Suporte prioritário 24/7',
      'Material promocional exclusivo',
      'Treinamento e capacitação',
      'Acesso antecipado a novos produtos'
    ]
  }
]

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}