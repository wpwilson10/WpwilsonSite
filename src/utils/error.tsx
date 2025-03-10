/**
 * The error module that provides utility functions and components for handling and logging errors in the application.
 *
 * This module exports several functions and components for dealing with errors that may occur during the execution of the application.
 * The module uses axios to send error information to a server API, which is specified by the ERROR_API environment variable.
 * The module also exports a React component that renders a fallback UI when an error boundary catches an error in a child component tree.
 *
 * @module error
 */

import { FallbackProps } from "react-error-boundary";
import { ErrorInfo } from "react";
import axios from "axios";

const errorURL: string = process.env.API_DOMAIN_NAME! + process.env.ERROR_API!;
// The AWS secret token for the light schedule API.
const awsSecretToken: string = process.env.AWS_LOGGING_SECRET_TOKEN!;

/**
 * An interface that represents an error object with additional properties for logging and debugging.
 *
 * @interface IError
 * @property {string} name - The name of the error (e.g., "TypeError", "ReferenceError")
 * @property {string} level - The severity level of the error (e.g., "ERROR", "WARN", "INFO")
 * @property {string} message - The human-readable error message describing what went wrong
 * @property {string} [stack] - The stack trace showing where the error occurred (if available)
 * @property {string} [componentStack] - React component tree stack trace (for React errors)
 * @property {string} service_name - The name/URL of the service where the error occurred
 * @property {Object} [clientInfo] - Information about the client environment
 * @property {string} clientInfo.userAgent - The browser's user agent string
 * @property {string} clientInfo.url - The URL where the error occurred
 */
export interface IError {
	name: string;
	level: string;
	message: string;
	stack: string | undefined; // Non-standard property that should be supported by most browsers
	componentStack: string | undefined; // Used by react error boundary
	service_name: string;
	clientInfo?: {
		userAgent: string;
		url: string;
	};
}

function getClientInfo() {
	return {
		userAgent: navigator.userAgent,
		url: window.location.href,
	};
}

/**
 * A function that logs an error and its component stack to the server using axios.
 *
 * This function takes an error object and an info object that contains a componentStack property,
 * and creates an IError object with these properties. The function then sends a POST request to
 * the error API with the IError object as the data. The function also logs the error message to
 * the console using console.error.
 *
 * @function
 * @param {Error} error - The error object to be logged.
 * @param {ErrorInfo} info - A React object that contains a componentStack property with information about which component threw the error.
 */
export const logErrorBoundary = (error: Error, info: ErrorInfo) => {
	const err: IError = {
		name: error.name,
		level: "ERROR",
		message: error.message,
		stack: error?.stack,
		componentStack: info.componentStack ?? undefined,
		service_name: errorURL,
		clientInfo: getClientInfo(),
	};

	console.error("Error logger:" + err.message);
	axios.post(errorURL, err, {
		headers: {
			"content-type": "application/json",
			"x-custom-auth": awsSecretToken,
		},
	});
};

/**
 * A function that logs any kind of error to the server using axios, and adds some additional information if it is an instance of Error.
 *
 * This function takes an error object and a string that provides some context or information about where or why the error occurred.
 * The function then sends a POST request to the error API with the IError object as the data. If another error occurs during this request,
 * the function calls handleAxiosError to handle it. The function also logs the IError message to the console using console.error.
 *
 * @function
 * @param {any} error - The error object to be logged.
 * @param {string} info - A string that provides some context or information about where or why the error occurred.
 */
export const logErrorToServer = (error: any, info: string) => {
	let err: IError = {
		name: "Unknown error",
		message: "logErrorToServer: ".concat(info),
		level: "ERROR",
		stack: error?.stack,
		componentStack: undefined,
		service_name: errorURL,
		clientInfo: getClientInfo(),
	};

	// if this is a real error type, add the additional info
	if (error instanceof Error) {
		err.name = error.name;
		err.message = err.message.concat(" : ", error?.message);
	}

	try {
		axios.post(errorURL, err, {
			headers: {
				"content-type": "application/json",
				"x-custom-auth": awsSecretToken,
			},
		});
	} catch (error) {
		handleAxiosError(error);
	}

	console.error(err.message);
};

/**
 * A React component that renders a fallback UI when an error boundary catches an error in a child component tree.
 *
 * The component renders a div element with an alert role, a paragraph element with the error message,
 * and a button element that calls resetErrorBoundary when clicked.
 *
 * Library recommended in official docs - https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 *
 * @component ErrorFallback
 * @param {IError} error - An IError object that contains information about the error that occurred.
 * @param {() => void} resetErrorBoundary - A function that can be called to reset the state of the error boundary and retry rendering its children.
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre>{error?.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}

/**
 * A function that handles any kind of axios errors and logs them to the console and server for later debugging.
 *
 * This function takes an error object and checks if it is an instance of AxiosError using axios.isAxiosError method.
 * If it is an AxiosError, it means that there was a problem with making or receiving an axios request, and it may contain
 * information about the request, response, or config. The function logs these information using console.warn method.
 * If it is not an AxiosError, it means that there was another kind of problem with setting up or executing an axios request,
 * such as network errors or invalid parameters. The function logs these errors using console.error method, and also calls
 * logErrorToServer function to send them to the server API.
 *
 * @function handleAxiosError
 * @param {any} error - The error object to be handled.
 */
export function handleAxiosError(error: any) {
	// https://axios-http.com/docs/handling_errors
	if (axios.isAxiosError(error)) {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.warn(error.response.data);
			console.warn(error.response.status);
			console.warn(error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			console.warn(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			logErrorToServer(error, "handleAxiosError");
			console.error("Error", error.message);
		}
	}
}
