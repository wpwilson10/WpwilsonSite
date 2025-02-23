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
 * Props for the AddScheduleEntry component.
 *
 * @interface AddScheduleEntryProps
 * @property {string} newTime - The new time value
 * @property {string} newWarmBrightness - The new warm brightness value
 * @property {string} newCoolBrightness - The new cool brightness value
 * @property {Function} setNewTime - Function to update the time value
 * @property {Function} setNewWarmBrightness - Function to update the warm brightness value
 * @property {Function} setNewCoolBrightness - Function to update the cool brightness value
 * @property {Function} handleAddRow - Function to handle adding a new row
 */
export interface AddScheduleEntryProps {
	newTime: string;
	newWarmBrightness: string;
	newCoolBrightness: string;
	setNewTime: (value: string) => void;
	setNewWarmBrightness: (value: string) => void;
	setNewCoolBrightness: (value: string) => void;
	handleAddRow: () => void;
}
