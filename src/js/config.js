export async function loadConfig() {
    const [weddingResponse, designsResponse] = await Promise.all([
        fetch('config/wedding.json', { cache: 'no-store' }),
        fetch('config/designs.json', { cache: 'no-store' })
    ]);
    if (!weddingResponse.ok) throw new Error(`Could not load wedding config: ${weddingResponse.status}`);
    if (!designsResponse.ok) throw new Error(`Could not load design registry: ${designsResponse.status}`);
    const wedding = await weddingResponse.json();
    const designs = await designsResponse.json();
    const designName = wedding.design || wedding.theme || 'emerald-gold';
    const design = designs[designName] || {
        ...designs.emerald-gold,
        ...(wedding.background ? { background: wedding.background } : {})
    };
    const resolved = { ...wedding, design: designName, designConfig: design };
    if (!designs[designName]) {
        resolved.designWarning = `Missing design "${designName}". Using emerald-gold instead.`;
    }
    return resolved;
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
