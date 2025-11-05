import { useState } from 'react'

export function useSubscription() {
  const [isReseller, setIsReseller] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('kaza-reseller') || 'false')
    }
    return false
  })

  const subscribeToPlan = async (planType: 'free' | 'reseller', paymentMethod: string) => {
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (planType === 'reseller') {
      setIsReseller(true)
      localStorage.setItem('kaza-reseller', JSON.stringify(true))
    }
    
    return { success: true }
  }

  return {
    isReseller,
    subscribeToPlan
  }
}