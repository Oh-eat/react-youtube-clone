import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import SideVideo from "./Sections/SideVideo";

function VideoDetailPage(props) {
  const [video, setVideo] = useState(null);

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
          <List.Item actions>
            <List.Item.Meta
              avatar={<Avatar src={video.writer.image} />}
              title={video.writer.name}
              description={video.description}
            />
          </List.Item>
          <textarea />
        </div>
      </Col>
      <Col lg={6} xs={24}>
        <SideVideo />
      </Col>
    </Row>
  );
}

export default withRouter(VideoDetailPage);
