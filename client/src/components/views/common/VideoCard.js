import React from "react";
import { Avatar, Col } from "antd";
import Meta from "antd/lib/card/Meta";
import moment from "moment";

function VideoCard({ video }) {
  return (
    <Col lg={6} md={8} xs={24}>
      <a href={`/video/${video._id}`}>
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
  );
}

export default VideoCard;
