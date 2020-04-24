import KO from 'knockout';
import ScheduleModel from './schedule';
import * as Validator from './utils/validator';

/**
 * Validates time inputs
 */

[...document.querySelectorAll('[data-input]')]
  .forEach(el => {
    if (el.dataset.input === 'time') {
      Inputmask({
        mask: '99:99'
      }).mask(el);
      Validator.time(el);
    }
  })

KO.applyBindings(new ScheduleModel({
  start: '09:00',
  end: '08:00',
  locale: {
    days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  }
}));
