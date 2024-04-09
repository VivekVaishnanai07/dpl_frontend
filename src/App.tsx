import { BrowserRouter, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './assets/css/common.css';
import AuthRoutes from './routes/auth-routes';
import UnAuthRoutes from './routes/unAuth-routes';
import GlobalLoader from './components/loader/global-loader';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {AuthRoutes}
        {UnAuthRoutes}
      </Routes>
      <GlobalLoader />
    </BrowserRouter>
  );
}

export default App;