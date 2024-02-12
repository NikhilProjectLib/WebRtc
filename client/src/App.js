
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/index";
import Room from "./pages/room";
import {ROUTES} from "./enum/routes"
import { socket,connectSocket,SocketContext } from "./context/socketConnection";


function App() {


  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />}></Route>
            <Route path={ROUTES.ROOM} element={<Room />}></Route>
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
