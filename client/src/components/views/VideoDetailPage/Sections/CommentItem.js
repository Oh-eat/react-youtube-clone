import React, { useState, useCallback } from "react";
import { Comment, Avatar } from "antd";
import Axios from "axios";
import LikeDislike from "./LikeDislike";

function CommentItem({
  comment,
  video,
  replies,
  getReplies,
  refreshAfterInsert,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleRepliesShow = useCallback(
    (e) => {
      setShowReplies(!showReplies);
    },
    [showReplies]
  );
  const handleReplyAdd = useCallback(() => {
    setShowReplyForm(!showReplyForm);
  }, [showReplyForm]);

  const handleReplyTextChange = useCallback((e) => {
    setReplyText(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const commentInfo = {
        content: replyText,
        writer: localStorage.getItem("userId"),
        responseTo: comment._id,
        postId: video._id,
      };

      Axios.post("/api/comment/saveComment", commentInfo).then((response) => {
        if (response.data.success) {
          setReplyText("");
          setShowReplyForm(false);
          setShowReplies(true);
          refreshAfterInsert(response.data.comment);
        } else {
          alert("답글 작성에 실패하였습니다.");
        }
      });
    },
    [replyText, comment, video, refreshAfterInsert]
  );

  const actions = [
    localStorage.getItem("userId") &&
      comment.writer._id !== localStorage.getItem("userId") && (
        <LikeDislike commentId={comment._id} />
      ),
    <span onClick={handleReplyAdd}>Reply to</span>,
    replies.length > 0 && (
      <span onClick={handleRepliesShow}>
        {replies.length > 1 ? "Show replies" : "Show reply"}
      </span>
    ),
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={comment.writer.name}
        avatar={<Avatar src={comment.writer.image} alt="" />}
        content={<p>{comment.content}</p>}
      />
      {showReplyForm && (
        <form
          style={{ marginLeft: "2rem", display: "flex" }}
          onSubmit={handleSubmit}
        >
          <textarea
            style={{
              width: "100%",
              padding: "5px",
              borderRadius: "5px",
            }}
            onChange={handleReplyTextChange}
            value={replyText}
            placeholder="답글"
          />
          <button
            onClick={handleSubmit}
            style={{ marginLeft: "1rem", width: "15vw", height: "52px" }}
          >
            Submit
          </button>
        </form>
      )}
      <div style={{ marginLeft: "2rem", width: "auto" }}>
        {showReplies &&
          replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              video={video}
              replies={getReplies(reply._id)}
              getReplies={getReplies}
              refreshAfterInsert={refreshAfterInsert}
            />
          ))}
      </div>
    </div>
  );
}

export default React.memo(CommentItem);
