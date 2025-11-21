import { UserType } from '../App'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Sprout, ShoppingCart, Shield } from 'lucide-react'

interface WelcomeScreenProps {
  onSelectUserType: (type: UserType) => void
}

export function WelcomeScreen({ onSelectUserType }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4 bg-[rgba(177,59,59,0)]">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Sprout className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AgriSense</h1>
          <p className="text-gray-600 mt-2">Conectando agricultores con consumidores</p>
        </div>

        {/* Botones de selección de tipo de usuario */}
        <Card>
          <CardHeader>
            <CardTitle>¿Cómo quieres usar AgriSense?</CardTitle>
            <CardDescription>
              Selecciona tu perfil para acceder a las funciones correspondientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => onSelectUserType('farmer')}
              className="w-full h-16 bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <div className="flex items-center space-x-3">
                <Sprout className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">Soy Agricultor</div>
                  <div className="text-sm opacity-90">Vende tus productos directamente</div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => onSelectUserType('consumer')}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">Soy Consumidor</div>
                  <div className="text-sm opacity-90">Compra productos frescos y locales</div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => onSelectUserType('admin')}
              className="w-full h-16 bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">Soy Administrador</div>
                  <div className="text-sm opacity-90">Gestiona y administra la plataforma</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}