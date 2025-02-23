import { Button, Form } from "react-bootstrap";
import { formatTime } from "../utils";
import { ScheduledEntryViewProps } from "./types";

/**
 * Displays schedule entries in a stacked format optimized for mobile viewports.
 *
 * @component
 * @param {ScheduledEntryViewProps} props - The props for the component
 * @returns {ReactElement} The MobileView component
 */
export const MobileView = ({
	schedule,
	handleInputChange,
	handleRemoveRow,
}: ScheduledEntryViewProps) => (
	<>
		{schedule.map((entry) => (
			<div key={entry.unix_time} className="border-bottom pb-3 mb-3">
				<div className="d-flex justify-content-between align-items-center mb-2">
					<strong>{formatTime(entry.time)}</strong>
					<Button
						variant="danger"
						size="sm"
						onClick={() => handleRemoveRow(entry.unix_time)}
					>
						X
					</Button>
				</div>
				<div className="mb-2">
					<label className="form-label">Warm Brightness</label>
					<Form.Control
						type="number"
						value={entry.warmBrightness}
						min="0"
						max="100"
						onChange={(e) =>
							handleInputChange(
								entry.unix_time,
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
						value={entry.coolBrightness}
						min="0"
						max="100"
						onChange={(e) =>
							handleInputChange(
								entry.unix_time,
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
