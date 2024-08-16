import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { Route, Routes } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleSaveProduct = (product) => {
    if (currentProduct) {
      setProducts(products.map(p => p === currentProduct ? product : p));
      setCurrentProduct(null);
    } else {
      setProducts([...products, product]);
    }
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
  };

  const handleDeleteProduct = (product) => {
    setProducts(products.filter(p => p !== product));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Routes>
          <Route path='Dashboard' element={ <ProductForm product={currentProduct} onSave={handleSaveProduct} />}/>
          <Route path='Products'  element={ <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />}/>
          </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
