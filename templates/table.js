function {{ function_name }}() {
  try {
    var data = new google.visualization.DataTable();
    data.addColumn('string', '{{ chart.label.x }}');
    data.addColumn('number', '{{ labels.record_count }}');
    {% for value in chart.label.values %}
      data.addColumn('number', '{{ value }}');
    {% endfor %}
    data.addRows({{ chart.values|length }});
    {% for value in chart.values %}
      {% set cell_index = loop.index0 %}
      data.setCell({{ cell_index }},0,'{{ value.x }}');
      {% for v in value.values %}
        data.setCell({{ cell_index }},{{ loop.index }},{{ v }});
      {% endfor %}
    {% endfor %}
    var tableDiv = $('#{{ element_id }}')[0];
    {% if chart.values|length > 20 %}
      tableDiv.style.height = '400px';
    {% else %}
      tableDiv.style.height = (100 + {{ chart.values|length }} * 30) + 'px';
    {% endif %}
    var table = new google.visualization.Table(tableDiv);
    var options = {
      width: '100%', 
      fontSize: 12
    };
    table.draw(data, options);
  } catch(e) {
    console.log('Failed to load a table object. (' + e + ')');
  }
};
