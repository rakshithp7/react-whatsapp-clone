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
  Stop,
} from "@material-ui/icons";
import ScrollToBottom from "react-scroll-to-bottom";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import db from "../firebase";
import { useStateValue } from "../StateProvider";
import { startRecording } from "../audio-record";
import firebase from "firebase";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [recordAudio, setRecordAudio] = useState(true);
  const [{ user }] = useStateValue();
  const { roomId } = useParams();

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));

    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      var unsubscribe = db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  // Chat body functions

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

  // Chat footer functions

  const showEmojiPicker = () => {
    setShowEmojis(!showEmojis);
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input + emoji);
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

  const recordVoiceNote = () => {
    if (recordAudio) {
      startRecording();
    }
    setRecordAudio(!recordAudio);
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
                ).toLocaleString(navigator.language, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
      <ScrollToBottom
        className="chat__bodyContainer "
        followButtonClassName="chat__scrollButton"
      >
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
      </ScrollToBottom>
      <div className="chat__footer">
        <IconButton onClick={showEmojiPicker}>
          <InsertEmoticon />
        </IconButton>
        <span
          className={`chat__emojiPicker ${
            showEmojis && "chat__emojiPickerShow"
          }`}
        >
          <Picker
            onSelect={addEmoji}
            emojiTooltip={true}
            title="Add an emoji"
          />
        </span>
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

        {!recordAudio ? (
          <IconButton id="btnStop" onClick={recordVoiceNote}>
            <Stop />
          </IconButton>
        ) : (
          <IconButton onClick={recordVoiceNote}>
            <Mic />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Chat;
