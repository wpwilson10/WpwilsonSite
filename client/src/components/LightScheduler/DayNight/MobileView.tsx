import { Form } from "react-bootstrap";
import { formatTime, handleNumericInput } from "../utils";
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
		{scheduleEntries.map(({ key, label, editable }) => (
			<div key={key} className="border-bottom pb-3 mb-3">
				<div className="mb-2">
					<strong>{label}</strong>
					<div>
						{editable &&
						handleTimeChange &&
						isEditableTimeKey(key) ? (
							<Form.Control
								type="time"
								value={data[key].time}
								onChange={(e) =>
									handleTimeChange(key, e.target.value)
								}
							/>
						) : (
							formatTime(data[key].time)
						)}
					</div>
				</div>
				<div className="mb-2">
					<label className="form-label">Warm Brightness</label>
					<Form.Control
						type="number"
						inputMode="numeric"
						pattern="[0-9]*"
						value={data[key].warmBrightness}
						min="0"
						max="100"
						onInput={handleNumericInput}
						onChange={(e) =>
							handleInputChange(
								data[key].unix_time,
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
						value={data[key].coolBrightness}
						min="0"
						max="100"
						onInput={handleNumericInput}
						onChange={(e) =>
							handleInputChange(
								data[key].unix_time,
								"coolBrightness",
								e.target.value
							)
						}
					/>
				</div>
			</div>
		))}
	</>
);
