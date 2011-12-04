/**
 * This file is used for the UI settings.
 * A lot of fancy stuff here.
 */
var setting_clked = false;
var width_div_over = false;

// a hashtable used to help shine or stop shining the usernames
var shine_username_hash = {};

// colors for username display
var color_arr = [
  "#ffa500", // orange
  "#87cefa", // light sky blue
  "#7cfc00", // lawn green
  "#daa520", // light goldenrod
  "#ff6347", // tomato
  "#ee82ee", // violet
];

function setting_over() {
  if (!setting_clked) {
    $("#setting").css("background", "#666");
  }
}

function setting_out() {
  if (!setting_clked) {
    $("#setting").css("background", "#333");
    $("#setting_img").attr("src", "/images/setting.png");
  }
}

function setting_clicked() {
  /*
  if (setting_clked) {
    setting_clked = false;
  } else {
    setting_clked = true;
  }
  $("#setting_img").attr("src", "/images/setting_clicked.png");
  $("#setting").css("background", "#FFF");
  var left = $("#setting").position().left;
  $("#setting_menu").css("top", 24);
  $("#setting_menu").css("left", left - 60);
  $("#setting_menu").show();
  */
}

function upload_over() {
  $("#upload").css("color", "#333");
  $("#upload").css("border-color", "#333");
}

function upload_out() {
  $("#upload").css("color", "#666");
  $("#upload").css("border-color", "#AAA");
}

function upload_clicked() {
  var dialogOpts = { // options
    buttons: {
      "Ok": function() {
        $("#coming_soon").dialog("close");
      }
    }
  };

  $("#coming_soon").dialog(
    dialogOpts,
    {
      modal: true,
      resizable: false,
    }
  );
  $(".ui-dialog-titlebar").hide(); // hide the title bar
}

function saveas_over() {
  $("#saveas").css("color", "#333");
  $("#saveas").css("border-color", "#333");
}

function saveas_out() {
  $("#saveas").css("color", "#666");
  $("#saveas").css("border-color", "#AAA");
}

function saveas_clicked() {
  make_url();
}

function pen_over() {
  $("#tool_pen").css("color", "#FFF");
  $("#tool_pen").css("background", "#CCC");
}

function pen_out() {
  $("#tool_pen").css("color", "#000");
  $("#tool_pen").css("background", "#FFF");
}

function pen_clicked() {
  clear_curr_tool();
  set_focused("pen");
}

function line_over() {
  $("#tool_line").css("color", "#FFF");
  $("#tool_line").css("background", "#CCC");
}

function line_out() {
  $("#tool_line").css("color", "#000");
  $("#tool_line").css("background", "#FFF");
}

function line_clicked() {
  clear_curr_tool();
  set_focused("line");
}

function rect_over() {
  $("#tool_rect").css("color", "#FFF");
  $("#tool_rect").css("background", "#CCC");
}

function rect_out() {
  $("#tool_rect").css("color", "#000");
  $("#tool_rect").css("background", "#FFF");
}

function rect_clicked() {
  clear_curr_tool();
  set_focused("rect");
}

function ellipse_over() {
  $("#tool_ellipse").css("color", "#FFF");
  $("#tool_ellipse").css("background", "#CCC");
}

function ellipse_out() {
  $("#tool_ellipse").css("color", "#000");
  $("#tool_ellipse").css("background", "#FFF");
}

function ellipse_clicked() {
  clear_curr_tool();
  set_focused("ellipse");
}

function eraser_over() {
  $("#tool_eraser").css("color", "#FFF");
  $("#tool_eraser").css("background", "#CCC");
}

function eraser_out() {
  $("#tool_eraser").css("color", "#000");
  $("#tool_eraser").css("background", "#FFF");
}

function eraser_clicked() {
  clear_curr_tool();
  set_focused("eraser");
}

function fgColor_over(){
  $("#tool_fg").css("color", "#FFF");
  $("#tool_fg").css("background", "#CCC");
}

function fgColor_out(){
  $("#tool_fg").css("color", "#000");
  $("#tool_fg").css("background", "#FFF");
}

function fgColor_clicked(){
}

function bgColor_over(){
  $("#tool_bg").css("color", "#FFF");
  $("#tool_bg").css("background", "#CCC");
}

