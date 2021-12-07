import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import TasksPage from "./TasksPage";
import InfoPage from "./InfoPage";
import ListsPage from "./ListsPage";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="Links">
                    <Link to="/">INFO</Link>
                    <Link to="/tasks" className="homelink">
                        MANAGE TASKS
                    </Link>
                    <Link to="/lists">MANAGE LISTS</Link>
                </div>
                <div className="Content">
                    <Routes>
                        <Route path="/" element={<InfoPage />}></Route>
                        <Route path="tasks" element={<TasksPage />}></Route>
                        <Route path="lists" element={<ListsPage />}></Route>
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
