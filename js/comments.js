async function individualCommentScript(comment, velocity, xPos) {
  let lifetime = 10000;
  let grav = 0.1;
  let bounce = 0.7;
  let dragHeight = 0.01;
  let drag = 0.1;
  let opacityDur = 3000
  const startTime = new Date().getTime();
  let curTime = new Date().getTime();
  let deltaTime = 0;
  let curXPos = xPos;
  let curYPos = 0;
  let t = curTime - startTime;
  while(t < lifetime) {
    let width = comment.getBoundingClientRect().width
    let maxX = 1 - width / window.innerWidth;
    comment.style.left = curXPos * 100 + "%";
    comment.style.bottom = curYPos * 100 + "%";
    comment.style.opacity = Math.min(t/opacityDur, 1, -(t - lifetime)/opacityDur)
    curXPos = Math.min(Math.max(curXPos + velocity[0] * deltaTime, 0), maxX);
    curYPos = Math.max(curYPos - velocity[1] * deltaTime, 0);
    velocity[1] += grav * deltaTime;
    if(curYPos == 0) {
      velocity[1] *= -bounce;
    }
    if(curYPos < dragHeight && t > lifetime * 0.1) {
      velocity[0] += Math.min(drag, Math.abs(velocity[0])) * deltaTime * Math.sign(velocity[0]);
    }
    if(curXPos == 0 || curXPos == maxX) {
      velocity[0] *= -1;
    }
    
    await delay(10);
    let newCurTime = new Date().getTime();
    deltaTime = (curTime - newCurTime) / 1000;
    curTime = newCurTime;
    t = curTime - startTime;
  }
  comment.remove()
}
async function commentScript() {
  let files = ["early_action_not_admitted", "not_admitted_3", "not_admitted_4", "not_admitted_5", "open_forum_for_those_not_admit_1", "open_forum_for_those_not_admit", "open_thread_for_those_not_admi", "open-thread-not-admitted-2", "open-thread-not-admitted-3", "open-thread-not-admitted-4", "open-thread-not-admitted-5", "open-thread-not-admitted-6", "open-thread-not-admitted-early-2019", "open-thread-not-admitted-early-2021", "open-thread-not-admitted-early", "open-thread-not-admitted-early1", "open-thread-not-admitted-early2", "open-thread-not-admitted-early3", "open-thread-not-admitted-in-ea", "open-thread-not-admitted", "open-thread-not-admitted2", "open-thread-not-admitted3", "open-thread-not-admitted4", "open-thread-not-admitted5", "open-thread-not-admitted6", "open-thread-not-admitted7", "open-thread-notadmitted-early"]
  let fileContents = Array(files.length);
  let totalSize = 0;
  for(let i = 0; i < fileContents.length; i++) {
    let txt = loadFile("Output/" + files[i] + ".txt");
    let size = parseInt(txt.substring(0, txt.indexOf('\n')));
    totalSize += size;
    let commentInd = 0;
    commentInd = txt.indexOf('', commentInd) + 1;
    let fileContent = [];
    while(commentInd != 0) {
    let newCommentInd = txt.indexOf('', commentInd);
    let commentTxt = "";
    if(newCommentInd == -1) {
      commentTxt = txt.substring(commentInd + 1);
    } else {
      commentTxt = txt.substring(commentInd + 1, newCommentInd);
    }
    let nextInd = commentTxt.indexOf('\n');
    let id = parseInt(commentTxt.substring(0, nextInd));
    let nextInd2 = commentTxt.indexOf('\n', nextInd + 1);
    let username = commentTxt.substring(nextInd + 1, nextInd2);
    let message =  commentTxt.substring(nextInd2 + 1)
    fileContent.push({"ID": id, "author": username, "content": message});
    commentInd = newCommentInd + 1;
    }
    fileContents[i] = fileContent
  }
  let commentParent = document.getElementById("comments");
  let comments = 0;
  while(true) {
    let commentInd = Math.floor(Math.random() * totalSize);
    let comment = null;
    for(let i = 0; i < fileContents.length; i++) {
      let content = fileContents[i];
      if(commentInd < content.length) {
        comment = content[commentInd];
        break;
      }
      commentInd -= content.length;
    }
    let htmlContent = "<div id=\"comment" + comments + "\" class=\"commentDiv\">";
    htmlContent += "<div style=\"margin-right:12px; float:left\"><img id=\"authorPic\" src= \"Images/ghost_icon.png\" style=\"width:40px\"></div>";
    htmlContent += "<div><header style=\"background-color: rgba(255, 255, 255, 0.1); height: 30px\">";
    htmlContent += "<p id= \"author\" class=\"comment_header\">" + comment.author + "</p>";
    htmlContent += "</header><div id=\"message\" class=\"comment_body\">" + comment.content;
    htmlContent += "</div></div></div>";
    let position = Math.random();
    let velocity = [Math.random() * (Math.sign(position - 0.5) * 0.2), Math.random() * 0.4 + 0.1];
    commentParent.insertAdjacentHTML("beforeend", htmlContent);
    individualCommentScript(document.getElementById("comment" + comments), velocity, position)
    comments += 1;
    await delay(8000);
  }
}