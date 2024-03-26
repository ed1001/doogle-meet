export const getUserMedia = async () =>
  navigator.mediaDevices.getUserMedia({
    video: true,
    // audio: true,
  });
