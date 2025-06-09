
export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  category: string;
  categoryAr: string;
  description?: string;
  descriptionAr?: string;
}

export const menuCategories = [
  { id: 'appetizers', name: 'Appetizers', nameAr: 'مقبلات', emoji: '🥗' },
  { id: 'fattah', name: 'Fattah', nameAr: 'فتة', emoji: '🍛' },
  { id: 'drinks', name: 'Drinks', nameAr: 'مشروبات', emoji: '🥤' },
  { id: 'desserts', name: 'Desserts', nameAr: 'حلو', emoji: '🍮' }
];

export const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: 'bread',
    name: 'Bread',
    nameAr: 'عيش',
    price: 10,
    category: 'appetizers',
    categoryAr: 'مقبلات'
  },
  {
    id: 'salad',
    name: 'Salad',
    nameAr: 'سلطة',
    price: 10,
    category: 'appetizers',
    categoryAr: 'مقبلات'
  },
  {
    id: 'heavy-salad',
    name: 'Heavy Salad',
    nameAr: 'سلطة تقيلة',
    price: 10,
    category: 'appetizers',
    categoryAr: 'مقبلات'
  },
  {
    id: 'lentil-hummus',
    name: 'Lentil Hummus',
    nameAr: 'عدس حمص',
    price: 10,
    category: 'appetizers',
    categoryAr: 'مقبلات'
  },
  {
    id: 'hummus-drink',
    name: 'Hummus Shami Drink',
    nameAr: 'حمص شام مشروب',
    price: 15,
    category: 'appetizers',
    categoryAr: 'مقبلات'
  },
  {
    id: 'tomato-sauce',
    name: 'Tomato Sauce',
    nameAr: 'شطة طماطم',
    price: 5,
    category: 'appetizers',
    categoryAr: 'مقبلات'
  },
  {
    id: 'dukkah',
    name: 'Dukkah',
    nameAr: 'دقة',
    price: 5,
    category: 'appetizers',
    categoryAr: 'مقبلات'
  },
  {
    id: 'hot-sauce',
    name: 'Hot Sauce',
    nameAr: 'شطة',
    price: 5,
    category: 'appetizers',
    categoryAr: 'مقبلات'
  },

  // Fattah
  {
    id: 'fattah-plain',
    name: 'Plain Fattah',
    nameAr: 'فتة سادة',
    price: 55,
    category: 'fattah',
    categoryAr: 'فتة'
  },
  {
    id: 'fattah-chicken',
    name: 'Chicken Fattah',
    nameAr: 'فتة فراخ',
    price: 70,
    category: 'fattah',
    categoryAr: 'فتة'
  },
  {
    id: 'fattah-meat',
    name: 'Meat Fattah',
    nameAr: 'فتة لحمة',
    price: 70,
    category: 'fattah',
    categoryAr: 'فتة'
  },
  {
    id: 'fattah-liver',
    name: 'Liver Fattah',
    nameAr: 'فتة كبدة',
    price: 70,
    category: 'fattah',
    categoryAr: 'فتة'
  },
  {
    id: 'fattah-sausage',
    name: 'Sausage Fattah',
    nameAr: 'فتة سجق',
    price: 70,
    category: 'fattah',
    categoryAr: 'فتة'
  },

  // Drinks
  {
    id: 'water-small',
    name: 'Small Water',
    nameAr: 'مياه صغيرة',
    price: 10,
    category: 'drinks',
    categoryAr: 'مشروبات'
  },
  {
    id: 'water-large',
    name: 'Large Water',
    nameAr: 'مياه كبيرة',
    price: 15,
    category: 'drinks',
    categoryAr: 'مشروبات'
  },
  {
    id: 'soda-can',
    name: 'Soda Can',
    nameAr: 'مشروب غازي كانز',
    price: 18,
    category: 'drinks',
    categoryAr: 'مشروبات'
  },
  {
    id: 'soda-liter',
    name: 'Soda 1 Liter',
    nameAr: 'مشروب غازي 1 لتر',
    price: 35,
    category: 'drinks',
    categoryAr: 'مشروبات'
  },

  // Desserts
  {
    id: 'rice-pudding-plain',
    name: 'Plain Rice Pudding',
    nameAr: 'أرز بلبن سادة',
    price: 22,
    category: 'desserts',
    categoryAr: 'حلو'
  },
  {
    id: 'rice-pudding-cream',
    name: 'Rice Pudding with Cream',
    nameAr: 'أرز بلبن قشدة',
    price: 23,
    category: 'desserts',
    categoryAr: 'حلو'
  },
  {
    id: 'rice-pudding-nuts',
    name: 'Rice Pudding with Nuts',
    nameAr: 'أرز بلبن مكسرات',
    price: 30,
    category: 'desserts',
    categoryAr: 'حلو'
  },
  {
    id: 'rice-pudding-basbousa',
    name: 'Rice Pudding with Basbousa',
    nameAr: 'أرز بلبن بسبوسة',
    price: 30,
    category: 'desserts',
    categoryAr: 'حلو'
  },
  {
    id: 'rice-pudding-nutella',
    name: 'Rice Pudding with Nutella',
    nameAr: 'أرز بلبن نوتيلا',
    price: 30,
    category: 'desserts',
    categoryAr: 'حلو'
  },
  {
    id: 'rice-pudding-lotus',
    name: 'Rice Pudding with Lotus',
    nameAr: 'أرز بلبن لوتس',
    price: 30,
    category: 'desserts',
    categoryAr: 'حلو'
  }
];

export const branches = [
  {
    id: 'haram-emad',
    name: 'Haram – Emad Street',
    nameAr: 'الهرم – شارع عماد',
    address: 'Emad Street, beside El Safwa Store',
    addressAr: 'شارع عماد، بجانب محل الصفوة'
  },
  {
    id: 'haram-omnia',
    name: 'Haram – Omnia Station',
    nameAr: 'الهرم – محطة أمنية',
    address: 'Omnia Station, beside El Montazah',
    addressAr: 'محطة أمنية، بجانب المنتزه'
  },
  {
    id: 'october-mehwar',
    name: '',
    nameAr: ' حصري  ',
    address: '',
    addressAr: 'إمتداد العبد- أمام جامعة ٦ اكتوبر'
  }
];
