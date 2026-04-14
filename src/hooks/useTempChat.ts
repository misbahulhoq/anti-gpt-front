import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useTempChat = () => {
  const mutation = useMutation({
    mutationKey: ["temporaryChat"],
    mutationFn: async (data: { prompt: string }) => {
      const response = await api.post("/chat/temporary-chat", data);
      return response;
    },
  });

  return mutation;
};
