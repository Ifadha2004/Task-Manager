import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import type { User } from "../lib/types";

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => (await http.get<User[]>("/api/users")).data,
    enabled,
  });
}
