import { ScheduleData, BrightnessEntry } from "../models";

/**
 * Props for the DaylightSchedule component and its views.
 */
export interface DaylightScheduleProps {
	data: ScheduleData;
	handleInputChange: (
		label: string,
		field: "warmBrightness" | "coolBrightness",
		value: string
	) => void;
	handleTimeChange?: (key: "bed_time" | "night_time", value: string) => void;
}

/**
 * Props for the SunTimes component.
 */
export interface SunTimesProps {
	brightnessSchedule: BrightnessEntry[];
}

/**
 * Schedule entry definition with label and editability flag.
 */
export interface ScheduleEntryDefinition {
	key: string;
	label: string;
	editable: boolean;
}

/**
 * Type guard to check if a key is an editable time key
 */
export const isEditableTimeKey = (
	key: string
): key is "bed_time" | "night_time" => {
	return key === "bed_time" || key === "night_time";
};

/**
 * Standard schedule entries configuration.
 */
export const scheduleEntries: readonly ScheduleEntryDefinition[] = [
	{ key: "civil_twilight_begin", label: "Dawn", editable: false },
	{ key: "sunrise", label: "Sunrise", editable: false },
	{ key: "sunset", label: "Sunset", editable: false },
	{ key: "civil_twilight_end", label: "Dusk", editable: false },
	{ key: "bed_time", label: "Bed Time", editable: true },
	{ key: "night_time", label: "Night Time", editable: true },
] as const;
