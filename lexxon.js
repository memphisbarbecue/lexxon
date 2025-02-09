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
"<li>It's possible that words that aren't the word of the day are still in multiple verses, but that's dependent on the day.</li>" + 
"<li>You're scored on how many guesses you take to find every occurrance.</li>"+
"<li> Be sure to select all of the uses of each word before clicking <i>check</i></li>"+
"</ol><br/> If you have trouble, try looking at each verse on <a href = 'https://biblehub.com/lexicon/genesis/1-1.htm'>Bible Hub's Lexicon view<a/><br/><br/>" + 
"All text and Strongs references courtesy of the <a href= 'https://berean.bible/downloads.htm'>Berean Standard Bible</a>.<br/>" + 
"Strongs lexicon definitions loaded from <a href='https://github.com/openscriptures/strongs'>the OpenScriptures GitHub repository.</a><br/>" +
"Logo font from <a href = 'https://actselect.chips.jp/fonts/54.htm'>this font site.</a>"

function pageLoad(){
    this.user_cookies = document.cookie
    welcome()
    this.time = new Date()
    temp_puzzle = Promise.resolve(getPuzzle(this.time.getMinutes()))
    temp_puzzle.then(function(result){setPuzzle(result)})
    
    
}
function number_to_light_color(num){
  switch(num){
    case 0: return "#00a9f0";
    case 1: return "#0eb17b";
    case 2: return "#fc77bc";
    case 3: return "#9480ca";
    case 5: return "#fcb711";
    default: return "#ffffff";
  }
}
function number_to_dark_color(num){
  switch(num){
    case 0: return "#004890";
    case 1: return "#0d8122";
    case 2: return "#9c002c";
    case 3: return "#44408a";
    case 5: return "#fcb711";
    default: return "#ffffff";
  }
}
function setPuzzle(puzzle){
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
  this.verse_order = [0,1,2,3,4]
  this.verse_order.sort(()=> Math.random()-0.5)
  this.game_state = {
    "current_selections":{
      
      },
    "solved":[false, false, false, false, false],
    "guesses_left":4,
    "word_index_to_button":[],
    "button_to_word_index":{}
    }

   this.game_state["word_index_to_button"] = [0,1,2,3,4];
   this.game_state["word_index_to_button"].sort(() => Math.random() - 0.5);
   let wordbuttons = document.getElementsByClassName("wordbutton");

   for(i = 0; i < 5; i++){
     this.game_state["button_to_word_index"][this.game_state["word_index_to_button"][i]] = i

    }
    for(i = 0; i < 5; i++){
      let word = {};
      if(i == 0){
        word = this.puzzle["wotd"]
      }
      else{
        word = this.puzzle["other_words"][i-1]
      }
      button_number = this.game_state["word_index_to_button"][i]
      wordbuttons[button_number].innerHTML = word["lemma"] + ": " + word["xlit"]
    }

  for(i = 0; i < 4; i++){
    this.game_state["current_selections"][i] = {}
    for(j = 0; j < 5; j++){
      this.game_state["current_selections"][i][j] = false;
    }
  }
  slides = document.getElementsByClassName("mySlides")
    for(i = 0; i < 4; i++){
      slides[i].style.borderColor = number_to_light_color(i)
      slides[i].style.borderWidth = "2px";
      slides[i].style.borderStyle = "solid"
    }
    showSlides(1)
}
function welcome(){
    var innerHTML = welcome_text + info_text

    overlay = generateOverlayFrame(innerHTML)
    
}
function info(){
  generateOverlayFrame(info_text)
}
function stats(){
  generateOverlayFrame("This should be the stats overlay.")
}
function getPuzzle(number){
    return $.getJSON("puzzles/" + number + "/wotd.json", function(data){
      return data;
    })
    
  }
function generateOverlayFrame(innerHTML){
  var new_overlayframe = document.createElement("div")
  var notification_text = document.createElement('div')
  notification_text.style.maxWidth = "750px"
  notification_text.style.textAlign= "left"
  notification_text.style.margin = "auto"
  notification_text.style.padding = "10px"
  notification_text.innerHTML = innerHTML
  new_overlayframe.id = "overlay"
  var close_button = document.createElement("span")
  close_button.classList.add("closebtn")
  close_button.addEventListener("click", function(){destroyOverlayFrame()})
  close_button.innerHTML="&times;"
  new_overlayframe.appendChild(close_button)
  new_overlayframe.appendChild(notification_text)
  body.appendChild(new_overlayframe)
    return new_overlayframe
}
function destroyOverlayFrame(){
    document.getElementById("overlay").remove();
}

