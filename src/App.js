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
                        HOME
                    </Link>
                    <Link to="/info">INFO</Link>
                    <Link to="/third_option">THIRD</Link>
                </div>
                <div className="Content">
                    <Routes>
                        <Route path="/" element={<MainPage />}></Route>
                        <Route path="info" element={<InfoPage />}></Route>
                        <Route
                            path="third_option"
                            element={"Third option"}
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
