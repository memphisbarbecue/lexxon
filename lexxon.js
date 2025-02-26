/*

This work is composed of four parts, each of which are licensed differently.
 a) The code (comprised of lexxon.html, lexxon.css, and lexxon.js) is licensed under the 
  Attribution-NonCommercial Creative Commons License (https://creativecommons.org/licenses/by-nc/4.0/)
  which permits derivative works which credit the original author. However, derivative works
  are not permitted to use the name "Lexxon" or its logo.
 b) Redistribution of the logo is not permitted. 
 c) The Bible verses, drawn from Berea Standard Bible (https://bereanbible.com/), remain
    subject to the distribution terms of that text.
 e) The Strongs lexicons, drawn from https://github.com/openscriptures/strongs, remain
    subject to the distribution terms of the source. 
    
    - memphisbarbecue (https://github.com/memphisbarbecue/)
    
*/
slideIndex = 1
var welcome_text = "<h1>Welcome to Lexxon!</h1>\n"
var info_text = "<h2>Rules</h2>" +
  "<img style = 'width:80%; max-width:750px;' src='images/puzzle_diagram.png'/><br/><br/>" +
  "You are trying to identify, from the English, which of the Greek words you have available is in each verse. " +
  "<ol><li>Every word is guaranteed to be in at least one verse.</li>" +
  '<li>One word is guaranteed to be in every verse. That word is the "Word of the Day".</li>' +
  "<li>You're scored on how many guesses you take to find every occurrance.</li>" +
  "<li> To make a guess, select a word, indicate whether it is in just the current verse or all verses, and click <i>Submit</i></li>" +
  "</ol><br/> If you have trouble, try looking at each verse on <a href = 'https://biblehub.com/lexicon/genesis/1-1.htm'>Bible Hub's Lexicon view<a/><br/><br/>" +
  "All text and Strongs references courtesy of the <a href= 'https://berean.bible/downloads.htm'>Berean Standard Bible</a>.<br/>" +
  "Strongs lexicon definitions loaded from <a href='https://github.com/openscriptures/strongs'>the OpenScriptures GitHub repository.</a><br/>" +
  "Logo font from <a href = 'https://actselect.chips.jp/fonts/54.htm'>this font site.</a>"

function pageLoad() {
  this.user_cookies = document.cookie
  welcome()
  this.time = new Date()
  temp_puzzle = Promise.resolve(getPuzzle(this.time.getMinutes()))
  temp_puzzle.then(function (result) { setPuzzle(result) })
}

