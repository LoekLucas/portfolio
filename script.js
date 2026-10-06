var yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.innerHTML = new Date().getFullYear();
}


// ---------- youtube videos ----------

// gets the id out of a youtube link
// works with the normal link, a youtu.be link, a shorts link,
// or just the id on its own
function getVideoId(link) {
  var id = link.trim();

  if (id.indexOf("youtu.be/") != -1) {
    id = id.split("youtu.be/")[1];
  } else if (id.indexOf("/shorts/") != -1) {
    id = id.split("/shorts/")[1];
  } else if (id.indexOf("/embed/") != -1) {
    id = id.split("/embed/")[1];
  } else if (id.indexOf("/live/") != -1) {
    id = id.split("/live/")[1];
  } else if (id.indexOf("v=") != -1) {
    id = id.split("v=")[1];
  }

  // cut off anything that comes after the id, like &t=30s
  id = id.split("&")[0];
  id = id.split("?")[0];
  id = id.split("/")[0];

  // youtube ids are always 11 characters, so if it isn't
  // 11 then something else got pasted in
  if (id.length != 11) {
    return "";
  }

  return id;
}


// makes the thumbnail + play button for one video box
function makeVideo(box) {
  var id = getVideoId(box.getAttribute("data-youtube"));

  // nothing pasted in yet, so leave the box the way it is
  if (id == "") {
    return;
  }

  // use the project name for the button so it makes sense
  // to someone using a screen reader
  var name = box.getAttribute("data-title");
  if (!name) {
    var project = box.closest(".project");
    if (project && project.querySelector("h3")) {
      name = project.querySelector("h3").innerHTML;
    } else {
      name = "the video";
    }
  }

  var thumbnail = document.createElement("img");
  thumbnail.src = "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";
  thumbnail.alt = "";
  thumbnail.loading = "lazy";

  // not every video has the big thumbnail, so fall back to the
  // small one if that image doesn't load
  thumbnail.onerror = function () {
    thumbnail.onerror = null;
    thumbnail.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
  };

  var circle = document.createElement("span");
  circle.className = "play-circle";

  var button = document.createElement("button");
  button.className = "video-button";
  button.type = "button";
  button.setAttribute("aria-label", "Play " + name);
  button.appendChild(thumbnail);
  button.appendChild(circle);

  // the actual youtube player only gets loaded once someone clicks,
  // otherwise 7 players load at the same time and the page gets slow
  button.onclick = function () {
    var player = document.createElement("iframe");
    player.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    player.title = name;
    player.allow = "autoplay; encrypted-media; picture-in-picture";
    player.allowFullscreen = true;

    box.innerHTML = "";
    box.appendChild(player);
  };

  box.innerHTML = "";
  box.appendChild(button);
}


// go through every box that has a data-youtube on it
var videoBoxes = document.querySelectorAll("[data-youtube]");

for (var i = 0; i < videoBoxes.length; i++) {
  makeVideo(videoBoxes[i]);
}
