// for IE
if (!('console' in window)) {
  window.console = {};
  window.console.log = function(str){
    return str;
  };
}

function loadFunction(url) {
  $.ajax({
    type: 'GET',
    async: false,
    url: url,
    dataType: 'script',
    success: function(xhr, status) {
      console.log('Succeeded to load the chart (' + url + ')');
    },
    error: function(xhr, status, error) { 
      console.log('Failed to load the chart (' + url + ')');
      alert('Failed to load chart (' + error + ')'); 
    }
  });
};

function removeOptionFromSelectBox(selectbox, value) {
  for (var i = 0; i < selectbox.options.length; i++) {
    var option = selectbox.options[i];
    if (option.value == value) {
      selectbox.options.remove(option);
      break;
    }
  }
}


