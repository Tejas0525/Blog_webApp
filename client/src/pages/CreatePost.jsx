import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default function CreatePost() {
  const [title, SetTitle] = useState("");
  const [summary, SetSummary] = useState("");
  const [content, SetContent] = useState("");
  const [files, SetFiles] = useState(null);
  const [redirect, SetRedirect] = useState(false);

  async function CreateNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    console.log(files);
    const response = await fetch("http://localhost:8000/post", {
      method: "POST",
      body: data,
      credentials:'include',
    });
    if (response.ok) {
      SetRedirect(true);
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }

  return (
    <form onSubmit={CreateNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => {
          SetTitle(ev.target.value);
        }}
      ></input>
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => {
          SetSummary(ev.target.value);
        }}
      ></input>
      <input
        type="file"
        onChange={(ev) => {
          SetFiles(ev.target.files);
        }}
      />
      <ReactQuill
        value={content}
        onChange={(newValue) => {
          SetContent(newValue);
        }}
        modules={modules}
        formats={formats}
      />
      <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
  );
}
