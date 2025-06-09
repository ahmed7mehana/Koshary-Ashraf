import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { menuCategories as defaultCategories, menuItems as defaultMenuItems, MenuItem } from '@/data/menuData';
import { Plus, Minus, ShoppingCart, User, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoginModal from '@/components/LoginModal';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  nameAr: string;
  emoji: string;
}

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('appetizers');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showLogin, setShowLogin] = useState(false);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [allCategories, setAllCategories] = useState<Category[]>(defaultCategories);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load custom menu items and categories from localStorage
    const customItems = localStorage.getItem('customMenuItems');
    const customCategories = localStorage.getItem('customCategories');

    if (customItems) {
      const parsedCustomItems = JSON.parse(customItems);
      setAllMenuItems([...defaultMenuItems, ...parsedCustomItems]);
    }

    if (customCategories) {
      const parsedCustomCategories = JSON.parse(customCategories);
      setAllCategories([...defaultCategories, ...parsedCustomCategories]);
    }
  }, []);

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const addToCart = (item: MenuItem) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const quantity = quantities[item.id] || 1;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        name: item.name,
        nameAr: item.nameAr,
        price: item.price,
        category: item.category
      });
    }

    toast({
      title: "تم إضافة الصنف",
      description: `تم إضافة ${item.nameAr} إلى سلة التسوق`,
    });

    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  const filteredItems = allMenuItems.filter(item => item.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12 bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-primary to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <img src="../public/image/logo.jpg" alt="logo" className="w-12 h-12 rounded-full" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4 arabic-font"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            قائمة كشري اشرف
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 arabic-font max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            اختار من أشهى الأطباق المصرية الأصيلة • طعم أصيل منذ 1970
          </motion.p>
          <motion.div
            className="flex items-center justify-center mt-4 space-x-2 rtl:space-x-reverse"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.8 + star * 0.1, duration: 0.4 }}
              >
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </motion.div>
            ))}
            <span className="text-gray-600 arabic-font mr-2">تقييم ممتاز من عملائنا</span>
          </motion.div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`arabic-font px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${selectedCategory === category.id
                  ? 'shadow-lg'
                  : 'hover:shadow-md'
                  }`}
              >
                <span className="text-xl mr-2">{category.emoji}</span>
                {category.nameAr}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Menu Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover="hover"
                layout
              >

                <Card className="group overflow-hidden shadow-lg transition-all duration-300 bg-white rounded-2xl border-0 h-full">
                  {/* image if we need in the futuer */}
                  {/* <motion.div
                    className="aspect-video bg-gradient-to-br from-primary/10 to-red-100 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-6xl opacity-50"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        🍛
                      </motion.span>
                    </div>
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge className="bg-primary/90 text-white arabic-font">
                        جديد
                      </Badge>
                    </motion.div>
                  </motion.div> */}

                  <CardHeader className="pb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <CardTitle className="arabic-font text-right text-xl mb-2">
                        {item.nameAr}
                      </CardTitle>
                      <div className="flex justify-between items-center">
                        <motion.span
                          className="text-3xl font-bold text-primary"
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.price} <span className="text-lg arabic-font">جنيه</span>
                        </motion.span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {item.name}
                        </span>
                      </div>
                      {item.descriptionAr && (
                        <p className="text-gray-600 arabic-font text-sm mt-2">
                          {item.descriptionAr}
                        </p>
                      )}
                    </motion.div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-3 rtl:space-x-reverse bg-gray-50 rounded-full p-1">
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={!quantities[item.id]}
                            className="h-8 w-8 rounded-full"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </motion.div>
                        <motion.span
                          className="w-8 text-center font-bold text-lg"
                          key={quantities[item.id] || 1}
                          initial={{ scale: 1.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {quantities[item.id] || 1}
                        </motion.span>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 rounded-full"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      </div>

                      {/* Add to Cart Button */}
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                          onClick={() => addToCart(item)}
                          className="arabic-font px-6 py-2 rounded-full shadow-lg transition-all duration-300"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          إضافة للسلة
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🍽️
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-600 arabic-font mb-2">
              لا توجد أصناف في هذه الفئة حالياً
            </h3>
            <p className="text-gray-500 arabic-font">جرب فئة أخرى أو تواصل معنا</p>
          </motion.div>
        )}

        {/* Login Prompt for Guests */}
        {!user && (
          <motion.div
            className="mt-16 text-center bg-gradient-to-br from-primary/5 to-red-50 rounded-2xl p-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <User className="h-16 w-16 mx-auto mb-6 text-primary" />
            </motion.div>
            <h3 className="text-2xl font-semibold mb-4 arabic-font">
              سجل دخولك عشان تقدر تطلب
            </h3>
            <p className="text-gray-600 mb-6 arabic-font text-lg">
              محتاج تسجل دخولك الأول عشان تقدر تضيف الأكل لسلة التسوق وتستمتع بخدماتنا
            </p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                onClick={() => setShowLogin(true)}
                className="arabic-font px-8 py-3 text-lg rounded-full shadow-lg"
              >
                سجل دخولك الآن
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <Footer />

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </motion.div>
  );
};

export default Menu;
