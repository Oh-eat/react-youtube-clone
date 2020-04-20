import React, { useCallback, useState, useEffect } from "react";
import Axios from "axios";
import CommentItem from "./CommentItem";

function Comment({ video }) {
  const [commentText, setCommentText] = useState("");
  const [commentItems, setCommentItems] = useState([]);

  const getReplies = useCallback(
    (commentId) =>
      commentItems.filter(
        (commentItem) => commentItem.responseTo === commentId
      ),
    [commentItems]
  );

  const refreshAfterInsert = useCallback(
    (commentItem) => {
      setCommentItems(commentItems.concat(commentItem));
    },
    [commentItems]
  );

  const handleChange = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const commentInfo = {
        content: commentText,
        writer: localStorage.getItem("userId"),
        postId: video._id,
      };

      Axios.post("/api/comment/saveComment", commentInfo).then((response) => {
        if (response.data.success) {
          setCommentText("");
          refreshAfterInsert(response.data.comment);
        } else {
          alert("댓글 작성에 실패하였습니다.");
        }
      });
    },
    [commentText, refreshAfterInsert, video]
  );

  useEffect(() => {
    Axios.get(`/api/comment/getcomments/${video._id}`).then((response) => {
      if (response.data.success) {
        setCommentItems(response.data.comments);
      } else {
        alert("댓글 조회에 실패하였습니다.");
      }
    });
  }, [video]);

  return (
    <div>
      <br />
      <p>Comments</p>
      <hr />
      <div>
        {commentItems.map(
          (commentItem) =>
            !commentItem.responseTo && (
              <CommentItem
                key={commentItem._id}
                comment={commentItem}
                video={video}
                replies={getReplies(commentItem._id)}
                getReplies={getReplies}
                refreshAfterInsert={refreshAfterInsert}
              />
            )
        )}
      </div>
      <form
        style={{ display: "flex", marginTop: "1rem" }}
        onSubmit={handleSubmit}
      >
        <textarea
          style={{
            width: "100%",
            padding: "5px",
            borderRadius: "5px",
          }}
          onChange={handleChange}
          value={commentText}
          placeholder="댓글"
        />
        <button
          onClick={handleSubmit}
          style={{ marginLeft: "1rem", width: "15vw", height: "52px" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
