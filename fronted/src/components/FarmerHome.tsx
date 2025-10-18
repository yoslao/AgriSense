import { useState } from 'react'
import { Screen, Order } from '../App'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { 
  Camera, 
  Package, 
  ShoppingBag, 
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react'

interface FarmerHomeProps {
  onNavigate: (screen: Screen) => void
  orders: Order[]
}

export function FarmerHome({ onNavigate, orders }: FarmerHomeProps) {
  const [showPublishForm, setShowPublishForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    description: ''
  })

  const handlePublishProduct = () => {
    // Aquí se publicaría el producto
    setShowPublishForm(false)
    setNewProduct({ name: '', price: '', quantity: '', category: '', description: '' })
  }

  const recentOrders = orders.slice(-3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Panel de Agricultor</h1>
                <p className="text-sm text-gray-600">Gestiona tus productos y pedidos</p>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('welcome')}
              variant="outline"
            >
              Cambiar usuario
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Ventas hoy</p>
                      <p className="text-2xl font-semibold">S/ 450</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Pedidos activos</p>
                      <p className="text-2xl font-semibold">{orders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Clientes únicos</p>
                      <p className="text-2xl font-semibold">23</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Publicar producto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Publicar Producto</span>
                </CardTitle>
                <CardDescription>
                  Agrega un nuevo producto a tu catálogo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showPublishForm ? (
                  <Button 
                    onClick={() => setShowPublishForm(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-name">Nombre del producto</Label>
                        <Input
                          id="product-name"
                          placeholder="ej. Tomates cherry"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-category">Categoría</Label>
                        <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verduras">Verduras</SelectItem>
                            <SelectItem value="frutas">Frutas</SelectItem>
                            <SelectItem value="semillas">Semillas</SelectItem>
                            <SelectItem value="tuberculos">Tubérculos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-price">Precio por kg (S/)</Label>
                        <Input
                          id="product-price"
                          type="number"
                          placeholder="0.00"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-quantity">Cantidad disponible (kg)</Label>
                        <Input
                          id="product-quantity"
                          type="number"
                          placeholder="0"
                          value={newProduct.quantity}
                          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="product-description">Descripción</Label>
                      <Textarea
                        id="product-description"
                        placeholder="Describe tu producto (origen, características, etc.)"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        onClick={handlePublishProduct}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Publicar Producto
                      </Button>
                      <Button 
                        onClick={() => setShowPublishForm(false)}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pedidos recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Pedidos Recientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay pedidos recientes</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Pedido #{order.id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">
                              {order.products.length} productos • S/ {order.total.toFixed(2)}
                            </p>
                          </div>
                          <Badge 
                            variant={order.status === 'pending' ? 'secondary' : 'default'}
                          >
                            {order.status === 'pending' ? 'Pendiente' : 
                             order.status === 'confirmed' ? 'Confirmado' :
                             order.status === 'in-transit' ? 'En tránsito' : 'Entregado'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Entrega estimada: {order.estimatedDelivery}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Hace 2 horas
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}