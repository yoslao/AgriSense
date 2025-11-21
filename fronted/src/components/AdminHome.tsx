import { useState } from 'react'
import { Screen, Order } from '../App'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { 
  Shield, 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Trash2,
  BarChart3
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

interface AdminHomeProps {
  onNavigate: (screen: Screen) => void
  orders: Order[]
}

// Datos mock para usuarios
const mockUsers = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', type: 'Agricultor', status: 'active', joined: '2024-01-15', orders: 45 },
  { id: '2', name: 'María García', email: 'maria@example.com', type: 'Consumidor', status: 'active', joined: '2024-02-20', orders: 12 },
  { id: '3', name: 'Carlos López', email: 'carlos@example.com', type: 'Agricultor', status: 'active', joined: '2024-01-10', orders: 67 },
  { id: '4', name: 'Ana Martínez', email: 'ana@example.com', type: 'Consumidor', status: 'suspended', joined: '2024-03-05', orders: 3 },
  { id: '5', name: 'Pedro Ramírez', email: 'pedro@example.com', type: 'Agricultor', status: 'active', joined: '2024-02-01', orders: 23 },
  { id: '6', name: 'Laura Sánchez', email: 'laura@example.com', type: 'Consumidor', status: 'active', joined: '2024-03-15', orders: 8 },
]

// Datos mock para productos
const mockProducts = [
  { id: '1', name: 'Papa Blanca', category: 'Tubérculos', price: 1.20, stock: 5000, farmer: 'Juan Pérez', status: 'active' },
  { id: '2', name: 'Quinua', category: 'Granos', price: 8.50, stock: 2000, farmer: 'Carlos López', status: 'active' },
  { id: '3', name: 'Maíz Morado', category: 'Granos', price: 2.80, stock: 3000, farmer: 'Pedro Ramírez', status: 'active' },
  { id: '4', name: 'Camote', category: 'Tubérculos', price: 1.50, stock: 0, farmer: 'Juan Pérez', status: 'out_of_stock' },
  { id: '5', name: 'Arroz', category: 'Granos', price: 3.20, stock: 8000, farmer: 'Carlos López', status: 'active' },
  { id: '6', name: 'Frijol', category: 'Legumbres', price: 4.50, stock: 1500, farmer: 'Pedro Ramírez', status: 'active' },
]

// Datos para gráficos
const salesData = [
  { month: 'Ene', ventas: 45000, pedidos: 120 },
  { month: 'Feb', ventas: 52000, pedidos: 145 },
  { month: 'Mar', ventas: 48000, pedidos: 130 },
  { month: 'Abr', ventas: 61000, pedidos: 170 },
  { month: 'May', ventas: 58000, pedidos: 160 },
  { month: 'Jun', ventas: 67000, pedidos: 185 },
]

const categoryData = [
  { name: 'Tubérculos', value: 35, color: '#10b981' },
  { name: 'Granos', value: 30, color: '#3b82f6' },
  { name: 'Legumbres', value: 20, color: '#f59e0b' },
  { name: 'Otros', value: 15, color: '#8b5cf6' },
]

export function AdminHome({ onNavigate, orders }: AdminHomeProps) {
  const [users, setUsers] = useState(mockUsers)
  const [products, setProducts] = useState(mockProducts)

  const handleLogout = () => {
    onNavigate('welcome')
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' } 
        : user
    ))
  }

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
  }

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1>Panel de Administración</h1>
              <p className="text-purple-100 text-sm">AgriSense</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-purple-700"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalUsers}</div>
              <p className="text-xs text-gray-500">
                {activeUsers} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalProducts}</div>
              <p className="text-xs text-gray-500">
                En catálogo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Pedidos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalOrders}</div>
              <p className="text-xs text-gray-500">
                Este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">S/ {totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12.5% vs mes anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Pedidos
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas Mensuales</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ventas" fill="#8b5cf6" name="Ventas (S/)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pedidos por Mes</CardTitle>
                  <CardDescription>Tendencia de pedidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="pedidos" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Pedidos"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categorías Más Vendidas</CardTitle>
                  <CardDescription>Distribución por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // label={({ name, percent }) => 
                        //     `${name} ${(percent * 100).toFixed(0)}%`
                        // }
                        label={(props) => {
                            const name = (props as any).name ?? "";
                            const rawPercent = (props as any).percent;
                            const percent = typeof rawPercent === "number" ? rawPercent : Number(rawPercent) || 0;
                            return `${name} ${(percent * 100).toFixed(0)}%`;
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Nuevo pedido #1234</p>
                        <p className="text-xs text-gray-500">Hace 5 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Nuevo usuario registrado</p>
                        <p className="text-xs text-gray-500">Hace 15 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <Package className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Producto actualizado</p>
                        <p className="text-xs text-gray-500">Hace 1 hora</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-orange-100 p-2 rounded-full mr-3">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Ventas aumentaron 15%</p>
                        <p className="text-xs text-gray-500">Hace 2 horas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Administra agricultores y consumidores de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell className="text-gray-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.type === 'Agricultor' ? 'default' : 'secondary'}>
                            {user.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'destructive'}
                            className={user.status === 'active' ? 'bg-green-600' : ''}
                          >
                            {user.status === 'active' ? 'Activo' : 'Suspendido'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell className="text-gray-600">{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? (
                                <Ban className="h-4 w-4 text-orange-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente
                                    el usuario {user.name} de la plataforma.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Productos</CardTitle>
                <CardDescription>
                  Administra el catálogo de productos de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio (S/)</TableHead>
                      <TableHead>Stock (kg)</TableHead>
                      <TableHead>Agricultor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>S/ {product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-600">{product.farmer}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.status === 'active' ? 'default' : 'destructive'}
                            className={product.status === 'active' ? 'bg-green-600' : ''}
                          >
                            {product.status === 'active' ? 'Disponible' : 'Agotado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente
                                    el producto {product.name} del catálogo.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteProduct(product.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Pedidos</CardTitle>
                <CardDescription>
                  Monitorea y administra todos los pedidos de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay pedidos registrados aún</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pedido</TableHead>
                        <TableHead>Agricultor</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Total (S/)</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Entrega</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id.substring(0, 12)}...
                          </TableCell>
                          <TableCell>{order.farmer}</TableCell>
                          <TableCell>{order.products.length} items</TableCell>
                          <TableCell>S/ {order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                order.status === 'delivered' ? 'default' : 
                                order.status === 'in-transit' ? 'secondary' : 
                                'outline'
                              }
                              className={
                                order.status === 'delivered' ? 'bg-green-600' :
                                order.status === 'in-transit' ? 'bg-blue-600' :
                                order.status === 'confirmed' ? 'bg-orange-600' :
                                'bg-gray-600'
                              }
                            >
                              {order.status === 'delivered' ? 'Entregado' :
                               order.status === 'in-transit' ? 'En Camino' :
                               order.status === 'confirmed' ? 'Confirmado' :
                               'Pendiente'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {order.estimatedDelivery}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}