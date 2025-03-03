"use client";

/**
 * The LightScheduler component that manages the light control interface.
 *
 * This component displays an interface for managing smart light settings, including schedule
 * management and mode selection. The component allows users to:
 * - Switch between different lighting modes (Day/Night Cycle, Scheduled, Demo)
 * - View and edit the current light schedule
 * - Add new schedule entries with specific times and brightness levels
 * - Remove existing schedule entries
 * - Save changes to the server
 *
 * The component displays feedback notifications for successful or unsuccessful
 * save operations and uses a loading spinner while fetching data from the server.
 * The schedule interface is only shown when not in demo mode, and all changes
 * are validated before being saved.
 *
 * @module components/LightScheduler
 * @component LightScheduler
 * @param {Object} props The props passed to the component. (Currently empty)
 * @returns {ReactElement} The LightScheduler component.
 */

import { Suspense } from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import { ErrorFallback, logErrorBoundary } from "../../utils/error";
import LoadingSpinner from "../LoadingSpinner/spinner";
import DayNight from "./DayNight";
import { ErrorBoundary } from "react-error-boundary";
import { ScheduledEntryTable, AddScheduleEntry } from "./ScheduledEntryTable";
import { ModeSelector } from "./ModeSelector/modeSelector";
import { useScheduleHandlers } from "./hooks/useScheduleHandlers";
import { useScheduleData } from "./hooks/useScheduleData";

/**
 * The LightScheduler component that displays the light scheduler interface.
 *
 * This component allows the user to view and edit the light schedule, including adding,
 * removing, and updating schedule entries. The component also allows the user to switch
 * between different modes (dayNight, scheduled, demo) and save the changes to the server.
 *
 * @component
 * @returns {ReactElement} The LightScheduler component.
 */
const LightScheduler = () => {
	// State, Reducers, and function to send schedule data to server
	const { state, dispatch, saveSchedule } = useScheduleData();
	// Handlers is the set of functions passed to subcomponenets to let them update state.
	const handlers = useScheduleHandlers(state, dispatch);

	// Prevent render until data is loaded
	if (state.status.isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={logErrorBoundary}
			onReset={() => {
				// currently do nothing
				// basic recovery option - window.location.reload();
			}}
		>
			<Suspense fallback={<LoadingSpinner />}>
				<Container id="light_scheduler" className="mb-3">
					{/* Alerts */}
					<Row className="justify-content-md-left">
						<Col md={12} className="mb-3">
							{state.status.isSuccessfullySubmitted && (
								<Alert variant="success">
									<p className="mb-0">
										Success - Light Settings Updated
									</p>
								</Alert>
							)}
							{state.status.isSubmissionError && (
								<Alert variant="danger">
									<p className="mb-0">
										Error occurred while sending updated
										settings. Please try again.
									</p>
								</Alert>
							)}
							{state.status.unsavedChanges && (
								<Alert variant="warning">
									<p className="mb-0">
										You have unsaved changes. Don't forget
										to save your changes!
									</p>
								</Alert>
							)}
						</Col>
					</Row>

					{/* Mode Selector */}
					<ModeSelector
						data={state.data}
						handleModeChange={handlers.handleModeChange}
					/>

					{/* Conditional Rendering of Tables Based on Mode*/}
					{state.data.mode === "dayNight" && (
						<DayNight
							data={state.data}
							handleInputChange={handlers.handleNamedEntryChange}
							handleTimeChange={handlers.handleTimeChange}
						/>
					)}

					{state.data.mode === "scheduled" && (
						<>
							<ScheduledEntryTable
								data={state.data}
								handleInputChange={
									handlers.handleScheduledEntryChange
								}
								handleRemoveRow={handlers.handleRemoveRow}
							/>
							<AddScheduleEntry
								newEntry={state.newEntry}
								onEntryChange={handlers.handleEntryChange}
								onAddEntry={handlers.handleAddRow}
							/>
						</>
					)}

					{/* Buttons */}
					<Row className="justify-content-md-left">
						<Col
							md={12}
							className="mb-3 d-flex justify-content-end gap-2"
						>
							<Button
								variant="secondary"
								onClick={handlers.handleCancel}
								disabled={!state.status.unsavedChanges}
							>
								Cancel
							</Button>
							<Button
								variant="success"
								onClick={() => saveSchedule()}
								disabled={!state.status.unsavedChanges}
							>
								Save Changes
							</Button>
						</Col>
					</Row>
				</Container>
			</Suspense>
		</ErrorBoundary>
	);
};

export default LightScheduler;
