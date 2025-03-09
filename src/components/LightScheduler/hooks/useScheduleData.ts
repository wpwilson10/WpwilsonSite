import { useEffect, useReducer, useCallback } from "react";
import axios from "axios";
import { lightSchedulerReducer, initialState } from "../reducer";
import { ScheduleData } from "../models";
import { handleAxiosError } from "../../../utils/error";

// The server URL for the light schedule API.
const lightScheduleURL: string =
	process.env.API_DOMAIN_NAME! + process.env.LIGHT_SCHEDULE_API!;

// The AWS secret token for the light schedule API.
const awsSecretToken: string = process.env.AWS_LIGHTS_SECRET_TOKEN!;

export const useScheduleData = () => {
	const [state, dispatch] = useReducer(lightSchedulerReducer, initialState);

	// Fetch schedule from the API
	const fetchSchedule = useCallback(async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		dispatch({ type: "SET_ERROR", payload: false });

		try {
			const response = await axios.get<ScheduleData>(lightScheduleURL);
			if (!response.data) {
				throw new Error("Failed to load schedule data");
			}
			dispatch({ type: "SET_DATA", payload: response.data });
			dispatch({ type: "SET_LAST_SAVED", payload: response.data });
		} catch (error) {
			handleAxiosError(error);
			dispatch({ type: "SET_ERROR", payload: true });
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, []);

	// Save schedule to the API
	const saveSchedule = async () => {
		try {
			await axios.post(lightScheduleURL, state.data, {
				headers: {
					"content-type": "application/json",
					"x-custom-auth": awsSecretToken,
				},
			});
			dispatch({ type: "SET_LAST_SAVED", payload: state.data });
			dispatch({ type: "SET_SUCCESS", payload: true });
		} catch (error) {
			handleAxiosError(error);
			dispatch({ type: "SET_ERROR", payload: true });
		}
	};

	// Fetch schedule **only once** when the component mounts
	useEffect(() => {
		fetchSchedule();
	}, [fetchSchedule]);

	// Return the state and functions for use in components
	return { state, dispatch, saveSchedule };
};
