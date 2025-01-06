'use client';

import { Suspense, useEffect, useState } from 'react';
import {
  Table,
  Form,
  Container,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';
import axios from 'axios';
import { handleAxiosError } from '../../utils/error';
import LoadingSpinner from '../LoadingSpinner/spinner';

// The server URL for the contact form API.
const lightScheduleURL: string =
  process.env.API_DOMAIN_NAME! + process.env.LIGHT_SCHEDULE_API!;

// Define an interface for the schedule entries
interface ScheduleEntry {
  id: number;
  time: string;
  warmBrightness: number;
  coolBrightness: number;
}

// Define an interface for the server data structure
interface ScheduleData {
  mode: 'dayNight' | 'scheduled' | 'demo';
  schedule: ScheduleEntry[];
}

const isValidScheduleData = (data: any): data is ScheduleData => {
  // Validate the mode
  const isValidMode = ['dayNight', 'scheduled', 'demo'].includes(data?.mode);
  // Validate the schedule array
  const isValidSchedule =
    Array.isArray(data?.schedule) &&
    data.schedule.every(
      (entry: any) =>
        typeof entry.id === 'number' &&
        typeof entry.time === 'string' &&
        typeof entry.warmBrightness === 'number' &&
        entry.warmBrightness >= 0 &&
        entry.warmBrightness <= 100 &&
        typeof entry.coolBrightness === 'number' &&
        entry.coolBrightness >= 0 &&
        entry.coolBrightness <= 100
    );

  return isValidMode && isValidSchedule;
};

const ScheduleTable = ({ data, handleInputChange, handleRemoveRow }: any) => (
  <Row className="justify-content-md-left">
    <Table striped bordered hover className="mb-3">
      <thead>
        <tr>
          <th>Time</th>
          <th>Warm Brightness</th>
          <th>Cool Brightness</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.schedule.map((entry: ScheduleEntry) => (
          <tr key={entry.id}>
            <td>{entry.time}</td>
            <td>
              <Form.Control
                type="number"
                value={entry.warmBrightness}
                min="0"
                max="100"
                onChange={(e) =>
                  handleInputChange(entry.id, 'warmBrightness', e.target.value)
                }
              />
            </td>
            <td>
              <Form.Control
                type="number"
                value={entry.coolBrightness}
                min="0"
                max="100"
                onChange={(e) =>
                  handleInputChange(entry.id, 'coolBrightness', e.target.value)
                }
              />
            </td>
            <td>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveRow(entry.id)}
              >
                X
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Row>
);

const AddRowForm = ({
  newTime,
  newWarmBrightness,
  newCoolBrightness,
  setNewTime,
  setNewWarmBrightness,
  setNewCoolBrightness,
  handleAddRow,
}: any) => (
  <Row className="justify-content-md-left">
    <Col className="mb-3">
      <h5>Add a New Row</h5>
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
          onChange={(e) => setNewWarmBrightness(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Cool Brightness"
          value={newCoolBrightness}
          min="0"
          max="100"
          onChange={(e) => setNewCoolBrightness(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddRow}>
          Add
        </Button>
      </InputGroup>
    </Col>
  </Row>
);

const ModeSelector = ({ data, handleModeChange }: any) => (
  <Row className="justify-content-start">
    <Col xs="auto" md="auto" className="mb-3">
      <Button
        variant={data.mode === 'dayNight' ? 'primary' : 'outline-primary'}
        onClick={() => handleModeChange('dayNight')}
      >
        Day/Night Cycle
      </Button>
    </Col>
    <Col xs="auto" md="auto" className="mb-3">
      <Button
        variant={data.mode === 'scheduled' ? 'primary' : 'outline-primary'}
        onClick={() => handleModeChange('scheduled')}
      >
        Scheduled
      </Button>
    </Col>
    <Col xs="auto" md="auto" className="mb-3">
      <Button
        variant={data.mode === 'demo' ? 'primary' : 'outline-primary'}
        onClick={() => handleModeChange('demo')}
      >
        Demo
      </Button>
    </Col>
  </Row>
);

const LightScheduler = () => {
  const [data, setData] = useState<ScheduleData>({
    mode: 'scheduled',
    schedule: [],
  });
  const [newTime, setNewTime] = useState('');
  const [newWarmBrightness, setNewWarmBrightness] = useState('');
  const [newCoolBrightness, setNewCoolBrightness] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const [isSubmissionError, setIsSubmissionError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get<ScheduleData>(lightScheduleURL);
        if (isValidScheduleData(response.data)) {
          setData(response.data);
        } else {
          console.error('Invalid schedule data format', response.data);
        }
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchSchedule();
  }, []);

  useEffect(() => {
    if (isSuccessfullySubmitted) {
      const timer = setTimeout(() => {
        setIsSuccessfullySubmitted(false);
      }, 5000); // Clear success banner after 5 seconds
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isSuccessfullySubmitted]);

  useEffect(() => {
    if (isSubmissionError) {
      const timer = setTimeout(() => {
        setIsSubmissionError(false);
      }, 5000); // Clear error banner after 5 seconds
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isSubmissionError]);

  const saveSchedule = async () => {
    try {
      await axios.post(lightScheduleURL, data);
      setIsSubmissionError(false);
      setIsSuccessfullySubmitted(true);
      setUnsavedChanges(false);
    } catch (error) {
      handleAxiosError(error);
      setIsSubmissionError(true);
      setIsSuccessfullySubmitted(false);
    }
  };

  const handleInputChange = (
    id: number,
    type: 'warmBrightness' | 'coolBrightness',
    value: string
  ) => {
    const updatedSchedule = data.schedule.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            [type]: Math.min(100, Math.max(0, Number(value))),
          }
        : entry
    );
    setData({ ...data, schedule: updatedSchedule });
    setUnsavedChanges(true);
  };

  const handleRemoveRow = (id: number) => {
    const updatedSchedule = data.schedule.filter((entry) => entry.id !== id);
    setData({ ...data, schedule: updatedSchedule });
    setUnsavedChanges(true);
  };

  const handleAddRow = () => {
    if (newTime && newWarmBrightness !== '' && newCoolBrightness !== '') {
      const newRow: ScheduleEntry = {
        id: Date.now(),
        time: newTime,
        warmBrightness: Math.min(100, Math.max(0, Number(newWarmBrightness))),
        coolBrightness: Math.min(100, Math.max(0, Number(newCoolBrightness))),
      };
      const updatedSchedule = [...data.schedule, newRow].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
      setData({ ...data, schedule: updatedSchedule });
      setUnsavedChanges(true);
      setNewTime('');
      setNewWarmBrightness('');
      setNewCoolBrightness('');
    }
  };

  const handleModeChange = (newMode: 'dayNight' | 'scheduled' | 'demo') => {
    setData({ ...data, mode: newMode });
    setUnsavedChanges(true);
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Container
        id="light_scheduler"
        className="content-container mb-3 py-3 px-3"
      >
        {isLoading ? (
          <LoadingSpinner /> // Display spinner while loading
        ) : (
          <>
            <Row className="justify-content-md-left">
              <Col md={12} className="mb-3">
                {isSuccessfullySubmitted && (
                  <Alert variant="success">
                    <p className="mb-0">Success - Light Settings Updated</p>
                  </Alert>
                )}
                {isSubmissionError && (
                  <Alert variant="danger">
                    <p className="mb-0">
                      Error occurred while sending updated settings. Please try
                      again.
                    </p>
                  </Alert>
                )}
              </Col>
            </Row>

            <h5>Select Mode</h5>
            <ModeSelector data={data} handleModeChange={handleModeChange} />

            {data.mode !== 'demo' && (
              <>
                <ScheduleTable
                  data={data}
                  handleInputChange={handleInputChange}
                  handleRemoveRow={handleRemoveRow}
                />
                <AddRowForm
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
              <Col md={12} className="mb-3 d-flex justify-content-end">
                <Button
                  variant="success"
                  onClick={() => saveSchedule()}
                  disabled={!unsavedChanges}
                >
                  Save Changes
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </Suspense>
  );
};

export default LightScheduler;
