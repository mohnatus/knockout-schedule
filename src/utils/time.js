export function validate(timeString) {
	const time = timeString.split(':');
	let h = parseInt(time[0]);
	let m = parseInt(time[1]);

  h = h || 0;
  m = m || 0;

	h = Math.min(23, h);
	h = Math.max(0, h);

	m = Math.min(59, m);
	m = Math.max(0, m);

	return [h, m];
}

export function validateString(timeString) {
  const time = validate(timeString);
  return format(time[0], time[1]);
}

export function formatPart(int) {
	return int > 9 ? int : '0' + int;
}

export function format(h, m) {
	return formatPart(h) + ':' + formatPart(m);
}
