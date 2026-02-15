import { defaultScheduleData, ScheduleData } from "./models";

// Define the shape of the reducer state
export type SchedulerState = {
	data: ScheduleData;
	lastSavedData: ScheduleData;
	status: {
		unsavedChanges: boolean;
		isSuccessfullySubmitted: boolean;
		isSubmissionError: boolean;
		isLoading: boolean;
	};
};

// Define action types
export type SchedulerAction =
	| { type: "SET_DATA"; payload: ScheduleData }
	| { type: "SET_LAST_SAVED"; payload: ScheduleData }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_SUCCESS"; payload: boolean }
	| { type: "SET_ERROR"; payload: boolean }
	| { type: "RESET" }
	| { type: "SET_MODE"; payload: "dayNight" | "scheduled" | "demo" };

// Initial state
export const initialState: SchedulerState = {
	data: defaultScheduleData,
	lastSavedData: defaultScheduleData,
	status: {
		unsavedChanges: false,
		isSuccessfullySubmitted: false,
		isSubmissionError: false,
		isLoading: false,
	},
};

// Reducer function
export const lightSchedulerReducer = (
	state: SchedulerState,
	action: SchedulerAction
): SchedulerState => {
	switch (action.type) {
		case "SET_DATA":
			return {
				...state,
				data: action.payload,
				status: {
					...state.status,
					unsavedChanges: true,
					isSubmissionError: false,
					isSuccessfullySubmitted: false,
				},
			};
		case "SET_LAST_SAVED":
			return {
				...state,
				lastSavedData: action.payload,
				status: { ...state.status, unsavedChanges: false },
			};
		case "SET_LOADING":
			return {
				...state,
				status: { ...state.status, isLoading: action.payload },
			};
		case "SET_SUCCESS":
			return {
				...state,
				status: {
					...state.status,
					isSuccessfullySubmitted: action.payload,
				},
			};
		case "SET_ERROR":
			return {
				...state,
				status: { ...state.status, isSubmissionError: action.payload },
			};
		case "RESET":
			return {
				...state,
				data: state.lastSavedData,
				status: { ...state.status, unsavedChanges: false },
			};
		case "SET_MODE":
			return {
				...state,
				data: {
					...state.data,
					mode: action.payload,
				},
				status: {
					...state.status,
					unsavedChanges: true,
					isSuccessfullySubmitted: false,
					isSubmissionError: false,
				},
			};
		default:
			return state;
	}
};
