/* 
  App > List = Edit = Means
  Login
  Register
*/

import App from "../App";
import Edit from "../pages/Edit";
import List from "../pages/List";
import Login from "../pages/Login";
import Means from "../pages/Means";
import Register from "../pages/Register";
import MyEditor from "../pages/MyEditor";
import Upload from "../pages/Upload";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const BaseRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Edit />}></Route>
        <Route path="/edit" element={<Edit />}></Route>
        <Route path="/edit/:id" element={<Edit />}></Route>
        <Route path="/list" element={<List />}></Route>
        <Route path="/means" element={<Means />}></Route>
        <Route path="/myeditor" element={<MyEditor />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
      </Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  </Router>
)

export default BaseRouter;