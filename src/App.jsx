import Home from "./pages/Home";
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
            <Route path="/" element={<Home />} />
        </Route>
    )
);

function App() {
    return (
        <div>
            <div role="alert" aria-live="assertive">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: "toast-class",
                        success: {
                            className: "success-text",
                        },
                        error: {
                            className: "error-text",
                        },
                    }}
                />
            </div>
            <RouterProvider router={router}></RouterProvider>
        </div>
    );
}

export default App;
