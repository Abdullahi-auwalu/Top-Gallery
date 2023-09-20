import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle successful login
  // const handleLoginSuccess = () => {
  //   setIsLoggedIn(true);
  // };

  // Function to handle logout
  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  // };

  return (
    <>
      {!isLoggedIn ? (
        <Login/>
      ) : (
        <Home />
      )}
    </>
  );
}

export default App;
