import { useEffect, useRef, useState } from "react";
import VideoCard from "../../components/videoCard";
import "./home.css";


const Home = () => {
  const [videos, setVideos] = useState([]);
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch("http://localhost:3000/get-videos?limit=30")
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.log(err))
  }, []);
  return <div className="home grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
    {videos.map((video: any) => (
      <VideoCard key={video._id} videoObject={video} />
    ))}
  </div>
};

export default Home;
