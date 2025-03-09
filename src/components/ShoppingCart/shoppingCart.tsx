/**
 * The ShoppingCart component that displays an off-canvas sidebar with the shopping cart items and checkout button.
 *
 * This component displays an off-canvas sidebar that can be toggled by clicking on the shopping cart icon in the navigation bar.
 * The sidebar shows the products that have been added to the cart, their quantities, and their prices. The sidebar also shows
 * the total number of items and the total amount of the cart. The component allows the user to checkout by sending a POST request
 * to the server with the cart items and redirecting to the Stripe checkout URL. The component uses redux actions to update the state
 * of the shopping cart and handle checkout events.
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} The ShoppingCart component.
 */

import { Button, Col, Offcanvas, Row, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import CartProduct from "../Product/cartProduct";
import {
	selectCartProducts,
	selectCartTotalAmount,
	selectCartTotalQuantity,
	selectIsOpen,
	setIsCheckoutError,
	setIsCheckoutSuccess,
	setIsOpen,
} from "../../store/shoppingCart";
import axios from "axios";
import { handleAxiosError } from "../../utils/error";
import { IProduct } from "../Product/product";

// The server URL for the checkout API. This URL is set using the CHECKOUT_API environment variable.
const checkoutURL: string =
	process.env.API_DOMAIN_NAME! + process.env.CHECKOUT_API!;

// Define the ShoppingCart component
const ShoppingCart = () => {
	const cart = useSelector(selectCartProducts);
	const amount = useSelector(selectCartTotalAmount);
	const quantity = useSelector(selectCartTotalQuantity);
	const isOpen = useSelector(selectIsOpen);

	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	// putting the dispatch directly in the onHide property caused errors for some reason
	const closeCart = () => {
		dispatch(setIsOpen(false));
	};

	const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();

		dispatch(setIsCheckoutError(false));
		dispatch(setIsCheckoutSuccess(false));

		try {
			// filter out products with quantity zero
			const nonZeroProducts = cart.filter((value) => value.quantity > 0);
			// send to server
			const response = await axios.post(checkoutURL, nonZeroProducts);
			// redirect to stripe
			if (response && response.data && response.data.url) {
				// redirect to checkout url
				window.location.href = response.data.url;
			}
		} catch (error) {
			dispatch(setIsCheckoutError(true));
			handleAxiosError(error);
		}
	};

	// only show items in cart that  have nonzero quantity
	const cartItems = cart.filter((product: IProduct) => product.quantity > 0);

	return (
		<Offcanvas
			id="shoppingCart"
			show={isOpen}
			onHide={closeCart}
			placement="end"
		>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Cart</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<Stack gap={2}>
					{cartItems.map((item: IProduct) => (
						<CartProduct
							key={item.stripeProductID}
							product={item}
						></CartProduct>
					))}
					<Row>
						<Col className="d-flex justify-content-start">
							<h5>Items: {quantity}</h5>
						</Col>
						<Col className="d-flex justify-content-end">
							<h5>Total: ${amount}</h5>
						</Col>
					</Row>
					<Col className="d-flex justify-content-end">
						<Button onClick={onSubmit}>Checkout</Button>
					</Col>
				</Stack>
			</Offcanvas.Body>
		</Offcanvas>
	);
};

export default ShoppingCart;
