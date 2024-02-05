import http from "../utils/util";

const statusDataService = {

  get(id: any) {
    return http.get(`/status/${id}`);
  }

}

export default statusDataService;