import React from "react";
import {Link} from "react-router-dom";

function Navigation() {
    return (
        <nav className="App-nav">
            <Link to="/">Home</Link>
            <span> </span>
            <Link to="/create-exercise">Create Exercise</Link>
        </nav>
    );
}

export default Navigation;
