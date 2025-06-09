import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Receipt, RotateCcw, Clock, CheckCircle, Package, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    nameAr: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  deliveryMethod: string;
  selectedBranch?: string;
  notes?: string;
  status: string;
  createdAt: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Get orders from localStorage (replace with actual API call)
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter((order: Order) => order.userId === user.id);
      setOrders(userOrders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  }, [user]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'قيد المراجعة', color: 'bg-yellow-500', icon: Clock };
      case 'confirmed':
        return { label: 'مؤكد', color: 'bg-blue-500', icon: CheckCircle };
      case 'preparing':
        return { label: 'قيد التحضير', color: 'bg-orange-500', icon: Package };
      case 'ready':
        return { label: 'جاهز للاستلام', color: 'bg-green-500', icon: CheckCircle };
      case 'completed':
        return { label: 'مكتمل', color: 'bg-green-600', icon: CheckCircle };
      default:
        return { label: 'غير معروف', color: 'bg-gray-500', icon: Clock };
    }
  };

  const reorder = (order: Order) => {
    order.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          nameAr: item.nameAr,
          price: item.price,
          category: 'reorder'
        });
      }
    });

    toast({
      title: "تم إضافة الطلب",
      description: "تم إضافة جميع الأصناف إلى سلة التسوق",
    });
  };

  const deleteOrder = (orderId: string) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.filter((order: Order) => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders.filter((order: Order) => order.userId === user.id));

    toast({
      title: "تم حذف الطلب",
      description: "تم حذف الطلب بنجاح",
    });
  };

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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Receipt className="h-24 w-24 mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4 arabic-font">لا توجد طلبات سابقة</h1>
          <p className="text-gray-600 mb-8 arabic-font">اطلب أول طلب لك واستمتع بأطيب كشري</p>
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 arabic-font">
            طلباتي
          </h1>
          <p className="text-gray-600 arabic-font">
            تاريخ طلباتك السابقة
          </p>
        </motion.div>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            const orderDate = new Date(order.createdAt);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <CardTitle className="arabic-font">
                          طلب رقم {order.id}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {orderDate.toLocaleDateString('ar-EG')} - {orderDate.toLocaleTimeString('ar-EG')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Badge className={`${statusInfo.color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          <span className="arabic-font">{statusInfo.label}</span>
                        </Badge>
                        <span className="text-lg font-bold">{order.total} جنيه</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold mb-3 arabic-font">الأصناف المطلوبة:</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span className="arabic-font">
                                {item.nameAr} × {item.quantity}
                              </span>
                              <span>{item.price * item.quantity} جنيه</span>
                            </div>
                          ))}
                        </div>
                        
                        {order.notes && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2 arabic-font">ملاحظات:</h4>
                            <p className="text-sm text-gray-600 arabic-font">{order.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col space-y-3">
                        <Link to={`/invoice/${order.id}`}>
                          <Button variant="outline" size="sm" className="w-full arabic-font">
                            <Receipt className="h-4 w-4 mr-2" />
                            عرض الفاتورة
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reorder(order)}
                          className="w-full arabic-font"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          إعادة الطلب
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteOrder(order.id)}
                          className="w-full arabic-font"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          حذف الطلب
                        </Button>
                        
                        <div className="text-xs text-gray-500 text-center arabic-font">
                          {order.deliveryMethod === 'delivery' ? 'توصيل للمنزل' : 'استلام من الفرع'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderHistory;
