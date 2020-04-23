import Schedule from './schedule';

function createSchedule() {
  return new Schedule({ start: '9:00', end: '9:00' });
}

function getHour(schedule, hourIndex) {
  return schedule.hours[0]()[hourIndex];
}

function getList(schedule) {
  return schedule.list();
}

describe('Schedule.toggleHour', () => {
	const schedule = createSchedule();

  function getFirstHourActivity() {
    return getHour(schedule, 0).active;
  }

	test('Hour is inactive by default', () => {
		expect(getFirstHourActivity()).toBe(false);
	});

	test('Activates hour correctly', () => {
		schedule.toggleHour(0, 0);
		expect(getFirstHourActivity()).toBe(true);
	});

	test('Deactivates hour correctly', () => {
		schedule.toggleHour(0, 0);
		expect(getFirstHourActivity()).toBe(false);
	});
});

describe('Schedule.updateStartTime', () => {
  test('Set start hours and minutes correctly', () => {
    const schedule = createSchedule();

    schedule.updateStartTime('18:45');
    expect(schedule.startHour()).toBe(18);
    expect(schedule.startMin()).toBe(45);

    schedule.updateStartTime('-3:68');
    expect(schedule.startHour()).toBe(0);
    expect(schedule.startMin()).toBe(59);

    schedule.updateStartTime('35:-3245');
    expect(schedule.startHour()).toBe(23);
    expect(schedule.startMin()).toBe(0);
  });
});

describe('Schedule.endTime', () => {
  test('Set end hours and minutes correctly', () => {
    const schedule = createSchedule();

    schedule.updateEndTime('18:45');
    expect(schedule.endHour()).toBe(18);
    expect(schedule.endMin()).toBe(45);

    schedule.updateEndTime('-3:68');
    expect(schedule.endHour()).toBe(0);
    expect(schedule.endMin()).toBe(59);

    schedule.updateEndTime('35:-3245');
    expect(schedule.endHour()).toBe(23);
    expect(schedule.endMin()).toBe(0);
  });
});

describe('Shedule.list', () => {
  const schedule = createSchedule();

  test('Generates list correctly if end is more then start', () => {
    schedule.updateStartTime('9:00')
    schedule.updateEndTime('15:00')
    expect(getList(schedule)[0].length).toBe(7);
    schedule.updateStartTime('00:00')
    schedule.updateEndTime('23:00')
    expect(getList(schedule)[0].length).toBe(24);
  })

  test('Generates list correctly if end is more then start and minutes are more then 0', () => {
    schedule.updateStartTime('9:00')
    schedule.updateEndTime('15:45')
    expect(getList(schedule)[0].length).toBe(8);
    schedule.updateStartTime('00:00')
    schedule.updateEndTime('23:30')
    expect(getList(schedule)[0].length).toBe(25);
  })

  test('Generates list correctly if end is less then start', () => {
    schedule.updateStartTime('20:00')
    schedule.updateEndTime('9:00')
    expect(getList(schedule)[0].length).toBe(14);
  })

  test('Generates list correctly if end is less then start and minutes are more then 0', () => {
    schedule.updateStartTime('20:00')
    schedule.updateEndTime('9:21')
    expect(getList(schedule)[0].length).toBe(15);
  })
});
