/**
 * The index file that renders the root element of the application using React 18's createRoot method.
 *
 * This file imports the App component from ./App and wraps it with Provider, BrowserRouter, and React.StrictMode components.
 * The file also imports the store object from ./store/store and passes it to the Provider component as a prop.
 * The file uses the createRoot method from react-dom/client to create a root object that can render concurrent React components into a container element.
 * The file then calls the render method of the root object with the App component as an argument. The file also uses a try-catch block to handle any errors that may occur during rendering.
 * If an error occurs, the file calls logErrorToServer function from ./utils/error to log the error to the server API, and renders a fallback UI with an alert role and an error message into the container element.
 *
 * @file index.js
 */

import { createRoot } from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { logErrorToServer } from "./utils/error";

// React 18
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

// Handle any rendering errors
try {
	root.render(
		// helper component that enables some additional checks and warnings in development mode
		// See https://react.dev/reference/react/StrictMode
		<React.StrictMode>
			{/*
			 * Makes the Redux store available to any nested components that need to access to the store.
			 * See https://react-redux.js.org/api/provider
			 */}
			<Provider store={store}>
				{/*
				 * Enables the single page app to to navigate between different views without refreshing the whole webpage.
				 * See https://reactrouter.com/en/main/router-components/browser-router
				 */}
				<BrowserRouter>
					{/* The main application component */}
					<App />
				</BrowserRouter>
			</Provider>
		</React.StrictMode>
	);
} catch (e) {
	// If there was an error, send to server and handle error if possible
	logErrorToServer(e, "Index rendering root");
	if (e instanceof Error) {
		root.render(
			<div role="alert">
				<p>Something went wrong:</p>
				<pre>{e?.message}</pre>
			</div>
		);
	} else {
		root.render(
			<div role="alert">
				<p>Something went wrong. Please try again</p>
			</div>
		);
	}
}
