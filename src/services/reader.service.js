import createApiClient from "./api.service";

class ReadersService {
  constructor(baseUrl = "/api/readers") {
    this.api = createApiClient(baseUrl);
  }
  async signUp(data) {
    return (await this.api.post("/auth/signup", data)).data;
  }
  async signIn(data) {
    return (await this.api.post("/auth/signin", data)).data;
    z;
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
}

export default new ReadersService();
