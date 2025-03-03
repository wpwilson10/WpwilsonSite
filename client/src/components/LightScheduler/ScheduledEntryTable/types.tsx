import { ScheduleData, ScheduleEntry } from "../models";

/**
 * Props for the ScheduledEntryTable component.
 *
 * @interface ScheduledEntryTableProps
 * @property {ScheduleData} data - The complete schedule data containing all entries and configuration
 * @property {Function} handleInputChange - Callback function to handle brightness value changes
 * @property {Function} handleRemoveRow - Callback function to handle removal of schedule entries
 */
export interface ScheduledEntryTableProps {
	data: ScheduleData;
	handleInputChange: (
		unix_time: number,
		type: "warmBrightness" | "coolBrightness",
		value: string
	) => void;
	handleRemoveRow: (unix_time: number) => void;
}

/**
 * Props for scheduled entry view components.
 *
 * @interface ScheduledEntryViewProps
 * @property {ScheduleEntry[]} schedule - Array of schedule entries to display
 * @property {Function} handleInputChange - Callback function to handle brightness value changes
 * @property {Function} handleRemoveRow - Callback function to handle removal of schedule entries
 */
export interface ScheduledEntryViewProps {
	schedule: ScheduleEntry[];
	handleInputChange: (
		unix_time: number,
		type: "warmBrightness" | "coolBrightness",
		value: string
	) => void;
	handleRemoveRow: (unix_time: number) => void;
}

/**
 * Props interface for the AddScheduleEntry component
 * @interface AddScheduleEntryProps
 *
 * @property {Object} newEntry - Object containing the values for a new schedule entry
 * @property {string} newEntry.time - The time value for the schedule entry
 * @property {string} newEntry.warmBrightness - The warm brightness value for the schedule entry
 * @property {string} newEntry.coolBrightness - The cool brightness value for the schedule entry
 * @property {function} onEntryChange - Callback function when an entry field changes
 * @param {string} field - The field name that changed
 * @param {string} value - The new value for the field
 * @property {function} onAddEntry - Callback function when adding a new entry
 */
export interface AddScheduleEntryProps {
	newEntry: {
		time: string;
		warmBrightness: string;
		coolBrightness: string;
	};
	onEntryChange: (field: string, value: string) => void;
	onAddEntry: () => void;
}
