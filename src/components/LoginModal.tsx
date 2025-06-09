import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "مرحباً بك",
          description: "تم تسجيل الدخول بنجاح",
        });
      } else {
        await register(formData.name, formData.email, formData.password, formData.phone);
        toast({
          title: "مرحباً بك",
          description: "تم إنشاء الحساب بنجاح",
        });
      }
      onClose();
      setFormData({ name: '', email: '', password: '', phone: '' });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ ما",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="border-none shadow-2xl">
            <CardHeader className="relative pb-4">
              <CardTitle className="arabic-font text-center text-2xl font-bold text-primary">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 hover:bg-gray-100"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="arabic-font text-sm font-medium">الاسم</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="text-right h-10"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="arabic-font text-sm font-medium">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="text-left h-10"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="arabic-font text-sm font-medium">كلمة المرور</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="text-left h-10"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="arabic-font text-sm font-medium">رقم الهاتف (اختياري)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="text-left h-10"
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-10 arabic-font bg-primary hover:bg-primary/90 text-white font-medium" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? 'دخول' : 'إنشاء حساب'}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="arabic-font text-sm text-primary hover:text-primary/90"
                >
                  {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل دخولك'}
                </Button>
              </div>
              
              {/* Demo accounts */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2 arabic-font">للتجربة السريعة:</p>
                <div className="space-y-1 text-xs">
                  <p><strong>عميل:</strong> user@demo.com / 123456</p>
                  <p><strong>إدارة:</strong> admin@koshary.com / admin123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
