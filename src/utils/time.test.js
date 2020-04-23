import { validate } from './time.js';

describe('Time.validate', () => {
	test('Parse time string correctly', () => {
		expect(validate('9:00')).toEqual([9, 0]);
		expect(validate('13:59')).toEqual([13, 59]);
	});
	test('Return hours in correct range', () => {
		expect(validate('-1:00')).toEqual([0, 0]);
		expect(validate('24:00')).toEqual([23, 0]);
		expect(validate('27:00')).toEqual([23, 0]);

	});
	test('Return minutes in correct range', () => {
		expect(validate('0:-10')).toEqual([0, 0]);
		expect(validate('0:60')).toEqual([0, 59]);
		expect(validate('0:100')).toEqual([0, 59]);

	});
	test('Return correct time with incorrect format', () => {
		expect(validate('-2734')).toEqual([0, 0]);
		expect(validate('0100')).toEqual([23, 0]);
		expect(validate('23,23')).toEqual([23, 0]);
		expect(validate('')).toEqual([0, 0]);
	})
});
