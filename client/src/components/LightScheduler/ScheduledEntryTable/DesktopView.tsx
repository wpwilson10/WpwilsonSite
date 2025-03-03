import { Table, Button, Form } from "react-bootstrap";
import { formatTime } from "../utils";
import { ScheduledEntryViewProps } from "./types";

/**
 * Displays schedule entries in a table format optimized for desktop viewports.
 *
 * @component
 * @param {ScheduledEntryViewProps} props - The props for the component
 * @returns {ReactElement} The DesktopView component
 */
export const DesktopView = ({
	schedule,
	handleInputChange,
	handleRemoveRow,
}: ScheduledEntryViewProps) => (
	<div className="table-responsive">
		<Table striped bordered hover size="sm">
			<thead>
				<tr>
					<th style={{ width: "20%" }}>Time</th>
					<th style={{ width: "35%" }}>Warm</th>
					<th style={{ width: "35%" }}>Cool</th>
					<th style={{ width: "10%" }}>Actions</th>
				</tr>
			</thead>
			<tbody>
				{schedule.map((entry) => (
					<tr key={entry.unix_time}>
						<td>{formatTime(entry.time)}</td>
						<td>
							<Form.Control
								type="number"
								value={entry.warmBrightness}
								min="0"
								max="100"
								size="sm"
								onChange={(e) =>
									handleInputChange(
										entry.unix_time,
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
								onChange={(e) =>
									handleInputChange(
										entry.unix_time,
										"coolBrightness",
										e.target.value
									)
								}
							/>
						</td>
						<td className="text-center">
							<Button
								variant="danger"
								size="sm"
								onClick={() => handleRemoveRow(entry.unix_time)}
							>
								X
							</Button>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	</div>
);
