import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Printer, Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { branches } from '@/data/menuData';

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

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Get order from localStorage (replace with actual API call)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const getBranchInfo = (branchId: string) => {
    return branches.find(b => b.id === branchId) || branches[0];
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 arabic-font">الطلب غير موجود</h1>
          <Link to="/orders">
            <Button className="arabic-font">عرض طلباتي</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const branchInfo = getBranchInfo(order.selectedBranch || '');

  return (
    <div className="min-h-screen bg-background">
      <div className="no-print">
        <Header />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 no-print"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2 arabic-font">
            تم إنشاء الطلب بنجاح
          </h1>
          <p className="text-gray-600 arabic-font">
            رقم الطلب: {order.id}
          </p>
        </motion.div>

        {/* Print Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-8 no-print">
          <Button onClick={handlePrint} className="arabic-font">
            <Printer className="h-4 w-4 mr-2" />
            طباعة الفاتورة
          </Button>
          <Link to="/orders">
            <Button variant="outline" className="arabic-font">
              <ArrowLeft className="h-4 w-4 mr-2" />
              طلباتي
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" className="arabic-font">
              طلب جديد
            </Button>
          </Link>
        </div>

        {/* Invoice */}
        <Card className="invoice-container">
          <CardHeader className="text-center border-b">
            <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">👨‍🍳</span>
              </div>
              <div className="arabic-font">
                <h2 className="text-2xl font-bold text-primary">كشري اشرف </h2>
                <p className="text-sm text-gray-600">منذ ١٩٧٠</p>
              </div>
            </div>
            
            <div className="text-sm">
              <p className="font-semibold arabic-font">فاتورة رقم: <span className="font-bold">{order.id}</span></p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-3 arabic-font">معلومات العميل:</h3>
                <div className="space-y-1 text-sm">
                  <p><strong className="arabic-font">الاسم:</strong> {order.customerInfo.name}</p>
                </div>
              </div>
              
              <div >
                <h3 className="font-semibold mb-3 arabic-font">معلومات الطلب:</h3>
                <div className="space-y-1 text-sm flex flex-row justify-center items-center">
                  <p><strong className="arabic-font mr-5">التاريخ:</strong> {orderDate.toLocaleDateString('ar-EG')}</p>
                  <p><strong className="arabic-font mr-5">طريقة الاستلام:</strong> 
                    <span className="arabic-font"> {order.deliveryMethod === 'delivery' ? 'توصيل' : 'استلام من الفرع'}</span>
                  </p>
                  {order.deliveryMethod === 'pickup' && (
                    <p><strong className="arabic-font">الفرع:</strong> {branchInfo.nameAr}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-bold mb-1 arabic-font text-center">تفاصيل الطلب:</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-right py-2 arabic-font">الصنف</th>
                      <th className="text-center py-2 arabic-font">الكمية</th>
                      <th className="text-center py-2 arabic-font">السعر</th>
                      <th className="text-center py-2 arabic-font">المجموع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 arabic-font">{item.nameAr}</td>
                        <td className="text-center py-2">{item.quantity}</td>
                        <td className="text-center py-2">{item.price} جنيه</td>
                        <td className="text-center py-2">{item.price * item.quantity} جنيه</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="arabic-font">المجموع الفرعي:</span>
                <span>{order.total} جنيه</span>
              </div>
              {order.deliveryMethod === 'delivery' && (
                <div className="flex justify-between items-center mb-2">
                  <span className="arabic-font">رسوم التوصيل:</span>
                  <span>15 جنيه</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="arabic-font">المجموع الكلي:</span>
                <span>{order.deliveryMethod === 'delivery' ? order.total + 15 : order.total} جنيه</span>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2 arabic-font">ملاحظات:</h3>
                <p className="text-sm text-gray-600 arabic-font">{order.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
              <p className="arabic-font">شكراً لاختياركم كشري الشرف</p>
              <p className="arabic-font">نتطلع لخدمتكم مرة أخرى</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
};

export default Invoice;