function bgColor_out(){
  $("#tool_bg").css("color", "#000");
  $("#tool_bg").css("background", "#FFF");
}

function bgColor_clicked(){
}

function undo_over() {
  $("#tool_undo").css("color", "#FFF");
  $("#tool_undo").css("background", "#CCC");
}

function undo_out() {
  $("#tool_undo").css("color", "#000");
  $("#tool_undo").css("background", "#FFF");
}

function undo_clicked(){
  undo();
}

function redo_over(){
  $("#tool_redo").css("color", "#FFF");
  $("#tool_redo").css("background", "#CCC");
}

function redo_out(){
  $("#tool_redo").css("color", "#000");
  $("#tool_redo").css("background", "#FFF");
}

function redo_clicked() {
  redo();
}

function width_over(){
  $("#tool_width").css("color", "#FFF");
  $("#tool_width").css("background", "#CCC");
  width_div_over = true;
}

function width_out(){
  $("#tool_width").css("color", "#000");
  $("#tool_width").css("background", "#FFF");
  width_div_over = false;
}

function width_dialog_over() {
  width_div_over = true;
}

function width_dialog_out() {
  width_div_over = false;
}

function width_clicked(){
  $("#width_div").show();
  $("#tool_width").css("border", "1px solid #999");
}

function fill_over(){
  $("#tool_fill").css("color", "#FFF");
  $("#tool_fill").css("background", "#CCC");
}

function fill_out(){
  $("#tool_fill").css("color", "#000");
  $("#tool_fill").css("background", "#FFF");
}

function fill_clicked(){
  if (currfill_g) {
    currfill_g = 0;
    $("#tool_fill").css("border", "1px solid #FFF");
  } else {
    currfill_g = 1;
    $("#tool_fill").css("border", "1px solid #999");
  }
}

// when the width is changed, change the number display
function width_changed() {
  $("#width_display").text($("#width_slider").val());
  currwidth_g = $("#width_slider").val();
}

// set the current tool focused by showing border
function set_focused(tool) {
  $("#tool_" + tool).css("border", "1px solid #999");
  currtool_g = tool;
}

// remove the border of all the tools, used before setting a new tool
function clear_curr_tool() {
  $("#tool_pen").css("border", "1px solid #FFF");
  $("#tool_line").css("border", "1px solid #FFF");
  $("#tool_rect").css("border", "1px solid #FFF");
  $("#tool_ellipse").css("border", "1px solid #FFF");
  $("#tool_eraser").css("border", "1px solid #FFF");
}

// when the mouse is move onto a chat entry
function chat_over() {
  $(this).css("background", "#EEE");
}

// when the mouse is moved out of a chat entry
function chat_out() {
  $(this).css("background", "#FFF");
}

// when the mouse is move onto a user entry
function user_over() {
  var id = $(this).attr("id");
  var regex = /user\_(.*)/;
  var username = id.match(regex)[1];
  if (!shine_username_hash[username]) {
    $(this).css("background", "#EEE");
  }
}

// when the mouse is move out of a user entry
function user_out() {
  var id = $(this).attr("id");
  var regex = /user\_(.*)/;
  var username = id.match(regex)[1];
  if (!shine_username_hash[username]) {
    $(this).css("background", "#FFF");
  }
}

// detect the "Ctrl + Enter" keyevent to send the message
function talk_area_pressed(e) {
  if (e.ctrlKey && e.keyCode == 13) {
    send_chat();
  }
}

// when the webpage is clicked. This is used only for closing the width dialog
function page_clicked() {
  if (!width_div_over) {
    $("#width_div").hide();
    $("#tool_width").css("border", "1px solid #FFF");
  }
}

// make the username shine when a user is drawing
function username_shine(username, color) {
  if (username != username_g) { // do not shine the user's name
    $("#user_" + username).css("background-color", color);
    var alpha = 0.4;
    var alpha_incr = true;
    var shine = function() {
      if (alpha_incr) { // increase the alpha
        alpha += 0.1;
        if (alpha >= 1.0) {
          alpha_incr = false;
        }
      } else { // decrease the alpha
        alpha -= 0.1;
        if (alpha <= 0.4) {
          alpha_incr = true;
        }
      }
      var bgcolor = $("#user_" + username).css("background-color");
      var regex = /([0-9]+).*?([0-9]+).*?([0-9]+)/;
      var rgb = bgcolor.match(regex); // convert the rgb string to an array

      $("#user_" + username).css("background-color", 
          "rgba(" + rgb[1] + ", " + rgb[2] + ", " + rgb[3] + ", " + alpha + ")"); // change the alpha
    };
    var id = setInterval(shine, 50);
    shine_username_hash[username] = id; // push to the hashtable for stopping
  }
}

