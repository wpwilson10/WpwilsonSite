import { ScheduleData, BrightnessEntry } from "./models";

/**
 * Validates the schedule data received from the server.
 */
export const isValidScheduleData = (data: any): data is ScheduleData => {
	const isValidString = (str: any): boolean =>
		typeof str === "string" && str.trim().length > 0;

	const isValidMode =
		data?.mode && ["dayNight", "scheduled", "demo"].includes(data.mode);

	const isValidServerTime = typeof data?.serverTime === "number";

	const isValidEntry = (entry: any): entry is BrightnessEntry =>
		entry &&
		isValidString(entry.time) &&
		typeof entry.unixTime === "number" &&
		typeof entry.warmBrightness === "number" &&
		entry.warmBrightness >= 0 &&
		entry.warmBrightness <= 100 &&
		typeof entry.coolBrightness === "number" &&
		entry.coolBrightness >= 0 &&
		entry.coolBrightness <= 100 &&
		isValidString(entry.label);

	const isValidSchedule =
		Array.isArray(data?.brightnessSchedule) &&
		data.brightnessSchedule.every((entry: any) => isValidEntry(entry));

	return isValidMode && isValidServerTime && isValidSchedule;
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
	// Remove leading zeros and ensure value is between 0-100, rounded to integer
	const value = e.target.value.replace(/^0+/, "") || "0";
	e.target.value = Math.round(Math.min(100, Math.max(0, Number(value)))).toString();
};
