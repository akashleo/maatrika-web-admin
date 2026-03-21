import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import type { RootState } from './store';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
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
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
