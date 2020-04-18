import React, { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { Avatar, Row, Col } from "antd";
import Axios from "axios";
import Meta from "antd/lib/card/Meta";
import moment from "moment";

const renderCards = (videos) =>
  videos.map((video) => (
    <Col key={video._id} lg={6} md={8} xs={24}>
      <a href={`/video/post/${video._id}`}>
        <div style={{ position: "relative" }}>
          <img
            style={{ width: "100%" }}
            src={video.thumbnail}
            alt="thumbnail"
          />
          <span className="duration">
            {Math.floor(video.duration / 60)}:
            {Math.floor(video.duration % 60)
              .toString()
              .padStart(2, 0)}
          </span>
        </div>
      </a>
      <br />
      <Meta
        avatar={<Avatar src={video.writer.image} />}
        title={video.title}
        description=""
      />
      <span>{video.writer.name}</span>
      <br />
      <span style={{ marginLeft: "3rem" }}>{video.views} views</span> -{" "}
      <span>{moment(video.createdAt).calendar()}</span>
    </Col>
  ));

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
