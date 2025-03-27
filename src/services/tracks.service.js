import createApiClient from "./api.service";

class TrackService {
  constructor(baseUrl = "/api/tracks") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
  async getFiltered(filters) {
    return (await this.api.get("/", { params: filters })).data;
  }
  async returnBook(id) {
    return (await this.api.post(`/${id}/return`)).data;
  }
}

export default new TrackService();
