
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock } from 'lucide-react';

const Index = () => {
  const branches = [
    {
      name: 'الهرم – شارع عماد',
      address: 'شارع عماد، بجانب محل الصفوة',
      phone: '0100 493 9009'
    },
    {
      name: 'الهرم – محطة أمنية',
      address: 'محطة أمنية، بجانب المنتزه',
      phone: '01142 404 166'
    },
    {
      name: 'الحصري ',
      address: ' إمتداد العبد- أمام جامعة ٦ اكتوبر',
      phone: '0100 493 9009'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Header />

      {/* Hero Section */}
      <section className=" hero-gradient text-white py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-[0.5]"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: "url('https://media.istockphoto.com/id/2008899267/photo/fried-onions-spices-and-peppers-sauce-called-shatta-and-cumin-vinegar-sauce-also-called.jpg?b=1&s=612x612&w=0&k=20&c=Osqmhbq0yADxt8Zia4tOtchmylkMmaHuvHGoWiJLiQQ=')",
            backgroundSize: "cover"
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div className="mb-8" animate={floatAnimation}>
              <motion.div
                className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center"
                whileHover={{
                  scale: 1.1,
                  rotate: 360,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ duration: 0.6 }}
              >
                <img src="../public/image/logo.jpg" alt="logo" className=" rounded-full" />
              </motion.div>
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-4 arabic-font"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                كشري اشرف
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl  m-5 arabic-font"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                الطعم الأصيل منذ ١٩٧٠
              </motion.p>
              <motion.p
                className="text-lg opacity-90 arabic-font"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                أجود الخامات • أطيب الطعم • أسرع التوصيل
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center rtl:space-x-reverse"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/menu">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto arabic-font text-lg px-8 py-3">
                    اطلب دلوقتي 🛒
                  </Button>
                </Link>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 arabic-font">
              ليه كشري الشرف؟
            </h2>
            <p className="text-lg text-gray-600 arabic-font">
              أكثر من ٥٠ سنة من الخبرة في تحضير أطيب الأكلات المصرية
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: '🥘',
                title: 'وصفات أصيلة',
                description: 'وصفات محفوظة من الجدود بنفس الطعم الأصيل'
              },
              {
                icon: '⚡',
                title: 'توصيل سريع',
                description: 'أسرع خدمة توصيل في المنطقة'
              },
              {
                icon: '💯',
                title: 'جودة مضمونة',
                description: 'أجود الخامات وأطيب الطعم مضمون'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="text-center p-6 h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <motion.div
                      className="text-4xl mb-4"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 arabic-font">{feature.title}</h3>
                    <p className="text-gray-600 arabic-font">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 arabic-font">
              فروعنا
            </h2>
            <p className="text-lg text-gray-600 arabic-font">
              اختر الفرع الأقرب ليك
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {branches.map((branch, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 h-full">
                  <CardContent className="pt-6">
                    <motion.div
                      className="flex items-center mb-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <h3 className="text-lg font-semibold arabic-font">{branch.name}</h3>
                    </motion.div>
                    <motion.p
                      className="text-gray-600 mb-3 arabic-font"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {branch.address}
                    </motion.p>
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      <Phone className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium" dir="ltr">{branch.phone}</span>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */} 
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 arabic-font">
              تواصل معانا
            </h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="flex items-center justify-center space-x-3 rtl:space-x-reverse"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold arabic-font">الخط الساخن</p>
                  <p dir="ltr">0100 493 9009</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center space-x-3 rtl:space-x-reverse"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold arabic-font">مواعيد العمل</p>
                  <p className="arabic-font">يومياً من ١٠ ص إلى ١٢ م</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/menu">
                <Button size="lg" className="arabic-font">
                  ابدأ طلبك الآن
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Float Button */}
      <motion.a
        href="https://wa.me/+201222200139"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float flex items-center justify-center"
        title="تواصل معنا عبر الواتساب"
        whileHover={{
          scale: 1.1,
          rotate: 10
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <span className="text-white text-2xl">📱</span>
      </motion.a>

      <Footer />
    </motion.div>
  );
};

export default Index;
