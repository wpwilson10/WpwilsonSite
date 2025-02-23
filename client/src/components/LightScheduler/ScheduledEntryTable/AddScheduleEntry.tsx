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
	newTime,
	newWarmBrightness,
	newCoolBrightness,
	setNewTime,
	setNewWarmBrightness,
	setNewCoolBrightness,
	handleAddRow,
}: AddScheduleEntryProps) => {
	const isFormValid =
		newTime &&
		newWarmBrightness !== "" &&
		newCoolBrightness !== "" &&
		Number(newWarmBrightness) >= 0 &&
		Number(newWarmBrightness) <= 100 &&
		Number(newCoolBrightness) >= 0 &&
		Number(newCoolBrightness) <= 100;

	return (
		<Container className="content-container mb-3 py-3 px-3">
			<h5>Add Schedule Entry</h5>
			<Row>
				<Col>
					<InputGroup className="mb-3">
						<Form.Control
							type="time"
							value={newTime}
							onChange={(e) => setNewTime(e.target.value)}
						/>
						<Form.Control
							type="number"
							placeholder="Warm Brightness"
							value={newWarmBrightness}
							min="0"
							max="100"
							onChange={(e) =>
								setNewWarmBrightness(e.target.value)
							}
						/>
						<Form.Control
							type="number"
							placeholder="Cool Brightness"
							value={newCoolBrightness}
							min="0"
							max="100"
							onChange={(e) =>
								setNewCoolBrightness(e.target.value)
							}
						/>
						<Button
							variant="primary"
							onClick={handleAddRow}
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
