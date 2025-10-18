import { useState } from "react";
import { Screen, CartItem, Order } from "../App";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Package,
} from "lucide-react";

interface CartAndTrackingProps {
  cart: CartItem[];
  orders: Order[];
  onNavigate: (screen: Screen) => void;
  onUpdateQuantity: (
    productId: string,
    quantity: number,
  ) => void;
  onRemoveItem: (productId: string) => void;
  onCreateOrder: (
    cartItems: CartItem[],
    paymentMethod: string,
  ) => Order;
}

export function CartAndTracking({
  cart,
  orders,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
  onCreateOrder,
}: CartAndTrackingProps) {
  const [activeTab, setActiveTab] = useState<"cart" | "orders">(
    "cart",
  );
  const [paymentMethod, setPaymentMethod] = useState("yape");
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0,
  );
  const deliveryFee = subtotal > 30 ? 0 : 5.0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length > 0) {
      const newOrder = onCreateOrder(cart, paymentMethod);
      setShowCheckout(false);
      setActiveTab("orders");
    }
  };

  const getOrderStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
          text: "Pendiente de confirmación",
        };
      case "confirmed":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: CheckCircle,
          text: "Confirmado",
        };
      case "in-transit":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: Truck,
          text: "En tránsito",
        };
      case "delivered":
        return {
          color: "bg-green-100 text-green-800",
          icon: Package,
          text: "Entregado",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          text: "Desconocido",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              onClick={() => onNavigate("consumer-home")}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>

            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  Mi Carrito
                </h1>
                <p className="text-sm text-gray-600">
                  Revisa y confirma tu pedido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            onClick={() => setActiveTab("cart")}
            variant={activeTab === "cart" ? "default" : "ghost"}
            className="relative"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Carrito
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                {cart.length}
              </Badge>
            )}
          </Button>
          <Button
            onClick={() => setActiveTab("orders")}
            variant={
              activeTab === "orders" ? "default" : "ghost"
            }
            className="relative"
          >
            <Package className="h-4 w-4 mr-2" />
            Mis Pedidos
            {orders.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs">
                {orders.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Carrito */}
        {activeTab === "cart" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Productos en el carrito */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Productos en tu carrito</CardTitle>
                  <CardDescription>
                    {cart.length} productos seleccionados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Tu carrito está vacío
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Agrega algunos productos para comenzar
                      </p>
                      <Button
                        onClick={() =>
                          onNavigate("consumer-home")
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Explorar productos
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />

                          <div className="flex-1">
                            <h4 className="font-medium">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.farmer} • {item.location}
                            </p>
                            <p className="text-sm font-medium">
                              S/ {item.price.toFixed(2)} / kg
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.id,
                                  item.cartQuantity - 1,
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.cartQuantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.id,
                                  item.cartQuantity + 1,
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-medium">
                              S/{" "}
                              {(
                                item.price * item.cartQuantity
                              ).toFixed(2)}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                onRemoveItem(item.id)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumen y checkout */}
            {cart.length > 0 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>S/ {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <span className="text-green-600">
                            Gratis
                          </span>
                        ) : (
                          `S/ ${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {subtotal < 30 && (
                      <Alert>
                        <AlertDescription className="text-sm">
                          Agrega S/ {(30 - subtotal).toFixed(2)}{" "}
                          más para envío gratis
                        </AlertDescription>
                      </Alert>
                    )}

                    <Separator />

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>S/ {total.toFixed(2)}</span>
                    </div>

                    <Button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Proceder al pago
                    </Button>
                  </CardContent>
                </Card>

                {/* Checkout */}
                {showCheckout && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Método de pago</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem
                            value="yape"
                            id="yape"
                          />
                          <Label
                            htmlFor="yape"
                            className="flex-1"
                          >
                            <div className="flex items-center justify-between">
                              <span>Yape</span>
                              <div className="bg-purple-100 px-2 py-1 rounded text-xs font-medium text-purple-700">
                                Instantáneo
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem
                            value="plin"
                            id="plin"
                          />
                          <Label
                            htmlFor="plin"
                            className="flex-1"
                          >
                            <div className="flex items-center justify-between">
                              <span>Plin</span>
                              <div className="bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-700">
                                Instantáneo
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem
                            value="card"
                            id="card"
                          />
                          <Label
                            htmlFor="card"
                            className="flex-1"
                          >
                            <div className="flex items-center justify-between">
                              <span>
                                Tarjeta de crédito/débito
                              </span>
                              <CreditCard className="h-4 w-4 text-gray-400" />
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>

                      <div className="flex space-x-3">
                        <Button
                          onClick={handleCheckout}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          Confirmar pedido
                        </Button>
                        <Button
                          onClick={() => setShowCheckout(false)}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pedidos */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Pedidos</CardTitle>
                <CardDescription>
                  Historial y seguimiento de tus pedidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes pedidos aún
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Realiza tu primer pedido para verlo aquí
                    </p>
                    <Button
                      onClick={() => setActiveTab("cart")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Ir al carrito
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const statusInfo = getOrderStatusInfo(
                        order.status,
                      );
                      const StatusIcon = statusInfo.icon;

                      return (
                        <div
                          key={order.id}
                          className="border rounded-lg p-6"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold">
                                Pedido #{order.id.slice(-8)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.products.length}{" "}
                                productos • S/{" "}
                                {order.total.toFixed(2)}
                              </p>
                            </div>
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.text}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">
                                  Desde
                                </p>
                                <p className="text-xs text-gray-600">
                                  Majes, Arequipa
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">
                                  Tiempo estimado
                                </p>
                                <p className="text-xs text-gray-600">
                                  {order.estimatedDelivery}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">
                                  Agricultor
                                </p>
                                <p className="text-xs text-gray-600">
                                  {order.farmer}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Progreso del pedido */}
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">
                                Pedido confirmado
                              </span>
                              <span className="text-xs text-gray-500">
                                En tránsito
                              </span>
                              <span className="text-xs text-gray-500">
                                Entregado
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width:
                                    order.status === "pending"
                                      ? "0%"
                                      : order.status ===
                                          "confirmed"
                                        ? "33%"
                                        : order.status ===
                                            "in-transit"
                                          ? "66%"
                                          : "100%",
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">
                              Productos:
                            </h4>
                            <div className="space-y-2">
                              {order.products.map(
                                (product, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-sm"
                                  >
                                    <span>
                                      {product.name} x
                                      {product.cartQuantity}
                                    </span>
                                    <span>
                                      S/{" "}
                                      {(
                                        product.price *
                                        product.cartQuantity
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}