declare namespace anonymizeIP { }

declare function anonymizeIP(
  ip: string,
  v4MaskLength?: number,
  v6MaskLength?: number
): string | null

export = anonymizeIP
