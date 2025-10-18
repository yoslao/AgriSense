import { useState } from 'react'
import { Screen, Product, CartItem } from '../App'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { 
  Search,
  ShoppingCart,
  Star,
  MapPin,
  Plus,
  User,
  Filter,
  Leaf,
  Apple,
  Sprout
} from 'lucide-react'

interface ConsumerHomeProps {
  onNavigate: (screen: Screen) => void
  onAddToCart: (product: Product, quantity?: number) => void
  cart: CartItem[]
  onGoToCart: () => void
}

export function ConsumerHome({ onNavigate, onAddToCart, cart, onGoToCart }: ConsumerHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'Todos', icon: Filter },
    { id: 'verduras', name: 'Verduras', icon: Leaf },
    { id: 'frutas', name: 'Frutas', icon: Apple },
    { id: 'semillas', name: 'Semillas', icon: Sprout }
  ]

  const products: Product[] = [
    {
      id: 'prod-1',
      name: 'Tomates Cherry',
      price: 5.80,
      quantity: 500,
      category: 'verduras',
      image: 'https://images.unsplash.com/photo-1570543375343-63fe3d67761b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjB0b21hdG9lc3xlbnwxfHx8fDE3NTkyNTM2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      farmer: 'Juan Pérez',
      location: 'Majes, Arequipa',
      rating: 4.8
    },
    {
      id: 'prod-2',
      name: 'Lechugas Hidropónicas',
      price: 4.20,
      quantity: 800,
      category: 'verduras',
      image: 'https://images.unsplash.com/photo-1657411658279-e32af8636eb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxldHR1Y2V8ZW58MXx8fHwxNzU5MjEyOTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      farmer: 'María Quispe',
      location: 'La Joya, Arequipa',
      rating: 4.9
    },
    {
      id: 'prod-3',
      name: 'Papas Nativas',
      price: 2.80,
      quantity: 2000,
      category: 'verduras',
      image: 'https://images.unsplash.com/photo-1566068875111-71e356e0e6d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG9lcyUyMGhhcnZlc3R8ZW58MXx8fHwxNzU5MjUzNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      farmer: 'Carlos Mamani',
      location: 'Puno',
      rating: 4.7
    },
    {
      id: 'prod-4',
      name: 'Manzanas Rojas',
      price: 4.50,
      quantity: 1200,
      category: 'frutas',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBhcHBsZXN8ZW58MXx8fHwxNzU5MjIyMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      farmer: 'Ana Flores',
      location: 'Huacachina, Ica',
      rating: 4.6
    },
    {
      id: 'prod-5',
      name: 'Semillas de Quinoa',
      price: 9.50,
      quantity: 600,
      category: 'semillas',
      image: 'https://images.unsplash.com/photo-1722882270502-4758cbd78661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWlub2ElMjBzZWVkc3xlbnwxfHx8fDE3NTkxNTY0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      farmer: 'Roberto Silva',
      location: 'Cusco',
      rating: 4.9
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const cartItemsCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Mercado Mayorista</h1>
                <p className="text-sm text-gray-600">Venta al por mayor - Productos frescos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={onGoToCart}
                className="relative bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
              <Button 
                onClick={() => onNavigate('welcome')}
                variant="outline"
              >
                Cambiar usuario
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Búsqueda */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos, agricultores..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Productos individuales */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Productos Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <User className="h-4 w-4 mr-1" />
                      <span>{product.farmer}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{product.location}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-semibold">S/ {product.price.toFixed(2)}/kg</span>
                      <Badge variant={product.quantity > 10 ? 'default' : 'secondary'}>
                        {product.quantity} kg disponibles
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={product.quantity === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar al carrito
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}