import logo from './logo.svg';
import './App.css';
import AdminRoutes from './Admin/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
