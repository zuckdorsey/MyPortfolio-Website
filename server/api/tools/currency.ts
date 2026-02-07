import { defineEventHandler, getMethod, getQuery, createError } from 'h3';

type CurrencyQuery = {
	from?: string;
	to?: string;
	amount?: string;
};

export default defineEventHandler(async (event) => {
	if (getMethod(event) !== 'GET') {
		throw createError({
			statusCode: 405,
			statusMessage: 'Method Not Allowed'
		});
	}

	const apiKey = process.env.RAPIDAPI_KEY || process.env.CURRENCY_RAPIDAPI_KEY;
	if (!apiKey) {
		throw createError({
			statusCode: 500,
			statusMessage: 'RapidAPI key not configured'
		});
	}

	const query = getQuery(event) as CurrencyQuery;
	const from = query.from || 'USD';
	const to = query.to || 'EUR';
	const amount = query.amount || '750';

	const searchParams = new URLSearchParams({
		from,
		to,
		amount
	});

	try {
		const data = await $fetch(`https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?${searchParams.toString()}`, {
			headers: {
				'x-rapidapi-key': apiKey,
				'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
			}
		});

		const result = (data as any)?.result;
		const formatted = typeof result === 'number'
			? new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: to
			}).format(result)
			: null;

		const safeData = typeof data === 'object' && data !== null ? data : {};

		return {
			...safeData,
			formatted
		};
	} catch (error: any) {
		const statusCode = error?.response?.status || 500;
		const statusMessage = error?.response?.statusText || 'Failed to fetch currency data';
		throw createError({
			statusCode,
			statusMessage
		});
	}
});
