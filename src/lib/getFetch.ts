import { toast } from "sonner";

interface IgetFetch {
    url: string;
    method: string;
    body?: unknown;
}

export const getFetch = async ({url, method, body}: IgetFetch) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const message = `Error ${response.status}: ${response.statusText}`;
        console.error(message);
        toast.error(message);
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong");
      throw error;
    }
};