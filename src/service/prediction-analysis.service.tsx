import http from "../utils/util";

const predictionAnalysisService = {

  getAll(tournamentId: number, groupId: number) {
    return http.get(`/prediction-analysis/filter/${tournamentId}/${groupId}`);
  },
  get(userId: number, groupId: number, tournamentId: number) {
    return http.get(`/prediction-analysis/${userId}/${groupId}/${tournamentId}`);
  }
}

export default predictionAnalysisService;