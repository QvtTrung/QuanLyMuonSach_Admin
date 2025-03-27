import createApiClient from "./api.service";

class StaffsService {
  constructor(baseUrl = "/api/staffs") {
    this.api = createApiClient(baseUrl);
  }
  async signUp(data) {
    return (await this.api.post("/auth/signup", data)).data;
  }
  async signIn(data) {
    return (
      await this.api.post("/auth/signin", {
        MSNV: data.username, // Đồng bộ với backend
        Password: data.password,
      })
    ).data;
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

export default new StaffsService();
