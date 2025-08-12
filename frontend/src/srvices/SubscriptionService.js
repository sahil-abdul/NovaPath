import axios from "axios";

class SubscriptionService {
  async toggleSubscription({ channelId }) {
    try {
      const data = await axios.post(`/v1/subscription/c/${channelId}`);
      if (data) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.log(
        "get toggle subscription Channels error:",
        error.response?.data || error.message
      );
    }
  }

  async getChannelSubscriber({ channelId }) {
    try {
      const data = await axios.get(`/v1/subscription/c/${channelId}`);
      if (data) {
        return data.data.data.subscriber;
      }
      return null;
    } catch (error) {
      console.log(
        "get subscriber of the channel error:",
        error.response?.data || error.message
      );
    }
  }

  async getSubscribedChannels({ subscriberId }) {
    try {
      const data = await axios.get(`/v1/subscription/u/${subscriberId}`);
      if (data) {
        return data.data.data.channels;
      }
      return null;
    } catch (error) {
      console.log(
        "get Subscribed Channels error:",
        error.response?.data || error.message
      );
    }
  }

  async isSubscribe({ channelId }) {
    try {
      const isSubscriber = await axios.get(
        `/v1/subscription/isSub/${channelId}`
      );
      return isSubscriber.data.data;
    } catch (error) {
      console.log(
        " subscriber status fetch error",
        error.response?.data || error.message
      );
    }
  }
}

const subService = new SubscriptionService();
export default subService;
