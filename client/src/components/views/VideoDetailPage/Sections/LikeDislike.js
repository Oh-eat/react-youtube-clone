import React, { useEffect, useState, useCallback } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislike({ videoId, commentId }) {
  const [state, setState] = useState({
    like: null,
    dislike: null,
    selected: null,
  });
  const { like, dislike, selected } = state;

  const handleClick = useCallback(
    (type) => {
      const likeInfo = {
        type,
        userId: localStorage.getItem("userId"),
        ...(videoId ? { videoId } : {}),
        ...(commentId ? { commentId } : {}),
      };

      if (selected === null) {
        Axios.post("/api/like/set", likeInfo).then((response) => {
          if (response.data.success) {
            setState({ ...state, [type]: state[type] + 1, selected: type });
          } else {
            alert("요청에 실패하였습니다.");
          }
        });
      } else if (selected === type) {
        Axios.post("/api/like/clear", likeInfo).then((response) => {
          if (response.data.success) {
            setState({ ...state, [type]: state[type] - 1, selected: null });
          } else {
            alert("요청에 실패하였습니다.");
          }
        });
      } else {
        Axios.post("/api/like/toggle", likeInfo).then((response) => {
          if (response.data.success) {
            setState({
              ...state,
              ...(type === "like"
                ? {
                    like: like + 1,
                    dislike: dislike - 1,
                    selected: "like",
                  }
                : {
                    like: like - 1,
                    dislike: dislike + 1,
                    selected: "dislike",
                  }),
            });
          } else {
            alert("요청에 실패하였습니다.");
          }
        });
      }
    },
    [like, dislike, selected, state, videoId, commentId]
  );

  const handleLikeClick = useCallback(() => {
    handleClick("like");
  }, [handleClick]);

  const handleDislikeClick = useCallback(() => {
    handleClick("dislike");
  }, [handleClick]);

  useEffect(() => {
    const likeDislikeInfo = {
      userId: localStorage.getItem("userId"),
      ...(videoId ? { videoId } : {}),
      ...(commentId ? { commentId } : {}),
    };

    Axios.post("/api/like/status", likeDislikeInfo).then((response) => {
      if (response.data.success) {
        const { like, dislike, selected } = response.data;
        setState({ ...state, like, dislike, selected });
      } else {
        console.error(response.data.err);
      }
    });
  }, [videoId, commentId]);

  if (!state) return null;

  return (
    <span>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={`${selected === "like" ? "filled" : "outlined"}`}
            onClick={handleLikeClick}
          />
        </Tooltip>
        <span style={{ paddingLeft: "5px", cursor: "auto" }}>{like}</span>
      </span>
      <span style={{ marginLeft: "0.5rem" }} key="comment-basic-dislike">
        <Tooltip title="Disike">
          <Icon
            type="dislike"
            theme={`${selected === "dislike" ? "filled" : "outlined"}`}
            onClick={handleDislikeClick}
          />
        </Tooltip>
        <span style={{ paddingLeft: "5px", cursor: "auto" }}>{dislike}</span>
      </span>
    </span>
  );
}

export default LikeDislike;
