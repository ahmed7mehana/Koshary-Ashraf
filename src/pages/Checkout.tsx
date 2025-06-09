import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { branches } from '@/data/menuData';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin } from 'lucide-react';

const Checkout = () => {
  const [orderData, setOrderData] = useState({
    deliveryMethod: 'delivery',
    address: '',
    phone: '',
    notes: '',
    selectedBranch: branches[0].id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to create order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = Date.now().toString();
      
      // Store order in localStorage (replace with actual API call)
      const order = {
        id: orderId,
        userId: user?.id,
        items: state.items,
        total: state.total,
        customerInfo: {
          name: user?.name,
          email: user?.email,
          phone: orderData.phone || user?.phone,
          address: orderData.address
        },
        deliveryMethod: orderData.deliveryMethod,
        selectedBranch: orderData.selectedBranch,
        notes: orderData.notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      clearCart();
      
      toast({
        title: "تم إنشاء الطلب بنجاح",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب",
      });
      
      navigate(`/invoice/${orderId}`);
    } catch (error) {
      toast({
        title: "خطأ في إنشاء الطلب",
        description: "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 arabic-font">
            إتمام الطلب
          </h1>
          <p className="text-gray-600 arabic-font">
            أدخل بياناتك لإتمام الطلب
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic-font">معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="arabic-font">الاسم</Label>
                      <Input value={user?.name || ''} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label className="arabic-font">البريد الإلكتروني</Label>
                      <Input value={user?.email || ''} disabled className="bg-gray-50" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="arabic-font">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orderData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder={user?.phone || "01xxxxxxxxx"}
                      required
                      dir="ltr"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic-font">طريقة الاستلام</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={orderData.deliveryMethod}
                    onValueChange={(value) => handleChange('deliveryMethod', value)}
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="arabic-font">توصيل للمنزل  </Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="arabic-font">استلام من الفرع</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Branch Selection (for pickup) */}
              {orderData.deliveryMethod === 'pickup' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="arabic-font">اختيار الفرع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={orderData.selectedBranch}
                      onValueChange={(value) => handleChange('selectedBranch', value)}
                    >
                      {branches.map((branch) => (
                        <div key={branch.id} className="flex items-start space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem value={branch.id} id={branch.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={branch.id} className="arabic-font font-medium">
                              {branch.nameAr}
                            </Label>
                            <p className="text-sm text-gray-600 arabic-font mt-1">
                              {branch.addressAr}
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Address (for delivery) */}
              {orderData.deliveryMethod === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="arabic-font">عنوان التوصيل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="address" className="arabic-font">العنوان بالتفصيل</Label>
                      <Textarea
                        id="address"
                        value={orderData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="أدخل العنوان بالتفصيل مع رقم الشقة والدور"
                        required={orderData.deliveryMethod === 'delivery'}
                        className="arabic-font text-right"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="arabic-font">ملاحظات إضافية</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={orderData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="أي ملاحظات خاصة بالطلب..."
                    className="arabic-font text-right"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="arabic-font">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="arabic-font">
                          {item.nameAr} × {item.quantity}
                        </span>
                        <span>{item.price * item.quantity} جنيه</span>
                      </div>
                    ))}
                  </div>
                  
                  <hr />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="arabic-font">المجموع الفرعي:</span>
                      <span>{state.total} جنيه</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="arabic-font">رسوم التوصيل:</span>
                      <span className="text-green-600 arabic-font"> عند التوصيل </span>
                    </div>  
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="arabic-font">المجموع الكلي:</span>
                      <span>{state.total} جنيه</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full arabic-font"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    تأكيد الطلب
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center arabic-font">
                    الدفع عند الاستلام
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
