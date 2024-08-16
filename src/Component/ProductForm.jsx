import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ product, productIndex, sizeIndex, colorIndex, onSave }) => {
  const [name, setName] = useState('');
  const [sizes, setSizes] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSizes(product.sizes || []);
    }
  }, [product]);

  const handleSizeChange = (index, key, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][key] = value;
    setSizes(updatedSizes);
  };

  const handleColorChange = (sizeIndex, colorIndex, key, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[sizeIndex].colors[colorIndex][key] = value;
    setSizes(updatedSizes);
  };

  const handleImageChange = (sizeIndex, colorIndex, file) => {
    const updatedSizes = [...sizes];
    updatedSizes[sizeIndex].colors[colorIndex].image = file;
    setSizes(updatedSizes);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', colors: [{ color: '', price: '', image: null }] }]);
  };

  const handleAddColor = (sizeIndex) => {
    const updatedSizes = [...sizes];
    updatedSizes[sizeIndex].colors.push({ color: '', price: '', image: null });
    setSizes(updatedSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = { name, sizes };

    try {
      if (productIndex !== undefined && sizeIndex !== undefined && colorIndex !== undefined) {
        onSave(updatedProduct, productIndex, sizeIndex, colorIndex);
      } else {
        // Make a POST request to your API to add a new product
        const formData = new FormData();
        formData.append('name', name);
        sizes.forEach((size, sizeIdx) => {
          formData.append(`sizes[${sizeIdx}][size]`, size.size);
          size.colors.forEach((color, colorIdx) => {
            formData.append(`sizes[${sizeIdx}][colors][${colorIdx}][color]`, color.color);
            formData.append(`sizes[${sizeIdx}][colors][${colorIdx}][price]`, color.price);
            formData.append(`sizes[${sizeIdx}][colors][${colorIdx}][image]`, color.image);
          });
        });

        const response = await axios.post('https://your-api-url.com/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Product added successfully:', response.data);
        setPopupMessage('Product added successfully!');
        setIsSuccess(true);
        onSave(response.data);
      }

      // Clear the form after submission
      setName('');
      setSizes([]);
    } catch (error) {
      console.error('Error adding product:', error);
      setPopupMessage('Error adding product. Please try again.');
      setIsSuccess(false);
    }
  };

  // Hide the popup after 3 seconds
  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{product ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {sizes.map((size, sizeIndex) => (
          <div key={sizeIndex} className="mb-4">
            <div className="mb-2">
              <label className="block text-gray-700">Size</label>
              <input
                type="text"
                value={size.size}
                onChange={(e) => handleSizeChange(sizeIndex, 'size', e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>

            {size.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="mb-2 pl-4 border-l">
                <label className="block text-gray-700">Color</label>
                <input
                  type="text"
                  value={color.color}
                  onChange={(e) => handleColorChange(sizeIndex, colorIndex, 'color', e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />

                <label className="block text-gray-700 mt-2">Price</label>
                <input
                  type="text"
                  value={color.price}
                  onChange={(e) => handleColorChange(sizeIndex, colorIndex, 'price', e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />

                <label className="block text-gray-700 mt-2">Image</label>
                <input
                  type="file"
                  onChange={(e) => handleImageChange(sizeIndex, colorIndex, e.target.files[0])}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleAddColor(sizeIndex)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Add Color
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSize}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Size
        </button>

        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded ml-[6rem]">
          {product ? 'Update' : 'Add'}
        </button>
      </form>

      {popupMessage && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded shadow-lg text-white ${
            isSuccess ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default ProductForm;
