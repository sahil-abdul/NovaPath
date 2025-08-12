import axios from "axios";

class PlayListService {
  async createPlayList({ name, description }) {
    try {
      const playlist = await axios.post("/v1/playlist", { name, description });
    } catch (error) {
      "create playlist error:", error.response?.data || error.message;
    }
  }

  async getPlayList({ playlistId }) {
    try {
      const playlist = axios.get(`/v1/playlist/${playlistId}`);
      if (playlist) {
        return (await playlist).data.data;
      }
      return null;
    } catch (error) {
      "get playlist error:", error.response?.data || error.message;
    }
  }

  async updatePlayList({ playlistId }) {
    try {
      const playlist = axios.patch(`/v1/playlist/${playlistId}`);
      if (playlist) {
        return playlist;
      }
      return null;
    } catch (error) {
      "update playlist error:", error.response?.data || error.message;
    }
  }

  async deletePlaylist({ playlistId }) {
    try {
      const playlist = axios.delete(`/v1/playlist/${playlistId}`);
      console, log("playlist deleted : ", playlist);
    } catch (error) {
      "delete playlist error:", error.response?.data || error.message;
    }
  }

  async addVideoToPlayList({ videoId, playlistId }) {
    try {
      const playlist = axios.patch(`/v1/playlist/add/${videoId}/${playlistId}`);
      if (playlist) {
        return playlist;
      }
      return null;
    } catch (error) {
      "video add to playlist error:", error.response?.data || error.message;
    }
  }

  async removeVideoFromPlaylist({ videoId, playlistId }) {
    try {
      const playlist = axios.patch(
        `/v1/playlist/remove/${videoId}/${playlistId}`
      );
      if (playlist) {
        return playlist;
      }
      return null;
    } catch (error) {
      "video remove to playlist error:", error.response?.data || error.message;
    }
  }

  async getUserPlaylist({ userId }) {
    try {
      const playlist = await axios.get(`/v1/playlist/user/${userId}`);
      if (playlist) {
        return playlist.data.data;
      }
      return null;
    } catch (error) {
      "get users playlist error:", error.response?.data || error.message;
    }
  }

  async getOwnersPlaylist() {
    try {
      const playlist = await axios.get("/v1/playlist");
      if (playlist) {
        return playlist.data.data;
      }
      return null;
    } catch (error) {
      "create playlist error:", error.response?.data || error.message;
    }
  }
}

const playlistService = new PlayListService();
export default playlistService;
