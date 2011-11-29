function copy_over() {
  $("#copy").css("color", "#333");
  $("#copy").css("border-color", "#333");
}

function copy_clicked() {
  make_url();
}

function copy_out() {
  $("#copy").css("color", "#666");
  $("#copy").css("border-color", "#AAA");
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
  set_tool("pen");
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
  set_tool("line");
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
  $("#fg_name").show().miniColors({
    change: function(hex, rgb){
              //TODO
              console.log(rgb);
              console.log(hex);
           $("#fg_name").miniColors('destroy');
            }});
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
  //Wait for fg to complete.
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
}

function init_tools() {
  $("#tools").menu();

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
}

function init_ui() {
  init_tools();
  $("#send_button").button();
  $("#copy_div").hover(copy_over, copy_out);
  $("#copy_div").mousedown(copy_clicked);
}
