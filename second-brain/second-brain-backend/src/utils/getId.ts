export function getId(param: string | string[] | undefined): string | null {
    if (!param) return null;
    if (Array.isArray(param)) return param[0] ?? null;
    return param ?? null;
}
