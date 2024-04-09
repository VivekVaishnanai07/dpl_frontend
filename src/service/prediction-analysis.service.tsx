import http from "../utils/util";

const predictionAnalysisService = {

  getAll() {
    return http.get("/prediction-analysis");
  },
  get(id: number) {
    return http.get(`/prediction-analysis/${id}`);
  }
}

export default predictionAnalysisService;