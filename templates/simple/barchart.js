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
          $('#drilldown_deeper_dialog_submit').click(function(e) {
            var drilldownKeyLabel = $('#drilldown_deeper_dialog_select option:selected').text();
            var drilldownKey = $('#drilldown_deeper_dialog_select option:selected').val();
            var cutName = encodeURIComponent('{{ drilldown_key }}');
            var cutValue = encodeURIComponent(selectedValue);
            var baseUrl = '/simple/chart?drilldown=' + drilldownKey + '&cut=' + cutName + ':' + cutValue; 
            var displayChildChartUrl = baseUrl + '&display_type=piechart&element_id=child_chart_div&function_name=displayChildChart';
            loadFunction(displayChildChartUrl);
            $('#child_chart_title').text('"{{ chart.label.x }} : ' + selectedValue + '" > "' + drilldownKeyLabel + '"');
            var childChartDiv = $('#child_chart_div')[0];
            childChartDiv.style.height = '400px';
            displayChildChart();
          });
          $('#drilldown_deeper_dialog_title').text('"{{ chart.label.x }} : ' + selectedValue + '"');
          $('#launch_drilldown_deeper_dialog').trigger('click');
        }
      } catch(e) {
        console.log('Failed to load the drill down deeper dialog. (' + e + ')');
      }
    });
  } catch(e) {
    console.log('Failed to load a barchart. (' + e + ')');
  }
};


