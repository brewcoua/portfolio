import type {
	DateRangeOrSingleDate,
	DateValue,
	EducationGrade,
	EducationHonorsGrade,
} from '$lib/content/types';

const EDUCATION_HONORS_LABELS: Record<EducationHonorsGrade, string> = {
	honors: 'Honors',
	'high-honors': 'High honors',
	'highest-honors': 'Highest honors',
	'cum-laude': 'Cum laude',
	'magna-cum-laude': 'Magna cum laude',
	'summa-cum-laude': 'Summa cum laude',
	distinction: 'Distinction',
	merit: 'Merit',
	'first-class': 'First class',
	'upper-second-class': 'Upper second class',
	'lower-second-class': 'Lower second class',
	'third-class': 'Third class',
};

/** Plain-language label for education grade (fraction left normalized, e.g. `14 / 20`). */
export function formatEducationGrade(grade: EducationGrade): string {
	if (grade.kind === 'fraction') return grade.value;
	if (grade.kind === 'honors') return EDUCATION_HONORS_LABELS[grade.honors];
	return grade.label;
}

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
