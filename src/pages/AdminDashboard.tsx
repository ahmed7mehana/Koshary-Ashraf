import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MenuManagement from '@/components/MenuManagement';
import { Receipt, Package, Clock, CheckCircle, Printer, Search, Settings, Menu, BarChart3, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    image: string;
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

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(allOrders.sort((a: Order, b: Order) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.phone.includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    toast({
      title: "تم تحديث حالة الطلب",
      description: `تم تغيير حالة الطلب ${orderId}`,
    });
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    toast({
      title: "تم حذف الطلب",
      description: `تم حذف الطلب ${orderId}`,
    });
  };

  const printOrder = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>طلب رقم ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .order-info { margin-bottom: 20px; }
              .items-table { width: 100%; border-collapse: collapse; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>كشري اشرف</h1>
              <p>طلب رقم: ${order.id}</p>
              <p>التاريخ: ${new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
            
            <div class="order-info">
              <h3>معلومات العميل:</h3>
              <p>الاسم: ${order.customerInfo.name}</p>
              <p>الهاتف: ${order.customerInfo.phone}</p>
              ${order.customerInfo.address ? `<p>العنوان: ${order.customerInfo.address}</p>` : ''}
            </div>
            
            <h3>الأصناف المطلوبة:</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>الصنف</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.nameAr}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price} جنيه</td>
                    <td>${item.price * item.quantity} جنيه</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              <p>المجموع الكلي: ${order.total} جنيه</p>
            </div>
            
            ${order.notes ? `<div><h3>ملاحظات:</h3><p>${order.notes}</p></div>` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

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

  const getOrderStats = () => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const preparing = orders.filter(o => o.status === 'preparing').length;
    const ready = orders.filter(o => o.status === 'ready').length;
    const total = orders.reduce((sum, o) => sum + o.total, 0);

    return { pending, preparing, ready, total };
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 arabic-font">غير مصرح لك بالدخول</h1>
          <Button onClick={() => window.history.back()} className="arabic-font">
            العودة
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 arabic-font">
            لوحة التحكم - كشري اشرف
          </h1>
          <p className="text-gray-600 arabic-font">
            إدارة شاملة للمطعم والطلبات
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="arabic-font">
              <BarChart3 className="h-4 w-4 mr-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="orders" className="arabic-font">
              <Package className="h-4 w-4 mr-2" />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="menu" className="arabic-font">
              <Menu className="h-4 w-4 mr-2" />
              القائمة
            </TabsTrigger>

          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 arabic-font">طلبات جديدة</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <Clock className="h-10 w-10 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 arabic-font">قيد التحضير</p>
                      <p className="text-3xl font-bold text-orange-600">{stats.preparing}</p>
                    </div>
                    <Package className="h-10 w-10 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 arabic-font">جاهز للاستلام</p>
                      <p className="text-3xl font-bold text-green-600">{stats.ready}</p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 arabic-font">إجمالي المبيعات</p>
                      <p className="text-3xl font-bold text-primary">{stats.total} جنيه</p>
                    </div>
                    <Receipt className="h-10 w-10 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="arabic-font">آخر الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium arabic-font">طلب #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.total} جنيه</p>
                        <Badge variant="secondary">
                          {getStatusInfo(order.status).label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <Input
                      placeholder="البحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="arabic-font"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="فلترة حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الطلبات</SelectItem>
                      <SelectItem value="pending">قيد المراجعة</SelectItem>
                      <SelectItem value="confirmed">مؤكد</SelectItem>
                      <SelectItem value="preparing">قيد التحضير</SelectItem>
                      <SelectItem value="ready">جاهز للاستلام</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 arabic-font">لا توجد طلبات تطابق البحث</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  const orderDate = new Date(order.createdAt);

                  return (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <CardTitle className="arabic-font">
                              طلب رقم {order.id}
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                              {order.customerInfo.name} - {order.customerInfo.phone}
                            </p>
                            <p className="text-xs text-gray-500">
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
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          {/* Order Details */}
                          <div className="lg:col-span-2">
                            <h4 className="font-semibold mb-2 arabic-font">الأصناف:</h4>
                            <div className="text-sm space-y-1">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                  <span className="arabic-font">{item.nameAr} × {item.quantity}</span>
                                  <span>{item.price * item.quantity} جنيه</span>
                                </div>
                              ))}
                            </div>

                            {order.notes && (
                              <div className="mt-3">
                                <h4 className="font-semibold mb-1 arabic-font">ملاحظات:</h4>
                                <p className="text-sm text-gray-600 arabic-font">{order.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Customer Info */}
                          <div>
                            <h4 className="font-semibold mb-2 arabic-font">معلومات العميل:</h4>
                            <div className="text-sm space-y-1">
                              <p><span className="arabic-font">الاسم:</span> {order.customerInfo.name}</p>
                              <p><span className="arabic-font">الهاتف:</span> {order.customerInfo.phone}</p>
                              <p><span className="arabic-font">النوع:</span>
                                <span className="arabic-font"> {order.deliveryMethod === 'delivery' ? 'توصيل' : 'استلام'}</span>
                              </p>
                              {order.customerInfo.address && (
                                <p><span className="arabic-font">العنوان:</span> {order.customerInfo.address}</p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2">
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">قيد المراجعة</SelectItem>
                                <SelectItem value="confirmed">مؤكد</SelectItem>
                                <SelectItem value="preparing">قيد التحضير</SelectItem>
                                <SelectItem value="ready">جاهز للاستلام</SelectItem>
                                <SelectItem value="completed">مكتمل</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => printOrder(order)}
                              className="w-full arabic-font"
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              طباعة الطلب
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>


        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
