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

import { Suspense, useEffect, useState } from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import {
	ErrorFallback,
	handleAxiosError,
	logErrorBoundary,
} from "../../utils/error";
import LoadingSpinner from "../LoadingSpinner/spinner";
import DayNight from "./DayNight";
import { defaultScheduleData, ScheduleData, ScheduleEntry } from "./models";
import { isValidScheduleData } from "./utils";
import { ErrorBoundary } from "react-error-boundary";
import { ScheduledEntryTable, AddScheduleEntry } from "./ScheduledEntryTable";

// The server URL for the light schedule API.
const lightScheduleURL: string =
	process.env.API_DOMAIN_NAME! + process.env.LIGHT_SCHEDULE_API!;

// The AWS secret token for the light schedule API.
const awsSecretToken: string = process.env.AWS_LIGHTS_SECRET_TOKEN!;

/**
 * The ModeSelector component that displays buttons to select the mode.
 *
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {ScheduleData} props.data - The schedule data.
 * @param {Function} props.handleModeChange - The function to handle mode changes.
 * @returns {ReactElement} The ModeSelector component.
 */
const ModeSelector = ({ data, handleModeChange }: any) => (
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
	const [data, setData] = useState<ScheduleData>(defaultScheduleData);
	const [lastSavedData, setLastSavedData] =
		useState<ScheduleData>(defaultScheduleData);
	const [newTime, setNewTime] = useState("");
	const [newWarmBrightness, setNewWarmBrightness] = useState("");
	const [newCoolBrightness, setNewCoolBrightness] = useState("");
	const [unsavedChanges, setUnsavedChanges] = useState(false);
	const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
		useState(false);
	const [isSubmissionError, setIsSubmissionError] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // Add loading state

	useEffect(() => {
		const fetchSchedule = async () => {
			setIsLoading(true);
			setIsSubmissionError(false);
			setUnsavedChanges(false);

			try {
				const response =
					await axios.get<ScheduleData>(lightScheduleURL);
				if (!response.data) {
					throw new Error("Failed to load schedule data");
				}
				if (isValidScheduleData(response.data)) {
					setData(response.data);
					setLastSavedData(response.data);
				} else {
					throw new Error("Invalid schedule data");
				}
			} catch (error) {
				handleAxiosError(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSchedule();
	}, []);

	/**
	 * Saves the schedule to the server.
	 */
	const saveSchedule = async () => {
		try {
			await axios.post(lightScheduleURL, data, {
				headers: {
					"content-type": "application/json",
					"x-custom-auth": awsSecretToken,
				},
			});
			setLastSavedData(data); // Update last saved data
			setIsSuccessfullySubmitted(true);
			setIsSubmissionError(false);
			setUnsavedChanges(false);
		} catch (error) {
			handleAxiosError(error);
			setIsSuccessfullySubmitted(false);
			setIsSubmissionError(true);
		}
	};

	const handleCancel = () => {
		if (lastSavedData) {
			setData(lastSavedData);
			setUnsavedChanges(false);
		}
		setIsSubmissionError(false);
	};

	/**
	 * Handles input changes for schedule entries and named entries.
	 */
	const handleInputChange = (
		unix_time: number,
		type: "warmBrightness" | "coolBrightness",
		value: string
	) => {
		// Find if this is a named entry
		const namedEntries = [
			"sunrise",
			"sunset",
			"natural_sunset",
			"civil_twilight_begin",
			"civil_twilight_end",
			"natural_twilight_end",
			"bed_time",
			"night_time",
		] as const;

		const matchingEntry = namedEntries.find(
			(key) => data[key].unix_time === unix_time
		);

		if (matchingEntry) {
			// Update named entry
			setData({
				...data,
				[matchingEntry]: {
					...data[matchingEntry],
					[type]: Math.min(100, Math.max(0, Number(value))),
				},
			});
		} else {
			// Update schedule entry
			const updatedSchedule = data.schedule.map((entry) =>
				entry.unix_time === unix_time
					? {
							...entry,
							[type]: Math.min(100, Math.max(0, Number(value))),
						}
					: entry
			);
			setData({ ...data, schedule: updatedSchedule });
		}

		setUnsavedChanges(true);
		setIsSubmissionError(false);
		setIsSuccessfullySubmitted(false);
	};

	/**
	 * Handles removing a schedule entry.
	 *
	 * @param {number} unix_time - The Unix timestamp of the schedule entry to remove.
	 */
	const handleRemoveRow = (unix_time: number) => {
		const updatedSchedule = data.schedule.filter(
			(entry) => entry.unix_time !== unix_time
		);
		setData({ ...data, schedule: updatedSchedule });
		setUnsavedChanges(true);
		setIsSubmissionError(false);
		setIsSuccessfullySubmitted(false);
	};

	/**
	 * Handles adding a new schedule entry.
	 */
	const handleAddRow = () => {
		if (!newTime || newWarmBrightness === "" || newCoolBrightness === "") {
			return;
		}

		const newRow: ScheduleEntry = {
			time: newTime,
			warmBrightness: Math.min(
				100,
				Math.max(0, Number(newWarmBrightness))
			),
			coolBrightness: Math.min(
				100,
				Math.max(0, Number(newCoolBrightness))
			),
			unix_time: Math.floor(
				new Date(`1970-01-01T${newTime}`).getTime() / 1000
			),
		};

		// Remove existing entry with same time if it exists
		const filteredSchedule = data.schedule.filter(
			(entry) => entry.time !== newTime
		);

		const updatedSchedule = [...filteredSchedule, newRow].sort((a, b) =>
			a.time.localeCompare(b.time)
		);

		setData({ ...data, schedule: updatedSchedule });
		setNewTime("");
		setNewWarmBrightness("");
		setNewCoolBrightness("");

		setUnsavedChanges(true);
		setIsSubmissionError(false);
		setIsSuccessfullySubmitted(false);
	};

	/**
	 * Handles changing the mode.
	 *
	 * @param {'dayNight' | 'scheduled' | 'demo'} newMode - The new mode to set.
	 */
	const handleModeChange = (newMode: "dayNight" | "scheduled" | "demo") => {
		setData({ ...data, mode: newMode });

		setUnsavedChanges(true);
		setIsSubmissionError(false);
		setIsSuccessfullySubmitted(false);
	};

	/**
	 * Handles time changes for bed_time and night_time entries.
	 */
	const handleTimeChange = (
		key: "bed_time" | "night_time",
		newTime: string
	) => {
		const unix_time = Math.floor(
			new Date(`1970-01-01T${newTime}`).getTime() / 1000
		);
		setData({
			...data,
			[key]: {
				time: newTime,
				unix_time: unix_time,
			},
		});

		setUnsavedChanges(true);
		setIsSubmissionError(false);
		setIsSuccessfullySubmitted(false);
	};

	// Prevent render until data is loaded
	if (isLoading) {
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
					<Row className="justify-content-md-left">
						<Col md={12} className="mb-3">
							{isSuccessfullySubmitted && (
								<Alert variant="success">
									<p className="mb-0">
										Success - Light Settings Updated
									</p>
								</Alert>
							)}
							{isSubmissionError && (
								<Alert variant="danger">
									<p className="mb-0">
										Error occurred while sending updated
										settings. Please try again.
									</p>
								</Alert>
							)}
							{unsavedChanges && (
								<Alert variant="warning">
									<p className="mb-0">
										You have unsaved changes. Don't forget
										to save your changes!
									</p>
								</Alert>
							)}
						</Col>
					</Row>

					<ModeSelector
						data={data}
						handleModeChange={handleModeChange}
					/>

					{data.mode === "dayNight" && (
						<DayNight
							data={data}
							handleInputChange={handleInputChange}
							handleTimeChange={handleTimeChange}
						/>
					)}

					{data.mode === "scheduled" && (
						<>
							<ScheduledEntryTable
								data={data}
								handleInputChange={handleInputChange}
								handleRemoveRow={handleRemoveRow}
							/>
							<AddScheduleEntry
								newTime={newTime}
								newWarmBrightness={newWarmBrightness}
								newCoolBrightness={newCoolBrightness}
								setNewTime={setNewTime}
								setNewWarmBrightness={setNewWarmBrightness}
								setNewCoolBrightness={setNewCoolBrightness}
								handleAddRow={handleAddRow}
							/>
						</>
					)}

					<Row className="justify-content-md-left">
						<Col
							md={12}
							className="mb-3 d-flex justify-content-end gap-2"
						>
							<Button
								variant="secondary"
								onClick={handleCancel}
								disabled={!unsavedChanges}
							>
								Cancel
							</Button>
							<Button
								variant="success"
								onClick={() => saveSchedule()}
								disabled={!unsavedChanges}
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
