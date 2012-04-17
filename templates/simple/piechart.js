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

    var chartDiv = $('#{{ element_id }}')[0];
    var chart = new google.visualization.PieChart(chartDiv);
    chart.draw(data, options);
  } catch(e) {
    console.log('Failed to load a piechart. (' + e + ')');
  }
};


