/**
 * Represents a single entry in the light schedule.
 *
 * @interface ScheduleEntry
 * @property {string} time - The time of day for this schedule entry in 24-hour format (HH:MM).
 * @property {number} warmBrightness - The brightness level for warm light (0-100).
 * @property {number} coolBrightness - The brightness level for cool light (0-100).
 * @property {number} unix_time - The Unix timestamp for this schedule entry.
 */
export interface ScheduleEntry {
	time: string;
	warmBrightness: number;
	coolBrightness: number;
	unix_time: number;
}

/**
 * Represents the complete light schedule data structure.
 *
 * @interface ScheduleData
 * @property {'dayNight' | 'scheduled' | 'demo'} mode - The current operating mode for the lights.
 *    - 'dayNight': Automatically adjusts based on time of day
 *    - 'scheduled': Follows the user-defined schedule
 *    - 'demo': Runs a demonstration cycle
 * @property {ScheduleEntry[]} schedule - Array of schedule entries that define the light settings throughout the day.
 * @property {ScheduleEntry} sunrise - The sunrise schedule entry.
 * @property {ScheduleEntry} sunset - The sunset schedule entry.
 * @property {ScheduleEntry} natural_sunset - The natural sunset schedule entry.
 * @property {ScheduleEntry} civil_twilight_begin - The civil twilight begin schedule entry.
 * @property {ScheduleEntry} civil_twilight_end - The civil twilight end schedule entry.
 * @property {ScheduleEntry} natural_twilight_end - The natural twilight end schedule entry.
 * @property {ScheduleEntry} bed_time - The bed time schedule entry.
 * @property {ScheduleEntry} night_time - The night time schedule entry.
 * @property {string} update_time - The time when the schedule was last updated in 24-hour format (HH:MM).
 * @property {number} update_time_unix - The Unix timestamp when the schedule was last updated.
 */
export interface ScheduleData {
	mode: "dayNight" | "scheduled" | "demo";
	schedule: ScheduleEntry[];
	sunrise: ScheduleEntry;
	sunset: ScheduleEntry;
	natural_sunset: ScheduleEntry;
	civil_twilight_begin: ScheduleEntry;
	civil_twilight_end: ScheduleEntry;
	natural_twilight_end: ScheduleEntry;
	bed_time: ScheduleEntry;
	night_time: ScheduleEntry;
	update_time: string;
	update_time_unix: number;
}

export const defaultScheduleData: ScheduleData = {
	mode: "dayNight",
	schedule: [],
	sunrise: {
		time: "07:00",
		unix_time: 0,
		warmBrightness: 0,
		coolBrightness: 0,
	},
	sunset: {
		time: "19:30",
		unix_time: 0,
		warmBrightness: 0,
		coolBrightness: 0,
	},
	natural_sunset: {
		time: "19:30",
		unix_time: 0,
		warmBrightness: 0,
		coolBrightness: 0,
	},
	civil_twilight_begin: {
		time: "06:30",
		unix_time: 0,
		warmBrightness: 0,
		coolBrightness: 0,
	},
	civil_twilight_end: {
		time: "20:00",
		unix_time: 0,
		warmBrightness: 0,
		coolBrightness: 0,
	},
	natural_twilight_end: {
		time: "20:00",
		unix_time: 0,
		warmBrightness: 0,
		coolBrightness: 0,
	},
	bed_time: {
		time: "23:00",
		unix_time: 0,
		warmBrightness: 0,
		coolBrightness: 0,
	},
	night_time: {
		time: "23:30",
		unix_time: 0,
		warmBrightness: 0,
		coolBrightness: 0,
	},
	update_time: "03:00",
	update_time_unix: Math.floor(new Date(`1970-01-01T03:00`).getTime() / 1000),
};
