import { Container } from "react-bootstrap";
import { DaylightScheduleProps } from "./types";
import { DesktopView } from "./DesktopView";
import { MobileView } from "./MobileView";
import { SunTimes } from "./SunTimes";

/**
 * The DayNight component that displays both the sun times and schedule configuration.
 * Provides a responsive layout with different views for desktop and mobile devices.
 *
 * @component
 * @param {DaylightScheduleProps} props - The component props
 * @returns {ReactElement} The DayNight component
 */
export const DayNight = ({
	data,
	handleInputChange,
	handleTimeChange,
}: DaylightScheduleProps) => (
	<>
		<SunTimes brightnessSchedule={data.brightnessSchedule} />
		<Container className="content-container mb-3 py-3 px-3">
			<h5>Daylight Schedule</h5>
			<div className="d-none d-md-block">
				<DesktopView
					data={data}
					handleInputChange={handleInputChange}
					handleTimeChange={handleTimeChange}
				/>
			</div>
			<div className="d-md-none">
				<MobileView
					data={data}
					handleInputChange={handleInputChange}
					handleTimeChange={handleTimeChange}
				/>
			</div>
		</Container>
	</>
);

export default DayNight;
