import { firebaseApp } from "./firebase";

let constraintObj = { audio: true };

//handle older browsers that might implement getUserMedia in some way
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
  navigator.mediaDevices.getUserMedia = function (constraintObj) {
    let getUserMedia =
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraintObj, resolve, reject);
    });
  };
}

export const startRecording = async (start) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraintObj);
  const audioTracks = stream.getAudioTracks();
  const track = audioTracks[0];

  let stop = document.getElementById("btnStop");
  let mediaRecorder = new MediaRecorder(stream);
  let chunks = [];

  mediaRecorder.start();

  stop.addEventListener("click", function unsubscribe(ev) {
    track.stop();
    stop.removeEventListener("click", unsubscribe);
  });

  mediaRecorder.ondataavailable = function (ev) {
    chunks.push(ev.data);
  };
  mediaRecorder.onstop = (ev) => {
    let blob = new Blob(chunks, { type: "audio/mpeg;" });
    chunks = [];
    let audioName = new Date().toUTCString().replace(/[,\s]/g, "");

    const storageRef = firebaseApp.storage().ref();
    const fileRef = storageRef.child(`audio/${audioName}`);
    fileRef.put(blob).then(() => {
      alert(
        "Uploaded voice note! Still working on implementation of voice notes in chat. :)"
      );
    });
  };
};
