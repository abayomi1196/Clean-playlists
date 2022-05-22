import { Routes, Route } from "react-router-dom";

import Login from "screens/Login";
import Playlists from "screens/Playlists";
import { Wrapper } from "styles/HomePage.styled";

function App() {
  return (
    <Wrapper>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/playlists' element={<Playlists />} />
      </Routes>
    </Wrapper>
  );
}

export default App;
