import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { AddScheduleEntryProps } from "./types";

/**
 * Form component for adding new schedule entries.
 *
 * @component
 * @param {AddScheduleEntryProps} props - The component props
 * @returns {ReactElement} The AddScheduleEntry component
 */
export const AddScheduleEntry = ({
	newEntry,
	onEntryChange,
	onAddEntry,
}: AddScheduleEntryProps) => {
	const isFormValid =
		newEntry.time &&
		newEntry.warmBrightness !== "" &&
		newEntry.coolBrightness !== "" &&
		Number(newEntry.warmBrightness) >= 0 &&
		Number(newEntry.warmBrightness) <= 100 &&
		Number(newEntry.coolBrightness) >= 0 &&
		Number(newEntry.coolBrightness) <= 100;

	return (
		<Container className="content-container mb-3 py-3 px-3">
			<h5>Add Schedule Entry</h5>
			<Row>
				<Col>
					<InputGroup className="mb-3">
						<Form.Control
							type="time"
							value={newEntry.time}
							onChange={(e) =>
								onEntryChange("time", e.target.value)
							}
						/>
						<Form.Control
							type="number"
							placeholder="Warm Brightness"
							value={newEntry.warmBrightness}
							min="0"
							max="100"
							onChange={(e) =>
								onEntryChange("warmBrightness", e.target.value)
							}
						/>
						<Form.Control
							type="number"
							placeholder="Cool Brightness"
							value={newEntry.coolBrightness}
							min="0"
							max="100"
							onChange={(e) =>
								onEntryChange("coolBrightness", e.target.value)
							}
						/>
						<Button
							variant="primary"
							onClick={onAddEntry}
							disabled={!isFormValid}
						>
							Add
						</Button>
					</InputGroup>
				</Col>
			</Row>
		</Container>
	);
};
