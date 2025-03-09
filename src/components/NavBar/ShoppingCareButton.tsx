import React from "react";
import { NavLink, Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import { selectCartTotalQuantity, setIsOpen } from "../../store/shoppingCart";

/**
 * ShoppingCartButton displays a cart icon with item quantity
 * and opens the shopping cart sidebar when clicked.
 *
 * @component
 * @returns {ReactElement} a react component for the shopping cart button
 */
const ShoppingCartButton: React.FC = () => {
	const quantity = useSelector(selectCartTotalQuantity);
	const dispatch = useAppDispatch();

	// Open the shopping cart sidebar
	const openCart = () => {
		dispatch(setIsOpen(true));
	};

	return (
		<NavLink href="#" onClick={openCart}>
			<FaShoppingCart size="1.5em" />
			{quantity > 0 && <Badge bg="primary">{quantity}</Badge>}
		</NavLink>
	);
};

export default ShoppingCartButton;
