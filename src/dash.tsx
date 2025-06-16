import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Eye } from 'lucide-react';
import { db } from './firebase.ts';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  colors: string[];
  images: string[];
  description: string;
  descriptionAr: string;
}

interface ProductFormData {
  name: string;
  nameAr: string;
  price: string;
  colors: string[];
  images: string[];
  imageFiles: File[];
  description: string;
  descriptionAr: string;
}

const ProductsDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    nameAr: '',
    price: '',
    colors: [''],
    images: [],
    imageFiles: [],
    description: '',
    descriptionAr: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(items);
    };
    fetchProducts();
  }, []);

  // Convert file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      price: '',
      colors: [''],
      images: [],
      imageFiles: [],
      description: '',
      descriptionAr: ''
    });
    setPreviewImages([]);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameAr: product.nameAr || '',
      price: product.price.toString(),
      colors: product.colors,
      images: product.images,
      imageFiles: [],
      description: product.description,
      descriptionAr: product.descriptionAr || ''
    });
    setPreviewImages(product.images);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const addColorField = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, '']
    }));
  };

  const removeColorField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColorField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => i === index ? value : color)
    }));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      // Convert files to base64 for preview and storage
      const base64Images = await Promise.all(files.map(file => fileToBase64(file)));
      
      setFormData(prev => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...files],
        images: [...prev.images, ...base64Images]
      }));

      setPreviewImages(prev => [...prev, ...base64Images]);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.price || !formData.description.trim()) {
      alert('Please fill in all required fields (Name, Price, Description)');
      return;
    }

    if (formData.images.length === 0) {
      alert('Please add at least one image');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        nameAr: formData.nameAr.trim(),
        price: parseFloat(formData.price),
        colors: formData.colors.filter(color => color.trim() !== ''),
        images: formData.images,
        description: formData.description.trim(),
        descriptionAr: formData.descriptionAr.trim(),
      };

      if (editingProduct) {
        // Update existing product in Firestore
        const docRef = doc(db, 'products', editingProduct.id);
        await updateDoc(docRef, productData);

        // Update in local state
        setProducts(prev =>
          prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p)
        );
      } else {
        // Add new product to Firestore
        const docRef = await addDoc(collection(db, 'products'), productData);

        // Add to local state
        const newProduct: Product = { ...productData, id: docRef.id };
        setProducts(prev => [...prev, newProduct]);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      // Remove from Firestore
      await deleteDoc(doc(db, 'products', productId));

      // Update local state
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="bg-gray-50 min-h-screen w-full">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-serif text-gray-900">
                Products Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === 'en' 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ar')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === 'ar' 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    العربية
                  </button>
                </div>
                <button
                  onClick={openAddModal}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add Product</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
              >
                <div className="relative h-48">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/400x300'}
                    alt={language === 'ar' ? product.nameAr || product.name : product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className={`text-xl font-serif text-gray-900 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? (product.nameAr || product.name) : product.name}
                  </h3>
                  <p className={`text-sm text-gray-600 mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? (product.descriptionAr || product.description) : product.description}
                  </p>
                  <p className="text-yellow-600 text-lg font-semibold mb-3">
                    ${product.price.toFixed(2)}
                  </p>
                  
                  <div className="flex space-x-2 mb-3">
                    {product.colors.map((color: string, index: number) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {product.images.length} image(s)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-600 focus:border-yellow-600"
                    required
                  />
                </div>

                {/* Product Name Arabic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name (Arabic) - اسم المنتج
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-600 focus:border-yellow-600 text-right"
                    dir="rtl"
                    placeholder="اسم المنتج"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-600 focus:border-yellow-600"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (English) *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-600 focus:border-yellow-600"
                    required
                  />
                </div>

                {/* Description Arabic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Arabic) - وصف المنتج
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-600 focus:border-yellow-600 text-right"
                    dir="rtl"
                    placeholder="وصف المنتج"
                  />
                </div>

                {/* Colors */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Colors
                    </label>
                    <button
                      type="button"
                      onClick={addColorField}
                      className="text-yellow-600 hover:text-yellow-700 text-sm"
                    >
                      + Add Color
                    </button>
                  </div>
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateColorField(index, e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => updateColorField(index, e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-600 focus:border-yellow-600"
                      />
                      {formData.colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeColorField(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-yellow-600 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label className="cursor-pointer">
                          <span className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors inline-flex items-center space-x-2">
                            <span>Choose Images</span>
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Image Previews ({previewImages.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previewImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X size={14} />
                            </button>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                              <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <Save size={20} />
                    <span>{editingProduct ? 'Update' : 'Save'} Product</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-900">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsDashboard;