import { Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import TaskPage from "./pages/TasksPage/TasksPage.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import AdminPageTasks from "./pages/AdminPageTasks/AdminPageTasks.jsx";
import AdminPageUsers from "./pages/AdminPageUsers/AdminPageUsers.jsx";
import AllTasksPage from "./pages/AllTasksPage/AllTasksPage.jsx";
import './App.css'
import AdminReports from "./pages/AdminReports/AdminReports.jsx";
import { ToastContainer } from 'react-toastify';  // Импортируем контейнер уведомлений
import 'react-toastify/dist/ReactToastify.css';  // Стили для Toastify


function App() {
  return (
    <div>
      <div id='content'>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/tasks" element={<TaskPage/>}/>
            <Route path="/alltasks" element={<AllTasksPage/>}/>
            <Route path="/admin" element={<AdminPage/>}/>
            <Route path="/admin/alltasks" element={<AdminPageTasks/>}/>
            <Route path="/admin/allusers" element={<AdminPageUsers/>}/>
            <Route path="/admin/reports" element={<AdminReports/>}/>
        </Routes>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
