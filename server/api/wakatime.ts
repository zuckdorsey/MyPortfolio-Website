// Cache WakaTime stats for 1 hour — data rarely changes
export default defineCachedEventHandler(async (event) => {
  try {
    const apiKey = process.env.WAKATIME_API_KEY;
    
    if (!apiKey) {
      throw new Error('WakaTime API key is not configured');
    }

    const username = 'birdfromhell'; 
    
    const data = await $fetch(
      `https://wakatime.com/api/v1/users/${username}/stats/last_30_days`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
      }
    );

    return data;
  } catch (error) {
    console.error('Error fetching WakaTime data:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch WakaTime statistics'
    });
  }
}, {
  maxAge: 3600, // 1 hour
  name: 'wakatime-stats',
  getKey: () => 'wakatime-stats'
});
