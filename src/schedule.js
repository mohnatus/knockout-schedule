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
          active: KO.observable(false),
        };
      });
    });
    this.list = KO.computed(() => this.getRange());

    this.offset = KO.computed(() => {
      // количество ячеек в ряду
      const cellsCount = this.list()[0].length;
      // ширина ячейки в процентах
      const cellWidth = 1 / cellsCount;
      // сколько нужно скрыть от первой ячейки в процентах
      const cellPercentStart = this.startMin() / 60;
      // сколько нужно скрыть от последней ячейки в процентах
      const cellPercentEnd = this.endMin() ? 1 - this.endMin() / 60 : 0;
      // сколько нужно скрыть от таблицы в процентах
      const tablePercentStart = cellPercentStart * cellWidth;
      const tablePercentEnd = cellPercentEnd * cellWidth;
      const tablePercent = tablePercentStart + tablePercentEnd;
      // видимая часть таблицы в процентах
      const visiblePercent = 1 - tablePercent;
      // полная ширина таблицы относительно ширины контейнера
      const width = (1 / visiblePercent) * 100 + '%';
      console.log('cells', cellsCount, cellWidth);
      console.log('cell percent', cellPercentStart, cellPercentEnd);
      console.log('table percent', tablePercent);
      console.log('visible percent', visiblePercent);

      const transform = `translateX(-${tablePercentStart * 100}%)`;

      console.log('width', width, 'transform', transform);
      return {
        table: { width, transform },
        time: { 'margin-left': cellPercentStart * 100 + '%' },
      };
    });
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
    if (this.endMin() > 0) append = endHour;
    if (append >= 24) append = 0;
    let list;

    if (startHour < endHour) {
      list = this.hours.map((day) => {
        const dayList = day.slice(startHour, endHour);
        if (append >= 0) {
          dayList.push(day[append]);
        }
        return dayList;
      });
    } else {
      list = this.hours.map((day) => {
        const dayList = [...day.slice(startHour), ...day.slice(0, endHour)];
        if (append >= 0) dayList.push(day[append]);
        return dayList;
      });
    }
    return list;
  }

  _eachHour(cb) {
    const startHour = this.startHour();
    const count = this.hours[0].length;

    let counter = 0;

    for (let i = startHour; i < count; i++) {
      this.hours.forEach((day, dayIndex) => {
        cb(day[i], counter++, dayIndex);
      });
    }

    for (let i = 0, finish = this.startHour(); i < finish; i++) {
      this.hours.forEach((day, dayIndex) => {
        cb(day[i], counter++, dayIndex);
      });
    }
  }

  fillSchedule() {
    this._eachHour((hour, index, dayIndex) => {
      setTimeout(() => hour.active(true), index * 2 + dayIndex * 50);
    });
  }

  resetSchedule() {
    this._eachHour((hour, index, dayIndex) => {
      setTimeout(() => hour.active(false), index * 2 + dayIndex * 50);
    });
  }

  timeFormat(int) {
    return Time.formatPart(int);
  }
}
