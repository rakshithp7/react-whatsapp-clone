import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined, MoreVert, AttachFile } from "@material-ui/icons";

const Chat = () => {
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h2>Room name</h2>
          <p>Last message sent at ...</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        <p className="chat__message">Hey Guys</p>
        <p className="chat__message">Hey Guys</p>
        <p className="chat__message">Hey Guys</p>
      </div>
      <div className="chat__footer"></div>
    </div>
  );
};

export default Chat;
