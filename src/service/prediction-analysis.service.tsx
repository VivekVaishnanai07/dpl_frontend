import http from "../utils/util";

const predictionAnalysisDataService = {

  getAll() {
    return http.get("/prediction-analysis");
  },
  get(id: any) {
    return http.get(`/prediction-analysis/${id}`);
  }
}

export default predictionAnalysisDataService;