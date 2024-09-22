export function getDomainKeyFromUrl(url: string): string {
    const parsedUrl = new URL(url);
    const port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80');
    return `${parsedUrl.hostname}:${port}`;
}