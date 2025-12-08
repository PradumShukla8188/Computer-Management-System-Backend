export function normalizeMetric(raw: Record<string, any>): Record<string, any> {
	const normalized: Record<string, any> = {};

	for (const [key, value] of Object.entries(raw)) {
		// Convert dot.notation to snake_case
		const snakeKey = key.replace(/\./g, '_');

		normalized[snakeKey] = value;
	}

	return normalized;
}
