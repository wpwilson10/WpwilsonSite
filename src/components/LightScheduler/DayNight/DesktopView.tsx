import { Table, Form } from "react-bootstrap";
import { formatTime, handleNumericInput } from "../utils";
import { getEntryByLabel } from "../models";
import {
	DaylightScheduleProps,
	scheduleEntries,
	isEditableTimeKey,
} from "./types";

/**
 * Desktop view for the daylight schedule table.
 * Displays entries in a responsive table format with columns for event, time, and brightness controls.
 *
 * @component
 * @param {DaylightScheduleProps} props - The component props
 * @returns {ReactElement} The DesktopView component
 */
export const DesktopView = ({
	data,
	handleInputChange,
	handleTimeChange,
}: DaylightScheduleProps) => (
	<div className="table-responsive">
		<Table striped bordered hover size="sm">
			<thead>
				<tr>
					<th style={{ width: "20%" }}>Event</th>
					<th style={{ width: "20%" }}>Time</th>
					<th style={{ width: "30%" }}>Warm</th>
					<th style={{ width: "30%" }}>Cool</th>
				</tr>
			</thead>
			<tbody>
				{scheduleEntries.map(({ key, label, editable }) => {
					const entry = getEntryByLabel(data.brightnessSchedule, key);
					if (!entry) return null;
					return (
						<tr key={key}>
							<td>{label}</td>
							<td>
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
										size="sm"
									/>
								) : (
									formatTime(entry.time)
								)}
							</td>
							<td>
								<Form.Control
									type="number"
									value={entry.warmBrightness}
									min="0"
									max="100"
									size="sm"
									onInput={handleNumericInput}
									onChange={(e) =>
										handleInputChange(
											key,
											"warmBrightness",
											e.target.value
										)
									}
								/>
							</td>
							<td>
								<Form.Control
									type="number"
									value={entry.coolBrightness}
									min="0"
									max="100"
									size="sm"
									onInput={handleNumericInput}
									onChange={(e) =>
										handleInputChange(
											key,
											"coolBrightness",
											e.target.value
										)
									}
								/>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	</div>
);
