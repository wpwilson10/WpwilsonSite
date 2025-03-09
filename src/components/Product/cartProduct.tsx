/**
 * The CartProduct component that displays a product item in the shopping cart.
 *
 * This component displays a product item with its image, name, price, and quantity.
 * The component also allows the user to increment or decrement the quantity of the product,
 * or remove the product from the cart. The component uses redux actions to update the state
 * of the shopping cart accordingly.
 *
 * @component
 * @param {Object} props The props passed to the component.
 * @param {IProduct} props.product The product object to display in the cart.
 * @returns {ReactElement} The CartProduct component.
 */

import { Button, Col, Container, Row, Image, Stack } from "react-bootstrap";
import { useAppDispatch } from "../../store/store";
import {
	decrementQuantity,
	incrementQuantity,
	removeItem,
} from "../../store/shoppingCart";
import { IProduct } from "./product";
import { formatPrice } from "../../utils/price";

// Define the CartProduct component
export const CartProduct = ({ product }: { product: IProduct }) => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	const decrement = () => {
		// Use remove button instead of decrementing to 0
		if (product.quantity > 1) {
			dispatch(
				decrementQuantity({
					productID: product.stripeProductID,
				})
			);
		}
	};
	const increment = () => {
		dispatch(
			incrementQuantity({
				productID: product.stripeProductID,
			})
		);
	};

	const removeProduct = () => {
		dispatch(
			removeItem({
				productID: product.stripeProductID,
			})
		);
	};

	return (
		<Container id="product" className="cart-product-container px-0 py-1">
			<Row className="mb-3">
				<Col xs={3} className="d-flex justify-content-start">
					<Image
						rounded
						className="profile-img"
						src={product.images[0]}
						height={64}
						width={100}
						alt="The product's default image"
					></Image>
				</Col>
				<Col xs={9} className="d-flex justify-content-end">
					<Stack gap={1}>
						<h5>{product.name}</h5>
						<h6>${formatPrice(product.unitAmount, "USD", 1)}</h6>
					</Stack>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col className="d-flex justify-content-start align-items-center">
					<Button variant="outline-danger" onClick={removeProduct}>
						&times;
					</Button>
				</Col>
				<Col className="d-flex flex-row justify-content-end align-items-center">
					<Button
						className="quantity-selector-input py-0"
						onClick={decrement}
					>
						-
					</Button>
					<div className="quantity-selector-text mx-2">
						{product.quantity}
					</div>
					<Button
						className="quantity-selector-input py-0"
						onClick={increment}
					>
						+
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default CartProduct;
