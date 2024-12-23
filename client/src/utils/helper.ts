export const getData = async (dbValue: string): Promise<{ error?: string, result: { label: string, value: string }[] }> => {
    const res = await fetch(`http://localhost:5000/api/table/db/${dbValue}`);

    if (!res.ok)
        return { error: "Failed while fetching", result: [] };

    const result = (await res.json()).data;
    return { result: result.map((r: string) => ({ label: r, value: r })) };
}