import { Form } from "react-bootstrap";
import { formatTime, handleNumericInput } from "../utils";
import { getEntryByLabel } from "../models";
import {
	DaylightScheduleProps,
	scheduleEntries,
	isEditableTimeKey,
} from "./types";

/**
 * Mobile view for the daylight schedule table.
 * Displays entries in a stacked card-like format with full-width controls.
 *
 * @component
 * @param {DaylightScheduleProps} props - The component props
 * @returns {ReactElement} The MobileView component
 */
export const MobileView = ({
	data,
	handleInputChange,
	handleTimeChange,
}: DaylightScheduleProps) => (
	<>
		{scheduleEntries.map(({ key, label, editable }) => {
			const entry = getEntryByLabel(data.brightnessSchedule, key);
			if (!entry) return null;
			return (
				<div key={key} className="border-bottom pb-3 mb-3">
					<div className="mb-2">
						<strong>{label}</strong>
						<div>
							{editable &&
							handleTimeChange &&
							isEditableTimeKey(key) ? (
								<Form.Control
									type="time"
									value={entry.time}
									onChange={(e) =>
										handleTimeChange(
											key,
											e.target.value
										)
									}
								/>
							) : (
								formatTime(entry.time)
							)}
						</div>
					</div>
					<div className="mb-2">
						<label className="form-label">Warm Brightness</label>
						<Form.Control
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							value={entry.warmBrightness}
							min="0"
							max="100"
							onInput={handleNumericInput}
							onChange={(e) =>
								handleInputChange(
									key,
									"warmBrightness",
									e.target.value
								)
							}
						/>
					</div>
					<div>
						<label className="form-label">Cool Brightness</label>
						<Form.Control
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							value={entry.coolBrightness}
							min="0"
							max="100"
							onInput={handleNumericInput}
							onChange={(e) =>
								handleInputChange(
									key,
									"coolBrightness",
									e.target.value
								)
							}
						/>
					</div>
				</div>
			);
		})}
	</>
);
