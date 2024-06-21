import { PredictionRequestPayload } from "../types/prediction";
import http from "../utils/util";

const PredictionService = {
  get(userId: number, matchId: number, data: { groupId: number, tournamentId: number }) {
    return http.post(`/prediction/${userId}/${matchId}`, data);
  },

  create(data: PredictionRequestPayload) {
    return http.post("/prediction/add-prediction", data);
  },

  update(data: PredictionRequestPayload) {
    return http.put(`/prediction/${data.teamId}/${data.predictionId}/${data.matchId}`, data);
  },

  predictedMatchUser(matchId: number, data: { groupId: number, tournamentId: number }) {
    return http.post(`/prediction/${matchId}`, data);
  },
}

export default PredictionService;