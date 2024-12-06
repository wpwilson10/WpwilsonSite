import { Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar/navbar";
import { Container } from "react-bootstrap";
import { lazy, Suspense, useEffect } from "react";
import { useAppDispatch } from "./store/store";
import { setIsOpen } from "./store/shoppingCart";
import LoadingSpinner from "./components/LoadingSpinner/spinner";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback, logErrorBoundary } from "./utils/error";
import LightScheduler from "./components/LightScheduler/lightScheduler";

const Home = lazy(() => import("./components/Home/home"));
const ContactPage = lazy(() => import("./components/ContactInfo/contactInfo"));
const Shop = lazy(() => import("./components/Shop/shop"));
const ShoppingCart = lazy(
	() => import("./components/ShoppingCart/shoppingCart")
);

/**
 * The main application component that renders the navigation bar and routes.
 *
 * This component renders a container with a navigation bar (NavBar) and a set of routes using react-router-dom.
 * The NavBar component should be updated to include any new routes added to the application.
 * The NavBar component goes outside the container to make it full size, while the Routes
 * component goes inside the container to ensure that later calls to components are also
 * inside the container.
 *
 * The component also uses react-bootstrap to style the container elements.
 *
 * The component wraps the container with an ErrorBoundary component from react-error-boundary,
 * which catches any errors that occur in the child component tree and renders a fallback UI
 * using ErrorFallback component from utils/error. The ErrorBoundary component also logs the errors
 * to the server using logErrorBoundary function from utils/error.
 *
 * The component uses lazy loading and Suspense from React to dynamically import and render the components
 * for each route, such as Home, ContactPage, Shop, and ShoppingCart for performance improvements.
 *
 * The ShoppingCart component is rendered
 * outside the Routes component as a sidebar that shows the selected products.
 *
 * @module app
 * @component App
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {JSX.Element} - The rendered App component.
 */
const App = () => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();
	// always close shopping cart sidebar when loading site
	useEffect(() => {
		dispatch(setIsOpen(false));
	}, [dispatch]);

	return (
		// wrapper that attempts to catch errors and render a fallback UI if something fails
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={logErrorBoundary}
			onReset={() => {
				// currently do nothing
				// basic recovery option - window.location.reload();
			}}
		>
			{/* Basic container that contains the body of the website */}
			<Container fluid className="px-1 py-3 body-container">
				{/* Navigation tool bar */}
				<NavBar />
				{/* Container that will be populated by content */}
				<Container className="px-1 site-container">
					{/* While loading, display a spinner animation */}
					<Suspense fallback={<LoadingSpinner />}>
						{/* When a link is selected from NavBar, load into that page */}
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/contact" element={<ContactPage />} />
							<Route path="/shop" element={<Shop />} />
							<Route
								path="/lights"
								element={<LightScheduler />}
							/>
						</Routes>
					</Suspense>
				</Container>
				{/* Shopping Cart that shows selected products in sidebar */}
				<Suspense fallback={<LoadingSpinner />}>
					<ShoppingCart></ShoppingCart>
				</Suspense>
			</Container>
		</ErrorBoundary>
	);
};

export default App;
