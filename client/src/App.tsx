import { Routes, Route } from "react-router-dom";

import Login from "screens/Login";
import { Wrapper } from "styles/HomePage.styled";

function App() {
  return (
    <Wrapper>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
