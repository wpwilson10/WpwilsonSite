import { Button } from "react-bootstrap";
import { useAuth } from "../../auth/useAuth";

/**
 * A component that renders authentication-related buttons and user information.
 * Displays a login button when the user is not authenticated, and shows the user's email
 * along with a logout button when authenticated.
 *
 * @component
 * @returns {ReactElement} Either login button or user email with logout button
 * ```
 */
const AuthButton = () => {
	const { isAuthenticated, login, logout, user } = useAuth();

	return isAuthenticated ? (
		<>
			<span className="me-2 text-light">{user?.profile.email}</span>
			<Button variant="danger" onClick={() => logout()}>
				Logout
			</Button>
		</>
	) : (
		<Button variant="primary" onClick={() => login()}>
			Login
		</Button>
	);
};

export default AuthButton;
