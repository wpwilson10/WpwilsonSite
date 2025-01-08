import { ScheduleData, ScheduleEntry } from './models';

/**
 * Validates the schedule data received from the server.
 *
 * @param {any} data - The data to validate.
 * @returns {boolean} - True if the data is valid, false otherwise.
 */
export const isValidScheduleData = (data: any): data is ScheduleData => {
  const isValidMode = ['dayNight', 'scheduled', 'demo'].includes(data?.mode);

  const isValidEntry = (entry: any): entry is ScheduleEntry =>
    typeof entry?.time === 'string' &&
    typeof entry?.unix_time === 'number' &&
    typeof entry?.warmBrightness === 'number' &&
    entry.warmBrightness >= 0 &&
    entry.warmBrightness <= 100 &&
    typeof entry?.coolBrightness === 'number' &&
    entry.coolBrightness >= 0 &&
    entry.coolBrightness <= 100;

  const isValidSchedule =
    Array.isArray(data?.schedule) &&
    data.schedule.every((entry: any) =>
      isValidEntry({ ...entry, id: entry.id })
    );

  const requiredEntries = [
    'sunrise',
    'sunset',
    'natural_sunset',
    'civil_twilight_begin',
    'civil_twilight_end',
    'natural_twilight_end',
    'bed_time',
    'night_time',
  ];

  const hasValidEntries = requiredEntries.every(
    (key) => data?.[key] && isValidEntry(data[key])
  );

  return isValidMode && isValidSchedule && hasValidEntries;
};

/**
 * Formats a 24-hour time string (HH:mm) to 12-hour format (h:mm tt)
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};
