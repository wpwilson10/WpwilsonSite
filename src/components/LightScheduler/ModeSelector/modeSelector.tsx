import { Button, Col, Container, Row } from "react-bootstrap";
import { ScheduleData } from "../models";

interface ModeSelectorProps {
	data: ScheduleData;
	handleModeChange: (mode: "dayNight" | "demo") => void;
}

/**
 * The ModeSelector component that displays buttons to select the mode.
 *
 * @component
 * @param {ModeSelectorProps} props - The props passed to the component.
 * @returns {ReactElement} The ModeSelector component.
 */
export const ModeSelector = ({ data, handleModeChange }: ModeSelectorProps) => (
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
