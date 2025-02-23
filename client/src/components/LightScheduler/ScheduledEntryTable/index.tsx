import { Container } from "react-bootstrap";
import { DesktopView } from "./DesktopView";
import { MobileView } from "./MobileView";
import { AddScheduleEntry } from "./AddScheduleEntry";
import { ScheduledEntryTableProps } from "./types";

export { AddScheduleEntry };

/**
 * Responsive component that displays the schedule entries in either desktop or mobile view.
 *
 * This component manages the display of schedule entries, providing different layouts
 * for desktop and mobile viewports. It uses Bootstrap's responsive classes to switch
 * between views based on the viewport size.
 *
 * Desktop view (>= md breakpoint): Displays entries in a table format
 * Mobile view (< md breakpoint): Displays entries in a stacked card-like format
 *
 * @component
 * @param {ScheduledEntryTableProps} props - The props for the component
 * @returns {ReactElement} The ScheduleTable component
 */
export const ScheduledEntryTable = ({
	data,
	handleInputChange,
	handleRemoveRow,
}: ScheduledEntryTableProps) => (
	<Container className="content-container mb-3 py-3 px-3">
		<h5>Schedule Configuration</h5>
		<div className="d-none d-md-block">
			<DesktopView
				schedule={data.schedule}
				handleInputChange={handleInputChange}
				handleRemoveRow={handleRemoveRow}
			/>
		</div>
		<div className="d-md-none">
			<MobileView
				schedule={data.schedule}
				handleInputChange={handleInputChange}
				handleRemoveRow={handleRemoveRow}
			/>
		</div>
	</Container>
);
