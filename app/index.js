const fs = require("fs");
const axios = require("axios").default;

let fileIndex = 1;
const url =
  "https://api.twitch.tv/v5/videos/606191453/comments?client_id=wjz9k2cy7wmf45m435p4micwwopcst";

let lastContentOffset = 1;

function getChatFromApi(contentOffset) {
  return axios.get(url + "&content_offset_seconds=" + contentOffset);
}

function getFormatedChatMessages(response) {
  return response.data.comments.map((value) => {
    return {
      commenter: value.commenter.display_name,
      msg: value.message.body,
      content_offset_sec: value.content_offset_seconds,
    };
  });
}

function writeChatMessagesToFile(messages) {
  fs.writeFile(
    `./chat-logs/portion_${fileIndex}.json`,
    JSON.stringify(messages),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

function getVodInfo() {
  return axios.get('https://api.twitch.tv/helix/videos?id=606191453', { headers: { 'Client-ID': 'wjz9k2cy7wmf45m435p4micwwopcst' } })
  .catch(error => { console.error(error) })

}

function getLastContentOffset(response) {
  return response.data.comments[response.data.comments.length - 1].content_offset_seconds
}

function getVodTotalContentOffset(value) {
  const duration = value.data.data[0].duration;

  let durationInSec = duration.replace('m', '-').replace('h', '-').replace('s', '').split('-').reduce(prev => Number(prev) * 60)

  return durationInSec;
}

async function saveChatToFiles(contentOffset) {
  const response = await getChatFromApi(contentOffset);

  const formated = getFormatedChatMessages(response)

  writeChatMessagesToFile(formated);

  fileIndex++;

  const vodinfo = await getVodInfo();

  const totalContentOffset = getVodTotalContentOffset(vodinfo);
  //console.log(totalContentOffset)


  if (getLastContentOffset(response) < totalContentOffset) {
    // saveChatToFiles(getLastContentOffset(response))
  }

  return formated;
}


saveChatToFiles(lastContentOffset).then();

