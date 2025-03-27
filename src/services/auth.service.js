// UserService.js
import createApiClient from "./api.service";
import { jwtDecode } from "jwt-decode";

class UserService {
  constructor(baseUrl = "/api/staffs") {
    this.api = createApiClient(baseUrl);
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const response = await this.api.get(`/${userId}`);
      return response.data.data; // Truy cập đúng dữ liệu user từ response
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default new UserService();
