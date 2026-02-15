import { Dispatch } from "react";
import { SchedulerState, SchedulerAction } from "../reducer";

export const useScheduleHandlers = (
	state: SchedulerState,
	dispatch: Dispatch<SchedulerAction>
) => {
	/**
	 * Handles changes to the light scheduler mode.
	 * @param newMode - The new mode to set ("dayNight" or "demo")
	 */
	const handleModeChange = (newMode: "dayNight" | "demo") => {
		dispatch({ type: "SET_MODE", payload: newMode });
	};

	const handleCancel = () => {
		dispatch({ type: "RESET" });
	};

	/**
	 * Handles input changes for named schedule entries (sunrise, sunset, etc.)
	 * Matches by label string rather than unixTime to avoid edge cases
	 * where default entries all have unixTime: 0.
	 */
	const handleNamedEntryChange = (
		label: string,
		type: "warmBrightness" | "coolBrightness",
		value: string
	) => {
		const numericValue = Math.round(Math.min(100, Math.max(0, Number(value))));
		const updatedSchedule = state.data.brightnessSchedule.map((entry) =>
			entry.label === label ? { ...entry, [type]: numericValue } : entry
		);
		dispatch({
			type: "SET_DATA",
			payload: { ...state.data, brightnessSchedule: updatedSchedule },
		});
	};

	/**
	 * Handles time changes for bed_time and night_time entries.
	 * Sets unixTime to 0 since the server recomputes it on next GET.
	 */
	const handleTimeChange = (
		label: "bed_time" | "night_time",
		newTime: string
	) => {
		const updatedSchedule = state.data.brightnessSchedule.map((entry) =>
			entry.label === label
				? { ...entry, time: newTime, unixTime: 0 }
				: entry
		);
		dispatch({
			type: "SET_DATA",
			payload: { ...state.data, brightnessSchedule: updatedSchedule },
		});
	};

	return {
		handleModeChange,
		handleCancel,
		handleNamedEntryChange,
		handleTimeChange,
	};
};
