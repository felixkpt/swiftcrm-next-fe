export const formatEvent = (name: string, newValue: any) => {
    return { target: { name, value: newValue.id, } } as unknown as React.ChangeEvent<{ value: unknown }>;
}