function displayStats(){

}
function updateGame(){

}
function renderMoreInfo(){

}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
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
    let expires = "expires="+d.toUTCString();
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
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
    dots[i].classList.add("inactive");
    dots[i].style.backgroundColor = number_to_dark_color(i);
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].classList.remove("inactive")
  dots[slideIndex-1].classList.add("active")
  dots[slideIndex-1].style.backgroundColor = number_to_light_color(slideIndex -1);
  updateButtonsOnGameState()
  
}
function define(number){
  word_to_define = this.game_state["button_to_word_index"][number]
  definition_panel = document.getElementById("def_panel")
  if(word_to_define == 0){
    word = this.puzzle["wotd"]
  }
  else{
    word = this.puzzle["other_words"][word_to_define-1]
  }
  text = "<b>" + word["lemma"] + "(" + word["xlit"] + "):</b>" + word["description"]
    definition_panel.innerHTML = text
}
function registerWordButtonClick(number){
  if(this.game_state["current_selections"][slideIndex-1][number]){
    this.game_state["current_selections"][slideIndex-1][number] = false;
  }
  else{
    this.game_state["current_selections"][slideIndex-1][number] = true;
  }
  updateButtonsOnGameState()

}
function updateButtonsOnGameState(){
  let wordbuttons = document.getElementsByClassName("wordbutton");

  let defbuttons = document.getElementsByClassName("definition_button");
  let checkbuttons = document.getElementsByClassName("check_button");
  for(i = 0; i < wordbuttons.length; i++){
    if(this.game_state["current_selections"][slideIndex-1][i]){
      if(this.game_state["solved"][i]){
        wordbuttons[i].style.backgroundImage = "radial-gradient(circle, "+ number_to_light_color(slideIndex-1)+ ", " + number_to_light_color(5) + ")";

      }
      else{
              wordbuttons[i].style.backgroundImage = "none"
              wordbuttons[i].style.backgroundColor = number_to_light_color(slideIndex-1)
        }
     wordbuttons[i].style.borderColor = "#000000"

    }
    else{
      if(this.game_state["solved"][i]){
        wordbuttons[i].style.backgroundImage = "radial-gradient(circle, #FFFFFF, " + number_to_light_color(5) + ")";
      
      }
      else{
        wordbuttons[i].style.backgroundImage = "none"
        wordbuttons[i].style.backgroundColor = "#FFFFFF";
        wordbuttons[i].style.borderWidth = "2px"
      }
      wordbuttons[i].style.borderColor = number_to_light_color(slideIndex-1);

    }
    
    defbuttons[i].style.backgroundColor = number_to_light_color(slideIndex -1)
    if(this.game_state["solved"][i]){
      checkbuttons[i].style.backgroundImage = "radial-gradient(circle, "+ number_to_light_color(slideIndex-1)+ ", " + number_to_light_color(5) + ")";
      checkbuttons[i].innerHTML = "Done"
    }
    else{
      checkbuttons[i].style.backgroundColor = number_to_light_color(slideIndex -1)
    }

  }
}
function check(number){
  destroyNotification()
  if(this.game_state["solved"][number]){
    return
  }
  if(this.game_state["guesses_left"] == 0){
    notification("Sorry, you've run out of guesses.", 0)
    return
  }
  word_index = this.game_state["button_to_word_index"][number]
  strongs_no = 0
  if(word_index == 0){
    strongs_no = this.puzzle["wotd"]["number"]
  }
  else{
    strongs_no = this.puzzle["other_words"][word_index-1]["number"]
  }
  select_incorrect = 0;
  unselect_incorrect = 0;

  for(i = 0; i < 4; i++){
    verse_data = this.puzzle["verses"][i]["verse_data"]
    verse_contains = false
    for(j=0; j < (verse_data.length); j++){
      if(verse_data[j]["Str Grk"] == strongs_no){
        verse_contains = true
        break
      }
    }
    if(verse_contains && !this.game_state["current_selections"][i][number]){
        unselect_incorrect = unselect_incorrect + 1
    }
    if(!verse_contains && this.game_state["current_selections"][i][number]){
      select_incorrect = select_incorrect + 1
    }

  }
  /*win*/
  if(select_incorrect == 0 && unselect_incorrect == 0){
    text = "Correct! "
    this.game_state["solved"][number] = true

    found_all = true;
    for(i = 0; i < 5; i++){
      if(!this.game_state["solved"][i]){
        found_all = false
    }
    }
    if(found_all){
      text = text + "<br/>Congratulations! You finished the puzzle!<br/>"
    }
    if(word_index == 0){
      text = text + "You found the word of the day, " + this.puzzle["wotd"]["lemma"] + " (" + 
      this.puzzle["wotd"]["xlit"] + ")!"
    }
    notification(text, 0)
  }
  else{
    this.game_state["guesses_left"] = this.game_state["guesses_left"] - 1
    if(this.game_state["guesses_left"] == 0){
      text = "Oh no. That was your last guess.<br/>"
    }
    else{ 
         text = "Keep trying. <br/> "
    }
    updateGuessCountDisplay()
    if(select_incorrect > 0){
      text = text + " Something is selected that's not right.<br/> "
    }
    if(unselect_incorrect > 0){
      text = text + " You're missing something. </br>"
    }
    notification(text, 0 )
  }
  currentSlide(slideIndex)
  updateButtonsOnGameState
}
function notification(text, time){
  body = document.getElementById("body")
  var new_overlayframe = document.createElement("div")
  var notification_text = document.createElement('div')
  notification_text.innerHTML = text
  new_overlayframe.id = "notification"
  var close_button = document.createElement("span")
  close_button.classList.add("closebtn")
  close_button.addEventListener("click", function(){destroyNotification()})
  close_button.innerHTML="&times;"
  new_overlayframe.appendChild(close_button)
  new_overlayframe.appendChild(notification_text)

  body.appendChild(new_overlayframe)
}
function destroyNotification(){
  if(document.getElementById("notification") != null){
    document.getElementById("notification").remove();
  }
}
function updateGuessCountDisplay(){
  guess_elements = document.getElementsByClassName("guessdot")
  for(i = 0; i < 4; i++){
      if(i > this.game_state["guesses_left"] - 1){
        guess_elements[i].style.backgroundColor = 'transparent'
      }
      else{
        guess_elements[i].style.backgroundColor = "#000000"
      }
  }
}