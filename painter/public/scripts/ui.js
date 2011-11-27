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
}

function line_out() {
}

function line_clicked() {
  set_tool("line");
}

function rect_over() {
}

function rect_out() {
}

function rect_clicked() {
}

function ellipse_over() {
}

function ellipse_out() {
}

function ellipse_clicked() {
}

function eraser_over() {
}

function eraser_out() {
}

function eraser_clicked() {
}

function undo_over() {
}

function undo_out() {
}

function undo_clicked() {
}

function redo_clicked() {
}

function redo_clicked() {
}

function redo_clicked() {
}

function init_tools() {
  $("#tools").menu();

  $("#tool_pen").hover(pen_over, pen_out);
  $("#tool_pen").mousedown(pen_clicked);

  $("#tool_line").hover(line_over, line_out);
  $("#tool_line").mousedown(line_clicked);
}

function init_ui() {
  init_tools();
  $("#copy_div").hover(copy_over, copy_out);
  $("#copy_div").mousedown(copy_clicked);
}
