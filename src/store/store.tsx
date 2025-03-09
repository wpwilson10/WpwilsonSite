/**
 * The store module that configures and exports the Redux store for the application.
 *
 * This module creates a Redux store using the configureStore function from Redux Toolkit.
 * The store holds the state of the shopping cart slice, which is currently the only slice in this application.
 * The module also defines and exports some utility types and hooks for accessing the store state and dispatching actions.
 * The module also implements some functions for saving and loading the store state to and from localStorage,
 * so that the shopping cart state can be persisted across browser sessions. The localStorage state is only valid
 * for 24 hours, after which it is reinitialized.
 *
 * The only thing you should need to do in this file is add reducers to the rootReducer.
 * See - https://redux-toolkit.js.org/tutorials/typescript
 *
 * @module store
 */

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import shoppingCartReducer from "./shoppingCart";
import { logErrorToServer } from "../utils/error";

/**
 * The reducer object that defines how to update data in the store.
 * https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-state-type
 */
const rootReducer = combineReducers({ shoppingCart: shoppingCartReducer });

/**
 * The centralized redux store object that holds the entire state tree of the application.
 */
export const store = configureStore({
	reducer: rootReducer,
	preloadedState: loadFromLocalStorage(),
});

// Have the store update the browser's local storage when it is changed.
// https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
store.subscribe(() => saveToLocalStorage(store.getState()));

/**
 * A function that converts an object to a string and stores it in localStorage.
 *
 * This function serializes the given state object using JSON.stringify and stores it in localStorage
 * under the key "store". This function is used to persist the Redux store state across browser sessions.
 * If an error occurs during serialization or storage, the function logs a warning to the console.
 *
 * https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
 *
 * @function
 * @param {RootState} state - The state object to be stored in localStorage.
 */
function saveToLocalStorage(state: RootState) {
	try {
		const serialisedState = JSON.stringify(state);
		localStorage.setItem("store", serialisedState);
	} catch (e) {
		console.warn(e);
	}
}

/**
 * A function that loads a string from localStorage and converts it into an object.
 *
 * This function retrieves the string stored in localStorage under the key "store" and parses it
 * using JSON.parse. The function returns the parsed object as the initial state for the Redux store.
 * If the string is null, invalid, or expired (older than 24 hours), the function returns undefined,
 * which causes the store to be reinitialized. If an error occurs during parsing or retrieval, the
 * function logs the error to the server and returns undefined.
 *
 * // https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
 *
 * @function
 * @returns {RootState | undefined} The initial state object for the Redux store, or undefined if none is found or valid.
 */
function loadFromLocalStorage() {
	try {
		const serialisedState = localStorage.getItem("store");
		if (serialisedState === null) return undefined;

		let state = JSON.parse(serialisedState);

		// basic type guard
		if (
			state &&
			state.shoppingCart &&
			state.shoppingCart.cart &&
			state.shoppingCart.timeStamp
		) {
			// check if cart is less than 24 hours old
			if (
				Date.now() - state.shoppingCart.timeStamp <
				24 * 60 * 60 * 1000
			) {
				// got good current data, so return state
				return state;
			}
		}

		// otherwise reinitialize
		return undefined;
	} catch (e) {
		logErrorToServer(e, "loadFromLocalStorage");
		return undefined;
	}
}

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux-toolkit.js.org/tutorials/typescript#define-root-state-and-dispatch-types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
// https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
