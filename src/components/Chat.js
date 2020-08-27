import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import {
  SearchOutlined,
  MoreVert,
  AttachFile,
  InsertEmoticon,
  Mic,
} from "@material-ui/icons";
import db from "../firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();
  const { roomId } = useParams();

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));

    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    getChatHeight();
  }, [messages]);

  const getChatHeight = () => {
    var chat = document.getElementsByClassName("chat__body")[0];
    let shouldScroll =
      chat.scrollTop + chat.clientHeight + 150 >= chat.scrollHeight;

    if (shouldScroll) {
      chat.scrollTop = chat.scrollHeight;
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (roomId && /\S/.test(input)) {
      db.collection("rooms").doc(roomId).collection("messages").add({
        message: input,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setInput("");
  };

  const shouldPrintDate = (message) => {
    var date = new Date(message.timestamp?.toDate());

    var x = messages.find((e) => e === message); // find the message in the array
    var next_message = messages[messages.indexOf(x) + 1]; // get the next message
    var date_next = new Date(next_message?.timestamp?.toDate());
    var isNewDay = date_next.getDate() > date.getDate();

    if (isNewDay) {
      return <p>{date_next.toDateString()}</p>;
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h2>{roomName}</h2>
          <p>
            {messages.length > 0 ? (
              <>
                Last message sent on{" "}
                {new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toLocaleString()}
              </>
            ) : (
              <>New chat room</>
            )}
          </p>
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
        {messages.map((message) => (
          <>
            <p
              className={`chat__message ${
                message.name === user.displayName && "chat__receiver"
              }`}
            >
              <span className="chat__name">{message.name}</span>
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toLocaleTimeString(
                  navigator.language,
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </p>
            <div className="chat__newDay">{shouldPrintDate(message)}</div>
          </>
        ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            placeholder="Type a message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
};

export default Chat;
