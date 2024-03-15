import http from "../utils/util";

const predictionAnalysisDataService = {

  get(id: any) {
    return http.get(`/prediction-analysis/${id}`);
  }

}

export default predictionAnalysisDataService;