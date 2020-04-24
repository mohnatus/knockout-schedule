import KO from 'knockout';
import * as Time from './utils/time';

export default class ScheduleModel {
	/**
	 * @constructor
	 * @param {Object} config
	 */
	constructor(config) {
		const { start, end, locale } = config;

		this.locale = locale;

		const [startHour, startMin] = Time.validate(start);
		this.startHour = KO.observable(startHour);
		this.startMin = KO.observable(startMin);

		const [endHour, endMin] = Time.validate(end);
		this.endHour = KO.observable(endHour);
		this.endMin = KO.observable(endMin);

		this.hours = [...Array(7)].map((day) => {
			return [...Array(24)].map((_, index) => {
				return {
					index,
					active: KO.observable(false)
				}
			});
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
		const current = this.hours[day][hour];

		current.active(!current.active());

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

	_eachHour(cb) {
		this.hours.forEach((day, dayIndex) => {
			day.forEach((hour, hourIndex) => cb(hour, hourIndex, dayIndex));
		})
	}

	fillSchedule() {
		this._eachHour((hour, index, dayIndex) => {
			setTimeout(() => hour.active(true), index * 100 + dayIndex * 10)
		})
	}

	resetSchedule() {
		this._eachHour((hour, index, dayIndex) => {
			setTimeout(() => hour.active(false), index * 100 + dayIndex * 10)
		})
	}

  timeFormat(int) {
    return Time.formatPart(int)
  }
}