// stop the username shining when the user stops to draw
function stop_username_shine(username) {
  if (username != username_g) {
    var id = shine_username_hash[username]; // get the id
    clearInterval(id); // stop shining
    $("#user_" + username).css("background-color", "#FFFFFF"); // restore background color
    shine_username_hash[username] = 0;
  }
}

// initialize the toolbar
function init_tools() {
  $("#tools").menu(); // make a menu of the tools

  $("#fg_name").show().miniColors({
    change: function(hex, rgb){
              currfg_g = [rgb.r, rgb.g, rgb.b];
            }});
  $("#fg_name").miniColors('value', '#000000');
  $("#bg_name").show().miniColors({
    change: function(hex, rgb){
              currbg_g = [rgb.r, rgb.g, rgb.b];
            }});
  $("#bg_name").miniColors('value', '#FFFFFF');

  $("#width_div").hide();
  $("#width_slider").change(width_changed);

  //Add all hover and mousedown function links.
  $("#tool_pen").hover(pen_over, pen_out);
  $("#tool_pen").mousedown(pen_clicked);
  $("#tool_line").hover(line_over, line_out);
  $("#tool_line").mousedown(line_clicked);
  $("#tool_rect").hover(rect_over, rect_out);
  $("#tool_rect").mousedown(rect_clicked);
  $("#tool_ellipse").hover(ellipse_over, ellipse_out);
  $("#tool_ellipse").mousedown(ellipse_clicked);
  $("#tool_eraser").hover(eraser_over, eraser_out);
  $("#tool_eraser").mousedown(eraser_clicked);
  $("#tool_undo").hover(undo_over, undo_out);
  $("#tool_undo").mousedown(undo_clicked);
  $("#tool_redo").hover(redo_over, redo_out);
  $("#tool_redo").mousedown(redo_clicked);
  $("#tool_fg").hover(fgColor_over, fgColor_out);
  $("#tool_fg").mousedown(fgColor_clicked);
  $("#tool_bg").hover(bgColor_over, bgColor_out);
  $("#tool_bg").mousedown(bgColor_clicked);
  $("#tool_width").hover(width_over, width_out);
  $("#tool_width").mousedown(width_clicked);
  $("#tool_fill").hover(fill_over, fill_out);
  $("#tool_fill").mousedown(fill_clicked);

  // this is for the width dialog implemented completely by myself
  $("#width_div").hover(width_dialog_over, width_dialog_out);

  pen_clicked();
}

function init_ui() {
  // $("#setting_menu").hide();
  // $("#setting_menu").mouseover(setting_clicked);

  // the setting icon on the top-right corner
  $("#setting").hover(setting_over, setting_out);
  $("#setting").mousedown(setting_clicked);

  // when the user presses "Ctrl + Enter"
  $("#talk_area").keydown(talk_area_pressed);

  // make a jQuery-UI style button
  $("#send_btn").button();
  $("#send_btn").click(send_chat);

  // upload button on the top-right corner
  $("#upload_div").hover(upload_over, upload_out);
  $("#upload_div").mousedown(upload_clicked);

  // saveas button on the top-right corner
  $("#saveas_div").hover(saveas_over, saveas_out);
  $("#saveas_div").mousedown(saveas_clicked);

  // effects when the user moves the mouse on and out of the chat entries
  $(".chat_entry").live("mouseover", chat_over);
  $(".chat_entry").live("mouseout", chat_out);

  // effects when the user moves the mouse on and out of the user entries
  $(".user_entry").live("mouseover", user_over);
  $(".user_entry").live("mouseout", user_out);

  // hide the dialogs
  $("#coming_soon").hide();
  $("#username_in_use").hide();

  init_tools();

  // also used for the width dialog
  $(document).mousedown(page_clicked);
}
