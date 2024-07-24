// ts modifier for converting a form interface to an empty form interface
export type EmptyForm<T> = {
    [K in keyof T]: T[K] extends string ? T[K] : T[K] extends Array<infer U> ? Array<NullPartial<U>> : T[K] extends object ? Partial<T[K]> : T[K] | undefined;
};

type NullPartial<T> = {
    [K in keyof T]: T[K] | null;
};
