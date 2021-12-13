import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import TasksPage from "./TasksPage";
import InfoPage from "./InfoPage";
import ListsPage from "./ListsPage";
import { useState } from "react";

function App() {
    const [openPage, setOpenPage] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    function getPlacement(page) {
        if (page === openPage) {
            return "FirstLink";
        } else if (menuOpen) {
            return "OtherLink";
        } else {
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
                        <Route
                            path="*"
                            element={
                                <p>
                                    Error 404 <br />
                                    Page Not Found
                                </p>
                            }
                        ></Route>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
