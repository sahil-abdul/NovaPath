import axios from "axios";

class LikeServices {
  async getLikeVideos() {
    try {
      const videos = await axios.get("/v1/likes/videos");
      if (videos) {
        return videos;
      }
      return null;
    } catch (error) {
      console.log(
        "getting like video error :",
        error.response?.data || error.message
      );
    }
  }

  async toggleVideoLike({ videoId }) {
    try {
      const like = await axios.post(`/v1/likes/toggle/v/${videoId}`);
    } catch (error) {
      console.log(
        "video like toggle error:",
        error.response?.data || error.message
      );
    }
  }

  async toggleTweetLike({ tweetId }) {
    try {
      const like = await axios.post(`/v1/likes/toggle/t/${tweetId}`);
    } catch (error) {
      console.log(
        "tweet like toggle error:",
        error.response?.data || error.message
      );
    }
  }

  async toggleCommentLike({ commentId }) {
    try {
      const like = await axios.post(`/v1/likes/toggle/c/${commentId}`);
    } catch (error) {
      console.log(
        "comment like toggle error:",
        error.response?.data || error.message
      );
    }
  }

  async getVideoLikes({ videoId }) {
    try {
      const like = await axios.get(`/v1/likes/get/v/${videoId}`);
      if (like) {
        return like.data.data;
      }
      return null;
    } catch (error) {
      console.log(
        "get video like error",
        error.response?.data || error.message
      );
    }
  }

  async getCommentLikes({ commentId }) {
    try {
      const like = await axios.get(`/v1/likes/get/c/${commentId}`);
      if (like) {
        return like.data.data;
      }
      return null;
    } catch (error) {
      console.log(
        "get comment like error",
        error.response?.data || error.message
      );
    }
  }

  async getTweetLikes({ tweetId }) {
    try {
      const like = await axios.get(`/v1/likes/get/t/${tweetId}`);
      if (like) {
        return like.data.data;
      }
      return null;
    } catch (error) {
      console.log(
        "get tweet like error",
        error.response?.data || error.message
      );
    }
  }
}

const likeService = new LikeServices();
export default likeService;
