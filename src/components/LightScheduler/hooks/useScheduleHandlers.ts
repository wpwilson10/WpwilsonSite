import { Dispatch } from "react";
import { ScheduleEntry } from "../models";
import { SchedulerState, SchedulerAction } from "../reducer";

export const useScheduleHandlers = (
	state: SchedulerState,
	dispatch: Dispatch<SchedulerAction>
) => {
	/**
	 * Handles changes to the light scheduler mode.
	 * @param newMode - The new mode to set. Can be one of three values:
	 *                 - "dayNight": Switches lights based on sunrise/sunset
	 *                 - "scheduled": Switches lights based on user-defined schedule
	 *                 - "demo": Demonstration mode for light operations
	 */
	const handleModeChange = (newMode: "dayNight" | "scheduled" | "demo") => {
		dispatch({ type: "SET_MODE", payload: newMode });
	};

	const handleCancel = () => {
		dispatch({ type: "RESET" });
	};

	/**
	 * Handles input changes for named schedule entries (sunrise, sunset, etc.)
	 */
	const handleNamedEntryChange = (
		unix_time: number,
		type: "warmBrightness" | "coolBrightness",
		value: string
	) => {
		const numericValue = Math.min(100, Math.max(0, Number(value)));
		const namedEntries = [
			"sunrise",
			"sunset",
			"natural_sunset",
			"civil_twilight_begin",
			"civil_twilight_end",
			"natural_twilight_end",
			"bed_time",
			"night_time",
		] as const;

		const matchingEntry = namedEntries.find(
			(key) => state.data[key]?.unix_time === unix_time
		);

		if (matchingEntry) {
			dispatch({
				type: "SET_DATA",
				payload: {
					...state.data,
					[matchingEntry]: {
						...state.data[matchingEntry],
						[type]: numericValue,
					},
				},
			});
		}
	};

	/**
	 * Handles time changes for bed_time and night_time entries.
	 */
	const handleTimeChange = (
		key: "bed_time" | "night_time",
		newTime: string
	) => {
		// Get current date
		const today = new Date();
		const [hours, minutes] = newTime.split(":");

		// Create new date with today's date but with new time
		const newDate = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			parseInt(hours),
			parseInt(minutes)
		);

		const unix_time = Math.floor(newDate.getTime() / 1000);

		dispatch({
			type: "SET_DATA",
			payload: {
				...state.data,
				[key]: {
					...state.data[key], // Preserve existing fields
					time: newTime,
					unix_time,
				},
			},
		});
	};

	/**
	 * Handles input changes for regular schedule entries
	 */
	const handleScheduledEntryChange = (
		unix_time: number,
		type: "warmBrightness" | "coolBrightness",
		value: string
	) => {
		const numericValue = Math.min(100, Math.max(0, Number(value)));
		const updatedSchedule = state.data.schedule.map((entry) =>
			entry.unix_time === unix_time
				? { ...entry, [type]: numericValue }
				: entry
		);

		dispatch({
			type: "SET_DATA",
			payload: { ...state.data, schedule: updatedSchedule },
		});
	};

	/**
	 * Handles removing a schedule entry.
	 *
	 * @param {number} unix_time - The Unix timestamp of the schedule entry to remove.
	 */
	const handleRemoveRow = (unix_time: number) => {
		// Filter out the entry that should be removed
		const updatedSchedule = state.data.schedule.filter(
			(entry) => entry.unix_time !== unix_time
		);

		// Update state
		dispatch({
			type: "SET_DATA",
			payload: { ...state.data, schedule: updatedSchedule },
		});
	};

	/**
	 * Handles adding a new schedule entry.
	 */
	const handleAddRow = () => {
		if (
			!state.newEntry.time ||
			state.newEntry.warmBrightness === "" ||
			state.newEntry.coolBrightness === ""
		) {
			return;
		}

		const newRow: ScheduleEntry = {
			time: state.newEntry.time,
			warmBrightness: Math.min(
				100,
				Math.max(0, Number(state.newEntry.warmBrightness))
			),
			coolBrightness: Math.min(
				100,
				Math.max(0, Number(state.newEntry.coolBrightness))
			),
			unix_time: Math.floor(
				new Date(`1970-01-01T${state.newEntry.time}`).getTime() / 1000
			),
		};

		// Remove existing entry with same time if it exists
		const filteredSchedule = state.data.schedule.filter(
			(entry) => entry.time !== state.newEntry.time
		);

		const updatedSchedule = [...filteredSchedule, newRow].sort((a, b) =>
			a.time.localeCompare(b.time)
		);

		dispatch({
			type: "SET_DATA",
			payload: { ...state.data, schedule: updatedSchedule },
		});
		// clear out new entry fields
		dispatch({
			type: "UPDATE_NEW_ENTRY",
			payload: { time: "", warmBrightness: "", coolBrightness: "" },
		});
	};

	/**
	 * Handles changes to the new entry form fields
	 * @param field - The field being updated (time, warmBrightness, or coolBrightness)
	 * @param value - The new value for the field
	 */
	const handleEntryChange = (field: string, value: string) => {
		dispatch({
			type: "UPDATE_NEW_ENTRY",
			payload: { [field]: value },
		});
	};

	return {
		handleModeChange,
		handleCancel,
		handleNamedEntryChange,
		handleTimeChange,
		handleScheduledEntryChange,
		handleRemoveRow,
		handleAddRow,
		handleEntryChange,
	};
};
