import { Col, Container, Row, Table } from 'react-bootstrap';
import { ScheduleData, ScheduleEntry } from './models';
import { formatTime } from './utils';

/**
 * The DaylightScheduleTable component that displays the named schedule entries in a table.
 */
export const DaylightScheduleTable = ({ data }: { data: ScheduleData }) => {
  // Define the entries to show and their labels
  const scheduleEntries = [
    { key: 'civil_twilight_begin', label: 'Dawn' },
    { key: 'sunrise', label: 'Sunrise' },
    { key: 'sunset', label: 'Sunset' },
    { key: 'civil_twilight_end', label: 'Dusk' },
    { key: 'bed_time', label: 'Bed Time' },
    { key: 'night_time', label: 'Night Time' },
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
            {scheduleEntries.map(({ key, label }) => (
              <tr key={key}>
                <td>{label}</td>
                <td>{formatTime(data[key].time)}</td>
                <td>{data[key].warmBrightness}%</td>
                <td>{data[key].coolBrightness}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

/**
 * The SunTimes component that displays the sunrise and sunset times.
 *
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {ScheduleEntry} props.sunrise - The sunrise time.
 * @param {ScheduleEntry} props.sunset - The sunset time.
 * @param {ScheduleEntry} props.natural_sunset - The natural sunset time.
 * @param {ScheduleEntry} props.civil_twilight_begin - The civil twilight begin time.
 * @param {ScheduleEntry} props.civil_twilight_end - The civil twilight end time.
 * @param {ScheduleEntry} props.natural_twilight_end - The natural twilight end time.
 * @returns {ReactElement} The SunTimes component.
 */
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

export const DayNightComponent = ({ data }: { data: ScheduleData }) => (
  <>
    <SunTimes
      sunrise={data.sunrise}
      sunset={data.sunset}
      natural_sunset={data.natural_sunset}
      civil_twilight_begin={data.civil_twilight_begin}
      civil_twilight_end={data.civil_twilight_end}
      natural_twilight_end={data.natural_twilight_end}
    />
    <DaylightScheduleTable data={data} />
  </>
);

export default DayNightComponent;
