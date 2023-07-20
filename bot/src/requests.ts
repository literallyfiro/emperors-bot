import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import {decode} from "https://deno.land/std@0.194.0/encoding/base64.ts";

const API_HOST: string = Deno.env.get("API_HOST")!

export const uploadImage = async (fileData: string): Promise<JSON> => {
    const image = `data:image/png;base64,${fileData}`
    const response = await fetch(`${API_HOST}/api/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
        signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}. ${await response.text()}`);
    }
    return await response.json();
};

export const getImage = async (id: string) => {
    const response = await fetch(`${API_HOST}/api/images/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to get image: ${response.statusText}`);
    }

    const json = await response.json();
    const decoded = decode(json.image);

    return decoded;
};

export const getRawImageLink = (id: string) => {
    return `${API_HOST}/api/images/raw/${id}`;
}