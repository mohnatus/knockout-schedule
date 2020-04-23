import * as Time from './time'

export function time(input) {
  input.addEventListener('change', (e) => {
    e.preventDefault();
    e.target.value = Time.validateString(e.target.value);
  })
}