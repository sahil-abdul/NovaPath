import axios from "axios";

class VideoService {
  async getAllVideos() {
    try {
      const videos = await axios.get("/v1/video");
      if (videos) {
        return videos.data.data;
      }
      return null;
    } catch (error) {
      console.log(" all video error:", error.response?.data || error.message);
    }
  }

  async uploadVideo({ title, description, videoFile, thumbnail }) {
    try {
      const video = await axios.post(
        "/v1/video",
        {
          title,
          description,
          videoFile: videoFile[0],
          thumbnail: thumbnail[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (video) {
        return video;
      }
      return null;
    } catch (error) {
      console.log(
        " upload video error:",
        error.response?.data || error.message
      );
    }
  }

  async togglePublish(videoId) {
    try {
      await axios.patch(`/v1/video/toggle/publish/${videoId}`);
    } catch (error) {
      console.log(
        "toggle publish  error:",
        error.response?.data || error.message
      );
    }
  }

  async getVideo({ videoId }) {
    try {
      const video = await axios.get(`/v1/video/${videoId}`);
      if (video) {
        return video.data.data;
      }
      return null;
    } catch (error) {
      console.log("get video error:", error.response?.data || error.message);
    }
  }

  async getAllUserVideo() {
    try {
      const video = await axios.get(`/v1/video/allVideos`);
      if (video) {
        return video.data.data;
      }
      return null;
    } catch (error) {
      console.log("get video error:", error.response?.data || error.message);
    }
  }

  async updateVideo({ videoId, thumbnail, description, title }) {
    try {
      const updateVideo = await axios.patch(
        `/v1/video/${videoId}`,
        {
          videoId,
          thumbnail: thumbnail[0],
          description,
          title,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (updateVideo) {
        return updateVideo;
      }
      return null;
    } catch (error) {
      console.log(
        "updating video error(service error):",
        error.response?.data || error.message
      );
    }
  }

  async deleteVideo({ videoId }) {
    // console.log(videoId);
    try {
      await axios.delete(`/v1/video/${videoId}`);
    } catch (error) {
      console.log("delete video error:", error.response?.data || error.message);
    }
  }

  async getChannelsVideo({ channelId }) {
    try {
      const video = await axios.get(`/v1/video/channel/${channelId}`);
      if (video) {
        return video.data.data;
      }
      return null;
    } catch (error) {
      console.log("get video error:", error.response?.data || error.message);
    }
  }

  async increaseView({ videoId }) {
    try {
      const video = await axios.post(`/v1/video/incView/`,{videoId});
      if (video) {
        return video.data.data;
      }
      return null;
    } catch (error) {
      console.log("get video error:", error.response?.data || error.message);
    }
  }
}

const videoService = new VideoService();
export default videoService;
