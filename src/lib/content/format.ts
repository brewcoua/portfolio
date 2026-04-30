import type { DateRangeOrSingleDate, DateValue } from '$lib/content/types';

export function formatEntityDate(dateInfo: DateRangeOrSingleDate): string {
	if (typeof dateInfo.date === 'string') return formatYearMonth(dateInfo.date);

	const [start, end] = dateInfo.date;
	if (!start) return '';
	const from = formatYearMonth(start);
	const to = end ? formatYearMonth(end) : 'Present';
	return `${from} - ${to}`;
}

export function getDateSortKey(dateInfo: DateRangeOrSingleDate): string {
	return getDateStart(dateInfo.date);
}

function getDateStart(date: DateValue): string {
	return typeof date === 'string' ? date : (date[0] ?? '');
}

export function formatYearMonth(value: string): string {
	const [year, month] = value.split('-');
	if (!month) return year;
	const date = new Date(`${year}-${month}-01T00:00:00Z`);
	return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
