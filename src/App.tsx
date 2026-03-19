import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Orders from './pages/Orders';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/filled-carts" replace />} />
          <Route path="/filled-carts" element={<div className="page-container"><h2 className="page-title">Filled Carts</h2><p className="text-secondary">No filled carts available.</p></div>} />
          <Route path="/users" element={<div className="page-container"><h2 className="page-title">Users List</h2><p className="text-secondary">No users available.</p></div>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/transactions" element={<div className="page-container"><h2 className="page-title">Transactions</h2><p className="text-secondary">No transactions available.</p></div>} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
