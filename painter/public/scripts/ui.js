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
  $("#setting_menu").hide();
  $("#setting_menu").mouseover(setting_clicked);

  init_tools();
  $("#setting").hover(setting_over, setting_out);
  $("#setting").mousedown(setting_clicked);

  $("#send_button").button();

  $("#saveas_div").hover(saveas_over, saveas_out);
  $("#saveas_div").mousedown(saveas_clicked);
}
