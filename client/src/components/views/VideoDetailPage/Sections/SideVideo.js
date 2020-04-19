import React, { useEffect, useState } from "react";
import Axios from "axios";

const renderSideVideo = (sideVideos) =>
  sideVideos.map((sideVideo) => (
    <div
      key={sideVideo._id}
      style={{
        display: "flex",
        marginBottom: "1.5rem",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          width: "50%",
          height: "auto",
          marginRight: "1rem",
        }}
      >
        <a href={`/video/${sideVideo._id}`}>
          <img
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={sideVideo.thumbnail}
            alt="thumbnail"
          />
        </a>
      </div>
      <div style={{ width: "50%" }}>
        <a href={`/video/${sideVideo._id}`} style={{ color: "gray" }}>
          <span style={{ fontSize: "1rem", color: "black" }}>
            {sideVideo.title}
          </span>
          <br />
          <span>{sideVideo.writer.name}</span>
          <br />
          <span>{sideVideo.views}</span>
          <br />
          <span>
            {Math.floor(sideVideo.duration / 60)}:
            {Math.floor(sideVideo.duration % 60)
              .toString()
              .padStart(2, 0)}
          </span>
        </a>
      </div>
    </div>
  ));

function SideVideo(props) {
  const [sideVideos, setSideVideos] = useState(null);

  useEffect(() => {
    Axios.get("/api/video/getvideos").then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert("비디오 목록을 불러오지 못했습니다.");
      }
    });
  }, []);

  if (!sideVideos) return null;

  return <div style={{ marginTop: "3rem" }}>{renderSideVideo(sideVideos)}</div>;
}

export default SideVideo;
