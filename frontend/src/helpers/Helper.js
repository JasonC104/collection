export function gameImageResize(url, size) {
    const regex = /t_.*\//g;
    return url.replace(regex, `${size}/`);
}
