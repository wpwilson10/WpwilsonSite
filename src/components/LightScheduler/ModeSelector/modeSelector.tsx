import { Button, Col, Container, Row } from "react-bootstrap";

/**
 * The ModeSelector component that displays buttons to select the mode.
 *
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {ScheduleData} props.data - The schedule data.
 * @param {Function} props.handleModeChange - The function to handle mode changes.
 * @returns {ReactElement} The ModeSelector component.
 */
export const ModeSelector = ({ data, handleModeChange }: any) => (
	<Container className="content-container mb-3 py-3 px-3">
		<h5>Select Mode</h5>
		<Row className="justify-content-start">
			<Col xs="auto" md="auto" className="mb-3">
				<Button
					variant={
						data.mode === "dayNight" ? "primary" : "outline-primary"
					}
					onClick={() => handleModeChange("dayNight")}
				>
					Day/Night Cycle
				</Button>
			</Col>
			<Col xs="auto" md="auto" className="mb-3">
				<Button
					variant={
						data.mode === "scheduled"
							? "primary"
							: "outline-primary"
					}
					onClick={() => handleModeChange("scheduled")}
				>
					Scheduled
				</Button>
			</Col>
			<Col xs="auto" md="auto" className="mb-3">
				<Button
					variant={
						data.mode === "demo" ? "primary" : "outline-primary"
					}
					onClick={() => handleModeChange("demo")}
				>
					Demo
				</Button>
			</Col>
		</Row>
	</Container>
);
