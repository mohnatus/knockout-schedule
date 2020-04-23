import KO from 'knockout';
import ScheduleModel from './schedule';
import * as Validator from './utils/validator';

/**
 * Validates time inputs
 */
[...document.querySelectorAll('[data-validation]')]
  .forEach(el => {
    console.log(el)
    if (el.dataset.validation === 'time') Validator.time(el);
  })

KO.applyBindings(new ScheduleModel({
  start: '09:00',
  end: '23:00'
}));
