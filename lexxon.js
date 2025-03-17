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

version = 0.1
mode  = "DAILY" /* Practice */
let slideIndex = 1
this.explanation_slideIndex = 1
practice_puzzles_loaded = 100 
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
  "Logo font from <a href = 'https://actselect.chips.jp/fonts/54.htm'>this font site.</a><br/><br/>" +
  "<a href = 'https://www.facebook.com/profile.php?id=61573621951149'><img class='reslogo' src='images/facebook.png'/></a>"

function pageLoad() {
  //Check if valid. If not, then create a new game state
  let page_data = null
  if(localStorage.getItem("page_data") == null){
    localStorage.setItem("page_data", JSON.stringify(create_page_data()))
    this.page_data = JSON.parse(localStorage.getItem("page_data"))
  }
  try{
    this.page_data = JSON.parse(localStorage.getItem("page_data"))
  }
  catch(e){

  }
  load_puzzle()
  load_game_state()
  welcome()

}
function load_puzzle(){
  this.time = new Date()
  let new_time = new Date()
  new_time.setTime(this.time.getTime() - (this.time.getTimezoneOffset() * 1000 * 60))
  this.date = new_time.toISOString().substring(0,10)
  new_time.setTime(this.time.getTime() - (this.time.getTimezoneOffset() * 1000 * 60)-1000*60*60*24)
  this.yesterday = new_time.toISOString().substring(0,10)

  temp_puzzle = Promise.resolve(getPuzzle())
  temp_puzzle.then(function (result) { setPuzzle(result) })
}
function load_game_state(){

}
function recordPuzzleSolvedState(){
  if(this.page_data["play_mode"] == "DAILY"){
    this.page_data["daily_puzzle_state"]["words_solved"][0] = this.game_state["solved"][0]
    this.page_data["daily_puzzle_state"]["words_solved"][1] = this.game_state["solved"][1]
    this.page_data["daily_puzzle_state"]["words_solved"][2] = this.game_state["solved"][2]
    this.page_data["daily_puzzle_state"]["words_solved"][3] = this.game_state["solved"][3]
    this.page_data["daily_puzzle_state"]["words_solved"][4] = this.game_state["solved"][4]
  }
  else if(this.page_data["play_mode"] == "PRACTICE")
  update_local_storage()
}
function recordGameWin(guess_count){
  let stats_source = ""
  if(this.page_data["play_mode"] == "DAILY"){
    stats_source = this.page_data["daily_puzzle_stats"]
    if(this.date in this.page_data["history"]){
        return
    }
    this.page_data["history"][this.date] = this.puzzle["wotd"]
    if(stats_source["last_solved"] == this.yesterday){
      stats_source["streak"] = stats_source["streak"] + 1 
    }
    else { 
      stats_source["streak"] = 1
    }
    stats_source["last_solved"] = this.date
    
  }else{
    this.page_data["practice_puzzle_state"]["current_puzzle_number"] = (this.page_data["practice_puzzle_state"]["current_puzzle_number"] + 1) % practice_puzzles_loaded
    stats_source = this.page_data["practice_puzzle_stats"]
  }
  if(guess_count == 4){
    stats_source["guesses_4"] = stats_source["guesses_4"] + 1
  }
  else if(guess_count == 3){
    stats_source["guesses_3"] = stats_source["guesses_3"] + 1
  }
  else if(guess_count == 2){
    stats_source["guesses_2"] = stats_source["guesses_2"] + 1
  }
  else if(guess_count == 1){
    stats_source["guesses_1"] = stats_source["guesses_1"] + 1
  }
  update_local_storage()
}
function recordGameLoss(){
  if(this.page_data["play_mode"] == "DAILY"){
    stats_source = this.page_data["daily_puzzle_stats"]
  }
  else{
    this.page_data["practice_puzzle_state"]["current_puzzle_number"] = (this.page_data["practice_puzzle_state"][current_puzzle_number] + 1) % practice_puzzles_loaded
    stats_source = this.page_data["practice_puzzle_stats"]
  }
  stats_source["guesses_0"] = stats_source["guesses_0"] + 1
}
function update_local_storage(){
  localStorage.setItem("page_data", JSON.stringify(this.page_data))
}
function create_page_data(){
  data_dict = {
    "version":version,
    "daily_puzzle_stats":{
      "guesses_4":0,
      "guesses_3":0,
      "guesses_2":0,
      "guesses_1":0,
      "guesses_0":0,
      "last_solved":"Never",
      "streak":0
    },
    "practice_puzzle_stats":{
      "guesses_4":0,
      "guesses_3":0,
      "guesses_2":0,
      "guesses_1":0,
      "guesses_0":0,
    },
    "history":{

    },
    "daily_puzzle_state":{
      "current_puzzle_date": this.date,
      "guesses_left":4,
      "guess_ledger":[],
      "words_solved":{
        0:false,
        1:false,
        2:false,
        3:false,
        4:false,
      }
    },
    "play_mode": "DAILY",
    "practice_puzzle_state":{
      "current_puzzle_number": 0,
      "guesses_left":4,
      "guess_ledger":[],
      "words_solved":{
        0:false,
        1:false,
        2:false,
        3:false,
        4:false,
      }
    },

    
  }
  return data_dict
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
  let innerHTML = ""
  if(this.page_data["play_mode"] == "DAILY"){
    innerHTML = "<h1>Lexxon Daily Puzzle for " + this.date + "</h1>"
  }
  else if (this.page_data["play_mode"] == "PRACTICE"){
    innerHTML = "<h1>Lexxon Practice Mode</h1>"
  }
  innerHTML = innerHTML + info_text
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
  else if(this.game_state["guesses_left"] == 0){
    generateExplanationOverlay(winning = false)
  }
  else {
    generateOverlayFrameText(info_text)
  }
}
function stats() {
  let title = ""
  if(this.page_data["play_mode"] == "DAILY"){
    title = "Daily Puzzle Stats"
  }
  else if(this.page_data["play_mode"] == "PRACTICE"){
    title = "Practice Puzzle Stats"
  }
  
  let master_div = document.createElement("div")
  master_div.classList.add("stats_master")
  let title_div = document.createElement("div")
  title_div.classList.add("stats_title")
  title_div.innerHTML = "<h2>" + title + "</h2>"
  master_div.appendChild(title_div)  
  let bar_chart = document.createElement("div")
  master_div.appendChild(bar_chart)
  let streak_count = document.createElement("div")
  let stats_source = ""
  if(this.page_data["play_mode"] == "DAILY"){
    stats_source = this.page_data["daily_puzzle_stats"]

    streak_count.innerHTML = "Streak: " + stats_source["streak"]
    bar_chart.appendChild(streak_count)
  }
  else{
    stats_source = this.page_data["practice_puzzle_stats"]
  }
  let guesses_left_4 = document.createElement("div")
  guesses_left_4.innerHTML = "<b>4 guesses left:</b> " + stats_source["guesses_4"] + " games"
  let guesses_left_3 = document.createElement("div")
  guesses_left_3.innerHTML = "<b>3 guesses left:</b> " + stats_source["guesses_3"] + " games"
  let guesses_left_2 = document.createElement("div")
  guesses_left_2.innerHTML = "<b>2 guesses left:</b> " + stats_source["guesses_2"] + " games"
  let guesses_left_1 = document.createElement("div")
  guesses_left_1.innerHTML = "<b>1 guess left:</b> " + stats_source["guesses_1"] + " games"
  bar_chart.appendChild(guesses_left_4)
  bar_chart.appendChild(guesses_left_3)
  bar_chart.appendChild(guesses_left_2)
  bar_chart.appendChild(guesses_left_1)
  if(this.page_data["play_mode"] == "DAILY"){
    let last_solved = document.createElement("div")
    last_solved.innerHTML = "Last solved: " + stats_source["last_solved"]
    bar_chart.appendChild(last_solved)
  }
  generateOverlayFrameElement(master_div)
}
function settings(){
  title = "Settings"
  master_div = document.createElement("div")
  master_div.classList.add("settings_master")
  title_div = document.createElement("div")
  title_div.classList.add("settings_title")
  title_div.innerHTML = "<h2>" + title + "</h2>"
  master_div.appendChild(title_div)  
  toggle_bar = document.createElement("div")
  daily_puzzle = document.createElement("div")
  daily_puzzle.innerHTML = "Daily Puzzle"
  daily_puzzle.id = "daily_puzzle_div"
  practice = document.createElement("div")
  practice.innerHTML = "Practice"
  practice.id = "practice_div"
  daily_puzzle.classList.add("puzzle_option")
  practice.classList.add("puzzle_option")
  daily_puzzle.addEventListener("click", function () { updatePuzzleSelection("DAILY") })
  practice.addEventListener("click", function(){updatePuzzleSelection("PRACTICE")})
  if(this.page_data["play_mode"] == "DAILY"){
    daily_puzzle.classList.add("puzzle_option_selected")
    practice.classList.add("puzzle_option_unselected")

  }
  else{
    daily_puzzle.classList.add("puzzle_option_unselected")
    practice.classList.add("puzzle_option_selected")

  }

  toggle_bar.appendChild(daily_puzzle)
  toggle_bar.appendChild(practice)
  master_div.appendChild(toggle_bar)
  generateOverlayFrameElement(master_div)
}
function getPuzzle() {
  if(this.page_data["play_mode"] == "DAILY"){
    return $.getJSON("puzzles/daily/" + this.date + "/puzzle.json", function (data) {
      return data;
    })
  }else{
    return $.getJSON("puzzles/practice/" + this.page_data["practice_puzzle_state"]["current_puzzle_number"] + "/puzzle.json", function (data) {
      return data;
    })
  }


}
function generateOverlayFrameText(innerHTML) {
  destroyOverlayFrame()
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
  destroyOverlayFrame()
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
  let overlay = document.getElementById("overlay")
  if(overlay != null ){
    overlay.remove()
  }
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
function plusExplanationVerse(n){
 showExplanation(this.explanation_slideIndex +=n)
}
function currentExplanation(n){
  this.explanation_slideIndex = n
  showExplanation(n)
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

  updateButtonsOnGameState()
}
function showExplanation(n) {
  let i;
  let slides = document.getElementsByClassName("explanationSlide");
  if (n > slides.length) { this.explanation_slideIndex = 1 }
  if (n < 1) { this.explanation_slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[this.explanation_slideIndex - 1].style.display = "block";

  let dots = document.getElementsByClassName("explanation_dot");
  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
    dots[i].classList.add("inactive");
    dots[i].style.backgroundColor = number_to_dark_color(i);
  }
  dots[this.explanation_slideIndex - 1].classList.remove("inactive")
  dots[this.explanation_slideIndex - 1].classList.add("active")
  dots[this.explanation_slideIndex - 1].style.backgroundColor = number_to_light_color(this.explanation_slideIndex - 1);
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
    recordGameWin(this.game_state["guesses_left"])
    info()
  }
  if(this.game_state["guesses_left"] == 0){
    recordGameLoss()
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
  nav_div.classList.add("nav_div")
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
    verses[i].classList.add("explanationSlide")
    for(j = 0; j < verse_data["verse_data"].length; j++){
      data_item = document.createElement("div")
      data_item.classList.add("explanation_verse_data_item")
      data_item.innerHTML = verse_data["verse_data"][j]["BSB Version"] + "<br/>" + 
                          verse_data["verse_data"][j]["lemma"] + "<br/>" +
                          verse_data["verse_data"][j]["xlit"] + "<br/>"
      if(verse_data["verse_data"][j]["Str Grk"] == this.puzzle["wotd"]["number"]){
        data_item.style.backgroundColor = number_to_light_color(5)
      }
      else if(verse_data["verse_data"][j]["Str Grk"] == this.puzzle["other_words"][0]["number"]){
        data_item.style.backgroundColor = number_to_light_color(0)
      }
      else if(verse_data["verse_data"][j]["Str Grk"] == this.puzzle["other_words"][1]["number"]){
        data_item.style.backgroundColor = number_to_light_color(1)
      }
      else if(verse_data["verse_data"][j]["Str Grk"] == this.puzzle["other_words"][2]["number"]){
        data_item.style.backgroundColor = number_to_light_color(2)
      }else if(verse_data["verse_data"][j]["Str Grk"] == this.puzzle["other_words"][3]["number"]){
        data_item.style.backgroundColor = number_to_light_color(3)
      }
        else
        {
        data_item.style.backgroundColor = "#FFFFFF"
      }
      data.appendChild(data_item)
    }
    verses[i].appendChild(data)
    verse_button = document.createElement("div")
    verse_button.classList.add("explanation_dot")
    if(i == 0){
      verse_button.addEventListener("click", function () { currentExplanation(1) })
    }
    else if(i == 1){
      verse_button.addEventListener("click", function () { currentExplanation(2) })
    }
    else if(i == 2){
      verse_button.addEventListener("click", function () { currentExplanation(3) })
    }
    else if(i == 3){
      verse_button.addEventListener("click", function () { currentExplanation(4) })
    }
    verse_button.innerHTML = reference
    nav_div.appendChild(verse_button)
  }

  let backward_button = document.createElement("a")
  backward_button.innerHTML = "&#10094;"
  backward_button.classList.add("prev_explanation")
  backward_button.addEventListener("click", function () { plusExplanationVerse(-1) })

  let forward_button = document.createElement("a")
  forward_button.innerHTML = "&#10095;"
  forward_button.classList.add("next_explanation")
  forward_button.addEventListener("click", function () { plusExplanationVerse(1) })
  slideshow_div.appendChild(forward_button)

  slideshow_div.appendChild(backward_button)
  master_div.appendChild(nav_div)
  next_button = document.createElement("div")
  next_button.innerHTML = "Stats"
  next_button.classList.add("puzzle_option")
  next_button.style.backgroundColor = "#BBBBBB"
  next_button.addEventListener("click", function () { stats() })
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
  currentExplanation(1)
}
function updatePuzzleSelection(puzzle_type){
  if(puzzle_type == "DAILY" && this.page_data["play_mode"] != "DAILY"){
      this.page_data["play_mode"] = "DAILY"
      daily_puzzle_div = document.getElementById("daily_puzzle_div")
      daily_puzzle_div.classList.add("puzzle_option_selected")
      daily_puzzle_div.classList.remove("puzzle_option_unselected")

      practice_div = document.getElementById("practice_div")
      practice_div.classList.add("puzzle_option_unselected")
      practice_div.classList.remove("puzzle_option_selected")

      load_puzzle()
  }
  else if(puzzle_type == "PRACTICE" && this.page_data["play_mode"] != "PRACTICE"){
    this.page_data["play_mode"] = "PRACTICE"

    daily_puzzle_div = document.getElementById("daily_puzzle_div")
    daily_puzzle_div.classList.add("puzzle_option_unselected")
    daily_puzzle_div.classList.remove("puzzle_option_selected")

    practice_div = document.getElementById("practice_div")
    practice_div.classList.add("puzzle_option_selected")
    practice_div.classList.remove("puzzle_option_unselected")
    load_puzzle()
  }
  update_local_storage()
}