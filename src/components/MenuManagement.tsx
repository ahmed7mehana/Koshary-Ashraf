import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Package2, FolderPlus } from 'lucide-react';
import { menuCategories as defaultCategories, MenuItem } from '@/data/menuData';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  nameAr: string;
  emoji: string;
}

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    price: '',
    category: 'appetizers',
    description: '',
    descriptionAr: '',
    image: ''
  });
  const [categoryForm, setCategoryForm] = useState({
    nameAr: '',
    emoji: '🍽️'
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedItems = localStorage.getItem('customMenuItems');
    const savedCategories = localStorage.getItem('customCategories');

    if (savedItems) {
      setMenuItems(JSON.parse(savedItems));
    }

    if (savedCategories) {
      const customCategories = JSON.parse(savedCategories);
      setCategories([...defaultCategories, ...customCategories]);
    }
  }, []);

  const saveToStorage = (items: MenuItem[], cats?: Category[]) => {
    localStorage.setItem('customMenuItems', JSON.stringify(items));
    setMenuItems(items);

    if (cats) {
      const customCats = cats.filter(cat => !defaultCategories.find(def => def.id === cat.id));
      localStorage.setItem('customCategories', JSON.stringify(customCats));
      setCategories(cats);
    }
  };

  const handleAddCategory = () => {
    if (!categoryForm.nameAr) {
      toast({
        title: "خطأ",
        description: "يرجى ملء اسم الفئة",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: categoryForm.nameAr.toLowerCase().replace(/\s+/g, '-'),
      name: categoryForm.nameAr,
      nameAr: categoryForm.nameAr,
      emoji: categoryForm.emoji
    };

    const updatedCategories = [...categories, newCategory];
    saveToStorage(menuItems, updatedCategories);

    setCategoryForm({ nameAr: '', emoji: '🍽️' });
    setIsCategoryDialogOpen(false);

    toast({
      title: "تم إضافة الفئة",
      description: "تم إضافة الفئة الجديدة بنجاح"
    });
  };

  const handleAddItem = () => {
    if (!formData.nameAr || !formData.price) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.name,
      nameAr: formData.nameAr,
      price: parseFloat(formData.price),
      category: formData.category,
      categoryAr: categories.find(cat => cat.id === formData.category)?.nameAr || '',
      description: formData.description,
      descriptionAr: formData.descriptionAr
    };

    const updatedItems = [...menuItems, newItem];
    saveToStorage(updatedItems);

    setFormData({
      name: '',
      nameAr: '',
      price: '',
      category: 'appetizers',
      description: '',
      descriptionAr: '',
      image: ''
    });
    setIsAddDialogOpen(false);

    toast({
      title: "تم إضافة الصنف",
      description: "تم إضافة الصنف الجديد بنجاح"
    });
  };

  const handleEditItem = () => {
    if (!editingItem || !formData.nameAr || !formData.price) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const updatedItem: MenuItem = {
      ...editingItem,
      name: formData.name,
      nameAr: formData.nameAr,
      price: parseFloat(formData.price),
      category: formData.category,
      categoryAr: categories.find(cat => cat.id === formData.category)?.nameAr || '',
      description: formData.description,
      descriptionAr: formData.descriptionAr
    };

    const updatedItems = menuItems.map(item =>
      item.id === editingItem.id ? updatedItem : item
    );
    saveToStorage(updatedItems);

    setIsEditDialogOpen(false);
    setEditingItem(null);

    toast({
      title: "تم تحديث الصنف",
      description: "تم تحديث الصنف بنجاح"
    });
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    saveToStorage(updatedItems);

    toast({
      title: "تم حذف الصنف",
      description: "تم حذف الصنف بنجاح"
    });
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameAr: item.nameAr,
      price: item.price.toString(),
      category: item.category,
      description: item.description || '',
      descriptionAr: item.descriptionAr || '',
      image: ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      price: '',
      category: 'appetizers',
      description: '',
      descriptionAr: '',
      image: ''
    });
  };

  const handleEditCategory = () => {
    if (!editingCategory || !categoryForm.nameAr) {
      toast({
        title: "خطأ",
        description: "يرجى ملء اسم الفئة",
        variant: "destructive"
      });
      return;
    }

    const updatedCategory: Category = {
      ...editingCategory,
      name: categoryForm.nameAr,
      nameAr: categoryForm.nameAr,
      emoji: categoryForm.emoji
    };

    const updatedCategories = categories.map(cat =>
      cat.id === editingCategory.id ? updatedCategory : cat
    );

    // Update menu items that use this category
    const updatedItems = menuItems.map(item => {
      if (item.category === editingCategory.id) {
        return {
          ...item,
          categoryAr: categoryForm.nameAr
        };
      }
      return item;
    });

    saveToStorage(updatedItems, updatedCategories);

    setCategoryForm({ nameAr: '', emoji: '🍽️' });
    setIsEditCategoryDialogOpen(false);
    setEditingCategory(null);

    toast({
      title: "تم تحديث الفئة",
      description: "تم تحديث الفئة بنجاح"
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    setCategoryToDelete(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;

    // حذف الفئة وجميع الأصناف المرتبطة بها
    const updatedCategories = categories.filter(cat => cat.id !== categoryToDelete.id);
    const updatedItems = menuItems.filter(item => item.category !== categoryToDelete.id);

    saveToStorage(updatedItems, updatedCategories);

    setIsDeleteCategoryDialogOpen(false);
    setCategoryToDelete(null);

    toast({
      title: "تم الحذف",
      description: "تم حذف الفئة وجميع الأصناف المرتبطة بها بنجاح"
    });
  };

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      nameAr: category.nameAr,
      emoji: category.emoji
    });
    setIsEditCategoryDialogOpen(true);
  };

  const AddNewItemForm = () => {
    const [newItem, setNewItem] = useState({
      nameAr: '',
      descriptionAr: '',
      price: '',
      category: 'appetizers'
    });

    const handleInputChange = (field: string, value: string) => {
      setNewItem(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSave = () => {
      if (!newItem.nameAr || !newItem.price) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive"
        });
        return;
      }

      const item: MenuItem = {
        id: Date.now().toString(),
        name: '',
        nameAr: newItem.nameAr,
        price: parseFloat(newItem.price),
        category: newItem.category,
        categoryAr: categories.find(cat => cat.id === newItem.category)?.nameAr || '',
        description: '',
        descriptionAr: newItem.descriptionAr
      };

      const updatedItems = [...menuItems, item];
      saveToStorage(updatedItems);

      setNewItem({
        nameAr: '',
        descriptionAr: '',
        price: '',
        category: 'appetizers'
      });
      setIsAddDialogOpen(false);

      toast({
        title: "تم إضافة الصنف",
        description: "تم إضافة الصنف الجديد بنجاح"
      });
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newNameAr" className="arabic-font text-sm font-medium">الاسم بالعربية *</Label>
            <Input
              id="newNameAr"
              value={newItem.nameAr}
              onChange={(e) => handleInputChange('nameAr', e.target.value)}
              className="arabic-font mt-1"
              placeholder="اسم الصنف"
              required
            />
          </div>
          <div>
            <Label htmlFor="newDescriptionAr" className="arabic-font text-sm font-medium">الوصف</Label>
            <Input
              id="newDescriptionAr"
              value={newItem.descriptionAr}
              onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
              className="arabic-font mt-1"
              placeholder="وصف الصنف"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newPrice" className="arabic-font text-sm font-medium">السعر *</Label>
            <Input
              id="newPrice"
              type="number"
              value={newItem.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="mt-1"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="newCategory" className="arabic-font text-sm font-medium">الفئة</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.emoji} {category.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryDialogOpen(true)}
                className="px-3"
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddDialogOpen(false)}
            className="arabic-font"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="arabic-font"
          >
            حفظ
          </Button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/5 to-red-50 p-6 rounded-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div>
          <h2 className="text-3xl font-bold arabic-font text-gray-900 mb-2">إدارة قائمة الطعام</h2>
          <p className="text-gray-600 arabic-font">إضافة وتعديل وحذف الأصناف والفئات</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="arabic-font shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              إضافة صنف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="arabic-font text-xl">إضافة صنف جديد</DialogTitle>
            </DialogHeader>
            <AddNewItemForm />
          </DialogContent>
        </Dialog>
      </motion.div>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {menuItems.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Package2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              </motion.div>
              <p className="text-xl text-gray-600 arabic-font mb-2">لا توجد أصناف مضافة بعد</p>
              <p className="text-gray-500 arabic-font">ابدأ بإضافة أول صنف</p>
            </motion.div>
          ) : (
            menuItems.map((item, index) => {
              const category = categories.find(cat => cat.id === item.category);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="feature-card group h-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="arabic-font text-lg group-hover:text-primary transition-colors">
                            {item.nameAr}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{item.name}</p>
                        </div>
                        <Badge variant="secondary" className="arabic-font">
                          {category?.emoji} {category?.nameAr}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">{item.price} جنيه</span>
                      </div>

                      {item.descriptionAr && (
                        <p className="text-sm text-gray-600 arabic-font">{item.descriptionAr}</p>
                      )}

                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                            className="arabic-font w-full"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            تعديل
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="arabic-font w-full"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            حذف
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="arabic-font text-xl">تعديل الصنف</DialogTitle>
          </DialogHeader>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="nameAr" className="arabic-font text-sm font-medium">الاسم بالعربية *</Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onInput={(e) => setFormData(prev => ({ ...prev, nameAr: e.currentTarget.value }))}
                  className="arabic-font mt-1"
                  placeholder="اسم الصنف"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="descriptionAr" className="arabic-font text-sm font-medium">الوصف</Label>
                <Input
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onInput={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.currentTarget.value }))}
                  className="arabic-font mt-1"
                  placeholder="وصف الصنف"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="price" className="arabic-font text-sm font-medium">السعر *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onInput={(e) => setFormData(prev => ({ ...prev, price: e.currentTarget.value }))}
                  className="mt-1"
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="category" className="arabic-font text-sm font-medium">الفئة</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.emoji} {category.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCategoryDialogOpen(true)}
                    className="px-3"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="arabic-font"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={handleEditItem}
                className="arabic-font"
              >
                حفظ
              </Button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="arabic-font text-2xl font-bold text-center mb-6">إدارة الفئات</DialogTitle>
          </DialogHeader>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* قائمة الفئات الحالية */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="arabic-font text-lg font-semibold mb-4 text-gray-800">الفئات الحالية</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.emoji}</span>
                      <div>
                        <p className="arabic-font font-medium text-gray-900">{category.nameAr}</p>
                        <p className="text-sm text-gray-500">{category.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditCategoryDialog(category)}
                        className="px-3 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="px-3 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* نموذج إضافة فئة جديدة */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="arabic-font text-lg font-semibold mb-6 text-gray-800">إضافة فئة جديدة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="categoryNameAr" className="arabic-font text-sm font-medium text-gray-700">اسم الفئة بالعربية *</Label>
                    <Input
                      id="categoryNameAr"
                      value={categoryForm.nameAr}
                      onInput={(e) => setCategoryForm(prev => ({ ...prev, nameAr: e.currentTarget.value }))}
                      className="arabic-font mt-1.5 bg-gray-50 border-gray-200 focus:border-primary"
                      placeholder="اسم الفئة"
                    />
                  </div>

                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="categoryEmoji" className="text-sm font-medium text-gray-700">رمز الفئة</Label>
                    <Input
                      id="categoryEmoji"
                      value={categoryForm.emoji}
                      onInput={(e) => setCategoryForm(prev => ({ ...prev, emoji: e.currentTarget.value }))}
                      className="mt-1.5 bg-gray-50 border-gray-200 focus:border-primary text-2xl"
                      placeholder="🍽️"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCategoryDialogOpen(false)}
                      className="arabic-font hover:bg-gray-100"
                    >
                      إغلاق
                    </Button>
                    <Button
                      onClick={handleAddCategory}
                      className="arabic-font bg-primary hover:bg-primary/90"
                    >
                      إضافة الفئة
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic-font text-xl font-bold text-center mb-6">تعديل الفئة</DialogTitle>
          </DialogHeader>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCategoryNameAr" className="arabic-font text-sm font-medium text-gray-700">اسم الفئة *</Label>
                <Input
                  id="editCategoryNameAr"
                  value={categoryForm.nameAr}
                  onInput={(e) => setCategoryForm(prev => ({ ...prev, nameAr: e.currentTarget.value }))}
                  className="arabic-font mt-1.5 bg-gray-50 border-gray-200 focus:border-primary"
                  placeholder="اسم الفئة"
                />
              </div>
              <div>
                <Label htmlFor="editCategoryEmoji" className="text-sm font-medium text-gray-700">رمز الفئة</Label>
                <Input
                  id="editCategoryEmoji"
                  value={categoryForm.emoji}
                  onInput={(e) => setCategoryForm(prev => ({ ...prev, emoji: e.currentTarget.value }))}
                  className="mt-1.5 bg-gray-50 border-gray-200 focus:border-primary text-2xl"
                  placeholder="🍽️"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEditCategoryDialogOpen(false)}
                className="arabic-font hover:bg-gray-100"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleEditCategory}
                className="arabic-font bg-primary hover:bg-primary/90"
              >
                حفظ التغييرات
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic-font text-xl font-bold text-center mb-4">تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center space-y-2">
              <p className="arabic-font text-gray-700">
                هل أنت متأكد من حذف الفئة "{categoryToDelete?.nameAr}"؟
              </p>
              <p className="arabic-font text-sm text-gray-500">
                سيتم حذف جميع الأصناف المرتبطة بهذه الفئة
              </p>
            </div>
            <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsDeleteCategoryDialogOpen(false)}
                className="arabic-font hover:bg-gray-100"
              >
                إلغاء
              </Button>
              <Button
                onClick={confirmDeleteCategory}
                variant="destructive"
                className="arabic-font hover:bg-red-600"
              >
                تأكيد الحذف
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MenuManagement;
