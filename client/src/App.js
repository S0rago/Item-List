import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
 
import Navbar from "./components/navbar.component.js";
import ItemList from "./components/item-list.component.js";
import EditItem from "./components/edit-item.component.js";
import AddItem from "./components/add-item.component.js";
import AddKiller from "./components/add-killer.component.js";

function App() {
 return (
   <Router>
     <div className="container">
     <Navbar/>
      <br/>
        <Route path="/" exact component={ItemList} />
        <Route path="/edit/:id" component={EditItem} />
        <Route path="/additem" component={AddItem} />
        <Route path="/addkiller" component={AddKiller} />
     </div>
   </Router>
 );
}
 
export default App;