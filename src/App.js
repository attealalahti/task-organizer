import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import TasksPage from "./TasksPage";
import InfoPage from "./InfoPage";
import ListsPage from "./ListsPage";
import { useState } from "react";

function App() {
    // Which page is open right now
    const [openPage, setOpenPage] = useState("");
    // Hamburger menu open or closed state
    const [menuOpen, setMenuOpen] = useState(false);

    // Return a class name that controls how hamburger menu links are shown
    function getPlacement(page) {
        if (page === openPage) {
            // Currently open page's link is show at the top
            return "FirstLink";
        } else if (menuOpen) {
            // Other links are shown below it
            return "OtherLink";
        } else {
            // If menu is not open, other links are hidden
            return "HiddenLink";
        }
    }
    return (
        <BrowserRouter>
            <div className="App">
                <div className="Links">
                    <Link to="/" className={getPlacement("info")}>
                        INFO
                    </Link>
                    <Link to="/tasks" className={getPlacement("tasks")}>
                        MANAGE TASKS
                    </Link>
                    <Link to="/lists" className={getPlacement("lists")}>
                        MANAGE LISTS
                    </Link>
                </div>
                <button
                    className="HamburgerMenuButton"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <i className="fa fa-bars"></i>
                </button>
                <div className="Content">
                    <Routes>
                        <Route
                            path="/"
                            element={<InfoPage setOpenPage={setOpenPage} />}
                        ></Route>
                        <Route
                            path="tasks"
                            element={<TasksPage setOpenPage={setOpenPage} />}
                        ></Route>
                        <Route
                            path="lists"
                            element={<ListsPage setOpenPage={setOpenPage} />}
                        ></Route>
                        <Route path="*" element={<p>Page Not Found</p>}></Route>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
