import axios from "axios";

class CommentService {
  async getVideoComments({ videoId }) {
    // console.log(videoId)
    try {
      // console.log(videoId)
      const comments = await axios.get(`/v1/comment/${videoId}`);
      if (comments) {
        return comments.data.data.docs;
      }
      return null;
    } catch (error) {
      console.log(
        " all comments error:",
        error.response?.data || error.message
      );
    }
  }

  async addcomment({ content},videoId) {
    try {
      const data = axios.post(`/v1/comment/${videoId}`,{content});
      if (data) {
        return data;
      }
      return null;
    } catch (error) {
      console.log("comments add error:", error.response?.data || error.message);
    }
  }

  async deleteComment( commentId ) {
  
    try {
      await axios.delete(`/v1/comment/c/${commentId}`);
    } catch (error) {
      console.log(
        " comments delete error:",
        error.response?.data || error.message
      );
    }
  }
}

const commentService = new CommentService();
export default commentService;
