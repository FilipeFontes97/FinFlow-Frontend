import http from "../../../api/http";

export interface UserSettings {
  income: number;
  fixedExpensesThresholdPercent: number;
}

export const settingsService = {
  get: async (): Promise<UserSettings> => {
    const response = await http.get<UserSettings>("/settings");
    return response.data;
  },

  update: async (payload: UserSettings): Promise<void> => {
    await http.put("/settings", payload);
  }
};