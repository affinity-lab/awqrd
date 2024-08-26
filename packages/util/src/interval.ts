export function interval(time: string): number {
	const timeUnits: { [key: string]: number } = {
		s: 1,          // seconds
		m: 60,         // minutes
		h: 3600,       // hours
		d: 86400,      // days
		w: 604800      // weeks
	};
	const unit = time.slice(-1); // Get the last character (unit)
	const value = parseInt(time.slice(0, -1)); // Get the numeric part
	if (!timeUnits[unit] || isNaN(value)) throw new Error("Invalid time format");
	return value * timeUnits[unit];
}

interval.week = (number: number) => { return number * 60 * 60 * 24 * 7; };
interval.day = (number: number) => { return number * 60 * 60 * 24; };
interval.hour = (number: number) => { return number * 60 * 60; };
interval.minute = (number: number) => { return number * 60; };
interval.second = (number: number) => { return number; };


interval.day(1);