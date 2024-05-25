import { toast } from "sonner";

interface IgetFetch {
    url: string;
    method: string;
    body?: any;
  }

export const getFetch = async ({url, method, body}:IgetFetch) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong");
    }
  };