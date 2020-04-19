import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";

function VideoDetailPage(props) {
  const [video, setVideo] = useState(null);
  const SubscribeButton = video &&
    video.writer._id !== localStorage.getItem("userId") && (
      <Subscribe userTo={video.writer._id} />
    );

  useEffect(() => {
    const { videoId } = props.match.params;
    Axios.get(`/api/video/getvideo/${videoId}`).then((response) => {
      if (response.data.success) {
        setVideo(response.data.video);
      } else {
        alert("비디오를 불러올 수 없습니다.");
      }
    });
  }, [props.match.params]);

  if (!video) return null;

  return (
    <Row gutter={[16, 16]}>
      <Col lg={18} xs={24}>
        <div style={{ width: "100%", padding: "3rem 4rem" }}>
          <video style={{ width: "100%" }} src={video.filePath} controls />
          <List.Item actions={[SubscribeButton]}>
            <List.Item.Meta
              avatar={<Avatar src={video.writer.image} />}
              title={video.writer.name}
              description={video.description}
            />
          </List.Item>
          <Comment video={video} />
        </div>
      </Col>
      <Col lg={6} xs={24}>
        <SideVideo />
      </Col>
    </Row>
  );
}

export default withRouter(VideoDetailPage);
