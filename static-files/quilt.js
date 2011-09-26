var SQUARE_SIZE = 128;

function maybeFixupYoutubeEmbed(iframe, size) {
  var fullSize = Math.floor(1.38 * size);
  var topTitleBar = Math.floor(0.18 * size);

  if (iframe.nodeName != "IFRAME")
    return;
  var src= $(iframe).attr("src");
  if (!src.match(/http:\/\/www\.youtube\.com/))
    return;
  if (src.indexOf('?') == -1)
    $(iframe).attr('src', src + "?controls=0");
  $(iframe).attr("width", null).attr("height", null);
  $(iframe).width(fullSize).height(fullSize).css({
    marginTop: -topTitleBar
  });
}

function maybeFixupImageDimensions(element, size) {
  if (element.nodeName == "IMG") {
    $(element).hide().load(function() {
      var width = $(this).width();
      var height = $(this).height();
      if (width > height) {
        $(this).height(size).width(null);
      } else {
        $(this).height(null).width(size);
      }
      $(this).fadeIn();
    });
  }
}

function buildQuilt(div) {
  var quilt = $('<div class="quilt"></div>');
  var squareSize = SQUARE_SIZE;

  function addSquare(element) {
    var square = $('<div class="quilt-square"></div>');
    square.append(element).appendTo(quilt);
  }

  div.contents().each(function() {
    switch (this.nodeType) {
      case this.TEXT_NODE:
      if (jQuery.trim(this.nodeValue).length)
        addSquare(this);
      break;
      
      case this.ELEMENT_NODE:
      maybeFixupYoutubeEmbed(this, squareSize);
      maybeFixupImageDimensions(this, squareSize);
      addSquare(this);
      break;
    }
  });

  var squaresPerSide = Math.floor(Math.sqrt(quilt.children().length));
  quilt.children().width(squareSize).height(squareSize);
  quilt.width(squareSize * squaresPerSide);

  return quilt;
}

function loadQuilt(cb) {
  var div = $("<div></div>").appendTo(document.body).hide();
  div.load("quilt.html", function() {
    $(".quilt").remove();
    var quilt = buildQuilt(div);
    quilt.appendTo(document.body);
    div.remove();
    if (cb)
      cb();
  });
}

$(window).ready(function() {
  loadQuilt();
});
