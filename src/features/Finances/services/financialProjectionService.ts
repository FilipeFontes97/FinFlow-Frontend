import http from "../../../api/http";

export interface EmergencyFundProjectionResponse {
  emergencyFundAmount: number;
  monthlyExpenses: number;
  monthsCovered: number;
}

export const financialProjectionService = {
  getEmergencyFundProjection: async (): Promise<EmergencyFundProjectionResponse> => {
    const response = await http.get<EmergencyFundProjectionResponse>("/projection/emergency-fund");
    return response.data;
  },
};
