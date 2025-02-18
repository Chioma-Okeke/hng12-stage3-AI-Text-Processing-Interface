// import About from "./pages/About";
// import ContactUs from "./pages/ContactUs";
// import ErrorPage from "./pages/ErrorPage";
// import LandingPage from "./pages/Home";
// import OurServices from "./pages/OurServices";
// import Outreaches from "./pages/Outreaches";
// import SkillAcquisitionPage from "./pages/SkillAcquisition";
import PageLayout from "./pages/PageLayout";
import { Toaster } from "sonner";

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<PageLayout />} />
        </Route>
    )
);

function App() {
    return (
        <div>
            <Toaster
                position="top-right"
                toastOptions={{
                    className: "toast-class",
                    success: {
                        className: "success-text"
                    },
                    error: {
                        className: "error-text"
                    }
                }}
            />
            ;<RouterProvider router={router}></RouterProvider>
        </div>
    );
}

export default App;
