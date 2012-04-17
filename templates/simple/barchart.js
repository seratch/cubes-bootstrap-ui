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
      hAxis: {minValue : 0},
      chartArea: {width: '75%', height: '98%'}
    };

    $('#{{ element_id }}_title').text('"{{ chart.label.x }}"');
    var chartDiv = $('#{{ element_id }}')[0];
    chartDiv.style.height = (100 + rows.length * 25) + 'px';
    var chart = new google.visualization.BarChart(chartDiv);
    chart.draw(data, options);

    // callback for row select event
    google.visualization.events.addListener(chart, 'select', function(e){
      try {
        var mightBeSeveral = chart.getSelection();
        if (mightBeSeveral.length == 1) {
          var selected = mightBeSeveral[0];
          var selectedValue = data.getValue(selected.row, 0);

          $('#drilldown_dialog_submit').off('click');
          $('#drilldown_dialog_submit').click(function(e) {
            var titleElementId = 'child_chart_0_title';
            var chartElementId = 'child_chart_0_div';

            var drilldownKeyLabel = $('#drilldown_dialog_select option:selected').text();
            var drilldownKey = $('#drilldown_dialog_select option:selected').val();
            var drilldownTopicPath = '"{{ chart.label.x }} : ' + selectedValue;
            var drilldownCurrentTopicPath = drilldownTopicPath + '" > "' + drilldownKeyLabel + '"';

            var displayChildChartUrl = '/simple/chart'
              + '?drilldown=' + drilldownKey
              + '&cut=' + encodeURIComponent('{{ drilldown_key }}') + ':' + encodeURIComponent(selectedValue)
              + '&display_type=piechart'
              + '&element_id=' + chartElementId
              + '&drilldown_topic_path=' + encodeURIComponent(drilldownTopicPath)
              + '&function_name=displayChildChart_0';

            loadFunction(displayChildChartUrl);

            var $childChartsDiv = $('#child_charts_div');
            $childChartsDiv.empty(); // remove all children
            var $chartTitle = $('<div>').attr({id:titleElementId})
              .append($('<h3>').text(drilldownCurrentTopicPath))
              .append($('<hr>'));
            $childChartsDiv.append($chartTitle);

            var $chartDiv = $('<div>').attr({id:chartElementId}).css('height','400px');
            $childChartsDiv.append($chartDiv);

            displayChildChart_0();
          });

          $('#drilldown_dialog_title').text('"{{ chart.label.x }} : ' + selectedValue + '"');
          $('#launch_drilldown_dialog').trigger('click');
        }
      } catch(e) {
        console.log('Failed to load the drill down dialog. (' + e + ')');
      }
    });
  } catch(e) {
    console.log('Failed to load a barchart. (' + e + ')');
  }
};


