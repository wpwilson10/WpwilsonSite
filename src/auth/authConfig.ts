/**
 * Authentication configuration for AWS Cognito using react-oidc-context.
 *
 * This module exports configuration objects and utilities for setting up OpenID Connect (OIDC)
 * authentication with AWS Cognito. It uses the react-oidc-context library to handle
 * the authentication flow.
 *
 * Required environment variables:
 * - AWS_COGNITO_DOMAIN: The base Cognito domain for the user pool (e.g., https://{domain}.auth.{region}.amazoncognito.com)
 * - AWS_COGNITO_CLIENT_ID: The client ID from AWS Cognito app client settings
 * - AWS_COGNITO_AUTHORITY: The OIDC authority endpoint for the Cognito user pool
 *
 * @see {@link https://github.com/authts/react-oidc-context React OIDC Context}
 * @see {@link https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-userpools-server-contract-reference.html AWS Cognito OIDC Reference}
 */

import { AuthProviderProps } from "react-oidc-context";

const cognitoDomain = process.env.AWS_COGNITO_DOMAIN;
const clientId = process.env.AWS_COGNITO_CLIENT_ID;
const cognitoAuthority = process.env.AWS_COGNITO_AUTHORITY;

/**
 * Generates the AWS Cognito logout URL with the specified redirect URI.
 *
 * @param {string} logoutUri - The URI to redirect to after logout is complete
 * @returns {string} The complete Cognito logout URL with parameters
 * @throws {Error} If AWS_COGNITO_DOMAIN or AWS_COGNITO_CLIENT_ID are not set
 */
export const getCognitoLogoutUrl = (logoutUri: string) => {
	return `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

/**
 * Configuration object for react-oidc-context AuthProvider.
 *
 * @type {AuthProviderProps}
 * @property {string} authority - The OpenID Connect authority URL from AWS Cognito
 * @property {string} client_id - The client ID registered with AWS Cognito
 * @property {string} redirect_uri - The URI to redirect to after successful authentication
 * @property {string} response_type - The OAuth 2.0 response type (set to "code" for authorization code flow)
 * @property {string} scope - Space-separated list of OAuth scopes to request:
 *                          - email: Access to user's email
 *                          - openid: Required for OpenID Connect
 *                          - phone: Access to user's phone number
 *
 * @throws {Error} If AWS_COGNITO_AUTHORITY or AWS_COGNITO_CLIENT_ID are not set
 */
export const authConfig: AuthProviderProps = {
	authority: cognitoAuthority ?? "",
	client_id: clientId ?? "",
	redirect_uri: window.location.origin,
	response_type: "code",
	scope: "email openid phone",
};
