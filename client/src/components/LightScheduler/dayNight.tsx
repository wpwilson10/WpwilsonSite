import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import { ScheduleData, ScheduleEntry } from './models';
import { formatTime } from './utils';

interface DaylightScheduleTableProps {
  data: ScheduleData;
  handleInputChange: (
    unix_time: number,
    type: 'warmBrightness' | 'coolBrightness',
    value: string
  ) => void;
  handleTimeChange?: (key: 'bed_time' | 'night_time', newTime: string) => void;
}

/**
 * The DaylightScheduleTable component that displays the named schedule entries in a table.
 */
export const DaylightScheduleTable = ({
  data,
  handleInputChange,
  handleTimeChange,
}: DaylightScheduleTableProps) => {
  // Define the entries to show and their labels
  const scheduleEntries = [
    { key: 'civil_twilight_begin', label: 'Dawn', editable: false },
    { key: 'sunrise', label: 'Sunrise', editable: false },
    { key: 'sunset', label: 'Sunset', editable: false },
    { key: 'civil_twilight_end', label: 'Dusk', editable: false },
    { key: 'bed_time', label: 'Bed Time', editable: true },
    { key: 'night_time', label: 'Night Time', editable: true },
  ] as const;

  return (
    <Container className="content-container mb-3 py-3 px-3">
      <h5>Daylight Schedule</h5>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Event</th>
              <th>Time</th>
              <th>Warm Brightness</th>
              <th>Cool Brightness</th>
            </tr>
          </thead>
          <tbody>
            {scheduleEntries.map(({ key, label, editable }) => (
              <tr key={key}>
                <td>{label}</td>
                <td>
                  {editable && handleTimeChange ? (
                    <Form.Control
                      type="time"
                      value={data[key].time}
                      onChange={(e) => handleTimeChange(key, e.target.value)}
                    />
                  ) : (
                    formatTime(data[key].time)
                  )}
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={data[key].warmBrightness}
                    min="0"
                    max="100"
                    onChange={(e) =>
                      handleInputChange(
                        data[key].unix_time,
                        'warmBrightness',
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={data[key].coolBrightness}
                    min="0"
                    max="100"
                    onChange={(e) =>
                      handleInputChange(
                        data[key].unix_time,
                        'coolBrightness',
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export const SunTimes = ({
  sunrise,
  sunset,
  natural_sunset,
  civil_twilight_begin,
  civil_twilight_end,
  natural_twilight_end,
}: {
  sunrise: ScheduleEntry;
  sunset: ScheduleEntry;
  natural_sunset: ScheduleEntry;
  civil_twilight_begin: ScheduleEntry;
  civil_twilight_end: ScheduleEntry;
  natural_twilight_end: ScheduleEntry;
}) => (
  <Container className="content-container mb-3 py-3 px-3">
    <h5>Day/Night Schedule</h5>
    <Row>
      <Col xs={12} md={6} className="mb-2">
        <div>
          <div className="text-muted small">Dawn</div>
          <div className="fs-5">{formatTime(civil_twilight_begin.time)}</div>
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
            {natural_twilight_end.time !== civil_twilight_end.time && (
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

export const DayNightComponent = ({
  data,
  handleInputChange,
  handleTimeChange,
}: DaylightScheduleTableProps) => (
  <>
    <SunTimes
      sunrise={data.sunrise}
      sunset={data.sunset}
      natural_sunset={data.natural_sunset}
      civil_twilight_begin={data.civil_twilight_begin}
      civil_twilight_end={data.civil_twilight_end}
      natural_twilight_end={data.natural_twilight_end}
    />
    <DaylightScheduleTable
      data={data}
      handleInputChange={handleInputChange}
      handleTimeChange={handleTimeChange}
    />
  </>
);

export default DayNightComponent;
