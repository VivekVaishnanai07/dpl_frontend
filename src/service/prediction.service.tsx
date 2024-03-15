import http from "../utils/util";

const PredictionDataService = {
  get(user_id: any, match_id: any) {
    return http.get(`/prediction/${user_id}/${match_id}`);
  },

  create(data: any) {
    return http.post("/prediction/add-prediction", data);
  },

  update(teamId: any, predictionId: any, matchId: any) {
    return http.put(`/prediction/${teamId}/${predictionId}/${matchId}`);
  },
}

export default PredictionDataService;