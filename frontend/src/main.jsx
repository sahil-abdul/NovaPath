import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./app/Store.js";
import { Provider } from "react-redux";
import MyContent from "./pages/MyContent.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VideoDetail from "./pages/VideoDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Protected } from "./components/Protected.jsx";
import OwnersVideo from "./pages/OwnersVideo.jsx";
import AllTweets from "./pages/AllTweets.jsx";
import Videos from "./pages/Videos.jsx";
import UploadVideo from "./components/UploadVideo.jsx";
import Playlist from "./pages/Playlist.jsx";
import Tweets from "./pages/Tweets.jsx";
import Subscribed from "./pages/Subscribed.jsx";
import PlaylistVideo from "./pages/PlaylistVideo.jsx";
import Channels from "./pages/Channels.jsx";
import { ChannelPlaylist } from "./components/Channel/index.js";
import { UserTweets } from "./components/index.js";
import Setting from "./pages/Setting.jsx";
import Privacy from "./pages/Privacy.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Protected autheticated={true}>
            <Videos />
          </Protected>
        ),
      },
       {
        path: "/setting",
        element: (
          <Protected autheticated={true}>
            <Setting />
          </Protected>
        ),
      },
      {
        path: "/playlist/:playlistId",
        element: <PlaylistVideo />,
      },
      {
        path: "/tweets",
        element: <AllTweets />,
      },
      {
        path: "/MyContent",
        element: (
          <Protected autheticated={true}>
            <MyContent />
          </Protected>
        ),
        children: [
          {
            path: "",
            element: <OwnersVideo />,
          },
          {
            path: "/MyContent/playlist",
            element: <Playlist />,
          },
          {
            path: "/MyContent/tweets",
            element: <Tweets />,
          },
          {
            path: "/MyContent/suscribed",
            element: <Subscribed />,
          },
        ],
      },
      {
        path: "/uploadVideo",
        element: (
          <Protected autheticated={true}>
            <UploadVideo />
          </Protected>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Protected autheticated={false}>
        <Login />
      </Protected>
    ),
  },
  {
    path: "/register",
    element: (
      <Protected autheticated={false}>
        <Register />
      </Protected>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Protected autheticated={true}>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/video/:videoId",
    element: <VideoDetail />,
  },
  {
    path: "/channel/:userId",
    element: <Channels />,
    children: [
      {
        path: "",
        element: <OwnersVideo />,
      },
      {
        path: "/channel/:userId/playlist",
        element: <ChannelPlaylist />,
      },
      {
        path: "/channel/:userId/tweets",
        element: <UserTweets />,
      },
      {
        path: "/channel/:userId/suscribed",
        element: <Subscribed />,
      },
    ],
  },
  {
    path:"/Privacy-Policy",
    element:<Privacy/>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
