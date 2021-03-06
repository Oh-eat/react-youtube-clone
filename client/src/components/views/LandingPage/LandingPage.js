import React, { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { Row } from "antd";
import Axios from "axios";
import VideoCard from "../common/VideoCard";

const renderCards = (videos) =>
  videos.map((video, index) => <VideoCard key={index} video={video} />);

function LandingPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    Axios.get("/api/video/getvideos").then((response) => {
      if (response.data.success) {
        setVideos(response.data.videos);
      } else {
        alert("비디오 정보를 가져오지 못했습니다.");
      }
    });
  }, []);

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={[32, 16]}>{videos.length > 0 && renderCards(videos)}</Row>
    </div>
  );
}

export default LandingPage;
