import React, { useState, useCallback } from "react";
import { Button, Form, message, Input, Icon } from "antd";
import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import Dropzone from "react-dropzone";

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
  const [form, setForm] = useState({
    title: "",
    description: "",
    private: 0,
    category: 0,
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Dropzone onDrop multiple maxSize>
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
            <img src alt />
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
