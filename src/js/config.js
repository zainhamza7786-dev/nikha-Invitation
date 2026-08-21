export async function loadConfig() {
    const response = await fetch('config/wedding.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load wedding config: ${response.status}`);
    return response.json();
}

export function getNames(config) {
    return `${config.groom} & ${config.bride}`;
}

export function getEventDate(config) {
    const [year, month, day] = config.date.split('-').map(Number);
    const [hour, minute] = to24Hour(config.time).split(':').map(Number);
    const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: config.timezone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date(utcGuess));
    const values = Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]));
    const localAsUtc = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute));
    return new Date(utcGuess - (localAsUtc - utcGuess));
}

function to24Hour(time) {
    const match = time.trim().match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)?$/i);
    if (!match) return '19:00';
    let hour = Number(match[1]);
    const minute = match[2] || '00';
    const meridiem = match[3]?.toUpperCase();
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    return `${String(hour).padStart(2, '0')}:${minute}`;
}
