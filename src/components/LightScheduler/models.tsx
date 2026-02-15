export interface BrightnessEntry {
	time: string; // HH:mm
	unixTime: number;
	warmBrightness: number; // 0-100
	coolBrightness: number; // 0-100
	label: string;
}

export interface ScheduleData {
	mode: "dayNight" | "scheduled" | "demo";
	serverTime: number;
	brightnessSchedule: BrightnessEntry[];
}

export const defaultScheduleData: ScheduleData = {
	mode: "dayNight",
	serverTime: 0,
	brightnessSchedule: [
		{ time: "06:30", unixTime: 0, warmBrightness: 0, coolBrightness: 0, label: "civil_twilight_begin" },
		{ time: "07:00", unixTime: 0, warmBrightness: 0, coolBrightness: 0, label: "sunrise" },
		{ time: "19:30", unixTime: 0, warmBrightness: 0, coolBrightness: 0, label: "sunset" },
		{ time: "20:00", unixTime: 0, warmBrightness: 0, coolBrightness: 0, label: "civil_twilight_end" },
		{ time: "23:00", unixTime: 0, warmBrightness: 0, coolBrightness: 0, label: "bed_time" },
		{ time: "23:30", unixTime: 0, warmBrightness: 0, coolBrightness: 0, label: "night_time" },
	],
};

export const getEntryByLabel = (
	schedule: BrightnessEntry[],
	label: string
): BrightnessEntry | undefined =>
	schedule.find((entry) => entry.label === label);