function number_to_light_color(num) {
  switch (num) {
    case 0: return "#00a9f0";
    case 1: return "#0eb17b";
    case 2: return "#fc77bc";
    case 3: return "#9480ca";
    case 5: return "#fcb711";
    default: return "#ffffff";
  }
}
function number_to_dark_color(num) {
  switch (num) {
    case 0: return "#004890";
    case 1: return "#0d8122";
    case 2: return "#9c002c";
    case 3: return "#44408a";
    case 5: return "#fcb711";
    default: return "#ffffff";
  }
}
function setPuzzle(puzzle) {
  this.puzzle = puzzle
  document.getElementById("dot1").innerHTML = puzzle["verses"][0]["verse_ref"]
  document.getElementById("dot2").innerHTML = puzzle["verses"][1]["verse_ref"]
  document.getElementById("dot3").innerHTML = puzzle["verses"][2]["verse_ref"]
  document.getElementById("dot4").innerHTML = puzzle["verses"][3]["verse_ref"]
  document.getElementById("text1").innerHTML = "<h2>" + puzzle["verses"][0]["verse_ref"] + "</h2>" +
    puzzle["verses"][0]["verse_text"]
  document.getElementById("text2").innerHTML = "<h2>" + puzzle["verses"][1]["verse_ref"] + "</h2>" +
    puzzle["verses"][1]["verse_text"]
  document.getElementById("text3").innerHTML = "<h2>" + puzzle["verses"][2]["verse_ref"] + "</h2>" +
    puzzle["verses"][2]["verse_text"]
  document.getElementById("text4").innerHTML = "<h2>" + puzzle["verses"][3]["verse_ref"] + "</h2>" +
    puzzle["verses"][3]["verse_text"]
  this.verse_order = [0, 1, 2, 3, 4]
  this.verse_order.sort(() => Math.random() - 0.5)
  this.game_state = {
    "current_word_selections": {

    },
    "target_selections": {
      "wotd": false,
      "current_verse": false
    },
    "solved": [false, false, false, false, false],
    "guesses_left": 4,
    "word_index_to_button": [],
    "button_to_word_index": {}
  }

  this.game_state["word_index_to_button"] = [0, 1, 2, 3, 4];
  this.game_state["word_index_to_button"].sort(() => Math.random() - 0.5);
  let wordbuttons = document.getElementsByClassName("wordbutton");

  for (i = 0; i < 5; i++) {
    this.game_state["button_to_word_index"][this.game_state["word_index_to_button"][i]] = i

  }
  for (i = 0; i < 5; i++) {
    let word = {};
    if (i == 0) {
      word = this.puzzle["wotd"]
    }
    else {
      word = this.puzzle["other_words"][i - 1]
    }
    button_number = this.game_state["word_index_to_button"][i]
    wordbuttons[button_number].innerHTML = word["lemma"] + ": " + word["xlit"]
  }

  for (i = 0; i < 5; i++) {
    this.game_state["current_word_selections"][i] = false
  }
  slides = document.getElementsByClassName("mySlides")
  for (i = 0; i < 4; i++) {
    slides[i].style.borderColor = number_to_light_color(i)
    slides[i].style.borderWidth = "2px";
    slides[i].style.borderStyle = "solid"
  }
  showSlides(1)
}
function welcome() {
  var innerHTML = welcome_text + info_text

  overlay = generateOverlayFrameText(innerHTML)

}
function info() {
  found_all = true;
  for (i = 0; i < 5; i++) {
    if (!this.game_state["solved"][i]) {
      found_all = false
    }
  }
  if (found_all) {
    generateExplanationOverlay(winning = true)
  }
  else {
    generateOverlayFrameText(info_text)
  }
}
function stats() {
  generateOverlayFrameText("This should be the stats overlay.")
}
function getPuzzle(number) {
  return $.getJSON("puzzles/" + number + "/wotd.json", function (data) {
    return data;
  })

}
function generateOverlayFrameText(innerHTML) {
  var new_overlayframe = document.createElement("div")
  var notification_text = document.createElement('div')
  notification_text.style.maxWidth = "750px"
  notification_text.style.textAlign = "left"
  notification_text.style.margin = "auto"
  notification_text.style.padding = "10px"
  notification_text.innerHTML = innerHTML
  new_overlayframe.id = "overlay"
  var close_button = document.createElement("span")
  close_button.classList.add("closebtn")
  close_button.addEventListener("click", function () { destroyOverlayFrame() })
  close_button.innerHTML = "&times;"
  new_overlayframe.appendChild(close_button)
  new_overlayframe.appendChild(notification_text)
  body.appendChild(new_overlayframe)
  return new_overlayframe
}
function generateOverlayFrameElement(element) {
  var new_overlayframe = document.createElement("div")

  new_overlayframe.id = "overlay"
  var close_button = document.createElement("span")
  close_button.classList.add("closebtn")
  close_button.addEventListener("click", function () { destroyOverlayFrame() })
  close_button.innerHTML = "&times;"
  new_overlayframe.appendChild(close_button)
  new_overlayframe.appendChild(element)
  body.appendChild(new_overlayframe)
  return new_overlayframe
}
function destroyOverlayFrame() {
  document.getElementById("overlay").remove();
}
function targetSelect(number) {
  if (number == 0) {
    if (this.game_state["target_selections"]["current_verse"]) {
      this.game_state["target_selections"]["current_verse"] = false

    }
    else {
      this.game_state["target_selections"]["current_verse"] = true
    }
    this.game_state["target_selections"]["wotd"] = false

  }
  else if (number == 1) {
    if (this.game_state["target_selections"]["wotd"]) {
      this.game_state["target_selections"]["wotd"] = false
    }
    else {
      this.game_state["target_selections"]["wotd"] = true
    }
    this.game_state["target_selections"]["current_verse"] = false

  }
  submit_span = document.getElementById("submit_span")

  if (!this.game_state["target_selections"]["current_verse"] &&
    !this.game_state["target_selections"]["wotd"]) {
    submit_span.style.color = "grey"
  }
  else {
    submit_span.style.color = "black"

  }
  updateButtonsOnGameState(0)
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  slideIndex = n;
  showSlides(n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
    dots[i].classList.add("inactive");
    dots[i].style.backgroundColor = number_to_dark_color(i);
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].classList.remove("inactive")
  dots[slideIndex - 1].classList.add("active")
  dots[slideIndex - 1].style.backgroundColor = number_to_light_color(slideIndex - 1);

  /*  if(this.game_state["solved"][n]){
      word_indicator.classList.add("word_appear")
      
    }
    else{
      word_indicator.classList.remove("word_appear")
  
    }
    if(this.game_state["solved"][0]){
  
    }*/
  updateButtonsOnGameState()

}
function define(number) {
  word_to_define = this.game_state["button_to_word_index"][number]
  definition_panel = document.getElementById("def_panel")
  if (word_to_define == 0) {
    word = this.puzzle["wotd"]
  }
  else {
    word = this.puzzle["other_words"][word_to_define - 1]
  }
  text = "<b>" + word["lemma"] + "(" + word["xlit"] + "):</b>" + word["description"]
  definition_panel.innerHTML = text
}
function registerWordButtonClick(number) {
  set = true;
  if (this.game_state["current_word_selections"][number]) {
    set = false;
  }
  for (i = 0; i < Object.keys(this.game_state["current_word_selections"]).length; i++) {
    this.game_state["current_word_selections"][i] = false;
  }
  this.game_state["current_word_selections"][number] = set;

  updateButtonsOnGameState(number)

}
function updateButtonsOnGameState(number) {
  let wordbuttons = document.getElementsByClassName("wordbutton");

  for (i = 0; i < wordbuttons.length; i++) {
    if (this.game_state["current_word_selections"][i]) {
      if (this.game_state["solved"][i]) {
        wordbuttons[i].style.height = "0vh";

      }
      else {
        wordbuttons[i].style.backgroundImage = "none"
        wordbuttons[i].style.backgroundColor = number_to_light_color(slideIndex - 1)
      }
      wordbuttons[i].style.borderColor = "#000000"

    }
    else {
      if (this.game_state["solved"][i]) {
        wordbuttons[i].style.height = "0vh";

      }
      else {
        wordbuttons[i].style.backgroundImage = "none"
        wordbuttons[i].style.backgroundColor = "#FFFFFF";
        wordbuttons[i].style.borderWidth = "2px"
      }
      wordbuttons[i].style.borderColor = number_to_light_color(slideIndex - 1);

    }
  }
  word_select_button = document.getElementById("w_in_wotd_div")
  if (this.game_state["target_selections"]["wotd"]) {
    word_select_button.style.backgroundColor = number_to_light_color(5)
    word_select_button.style.borderColor = "#000000"
  }
  else {
    word_select_button.style.backgroundColor = "#FFFFFF"
    word_select_button.style.borderColor = number_to_light_color(5)
  }
  cur_vs_select = document.getElementById("w_in_v_div")
  if (this.game_state["target_selections"]["current_verse"]) {
    cur_vs_select.style.backgroundColor = number_to_light_color(slideIndex - 1)
    cur_vs_select.style.borderColor = "#000000"

  }
  else {
    cur_vs_select.style.backgroundColor = "#FFFFFF"
    cur_vs_select.style.borderColor = number_to_light_color(slideIndex - 1)
  }

  cur_vs_selectText = document.getElementById("w_in_v_span")
  selected_word = getSelectedWord()
  wotd_select_button = document.getElementById("w_in_wotd_span")
  if (selected_word >= 0) {
    word_index = this.game_state["button_to_word_index"][selected_word]
    if (word_index == 0) {
      word = this.puzzle["wotd"]
    }
    else {
      word = this.puzzle["other_words"][word_index - 1]
    }
    word = word["lemma"] + " (" + word["xlit"] + ") "
    verse = this.puzzle["verses"][slideIndex - 1]["verse_ref"]
    cur_vs_selectText.innerHTML = verse + "<br/> contains<br/> " + word
    if (this.game_state["solved"][this.game_state["word_index_to_button"][0]]) {
      wotd_select_button.innerHTML = ""
    }
    else {
      wotd_select_button.innerHTML = "All verses <br/> contain <br/>" + word
    }
  }
  else {

    cur_vs_selectText.innerHTML = "Select a word"
    wotd_select_button.innerHTML = ""


  }

}
function getSelectedWord() {
  number = -1
  for (i = 0; i < 5; i++) {
    if (this.game_state["current_word_selections"][i]) {
      number = i
      break
    }
  }
  return number
}
function getTarget() {

  if (this.game_state["target_selections"]["current_verse"]) {
    return 0
  }
  if (this.game_state["target_selections"]["wotd"]) {
    return 1
  }
  return -1
}
function reset_selections() {

}
function removeChoice(number) {
  slot = document.getElementById("wordslot_" + number)
  slot.classList.add("word_disappear")
  button = document.getElementById("wordbutton_" + number)
  button.classList.add("word_disappear")
  button.innerHTML = ""
}
function check() {
  number = getSelectedWord()
  target = getTarget()
  if (number < 0 || target < 0) {
    return
  }
  destroyNotification()
  if (this.game_state["solved"][number]) {
    return
  }
  if (this.game_state["guesses_left"] == 0) {
    notification("Sorry, you've run out of guesses.", 0)
    return
  }
  word_index = this.game_state["button_to_word_index"][number]
  strongs_no = 0
  if (word_index == 0) {
    strongs_no = this.puzzle["wotd"]["number"]
    word = this.puzzle["wotd"]
  }
  else {
    strongs_no = this.puzzle["other_words"][word_index - 1]["number"]
    word = this.puzzle["other_words"][word_index - 1]
  }

  if (target == 0) {

    selected_verse = slideIndex - 1
    verse_data = this.puzzle["verses"][selected_verse]["verse_data"]
    verse_contains = false
    for (j = 0; j < (verse_data.length); j++) {
      if (verse_data[j]["Str Grk"] == strongs_no) {
        verse_contains = true
        break
      }
    }
    if (verse_contains && word_index != 0) {
      this.game_state["solved"][number] = true
      removeChoice(number)
      slides = document.getElementsByClassName("mySlides")

      new_word_indicator = document.createElement("div")
      new_word_indicator.classList.add("word_indicator")
      new_word_indicator.innerHTML = word["lemma"] + " (" + word["xlit"] + ")"
      new_word_indicator.style.backgroundColor = number_to_light_color(slideIndex - 1)
      slides[slideIndex - 1].appendChild(new_word_indicator)
      for (i = 0; i < 5; i++) {
        this.game_state["current_word_selections"][i] = false
      }
      this.game_state["target_selections"]["wotd"] = false
      this.game_state["target_selections"]["current_verse"] = false

      /** success here
       *  record result
       *  show animation
       *  display explanation
       * 
      */
    }
    else {
      this.game_state["guesses_left"] = this.game_state["guesses_left"] - 1
      if (word_index == 0) {
        notification("This isn't the only verse that contains " + word["lemma"] + "(" + word["xlit"] + ")")
      }
      else {
        notification("This verse doesn't contain that word.")
      }
      /*got it wrong*/
    }
  }
  else if (target == 1) {
    all_verses_contain = true;
    for (i = 0; i < 4; i++) {
      verse_data = this.puzzle["verses"][i]["verse_data"]
      verse_contains = false
      for (j = 0; j < (verse_data.length); j++) {
        if (verse_data[j]["Str Grk"] == strongs_no) {
          verse_contains = true
          break
        }
      }
      if (!verse_contains) {
        all_verses_contain = false
      }
    }
    if (all_verses_contain) {
      this.game_state["solved"][number] = true
      removeChoice(number)
      slides = document.getElementsByClassName("mySlides")
      for (slideNo = 0; slideNo < 4; slideNo++) {
        new_word_indicator = document.createElement("div")
        new_word_indicator.classList.add("wotd_indicator")
        new_word_indicator.innerHTML = word["lemma"] + " (" + word["xlit"] + ")"
        new_word_indicator.style.backgroundColor = number_to_light_color(5)
        slides[slideNo].appendChild(new_word_indicator)

      }
      for (i = 0; i < 5; i++) {
        this.game_state["current_word_selections"][i] = false
      }

      this.game_state["target_selections"]["wotd"] = false
      this.game_state["target_selections"]["current_verse"] = false
      wotd_button = document.getElementById("w_in_wotd_div")
      wotd_button.classList.add("word_disappear")
      wotd_span = document.getElementById("w_in_wotd_span")
      wotd_span.innerHTML = ""
      /** success here
       *  display explanation
       * 
      */
    }
    else {

      this.game_state["guesses_left"] = this.game_state["guesses_left"] - 1
      notification(word["lemma"] + "(" + word["xlit"] + ") isn't the word of the day.")
      /*explanation
      */
    }
  }


  found_all = true;
  for (i = 0; i < 5; i++) {
    if (!this.game_state["solved"][i]) {
      found_all = false
    }
  }
  if (found_all) {
    info()
  }
  /*win*/
  if (false) {
    text = "Correct! "

    if (found_all) {
      text = text + "<br/>Congratulations! You finished the puzzle!<br/>"
    }
    if (word_index == 0) {
      text = text + "You found the word of the day, " + this.puzzle["wotd"]["lemma"] + " (" +
        this.puzzle["wotd"]["xlit"] + ")!"
    }
    notification(text, 0)
  }
  /*else{
    this.game_state["guesses_left"] = this.game_state["guesses_left"] - 1
    if(this.game_state["guesses_left"] == 0){
      text = "Oh no. That was your last guess.<br/>"
    }
    else{ 
         text = "Keep trying. <br/> "
    }
    updateGuessCountDisplay()

    notification(text, 0 )
  }*/
  currentSlide(slideIndex)
  updateButtonsOnGameState()
  updateGuessCountDisplay()
}
function notification(text, time) {
  body = document.getElementById("body")
  var new_overlayframe = document.createElement("div")
  var notification_text = document.createElement('div')
  notification_text.innerHTML = text
  new_overlayframe.id = "notification"
  var close_button = document.createElement("span")
  close_button.classList.add("closebtn")
  close_button.addEventListener("click", function () { destroyNotification() })
  close_button.innerHTML = "&times;"
  new_overlayframe.appendChild(close_button)
  new_overlayframe.appendChild(notification_text)

  body.appendChild(new_overlayframe)
}
function destroyNotification() {
  if (document.getElementById("notification") != null) {
    document.getElementById("notification").remove();
  }
}
function updateGuessCountDisplay() {
  guess_elements = document.getElementsByClassName("guessdot")
  for (i = 0; i < 4; i++) {
    if (i > this.game_state["guesses_left"] - 1) {
      guess_elements[i].style.backgroundColor = 'transparent'
    }
    else {
      guess_elements[i].style.backgroundColor = "#000000"
    }
  }
}
function constructExplanation(title) {
  master_div = document.createElement("div")
  master_div.classList.add("explanation_master")
  title_div = document.createElement("div")
  title_div.classList.add("explanation_title")
  title_div.innerHTML = "<h2>" + title + "</h2>"
  master_div.appendChild(title_div)
  slideshow_div = document.createElement("div")
  slideshow_div.classList.add("explanation_slideshow")
  master_div.appendChild(slideshow_div)
  nav_div = document.createElement("div")
  verses = []
  for (i = 0; i < 4; i++) {
    verses.push(document.createElement("div"))
    slideshow_div.appendChild(verses[i])
    verse_data = this.puzzle["verses"][i]
    reference = verse_data["verse_ref"]
    ref_div = document.createElement("div")
    ref_div.innerHTML = "<h2>" + reference + "</h2>"
    verses[i].appendChild(ref_div)
    data = document.createElement("div")
    for(j = 0; j < verse_data["verse_data"].length; j++){
      data_item = document.createElement("div")
      data_item.classList.add("explanation_verse_data_item")
      data_item.innerHTML = verse_data["verse_data"][j]["BSB Version"] + "<br/>" + 
                          verse_data["verse_data"][j]["lemma"] + "<br/>" +
                          verse_data["verse_data"][j]["xlit"] + "<br/>"
      if(verse_data["verse_data"][j]["Str Grk"] == this.puzzle["wotd"]["number"]){
        data_item.style.backgroundColor = number_to_light_color(5)
      }
      else{
        data_item.style.backgroundColor = "#FFFFFF"
      }
      data.appendChild(data_item)
    }
    verses[i].appendChild(data)
    verse_button = document.createElement("div")
    verse_button.classList.add("dot")
    verse_button.innerHTML = reference
    nav_div.appendChild(verse_button)
  }
  master_div.appendChild(nav_div)
  next_button = document.createElement("div")
  next_button.innerHTML = "Next"
  master_div.appendChild(next_button)
  return master_div
}
function generateExplanationOverlay(winning) {
  if (winning) {
    header_text = "Congratulations! You finished with " + this.game_state["guesses_left"] + " guesses left!"
  } else {
    header_text = "Try again tomorrow..."
  }
  explanation_div = constructExplanation(header_text)
  generateOverlayFrameElement(explanation_div)
}