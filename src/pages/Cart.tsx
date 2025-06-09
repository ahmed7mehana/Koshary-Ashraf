
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 arabic-font">محتاج تسجل دخولك الأول</h1>
          <Link to="/menu">
            <Button className="arabic-font">ارجع للقائمة</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4 arabic-font">سلة التسوق فارغة</h1>
          <p className="text-gray-600 mb-8 arabic-font">ضيف أصناف من القائمة عشان تبدأ طلبك</p>
          <Link to="/menu">
            <Button size="lg" className="arabic-font">تصفح القائمة</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 arabic-font">
            سلة التسوق
          </h1>
          <p className="text-gray-600 arabic-font">
            راجع طلبك قبل إتمام الشراء
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold arabic-font">
                          {item.nameAr}
                        </h3>
                        <p className="text-sm text-gray-500">{item.name}</p>
                        <p className="text-lg font-bold text-primary mt-1">
                          {item.price * item.quantity} جنيه
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {/* Clear Cart Button */}
            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full arabic-font text-red-600 hover:text-red-700"
            >
              إفراغ السلة
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="arabic-font">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="arabic-font">عدد الأصناف:</span>
                  <span>{state.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="arabic-font">المجموع الفرعي:</span>
                  <span>{state.total} جنيه</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="arabic-font">رسوم التوصيل:</span>
                  <span className="text-green-600 arabic-font">عند التوصيل</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className="arabic-font">المجموع الكلي:</span>
                  <span>{state.total} جنيه</span>
                </div>
                
                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full arabic-font">
                    إتمام الطلب
                  </Button>
                </Link>
                
                <Link to="/menu" className="block">
                  <Button variant="outline" size="lg" className="w-full arabic-font">
                    إضافة أصناف أخرى
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
