import { useAuth as useOidcAuth } from "react-oidc-context";
import { logErrorToServer } from "../utils/error";
import { getCognitoLogoutUrl } from "./authConfig";

/**
 * Custom hook for managing authentication state and operations.
 * Wraps OIDC authentication functionality with AWS Cognito integration.
 *
 * @returns An object containing authentication state and methods:
 * - `isAuthenticated` - Boolean indicating if user is authenticated
 * - `isLoading` - Boolean indicating if auth state is being loaded
 * - `error` - Any authentication errors that occurred
 * - `login` - Function to initiate sign-in redirect flow
 * - `logout` - Function to sign out user and redirect to logout URL
 * - `user` - The authenticated user object if available
 * - `tokens` - Object containing ID, access and refresh tokens
 */
export const useAuth = () => {
	const auth = useOidcAuth();

	// Handles the Cognito-specific logout redirect
	const signOutRedirect = () => {
		try {
			const logoutUri = window.location.origin;
			// Redirect to Cognito's hosted UI logout endpoint
			window.location.href = getCognitoLogoutUrl(logoutUri);
		} catch (error) {
			logErrorToServer(error, "Logout failed.");
		}
	};

	// Main logout function that orchestrates the complete logout flow
	const logout = async () => {
		// Step 1: Clear local session data and tokens
		await auth.removeUser();
		// Step 2: Redirect to Cognito to clear server-side session
		signOutRedirect();
	};

	return {
		isAuthenticated: !!auth.user,
		isLoading: auth.isLoading,
		error: auth.error,
		login: () => auth.signinRedirect(),
		logout,
		user: auth.user,
		tokens: {
			idToken: auth.user?.id_token,
			accessToken: auth.user?.access_token,
			refreshToken: auth.user?.refresh_token,
		},
	};
};
