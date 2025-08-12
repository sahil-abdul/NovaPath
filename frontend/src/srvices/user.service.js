import axios from "axios";


class UserService {
  async resetPass({ oldPassword, newPassword }) {
    try {
      await axios.post("/v1/user/reset-pass", { oldPassword, newPassword });
    } catch (error) {
      console.log(
        "reset password error:",
        error.response?.data || error.message
      );
    }
  }

  async updateDetail({ fullName, email }) {
    try {
      const updateData = await axios.patch("/v1/user/updDetail", {
        fullName,
        email,
      });
      if (updateData) {
        return updateData;
      }
      return null;
    } catch (error) {
      console.log(
        "update user detail error:",
        error.response?.data || error.message
      );
    }
  }

  async updateAvatar({ avatar }) {
    try {
      const updateData = await axios.patch(
        "/v1/user/updAvatar",
        {
          avatar: avatar[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (updateData) {
        return updateData;
      }
      return null;
    } catch (error) {
      console.log(
        "update avatar detail error:",
        error.response?.data || error.message
      );
    }
  }

  async updateCoverImage({ coverImage }) {
   
    try {
      const updateData = await axios.patch(
        "/v1/user/updCoverImage",
        {
          covarimage: coverImage[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (updateData) {
        return updateData;
      }
      return null;
    } catch (error) {
      console.log(
        "update cover image detail error:",
        error.response?.data || error.message
      );
    }
  }

  async getUserChannel({ userId }) {
    try {
      const channel = await axios.get(`/v1/user/channel/${userId}`);
      if (channel) {
        return channel.data.data;
      }
      return null;
    } catch (error) {
      console.log(
        "get user channel error:",
        error.response?.data || error.message
      );
    }
  }

  async getWatchHistory() {
    try {
      const watchHistory = await axios.get(`/v1/user/watch-history`);
      if (watchHistory) {
        return watchHistory;
      }
      return null;
    } catch (error) {
      console.log(
        "get user watch history error:",
        error.response?.data || error.message
      );
    }
  }
}

const userService = new UserService();
export default userService;
