import http from "../utils/util";

const PredictionDataService = {
  get(id: any) {
    return http.get(`/prediction/${id}`);
  },
  getAll(user_id: any, match_id: any) {
    return http.get(`/prediction/${user_id}/${match_id}`);
  },

  create(data: any) {
    return http.post("/prediction/add-prediction", data);
  },

  update(teamId: any, id: any) {
    return http.put(`/prediction/${teamId}/${id}`);
  },
}

export default PredictionDataService;