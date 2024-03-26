export const attachStreamToVideo = (
  stream: MediaStream,
  videoElement: HTMLVideoElement,
) => {
  videoElement.srcObject = stream;
  videoElement.setAttribute("autoplay", "");
  videoElement.setAttribute("muted", "");
  videoElement.setAttribute("playsinline", "");
};
