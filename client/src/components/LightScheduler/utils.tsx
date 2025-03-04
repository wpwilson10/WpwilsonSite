import { ScheduleData, ScheduleEntry } from "./models";

/**
 * Validates the schedule data received from the server.
 *
 * @param {any} data - The data to validate.
 * @returns {boolean} - True if the data is valid, false otherwise.
 */
export const isValidScheduleData = (data: any): data is ScheduleData => {
	// No empty strings allowed
	const isValidString = (str: any): boolean =>
		typeof str === "string" && str.trim().length > 0;

	const isValidMode =
		data?.mode && ["dayNight", "scheduled", "demo"].includes(data.mode);

	// Validate each of the fields of the schedule entry
	const isValidEntry = (entry: any): entry is ScheduleEntry =>
		entry &&
		"time" in entry &&
		"unix_time" in entry &&
		"warmBrightness" in entry &&
		"coolBrightness" in entry &&
		isValidString(entry.time) &&
		typeof entry.unix_time === "number" &&
		typeof entry.warmBrightness === "number" &&
		entry.warmBrightness >= 0 &&
		entry.warmBrightness <= 100 &&
		typeof entry.coolBrightness === "number" &&
		entry.coolBrightness >= 0 &&
		entry.coolBrightness <= 100;

	// Validate the schedule array exists and each entry is valid
	const isValidSchedule =
		data?.schedule &&
		Array.isArray(data.schedule) &&
		data.schedule.every((entry: any) => isValidEntry(entry));

	const requiredEntries = [
		"sunrise",
		"sunset",
		"natural_sunset",
		"civil_twilight_begin",
		"civil_twilight_end",
		"natural_twilight_end",
		"bed_time",
		"night_time",
	];

	// Validate the required entries exist and are valid
	const hasValidEntries =
		data &&
		requiredEntries.every(
			(key) => key in data && data[key] && isValidEntry(data[key])
		);

	// Validate the update time fields
	const hasValidUpdateTime =
		data?.update_time &&
		data?.update_time_unix &&
		isValidString(data.update_time) &&
		typeof data.update_time_unix === "number";

	return (
		isValidMode && isValidSchedule && hasValidEntries && hasValidUpdateTime
	);
};

/**
 * Formats a 24-hour time string (HH:mm) to 12-hour format (h:mm tt)
 */
export const formatTime = (time: string): string => {
	const [hours, minutes] = time.split(":").map(Number);
	const period = hours >= 12 ? "PM" : "AM";
	const hour12 = hours % 12 || 12;
	return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
	// Remove leading zeros and ensure value is between 0-100
	const value = e.target.value.replace(/^0+/, "") || "0";
	e.target.value = Math.min(100, Math.max(0, Number(value))).toString();
};
