import { Container, Row, Col } from "react-bootstrap";
import { formatTime } from "../utils";
import { SunTimesProps } from "./types";

/**
 * Displays a grid of sun-related times including dawn, sunrise, sunset, and dusk.
 * Shows both natural and adjusted times where they differ.
 *
 * The times are displayed in a responsive grid layout that adjusts based on viewport size:
 * - Desktop (≥md): 2 columns
 * - Mobile (<md): 1 column
 *
 * Each time entry includes:
 * - A label (small, muted text)
 * - The time value (larger text)
 * - Adjusted time value when different from natural time (small, muted text)
 *
 * @component
 * @param {SunTimesProps} props - The component props
 * @returns {ReactElement} The SunTimes component
 */
export const SunTimes = ({
	sunrise,
	sunset,
	natural_sunset,
	civil_twilight_begin,
	civil_twilight_end,
	natural_twilight_end,
}: SunTimesProps) => (
	<Container className="content-container mb-3 py-3 px-3">
		<h5>Day/Night Schedule</h5>
		<Row>
			<Col xs={12} md={6} className="mb-2">
				<div>
					<div className="text-muted small">Dawn</div>
					<div className="fs-5">
						{formatTime(civil_twilight_begin.time)}
					</div>
				</div>
			</Col>
			<Col xs={12} md={6} className="mb-2">
				<div>
					<div className="text-muted small">Sunrise</div>
					<div className="fs-5">{formatTime(sunrise.time)}</div>
				</div>
			</Col>
			<Col xs={12} md={6} className="mb-2">
				<div>
					<div className="text-muted small">Sunset</div>
					<div className="fs-5">
						{formatTime(natural_sunset.time)}
						{natural_sunset.time !== sunset.time && (
							<span className="text-muted small ms-2">
								({formatTime(sunset.time)} Adjusted)
							</span>
						)}
					</div>
				</div>
			</Col>
			<Col xs={12} md={6} className="mb-2">
				<div>
					<div className="text-muted small">Dusk</div>
					<div className="fs-5">
						{formatTime(natural_twilight_end.time)}
						{natural_twilight_end.time !==
							civil_twilight_end.time && (
							<span className="text-muted small ms-2">
								({formatTime(civil_twilight_end.time)} Adjusted)
							</span>
						)}
					</div>
				</div>
			</Col>
		</Row>
	</Container>
);
