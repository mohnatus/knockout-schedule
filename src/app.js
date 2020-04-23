import KO from 'knockout';
import ScheduleModel from './schedule';
import * as Validator from './utils/validator';

/**
 * Validates time inputs
 */

[...document.querySelectorAll('[data-validation]')]
  .forEach(el => {
    if (el.dataset.validation === 'time') {
      Inputmask({
        mask: '99:99'
      }).mask(el);
      Validator.time(el);
    }
  })

KO.applyBindings(new ScheduleModel({
  start: '09:00',
  end: '23:00'
}));
