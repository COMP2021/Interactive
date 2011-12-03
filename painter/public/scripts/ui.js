var setting_clked = false;

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

function saveas_over() {
  $("#saveas").css("color", "#333");
  $("#saveas").css("border-color", "#333");
}

function saveas_clicked() {
  make_url();
}

function saveas_out() {
  $("#saveas").css("color", "#666");
  $("#saveas").css("border-color", "#AAA");
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

}
function width_out(){
  $("#tool_width").css("color", "#000");
  $("#tool_width").css("background", "#FFF");
}

function width_clicked(){

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

function set_focused(tool) { // set the current tool focused by showing border
  $("#tool_" + tool).css("border", "1px solid #999");
  currtool_g = tool;
}

function clear_curr_tool() {
  $("#tool_pen").css("border", "1px solid #FFF");
  $("#tool_line").css("border", "1px solid #FFF");
  $("#tool_rect").css("border", "1px solid #FFF");
  $("#tool_ellipse").css("border", "1px solid #FFF");
  $("#tool_eraser").css("border", "1px solid #FFF");
}

function chat_over() {
  $(this).css("background", "#EEE");
}

function chat_out() {
  $(this).css("background", "#FFF");
}

function talk_area_pressed(e) {
  if (e.ctrlKey && e.keyCode == 13) {
    send_chat();
  }
}

function init_tools() {
  $("#tools").menu();
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

  pen_clicked();
}

function init_ui() {
  $("#setting_menu").hide();
  $("#setting_menu").mouseover(setting_clicked);

  $("#setting").hover(setting_over, setting_out);
  $("#setting").mousedown(setting_clicked);

  $("#talk_area").keydown(talk_area_pressed);

  $("#send_btn").button();
  $("#send_btn").click(send_chat);

  $("#saveas_div").hover(saveas_over, saveas_out);
  $("#saveas_div").mousedown(saveas_clicked);

  $(".chat_entry").live("mouseover", chat_over);
  $(".chat_entry").live("mouseout", chat_out);

  init_tools();
}
