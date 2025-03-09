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

import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthButton from "./AuthButton";
import ShoppingCartButton from "./ShoppingCareButton";

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
 * NavRight displays authentication and shopping cart buttons
 *
 * @component
 * @returns {ReactElement} a react component for the right side of the NavBar
 */
const NavRight = () => {
	return (
		<Nav className="ms-auto d-flex align-items-center gap-3">
			<ShoppingCartButton />
			<AuthButton />
		</Nav>
	);
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
