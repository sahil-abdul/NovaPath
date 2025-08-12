import axios from "axios";

class AuthService {
  //

  //registering and login the user
  async registerUser({
    fullName,
    username,
    email,
    password,
    avatar,
    coverImage,
  }) {
    try {
      // console.log(avatar[0])
      const user = await axios.post(
        "/v1/user/register",
        {
          fullName,
          username,
          email,
          password,
          coverImage: coverImage?.[0],
          avatar: avatar[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(user);
      if (user) {
        await this.login({ email, password, username });
      }
    } catch (error) {
      console.log("register error:", error.response?.data || error.message);
    }
  }

  async login({ email, password, username }) {
    try {
      const res = await axios.post("/v1/user/login", {
        email,
        password,
        username,
      });

      // console.log("Login success:", res.data);
      return res.data;
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
    }
  }

  async logout() {
    try {
      const data = await axios.post("/v1/user/logout");
      // console.log(data.data.message);
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
    }
  }

  async getUser() {
    try {
      const user = await axios.post("/v1/user/getUser");
      // console.log(user);
      if (user) return user;

      return null;
    } catch (error) {
      console.log("getUser error:", error.response?.data || error.message);
    }
  }
}

const authService = new AuthService();

export default authService;
