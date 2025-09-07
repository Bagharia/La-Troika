import ProductManager from '../components/ProductManager';
import TestNavbar from '../components/TestNavbar';

const ProductManagerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TestNavbar />
      <ProductManager />
    </div>
  );
};

export default ProductManagerPage;
