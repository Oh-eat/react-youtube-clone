import React, { useState, useCallback } from "react";
import { Button, Form, message, Input, Icon } from "antd";
import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import Dropzone from "react-dropzone";
import Axios from "axios";

const privateOptions = [
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
  const [thumbnail, setThumbnail] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    private: 0,
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
            setThumbnail(`http://localhost:5000/${response.data.url}`);
          } else {
            alert("썸네일 생성에 실패하였습니다.");
          }
        });
      } else {
        alert("비디오 업로드에 실패하였습니다.");
      }
    });
  }, []);

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
          <div>{thumbnail && <img src={thumbnail} alt="thumbnail" />}</div>
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
        <select name="private" onChange={handleChange} value={form.private}>
          {privateOptions.map((privateOption, index) => (
            <option key={index} value={privateOption.value}>
              {privateOption.label}
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
        <Button type="primary">Submit</Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
