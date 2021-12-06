import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import MainPage from "./MainPage";
import InfoPage from "./InfoPage";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="Links">
                    <Link to="/" className="homelink">
                        MANAGE TASKS
                    </Link>
                    <Link to="/lists">MANAGE LISTS</Link>
                    <Link to="/info">INFO</Link>
                </div>
                <div className="Content">
                    <Routes>
                        <Route path="/" element={<MainPage />}></Route>
                        <Route path="info" element={<InfoPage />}></Route>
                        <Route path="lists" element={"Third option"}></Route>
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
