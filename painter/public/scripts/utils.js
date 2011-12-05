/**
 * This file contains the functions and variables to help the main functionalities
 */

// used for setting the refreshing frequency
function time_out() {
  timeout = true;
}

// initialize the detector canvas by adding the event listeners
function init_detector() {
  $("#detector").mousedown(canvas_mousedown);
  $("#detector").mouseup(canvas_mouseup);
  $("#detector").mousemove(canvas_mousemove);
  $("#detector").mouseover(canvas_mouseover);
  $("#detector").mouseout(canvas_mouseout);
}

// make a url to the canvas to enable downloading
function make_url() {
  $("<canvas id=\"save_canvas\" width=\"800\" height=\"600\"></canvas>").insertBefore($("#canvas"));
  var ctx = $("#save_canvas").get(0).getContext('2d');

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 800, 600); // fill the background with white
  ctx.drawImage($("#canvas").get(0), 0, 0);
  for (var i = 0; i < $(".layer").length; i++) {
    ctx.drawImage($("#layer" + i).get(0), 0, 0);
  }

  $("#save_canvas").hide(); // make it invisible since we don't need it displayed
  var url = $("#save_canvas").get(0).toDataURL();

  var save_dialog = "<div id=\"save_dialog\">" 
      + "<img id=\"img_to_save\" src=\"" + url + "\"/ >"
      + "<p>Right click and click \"Save Image As\"</p></div>"
  $("#container").append(save_dialog);
  $("#save_dialog").hide();

  var dialogOpts = { // options
    buttons: {
      "Ok": function() {
        $("#save_dialog").dialog("close");
        $("#save_dialog").remove();
      }
    }
  };

  $("#save_dialog").dialog(
    dialogOpts,
    {
      modal: true,
      resizable: false,
      width:'auto',
      position: [200, 0],
    }
  );
  $(".ui-dialog-titlebar").hide(); // hide the title bar

  // window.open(url); // open a tab for the image
  $("#save_canvas").remove();
}

// clear the cursor(pen cap)
function clear_usercap(username) {
  $("#detector").get(0).getContext('2d')
      .clearRect(userbufs[username][0] - 10, userbufs[username][1] - 10, 20, 20); // clear the detector canvas
}

// draw an ellipse with the specified coordinates and "fill"
function draw_ellipse(ctx, x, y, w, h, fill) {
  var kappa = .5522848;
  ox = (w / 2) * kappa, // control point offset horizontal
  oy = (h / 2) * kappa, // control point offset vertical
  xe = x + w,           // x-end
  ye = y + h,           // y-end
  xm = x + w / 2,       // x-middle
  ym = y + h / 2;       // y-middle

  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  ctx.stroke();
}

// check whether a user has logged in before or not
function is_new_user(username) {
  for (var i = 0; i < usernames.length; i++) {
    if (usernames[i] == username) {
      return false;
    }
  }
  return true;
}
