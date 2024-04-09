import { PredictionRequestPayload } from "../types/prediction";
import http from "../utils/util";

const PredictionService = {
  get(userId: number, matchId: number) {
    return http.get(`/prediction/${userId}/${matchId}`);
  },

  create(data: PredictionRequestPayload) {
    return http.post("/prediction/add-prediction", data);
  },

  update(data: PredictionRequestPayload) {
    return http.put(`/prediction/${data.teamId}/${data.predictionId}/${data.matchId}`);
  },

  predictedMatchUser(matchId: number) {
    return http.get(`/prediction/${matchId}`);
  },
}

export default PredictionService;