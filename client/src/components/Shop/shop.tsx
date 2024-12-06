/**
 * The Shop component that displays the shop page with all products and the shopping cart.
 *
 * This component displays a list of products that can be added to the shopping cart. The component
 * also displays feedback notifications for successful or unsuccessful checkout or setup. The component
 * uses redux actions to initialize the store, update the cart state, and handle checkout events. The component
 * also uses lazy loading and suspense to load the product components only when needed.
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} The Shop component.
 */

import { Suspense, lazy, useEffect } from "react";
import { Alert, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import {
	initializeStore,
	selectCartProducts,
	selectIsCheckoutError,
	selectIsCheckoutSuccess,
	selectIsSetupError,
	setIsCheckoutError,
	setIsCheckoutSuccess,
	setIsSetupError,
} from "../../store/shoppingCart";
import LoadingSpinner from "../LoadingSpinner/spinner";
import { IProduct } from "../Product/product";

// Lazy load the Product component
const Product = lazy(() => import("../Product/product"));

// Define the Shop component
const Shop = () => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();
	// Reference to shopping cart
	const cart = useSelector(selectCartProducts);

	// track checkout error or success and setup error to show feedback notifications
	const isCheckoutError = useSelector(selectIsCheckoutError);
	const isCheckoutSuccess = useSelector(selectIsCheckoutSuccess);
	const isSetupError = useSelector(selectIsSetupError);

	// initialization - get all products and add to cart
	useEffect(() => {
		// do setup if there is nothing in shop or previous error
		if (cart === undefined || cart.length === 0) {
			dispatch(initializeStore());
		}
	}, [cart, dispatch]);

	// Check to see if this is a redirect back from Checkout
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);

		if (query.get("success")) {
			// reset store and show success message
			dispatch(initializeStore());
			dispatch(setIsCheckoutSuccess(true));
		} else if (query.get("canceled")) {
			dispatch(setIsCheckoutError(true));
			dispatch(setIsCheckoutSuccess(false));
		} else {
			// clear checkout messages on new visit/reload
			dispatch(setIsCheckoutError(false));
			dispatch(setIsCheckoutSuccess(false));
			dispatch(setIsSetupError(false));
		}
	}, [dispatch]);

	if (isSetupError) {
		// Feedback notifcation if there was an error during shop setup
		return (
			<Container id="shop" className="content-container mb-3 py-3 px-3">
				<Alert variant="danger">
					<p className="mb-0">
						Error occurred during setup. Please try again.
					</p>
				</Alert>
			</Container>
		);
	} else if (cart.length <= 0) {
		// placeholder until we have information to load
		return <LoadingSpinner />;
	} else {
		return (
			// Display feedback notifications followed by store with each product.
			// Includes the shopping cart sidebar overlay component
			<div>
				{/* Feedback for successful form submission */}
				{isCheckoutSuccess && (
					<Alert variant="success">
						<p className="mb-0">
							Success - Thanks for your support!
						</p>
					</Alert>
				)}
				{/* Feedback for unsuccessful form submission */}
				{isCheckoutError && (
					<Alert variant="danger">
						<p className="mb-0">
							Error occurred during checkout. Please try again.
						</p>
					</Alert>
				)}
				{/* List each product in its own component container */}
				{cart.map((each: IProduct) => {
					return (
						<Suspense
							key={each.stripeProductID}
							fallback={<LoadingSpinner />}
						>
							<Product product={each}></Product>
						</Suspense>
					);
				})}
			</div>
		);
	}
};

export default Shop;
