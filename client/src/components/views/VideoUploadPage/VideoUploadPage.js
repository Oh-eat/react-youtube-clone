import React from "react";
import { Button, Form, message, Input, Icon } from "antd";
import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import Dropzone from "react-dropzone";

function VideoUploadPage(props) {
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
        <Input onChange value />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange value />
        <br />
        <br />
        <select onChange>
          <option key value />
        </select>
        <br />
        <br />
        <select onChange>
          <option key value />
        </select>
        <br />
        <br />
        <Button type="primary">Submit</Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
