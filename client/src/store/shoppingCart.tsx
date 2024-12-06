import {
	AnyAction,
	createSlice,
	PayloadAction,
	ThunkAction,
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { IProduct, IProductList } from "../components/Product/product";
import { formatPrice } from "../utils/price";
import { handleAxiosError } from "../utils/error";

// The server URL for the product API. This URL is set using the PRODUCT_API environment variable.
const productURL: string =
	process.env.API_DOMAIN_NAME! + process.env.PRODUCT_API!;

/**
 * Represents the shopping cart state in Redux. The cart with its array of products should
 * be initialized by loading the list from the server. Products are then "added" by incrementing
 * the quantity to be greater than zero. The shop component then references this list of products
 * and shows everything despite the quantity listed.
 *
 * Typescript + Redux wants an explicit state type and initialization for correct type inferrence
 * https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
 *
 * @type {Object}
 * @property {IProduct[]} cart - The array of products in the shopping cart.
 * @property {number} totalAmount - The sum total price of products in the shopping cart.
 * @property {number} totalQuantity - The total quantity of products in the shopping cart.
 * @property {boolean} isOpen - True if the shopping cort sidebar is open, false otherwise.
 * @property {number} isCheckoutError - True if there was an error during checkout, false otherwise.
 * @property {boolean} isCheckoutSuccess - True if checkout completed successfully, false otherwise.
 * @property {boolean} isSetupError - True if store setup encountered an errors, false otherwise.
 * @property {Date} timeStamp - Time of last update to the cart. Used to expire cart after some duration.
 */
type ShoppingCartState = {
	cart: IProduct[];
	totalAmount: number;
	totalQuantity: number;
	isOpen: boolean;
	isCheckoutError: boolean;
	isCheckoutSuccess: boolean;
	isSetupError: boolean;
	timeStamp: number;
};

/**
 * Initial state for the shopping cart slice.
 *
 * @type {ShoppingCartState}
 */
const initialState: ShoppingCartState = {
	cart: [],
	totalAmount: 0,
	totalQuantity: 0,
	isOpen: false,
	isCheckoutError: false,
	isCheckoutSuccess: false,
	isSetupError: false,
	timeStamp: Date.now(),
};

/**
 * Interface for updating products values in the shopping cart redux store. Uses just the product
 * and not the whole product to force lookup on the current product in the store as opposed to
 * some nebulous product object.
 *
 * @interface cartProduct
 * @property {string} productID - The product's stripe ID
 */
export interface cartProduct {
	productID: string;
}

/**
 * A Redux slice for managing the shopping cart state
 *
 * @type {Object}
 * @property {string} name - The slice name, "shoppingCart"
 * @property {ShoppingCartState} initialState - The initial empty state of the shopping cart slice
 * @property {Object} reducers - An object containing the reducer functions for updating the shopping cart state
 * @property {Function} reducers.resetShop - A reducer function that reinitializes the shop
 * @property {Function} reducers.setCart - A reducer function that sets the products in the shop
 * @property {Function} reducers.setIsOpen - A reducer function that sets the shopping cart sidebar to open or close
 * @property {Function} reducers.setIsCheckoutError - A reducer function that sets the checkout error flag.
 * @property {Function} reducers.setIsCheckoutSuccess - A reducer function that sets the checkout success flag.
 * @property {Function} reducers.setIsSetupError - A reducer function that sets the setup error flag.
 * @property {Function} reducers.addToCart - A reducer function that adds a product to the shopping cart or increases the quantity if the product is already in the cart
 * @property {Function} reducers.removeItem - A reducer function that removes a product from the shopping cart
 * @property {Function} reducers.decrementQuantity - A reducer function that decrements the quantity for a given product
 * @property {Function} reducers.incrementQuantity - A reducer function that increments the quantity for a given product
 */
const shoppingCartSlice = createSlice({
	name: "shoppingCart",
	initialState: initialState,
	reducers: {
		resetShop: () => initialState,
		setCart: (state, action: PayloadAction<IProductList>) => {
			state.cart = action.payload.products;
			// running totals
			recalculateTotal(state);
			state.timeStamp = Date.now();
		},
		setIsOpen: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload;
		},
		setIsCheckoutError: (state, action: PayloadAction<boolean>) => {
			state.isCheckoutError = action.payload;
		},
		setIsCheckoutSuccess: (state, action: PayloadAction<boolean>) => {
			state.isCheckoutSuccess = action.payload;
		},
		setIsSetupError: (state, action: PayloadAction<boolean>) => {
			state.isSetupError = action.payload;
		},
		addToCart: (state, action: PayloadAction<cartProduct>) => {
			let productInCart = findInCart(state, action.payload.productID);

			if (productInCart) {
				productInCart.quantity++;
				// running totals
				recalculateTotal(state);
				state.timeStamp = Date.now();
			} else {
				// shouldn't happend
				console.error("Tried to add product that doesn't exist");
			}
		},
		removeItem: (state, action: PayloadAction<cartProduct>) => {
			let productInCart = findInCart(state, action.payload.productID);
			// products get filtered out of cart when quantity = 0
			if (productInCart) {
				productInCart.quantity = 0;
				// running totals
				recalculateTotal(state);
				state.timeStamp = Date.now();
			}
		},
		decrementQuantity: (state, action: PayloadAction<cartProduct>) => {
			let productInCart = findInCart(state, action.payload.productID);

			if (productInCart) {
				// update quantity if there is more than one
				if (productInCart.quantity > 1) {
					productInCart.quantity--;
					// running totals
					recalculateTotal(state);
					state.timeStamp = Date.now();
				}
			}
		},
		incrementQuantity: (state, action: PayloadAction<cartProduct>) => {
			let productInCart = findInCart(state, action.payload.productID);

			if (productInCart) {
				// update quantity
				productInCart.quantity++;
				// running totals
				recalculateTotal(state);
				state.timeStamp = Date.now();
			}
		},
	},
});

