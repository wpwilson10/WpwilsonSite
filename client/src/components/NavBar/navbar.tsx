/**
 * NavBar is the main navigation bar component for the website and
 * contains two components for the left and right side of the navigation bar.
 * It also has properties for collapsing on select, expanding to large viewports,
 * using a dark variant, and being fixed to the top of the viewport.
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} a react component for the NavBar
 */

import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/store";
import { selectCartTotalQuantity, setIsOpen } from "../../store/shoppingCart";
import { Link } from "react-router-dom";

// Define the NavBar component
const NavBar = () => {
	return (
		<Navbar
			collapseOnSelect={true}
			expand="lg"
			className="navbar"
			variant="dark"
			fixed="top"
		>
			<Container fluid>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<NavLeft />
				</Navbar.Collapse>
				<NavRight />
			</Container>
		</Navbar>
	);
};

/**
 * NavRight displays a shopping cart icon with the number of items in the cart
 * which will render on the right side a navigation bar
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} a react component for the right side of the NavBar
 */
const NavRight = () => {
	const quantity = useSelector(selectCartTotalQuantity);
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	const openCart = () => {
		dispatch(setIsOpen(true));
	};

	if (quantity > 0) {
		return (
			<Nav className="ms-auto" onSelect={openCart}>
				<Nav.Link href="#" eventKey="cart" as="span">
					<FaShoppingCart size="1.5em" />{" "}
					<Badge bg="primary">{quantity}</Badge>
				</Nav.Link>
			</Nav>
		);
	} else {
		return (
			<Nav className="ms-auto" onSelect={openCart}>
				<Nav.Link href="#" eventKey="cart" as="span">
					<FaShoppingCart size="1.5em" />{" "}
				</Nav.Link>
			</Nav>
		);
	}
};

/**
 * NavLeft contains links that will render on the left side a navigation bar.
 * eventKey="#" makes collapseOnSelect work - https://stackoverflow.com/a/56485081
 * How to get react-router-dom and bootstrap links to play nice
 * - https://stackoverflow.com/questions/54843302/reactjs-bootstrap-navbar-and-routing-not-working-together
 *
 * @component
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} a react component for the left side of the NavBar
 */
const NavLeft = () => {
	return (
		<Nav className="me-auto">
			<Nav.Link eventKey="home" as={Link} to="/#home">
				Home
			</Nav.Link>
			<Nav.Link eventKey="about" as={Link} to="/#about">
				About
			</Nav.Link>
			<Nav.Link eventKey="contact" as={Link} to="/contact">
				Contact
			</Nav.Link>
			<Nav.Link eventKey="shop" as={Link} to="/shop">
				Shop
			</Nav.Link>
			<Nav.Link eventKey="lights" as={Link} to="/lights">
				Lights
			</Nav.Link>
		</Nav>
	);
};

export default NavBar;
