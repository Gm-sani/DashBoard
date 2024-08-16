import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = ({ onEdit, onDelete }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the API when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://github.com/Zubair-Rajpoot/Trial-backend.git');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productIndex, sizeIndex, colorIndex) => {
    try {
      const updatedProducts = [...products];

      // Remove the specific color
      updatedProducts[productIndex].sizes[sizeIndex].colors.splice(colorIndex, 1);

      // If no colors left in a size, remove the size
      if (updatedProducts[productIndex].sizes[sizeIndex].colors.length === 0) {
        updatedProducts[productIndex].sizes.splice(sizeIndex, 1);
      }

      // If no sizes left in a product, remove the product
      if (updatedProducts[productIndex].sizes.length === 0) {
        const productToDelete = updatedProducts.splice(productIndex, 1)[0];

        // Send a DELETE request to the server to delete the product
        await axios.delete(`https://github.com/Zubair-Rajpoot/Trial-backend.git/${productToDelete.id}`);

        console.log('Product deleted successfully:', productToDelete);
      } else {
        // Update the product on the server
        const productToUpdate = updatedProducts[productIndex];
        const formData = new FormData();
        formData.append('name', productToUpdate.name);
        productToUpdate.sizes.forEach((size, sizeIdx) => {
          formData.append(`sizes[${sizeIdx}][size]`, size.size);
          size.colors.forEach((color, colorIdx) => {
            formData.append(`sizes[${sizeIdx}][colors][${colorIdx}][color]`, color.color);
            formData.append(`sizes[${sizeIdx}][colors][${colorIdx}][price]`, color.price);
            if (color.image instanceof File) {
              formData.append(`sizes[${sizeIdx}][colors][${colorIdx}][image]`, color.image);
            }
          });
        });

        await axios.put(`https://github.com/Zubair-Rajpoot/Trial-backend.git/${productToUpdate.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Product updated successfully:', productToUpdate);
      }

      // Update the state with the new product list
      setProducts(updatedProducts);

      // Call the onDelete callback with the updated product list
      onDelete && onDelete(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (productIndex, sizeIndex, colorIndex) => {
    const productToEdit = products[productIndex];
    const sizeToEdit = productToEdit.sizes[sizeIndex];
    const colorToEdit = sizeToEdit.colors[colorIndex];
    onEdit && onEdit(productToEdit, productIndex, sizeIndex, colorIndex);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Products</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Size</th>
            <th className="py-2">Color</th>
            <th className="py-2">Price</th>
            <th className="py-2">Image</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, productIndex) =>
            product.sizes.map((size, sizeIndex) =>
              size.colors.map((color, colorIndex) => (
                <tr key={`${productIndex}-${sizeIndex}-${colorIndex}`}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{size.size}</td>
                  <td className="border px-4 py-2">{color.color}</td>
                  <td className="border px-4 py-2">{color.price}</td>
                  <td className="border px-4 py-2">
                    {color.image && (
                      <img
                        src={color.image instanceof File ? URL.createObjectURL(color.image) : color.image}
                        alt={color.color}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(productIndex, sizeIndex, colorIndex)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(productIndex, sizeIndex, colorIndex)}
                      className="px-4 mt-2 py-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
