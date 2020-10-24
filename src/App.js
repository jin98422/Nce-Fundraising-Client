import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import decode from 'jwt-decode';
import routes from "./routes";
import "./App.css";

function App() {
  const [load, setLoad] = useState(true)
  useEffect(() => {
    let path = window.location.pathname;
    const token = localStorage.getItem("token");
    if(token === null || token === "") {
        if(path === "/" || path.includes("home")) {
          window.location.href="/login";
        } else {
          setLoad(true)
        }        
    } else {
        const decodedToken = decode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          if(path === "/" || path.includes("home")) {
            window.location.href="/login";
          } else {
            setLoad(true)
          }   
        } else {
          axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
          setLoad(true)
        }
    }    
  }, [])
  return(
    load && <Router basename="/">
      <Switch>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact
              component={route.component}
            />
          );
        })}
      </Switch>
    </Router>
  )  
}

export default App;
