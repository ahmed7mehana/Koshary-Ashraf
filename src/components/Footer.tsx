
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <img src="./image/logo.jpg" alt="logo" className=" rounded-full" />
              </div>
              <div className="arabic-font">
                <h3 className="text-lg font-bold">كشري اشرف </h3>
              </div>
            </div>
            <p className="text-gray-400 arabic-font">
              أطيب كشري في مصر بوصفات أصيلة ومذاق لا يُنسى
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 arabic-font">تواصل معانا</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Phone className="h-4 w-4" />
                <span dir="ltr">0100 493 9009</span>
              </div>
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Phone className="h-4 w-4" />
                <span dir="ltr">01142 404 166</span>
              </div>
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <span className="text-green-400">📱</span>
                <span dir="ltr">0122 2200 139</span>
                <span className="text-sm text-gray-400 arabic-font">(واتساب)</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 arabic-font">مواعيد العمل</h4>
            <div className="space-y-2 text-gray-400">
              <p className="arabic-font">يومياً من ١٠ ص إلى ١٢ م</p>
              <p className="arabic-font">متاح الآن التوصيل</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center flex flex-col  justify-center ">
          <p className="text-gray-400 arabic-font">
            جميع الحقوق محفوظة © ٢٠٢٤ كشري الشرف
          </p>
          <a href='https://api.whatsapp.com/send/?phone=%2B201558533755&text&type=phone_number&app_absent=0'>
            <p className="text-gray-400 arabic-font uppercase">
              made with love by
              <span> Ahmed mehana </span>
              
            </p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
