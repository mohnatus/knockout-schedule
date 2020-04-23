import KO from 'knockout';
import * as Time from './utils/time';

export default class ScheduleModel {
	/**
	 * @constructor
	 * @param {Object} config
	 */
	constructor(config) {
		const { start, end } = config;

		const [startHour, startMin] = Time.validate(start);
		this.startHour = KO.observable(startHour);
		this.startMin = KO.observable(startMin);

		const [endHour, endMin] = Time.validate(end);
		this.endHour = KO.observable(endHour);
		this.endMin = KO.observable(endMin);

		this.hours = [...Array(7)].map((day) => {
			return KO.observableArray(
				[...Array(24)].map((_, index) => ({ active: false, index }))
			);
		});
		this.list = KO.computed(() => this.getRange());
	}

	get startTime() {
    return Time.format(this.startHour(), this.startMin());
	}

	updateStartTimeHandler(_, event) {
		this.updateStartTime(event.target.value);
	}

	updateStartTime(value) {
		const [hour, min] = Time.validate(value);
		this.startHour(hour);
		this.startMin(min);
	}

	get endTime() {
		return Time.format(this.endHour(), this.endMin());
	}

	updateEndTimeHandler(_, event) {
		this.updateEndTime(event.target.value);
	}

	updateEndTime(value) {
		const [hour, min] = Time.validate(value);
		this.endHour(hour);
		this.endMin(min);
	}

	/**
	 * Toggle hour activity
	 * @param {number} day day index [0-6]
	 * @param {number} hour hour index [0-23]
	 */
	toggleHour(day, hour) {
		const current = this.hours[day]()[hour];
		this.hours[day].splice(hour, 1, {
			...current,
			active: !current.active,
		});
	}

	/**
	 * Generates range of visible hours
	 */
	getRange() {
		const startHour = this.startHour();
		const endHour = this.endHour();

    let append = -1;
		if (this.endMin() > 0) append = endHour + 1;
    if (append >= 24) append = 0;
    let list;

    if (startHour < endHour) {
      list = this.hours.map((day) => {
        const dayList = day.slice(startHour, endHour + 1);
        if (append >= 0) {
          dayList.push(day()[append])
        };
				return dayList;
			});
    } else {
			list = this.hours.map((day) => {
				const dayList = [
          ...day.slice(startHour),
          ...day.slice(0, endHour + 1)
        ];
        if (append >= 0) dayList.push(day()[append]);
				return dayList;
			});
		}
    return list;
	}

  timeFormat(int) {
    return Time.formatPart(int)
  }
}
