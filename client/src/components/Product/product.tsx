/**
 * The Product component that displays a product item in the shop page.
 *
 * This component displays a product item with its image, name, price, and description.
 * The component also allows the user to add the product to the shopping cart. The component
 * uses redux actions to update the state of the shopping cart accordingly.
 *
 * @component
 * @param {Object} props The props passed to the component.
 * @param {IProduct} props.product The product object to display in the shop page.
 * @returns {ReactElement} The Product component.
 */

import { Button, Col, Container, Row, Image } from "react-bootstrap";
import { useAppDispatch } from "../../store/store";
import { incrementQuantity, setIsOpen } from "../../store/shoppingCart";
import { formatPrice } from "../../utils/price";

/**
 * Represents a product object from the server based on the Stripe API.
 *
 * @see {@link https://stripe.com/docs/api/products/object|Stripe API documentation}.
 *
 * @interface IProduct
 * @property {string} stripeProductID - The unique identifier for the product.
 * @property {string} name - The name of the product.
 * @property {string} description - A description of the product.
 * @property {string[]} images - An array of image URLs for the product.
 * @property {string} stripePriceID - The unique identifier for the price associated with the product.
 * @property {number} unitAmount - The the price associated with the a single unit of the product.
 * @property {string} currency - The currency of the product.
 * @property {number} quantity - The number of units of the product selected.
 */
export interface IProduct {
	stripeProductID: string;
	name: string;
	description: string;
	images: string[];
	stripePriceID: string;
	unitAmount: number;
	currency: string;
	quantity: number;
}

/**
 * Interface for a list of IProducts
 *
 * @interface IProductList
 * @property {Array<IProduct>} products - an array of product objects
 */
export interface IProductList {
	products: IProduct[];
}

// Define the Product component
export const Product = ({ product }: { product: IProduct }) => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	const addProduct = () => {
		dispatch(
			incrementQuantity({
				productID: product.stripeProductID,
			})
		);
		dispatch(setIsOpen(true));
	};

	return (
		<Container id="product" className="content-container mb-3 py-3 px-3">
			<Row className="justify-content-center">
				<Col xs={9} md={3} className="mb-3">
					<Image
						rounded
						className="profile-img"
						src={product.images[0]}
						height={144}
						width={256}
						alt="The product's default image"
					></Image>
				</Col>
				<Col xs={12} md={9}>
					<Row>
						<h3>{product.name}</h3>
					</Row>
					<Row>
						<h4>${formatPrice(product.unitAmount, "USD", 1)}</h4>
					</Row>
					<Row>
						<p>{product.description}</p>
					</Row>
				</Col>
			</Row>

			<Row className="justify-content-md-center">
				{/* Submit button aligned to the right*/}
				<Col md={12} className="mb-3 d-flex justify-content-end">
					<Button type="submit" onClick={addProduct}>
						Add to Cart
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default Product;
