import { useState } from 'react'
import { WelcomeScreen } from './components/WelcomeScreen'
import { LoginScreen } from './components/LoginScreen'
import { FarmerHome } from './components/FarmerHome'
import { ConsumerHome } from './components/ConsumerHome'
import { CartAndTracking } from './components/CartAndTracking'
import { AdminHome } from './components/AdminHome'

export type UserType = 'farmer' | 'consumer' | 'admin' | null
export type Screen = 'welcome' | 'login' | 'farmer-home' | 'consumer-home' | 'cart' | 'admin-home'

export interface Product {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image: string
  farmer: string
  location: string
  rating?: number
}

export interface CartItem extends Product {
  cartQuantity: number
}

export interface Order {
  id: string
  products: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered'
  farmer: string
  estimatedDelivery: string
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [userType, setUserType] = useState<UserType>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, cartQuantity: quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, cartQuantity: quantity } : item
      )
    )
  }

  const goToCart = () => {
    setCurrentScreen('cart')
  }

  const createOrder = (cartItems: CartItem[], paymentMethod: string) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      products: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0),
      status: 'pending',
      farmer: cartItems[0]?.farmer || 'Agricultor',
      estimatedDelivery: '30 minutos'
    }
    setOrders(prev => [...prev, newOrder])
    setCart([])
    return newOrder
  }

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const selectUserType = (type: UserType) => {
    setUserType(type)
    setCurrentScreen('login')
  }

  const handleLoginSuccess = () => {
    if (userType === 'farmer') {
      setCurrentScreen('farmer-home')
    } else if (userType === 'consumer') {
      setCurrentScreen('consumer-home')
    } else if (userType === 'admin') {
      setCurrentScreen('admin-home')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onSelectUserType={selectUserType} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen 
          userType={userType}
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}
      
      {currentScreen === 'farmer-home' && (
        <FarmerHome 
          onNavigate={navigateToScreen}
          orders={orders}
        />
      )}
      
      {currentScreen === 'consumer-home' && (
        <ConsumerHome 
          onNavigate={navigateToScreen}
          onAddToCart={addToCart}
          cart={cart}
          onGoToCart={goToCart}
        />
      )}
      
      {currentScreen === 'cart' && (
        <CartAndTracking 
          cart={cart}
          orders={orders}
          onNavigate={navigateToScreen}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCreateOrder={createOrder}
        />
      )}

      {currentScreen === 'admin-home' && (
        <AdminHome 
          onNavigate={navigateToScreen}
          orders={orders}
        />
      )}
    </div>
  )
}
