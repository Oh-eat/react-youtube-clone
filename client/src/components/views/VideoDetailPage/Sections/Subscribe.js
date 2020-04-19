import React, { useEffect, useState } from "react";
import Axios from "axios";

function Subscribe({ userTo }) {
  const [subscriberNumber, setSubscriberNumber] = useState(null);
  const [subscribed, setSubscribed] = useState(null);

  const handleClick = () => {
    const requestBody = {
      userTo,
      userFrom: localStorage.getItem("userId"),
    };

    if (subscribed) {
      Axios.post("/api/subscribe/unsubscribe", requestBody).then((response) => {
        if (response.data.success) {
          setSubscribed(false);
          setSubscriberNumber(subscriberNumber - 1);
        } else {
          alert("구독 취소에 실패하였습니다.");
        }
      });
    } else {
      Axios.post("/api/subscribe/subscribe", requestBody).then((response) => {
        if (response.data.success) {
          setSubscribed(true);
          setSubscriberNumber(subscriberNumber + 1);
        } else {
          alert("구독에 실패하였습니다.");
        }
      });
    }
  };

  useEffect(() => {
    Axios.post("/api/subscribe/subscribenumber", { userTo }).then(
      (response) => {
        if (response.data.success) {
          setSubscriberNumber(response.data.subscriberNumber);
        } else {
          alert("구독자 정보를 받아오지 못했습니다.");
        }
      }
    );

    Axios.post("/api/subscribe/subscribed", {
      userTo,
      userFrom: localStorage.getItem("userId"),
    }).then((response) => {
      if (response.data.success) {
        setSubscribed(response.data.subscribed);
      } else {
        alert("구독 여부를 확인할 수 없습니다.");
      }
    });
  }, [userTo]);

  if (subscriberNumber === null || subscribed === null) return null;

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? "gray" : "#C00"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick={handleClick}
      >
        {subscriberNumber} {subscribed ? "subscribed" : "subscribe"}
      </button>
    </div>
  );
}

export default Subscribe;
