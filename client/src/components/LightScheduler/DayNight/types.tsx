import { ScheduleData, ScheduleEntry } from "../models";

/**
 * Props for the DaylightSchedule component and its views.
 *
 * @interface DaylightScheduleProps
 * @property {ScheduleData} data - The complete schedule data containing all entries
 * @property {Function} handleInputChange - Callback function to handle brightness value changes
 * @property {Function} [handleTimeChange] - Optional callback function to handle time changes for editable entries
 */
export interface DaylightScheduleProps {
	data: ScheduleData;
	handleInputChange: (
		unix_time: number,
		field: "warmBrightness" | "coolBrightness",
		value: string
	) => void;
	handleTimeChange?: (key: "bed_time" | "night_time", value: string) => void;
}

/**
 * Props for the SunTimes component.
 *
 * @interface SunTimesProps
 * @property {ScheduleEntry} sunrise - The sunrise entry
 * @property {ScheduleEntry} sunset - The sunset entry
 * @property {ScheduleEntry} natural_sunset - The natural sunset entry
 * @property {ScheduleEntry} civil_twilight_begin - The civil twilight begin entry
 * @property {ScheduleEntry} civil_twilight_end - The civil twilight end entry
 * @property {ScheduleEntry} natural_twilight_end - The natural twilight end entry
 */
export interface SunTimesProps {
	sunrise: ScheduleEntry;
	sunset: ScheduleEntry;
	natural_sunset: ScheduleEntry;
	civil_twilight_begin: ScheduleEntry;
	civil_twilight_end: ScheduleEntry;
	natural_twilight_end: ScheduleEntry;
}

/**
 * Schedule entry definition with label and editability flag.
 *
 * @interface ScheduleEntryDefinition
 * @property {keyof ScheduleData} key - The key in the ScheduleData object
 * @property {string} label - The display label for the entry
 * @property {boolean} editable - Whether the time can be edited
 */
export interface ScheduleEntryDefinition {
	key:
		| "civil_twilight_begin"
		| "sunrise"
		| "sunset"
		| "civil_twilight_end"
		| "bed_time"
		| "night_time";
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