/**
 * Finds the product from the shopping cart Redux state with a given product ID.
 *
 * @function
 * @param {RootState} state - The root redux state of the application.
 * @param {RootState} productID - The string ID of the product to look up.
 * @returns {IProduct} The product object from the shopping cart state.
 */
const findInCart = (state: ShoppingCartState, productID: string) => {
	return state.cart.find((item) => item.stripeProductID === productID);
};

/**
 * Recalculates the total quantity and prices of all products in the cart.
 *
 * @function
 * @param {RootState} state - The root redux state of the application.
 */
const recalculateTotal = (state: ShoppingCartState) => {
	let runningTotal = 0;
	let runningQuanity = 0;

	state.cart.forEach((item: IProduct) => {
		runningQuanity += item.quantity;
		runningTotal += item.quantity * item.unitAmount;
	});

	state.totalAmount = runningTotal;
	state.totalQuantity = runningQuanity;
};

/**
 * Selects the cart product array from the shopping cart Redux state.
 *
 * @function
 * @param {RootState} state - The root redux state of the application.
 * @returns {IProduct[]} The shopping cart array of products from the shopping cart state.
 */
export const selectCartProducts = (state: RootState): IProduct[] => {
	return state.shoppingCart.cart;
};

/**
 * Returns the total quantity of items in the shopping cart.
 *
 * @function
 * @param {RootState} state - The current state of the Redux store.
 * @returns {number} - The total quantity of items in the shopping cart.
 */
export const selectCartTotalQuantity = (state: RootState): number => {
	return state.shoppingCart.totalQuantity;
};

/**
 * Returns the total price amount of all items in the cart as a formatted string.
 *
 * @function
 * @param {RootState} state - The Redux store root state.
 * @returns {string} The total price amount of all items in the cart as a formatted string.
 */
export const selectCartTotalAmount = (state: RootState): string => {
	return formatPrice(state.shoppingCart.totalAmount, "USD", 1);
};

/**
 * Returns the open (visibility) status of the shopping cart sidebar.
 *
 * @function
 * @param {RootState} state - The Redux store root state.
 * @returns {boolean} True if the cart sidebar is open and thus visible. False if not open.
 */
export const selectIsOpen = (state: RootState): boolean => {
	return state.shoppingCart.isOpen;
};

/**
 * Returns whether there was an error during checkout.
 *
 * @function
 * @param {RootState} state - The Redux store root state.
 * @returns {boolean} True if there was an error during checkout. False otherwise.
 */
export const selectIsCheckoutError = (state: RootState): boolean => {
	return state.shoppingCart.isCheckoutError;
};

/**
 * Returns whether there was a successfully completed checkout.
 *
 * @function
 * @param {RootState} state - The Redux store root state.
 * @returns {boolean} True if there was an successfully completed checkout. False otherwise.
 */
export const selectIsCheckoutSuccess = (state: RootState): boolean => {
	return state.shoppingCart.isCheckoutSuccess;
};

/**
 * Returns whether there was an error during store setup
 *
 * @function
 * @param {RootState} state - The Redux store root state.
 * @returns {boolean} True if there was an error during store setup. False otherwise.
 */
export const selectIsSetupError = (state: RootState): boolean => {
	return state.shoppingCart.isSetupError;
};

/**
 * A thunk action creator that initializes the shopping cart state by fetching the products from the server and adding them to the cart.
 *
 * https://redux.js.org/usage/usage-with-typescript#type-checking-redux-thunks
 *
 * @function
 * @returns {ThunkAction<void, RootState, unknown, AnyAction>} A redux thunk action that dispatches other actions to update the shopping cart state.
 */
export const initializeStore = (): ThunkAction<
	void,
	RootState,
	unknown,
	AnyAction
> => {
	return async (dispatch) => {
		try {
			// reset before doing async
			dispatch(resetShop);

			const response = await axios.get(productURL);
			// validate that we got some kind of products
			if (
				response &&
				response.data &&
				response.data.products &&
				response.data.products[0].stripeProductID
			) {
				// good data so put in cart
				dispatch(setCart(response.data));
			}
		} catch (error) {
			handleAxiosError(error);
			dispatch(resetShop);
			dispatch(setIsSetupError(true));
		}
	};
};

/**
 * This statement exports the reducer function as the default export of the module,
 * so it can be imported by other parts of the codebase. In this specific case,
 * it is used by the Redux store to manage the state of the shopping cart.
 */
export default shoppingCartSlice.reducer;
/**
    Destructures the actions object from the shoppingCartSlice slice and
    assigns the addToCart, removeItem, and setCart action creators to
    constants. These constants can be used to dispatch these actions from
    components or other parts of the Redux store.
    */
export const {
	addToCart,
	removeItem,
	setCart,
	resetShop,
	setIsOpen,
	setIsCheckoutError,
	setIsCheckoutSuccess,
	setIsSetupError,
	incrementQuantity,
	decrementQuantity,
} = shoppingCartSlice.actions;
