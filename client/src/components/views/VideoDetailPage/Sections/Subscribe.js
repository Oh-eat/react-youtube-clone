import React, { useEffect, useState } from "react";
import Axios from "axios";

function Subscribe({ userTo }) {
  const [subscriberNumber, setSubscriberNumber] = useState(null);
  const [subscribed, setSubscribed] = useState(null);

  const handleClick = () => {};

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
