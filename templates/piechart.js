function {{ function_name }}() {
  try {
    var data = new google.visualization.DataTable();
    data.addColumn('string', '{{ chart.label.x }}');
    data.addColumn('number', 'record_count');
    {% for value in chart.label.values %}
      data.addColumn('number', '{{ value }}');
    {% endfor %}

    var rows = [];
    {% for data in chart.values %}
      rows.push(['{{ data.x }}'{% for value in data.values %},{{ value }}{% endfor %}]);
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


