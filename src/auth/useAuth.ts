import { useAuth as useOidcAuth } from "react-oidc-context";

export const useAuth = () => {
	const auth = useOidcAuth();
	return {
		isAuthenticated: !!auth.user,
		login: auth.signinRedirect,
		logout: auth.signoutRedirect,
		user: auth.user,
	};
};
