import React, { useState, useCallback } from "react";
import { Button, Form, message, Input, Icon } from "antd";
import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const privacyOptions = [
  {
    value: 0,
    label: "public",
  },
  {
    value: 1,
    label: "private",
  },
];

const categoryOptions = [
  {
    value: 0,
    label: "Film & Animation",
  },
  {
    value: 1,
    label: "Autos & Vehicles",
  },
  {
    value: 2,
    label: "Music",
  },
  {
    value: 3,
    label: "Pets & Animals",
  },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);
  const [video, setVideo] = useState({
    filePath: null,
    duration: null,
    thumbnail: null,
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    privacy: 0,
    category: 0,
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((state) => ({ ...state, [name]: value }));
  }, []);

  const handleDrop = useCallback((files) => {
    let formData = new FormData();
    const config = {
      header: { "Content-Type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        const fileInfo = {
          url: response.data.url,
          fileName: response.data.fileName,
        };

        Axios.post("/api/video/thumbnail", fileInfo).then((response) => {
          if (response.data.success) {
            setVideo({
              filePath: `http://localhost:5000/${fileInfo.fileName}`,
              thumbnail: `http://localhost:5000/${response.data.url}`,
              duration: response.data.fileDuration,
            });
          } else {
            alert("썸네일 생성에 실패하였습니다.");
          }
        });
      } else {
        alert("비디오 업로드에 실패하였습니다.");
      }
    });
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { title, description, privacy, category } = form;
      const { filePath, duration, thumbnail } = video;
      const submitInfo = {
        writer: user.userData._id,
        title,
        description,
        privacy,
        category,
        filePath,
        duration,
        thumbnail,
      };

      Axios.post("/api/video/uploadVideo", submitInfo).then((response) => {
        if (response.data.success) {
          message.success("비디오 업로드가 완료되었습니다.");
          props.history.push("/");
        } else {
          alert("비디오 업로드에 실패했습니다.");
        }
      });
    },
    [form, video]
  );

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropzone onDrop={handleDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          <div>
            {video.thumbnail && <img src={video.thumbnail} alt="thumbnail" />}
          </div>
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input name="title" onChange={handleChange} value={form.title} />
        <br />
        <br />
        <label>Description</label>
        <TextArea
          name="description"
          onChange={handleChange}
          value={form.description}
        />
        <br />
        <br />
        <select name="privacy" onChange={handleChange} value={form.privacy}>
          {privacyOptions.map((privacyOption, index) => (
            <option key={index} value={privacyOption.value}>
              {privacyOption.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select name="category" onChange={handleChange} value={form.category}>
          {categoryOptions.map((categoryOption, index) => (
            <option key={index} value={categoryOption.value}>
              {categoryOption.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(VideoUploadPage);
