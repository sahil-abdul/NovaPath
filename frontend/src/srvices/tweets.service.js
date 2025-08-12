import axios from "axios";

class TweetService {
  async getAllTweets() {
    try {
      const Tweets = await axios.get("/v1/tweets");
      if (Tweets) {
        return Tweets.data.data;
      }
      return null;
    } catch (error) {
      console.log(
        "get all tweets error:",
        error.response?.data || error.message
      );
    }
  }

  async addTweet({ content }) {
    try {
      const Tweets = await axios.post("/v1/tweets", { content });
    } catch (error) {
      console.log(
        "get all tweets error:",
        error.response?.data || error.message
      );
    }
  }

   async deleteTweet({ tweetId }) {
    try {
      const Tweets = await axios.delete(`/v1/tweets/${tweetId}`);
    } catch (error) {
      console.log(
        "delete tweets error:",
        error.response?.data || error.message
      );
    }
  }

  async getUsersTweet(){
    try {
      const Tweets = await axios.get(`/v1/tweets/owner`);
      if(Tweets){
        return Tweets.data.data
      }
      return null;
    } catch (error) {
      console.log(
        "users tweets error:",
        error.response?.data || error.message
      );
    }
  }

  async getChannelsTweet({userId}){
     try {
      const Tweets = await axios.get(`/v1/tweets/user/${userId}`);
      if(Tweets){
        return Tweets.data.data
      }
      return null;
    } catch (error) {
      console.log(
        "channels tweets error:",
        error.response?.data || error.message
      );
    }
  }
}

const tweetService = new TweetService();
export default tweetService;
