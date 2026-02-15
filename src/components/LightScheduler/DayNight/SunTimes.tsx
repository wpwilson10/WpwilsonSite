import { Container, Row, Col } from "react-bootstrap";
import { formatTime } from "../utils";
import { getEntryByLabel } from "../models";
import { SunTimesProps } from "./types";

/**
 * Displays a grid of sun-related times including dawn, sunrise, sunset, and dusk.
 *
 * The times are displayed in a responsive grid layout that adjusts based on viewport size:
 * - Desktop (>=md): 2 columns
 * - Mobile (<md): 1 column
 *
 * @component
 * @param {SunTimesProps} props - The component props
 * @returns {ReactElement} The SunTimes component
 */
export const SunTimes = ({ brightnessSchedule }: SunTimesProps) => {
	const dawn = getEntryByLabel(brightnessSchedule, "civil_twilight_begin");
	const sunrise = getEntryByLabel(brightnessSchedule, "sunrise");
	const sunset = getEntryByLabel(brightnessSchedule, "sunset");
	const dusk = getEntryByLabel(brightnessSchedule, "civil_twilight_end");

	return (
		<Container className="content-container mb-3 py-3 px-3">
			<h5>Day/Night Schedule</h5>
			<Row>
				<Col xs={12} md={6} className="mb-2">
					<div>
						<div className="text-muted small">Dawn</div>
						<div className="fs-5">
							{dawn ? formatTime(dawn.time) : "--:--"}
						</div>
					</div>
				</Col>
				<Col xs={12} md={6} className="mb-2">
					<div>
						<div className="text-muted small">Sunrise</div>
						<div className="fs-5">
							{sunrise ? formatTime(sunrise.time) : "--:--"}
						</div>
					</div>
				</Col>
				<Col xs={12} md={6} className="mb-2">
					<div>
						<div className="text-muted small">Sunset</div>
						<div className="fs-5">
							{sunset ? formatTime(sunset.time) : "--:--"}
						</div>
					</div>
				</Col>
				<Col xs={12} md={6} className="mb-2">
					<div>
						<div className="text-muted small">Dusk</div>
						<div className="fs-5">
							{dusk ? formatTime(dusk.time) : "--:--"}
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	);
};
