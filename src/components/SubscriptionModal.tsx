"use client"

import { useState } from 'react'
import { X, Crown, Check, CreditCard, Loader2, Star, Zap, TrendingUp, Shield, Gift, Sparkles } from 'lucide-react'
import { SUBSCRIPTION_PLANS, formatPrice, SubscriptionPlan } from '@/lib/subscription'
import { useSubscription } from '@/hooks/useSubscription'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  initialPlan?: 'free' | 'reseller'
  onSubscribe: () => void
}

export default function SubscriptionModal({ isOpen, onClose, initialPlan = 'reseller', onSubscribe }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    SUBSCRIPTION_PLANS.find(p => p.type === initialPlan) || SUBSCRIPTION_PLANS[1]
  )
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { subscribeToPlan, isReseller } = useSubscription()

  if (!isOpen) return null

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true)
      await subscribeToPlan(selectedPlan.type, paymentMethod)
      setShowSuccess(true)
      
      // Chamar callback do parent
      onSubscribe()
      
      // Fechar modal após 3 segundos
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Erro ao processar assinatura:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black border-2 border-yellow-400 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
          {/* Efeito de confete dourado */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>

          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Check className="w-10 h-10 text-black" />
            </div>
            
            <h3 className="text-3xl font-black text-white mb-4">
              🎉 Parabéns!
            </h3>
            
            <p className="text-gray-300 text-lg mb-6">
              Sua assinatura <span className="font-bold text-yellow-400">{selectedPlan.name}</span> foi ativada com sucesso!
            </p>
            
            <div className="bg-gray-900 border border-yellow-400/30 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <span className="font-bold text-white">Você agora é um Revendedor Premium!</span>
              </div>
              <p className="text-gray-400 text-sm">
                Aproveite todos os benefícios exclusivos e comece a ganhar renda extra hoje mesmo.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-yellow-400 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-black to-gray-900 border-b border-yellow-400/30 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-yellow-400" />
              <div>
                <h2 className="text-2xl font-black text-white">Planos de Assinatura</h2>
                <p className="text-gray-400">Escolha o plano ideal para você</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-yellow-400/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-yellow-400" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedPlan.id === plan.id
                    ? 'border-yellow-400 bg-gray-900 shadow-2xl shadow-yellow-400/20'
                    : 'border-gray-700 bg-gray-800 hover:border-yellow-400/50 hover:shadow-xl'
                } ${plan.isPopular ? 'ring-2 ring-yellow-400/30' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 MAIS POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    plan.type === 'reseller' 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700'
                  } shadow-xl`}>
                    {plan.type === 'reseller' ? (
                      <Crown className="w-8 h-8 text-black" />
                    ) : (
                      <Star className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-black text-white">Grátis</span>
                    ) : (
                      <div>
                        <span className="text-4xl font-black text-yellow-400">{formatPrice(plan.price)}</span>
                        <span className="text-gray-400 ml-2">/mês</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        plan.type === 'reseller' 
                          ? 'bg-yellow-400' 
                          : 'bg-gray-600'
                      }`}>
                        <Check className={`w-4 h-4 ${plan.type === 'reseller' ? 'text-black' : 'text-white'}`} />
                      </div>
                      <span className="text-gray-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPlan.id === plan.id && (
                  <div className="absolute inset-0 rounded-2xl bg-yellow-400/5 pointer-events-none border-2 border-yellow-400/30"></div>
                )}
              </div>
            ))}
          </div>

          {/* Payment Section - Only show for paid plans */}
          {selectedPlan.price > 0 && (
            <div className="bg-gray-900 border border-yellow-400/30 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-yellow-400" />
                <span>Método de Pagamento</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { id: 'credit_card', name: 'Cartão de Crédito', icon: CreditCard },
                  { id: 'pix', name: 'PIX', icon: Zap },
                  { id: 'boleto', name: 'Boleto', icon: Shield }
                ].map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-3 ${
                      paymentMethod === id
                        ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                        : 'border-gray-700 hover:border-yellow-400/50 text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{name}</span>
                  </button>
                ))}
              </div>

              {/* Benefits Highlight */}
              <div className="bg-black border border-yellow-400/20 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Gift className="w-6 h-6 text-yellow-400" />
                  <span className="font-bold text-white">Benefícios Exclusivos do Plano Revendedor:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: TrendingUp, text: 'Comissões de até 30%' },
                    { icon: Sparkles, text: 'Dashboard avançado' },
                    { icon: Crown, text: 'Suporte prioritário' },
                    { icon: Zap, text: 'Material promocional' }
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300 text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-bold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleSubscribe}
              disabled={isProcessing || (isReseller && selectedPlan.type === 'reseller')}
              className={`flex-1 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : isReseller && selectedPlan.type === 'reseller'
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : selectedPlan.price === 0
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-black'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : isReseller && selectedPlan.type === 'reseller' ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Plano Ativo</span>
                </>
              ) : selectedPlan.price === 0 ? (
                <span>Continuar Grátis</span>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  <span>Assinar por {formatPrice(selectedPlan.price)}/mês</span>
                </>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Ao assinar, você concorda com nossos{' '}
            <a href="#" className="text-yellow-400 hover:underline">Termos de Serviço</a>
            {' '}e{' '}
            <a href="#" className="text-yellow-400 hover:underline">Política de Privacidade</a>.
            Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  )
}