function {{ function_name }}() {
  try {
    var data = new google.visualization.DataTable();
    data.addColumn('string', '{{ chart.label.x }}');
    data.addColumn('number', '{{ chart.label.value }}');

    var rows = [];
    {% for data in chart.values %}
      rows.push(['{{ data.x }}',{{ data.value }}]);
    {% endfor %}
    data.addRows(rows);

    var options = { 
      fontSize: 12,
      chartArea: {width: '75%', height: '98%'}
    };

    var $chartDiv = $('#{{ element_id }}');
    var chart = new google.visualization.PieChart($chartDiv[0]);
    chart.draw(data, options);

    // callback for row select event
    google.visualization.events.addListener(chart, 'select', function (e){
      try {
        var mightBeSeveral = chart.getSelection();
        if (mightBeSeveral.length == 1) {
          var selected = mightBeSeveral[0];
          var selectedValue = data.getValue(selected.row, 0);

          var dialogSelectBox = $('#drilldown_dialog_select')[0];
          initDimensionsSelectBox(dialogSelectBox);
          removeOptionFromSelectBox(dialogSelectBox, '{{ drilldown_key }}');
          {% for cut_key in cut_keys %}
            removeOptionFromSelectBox(dialogSelectBox, '{{ cut_key }}');
          {% endfor %}

          $('#drilldown_dialog_submit').off('click');
          $('#drilldown_dialog_submit').click(function(e) {

            var titleElementId = 'child_chart_{{ drilldown_next_depth }}_title';
            var chartElementId = 'child_chart_{{ drilldown_next_depth }}_div';
 
            var drilldownKeyLabel = $('#drilldown_dialog_select option:selected').text();
            var drilldownKey = $('#drilldown_dialog_select option:selected').val();
            var drilldownTopicPath = '{{ drilldown_topic_path }} > "{{ chart.label.x }} : ' + selectedValue;
            var drilldownCurrentTopicPath = drilldownTopicPath + '" > "' + drilldownKeyLabel + '"';

            var displayChildChartUrl = '/simple/chart' 
              + '?drilldown=' + drilldownKey 
              + '&cut={{ cut }}|' + encodeURIComponent('{{ drilldown_key }}') + ':' + encodeURIComponent(selectedValue) 
              + '&display_type=piechart' 
              + '&element_id=' + chartElementId 
              + '&drilldown_topic_path=' + encodeURIComponent(drilldownTopicPath)
              + '&function_name=displayChildChart_{{ drilldown_next_depth }}';
            loadFunction(displayChildChartUrl);

            var $childChartsDiv = $('#child_charts_div');
            for (var i = 100; i >= {{ drilldown_next_depth }}; i--) {
              if ($('#child_chart_' + i + '_div').length > 0) {
                $('#child_chart_' + i + '_div').remove();
                $('#child_chart_' + i + '_title').remove();
              }
            } 

            var $chartDiv = $('<div>').attr({id:chartElementId}).css('height','400px');
            if ($('#' + chartElementId).length == 0) {
              $childChartsDiv.prepend($chartDiv);
            }

            var $chartTitle = $('<div>').attr({id:titleElementId})
              .append($('<h3>').text(drilldownCurrentTopicPath))
              .append($('<hr>'));
            if ($('#' + titleElementId).length == 0) {
              $childChartsDiv.prepend($chartTitle);
            }

            displayChildChart_{{ drilldown_next_depth }}();
          });

          $('#drilldown_dialog_title').text('"{{ chart.label.x }} : ' + selectedValue + '"');
          $('#launch_drilldown_dialog').trigger('click');
        }

      } catch(e) {
        console.log('Failed to load the drill down dialog. (' + e + ')');
      }
    });

  } catch(e) {
    console.log('Failed to load a piechart. (' + e + ')');
  }
};


