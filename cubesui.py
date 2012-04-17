#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request, render_template
from slimit import minify
import sys
import urllib
import httplib
import json
import codecs

encoding = 'utf-8'
config_dir = sys.argv[1] if len(sys.argv) > 1 else './config'

app = Flask(__name__)

class SimpleDrilldownChartLabel:
  def __init__(self, x, value):
    self.x = x
    self.value = value

class SimpleDrilldownChartValue:
  def __init__(self, x, value):
    self.x = x
    self.value = value

class SimpleDrilldownChart:
  def __init__(self, label, values):
    if not isinstance(label, SimpleDrilldownChartLabel):
      raise ValueError('label should be a SimpleDrilldownChartLabel value', label)
    if len(values) and not isinstance(values[0], SimpleDrilldownChartValue):
      raise ValueError('value should be an array of SimpleDrilldownChartValue', value)
    self.label = label
    self.values = values

class CubesDimension:
  def __init__(self, name, label, levels):
    if not isinstance(name, str):
      raise ValueError('name should be a str value', name)
    if not isinstance(label, unicode):
      raise ValueError('label should be a unicode value', label) 
    if len(levels) and not isinstance(levels[0], str):
      raise ValueError('levels should be an array of str', levels)
    self.name = name
    self.label = label
    self.levels = levels

print 'Loading app.json...'
app_json = codecs.open(config_dir + '/app.json', 'r', encoding).read()
app.appjson = json.loads(app_json)

print 'Loading labels.json...'
labels_json = codecs.open(config_dir + '/labels.json', 'r', encoding).read()
app.labels = json.loads(labels_json)

# Cubes Model
print 'Loading Cubes Model...'
cubes_conn = httplib.HTTPConnection(
  app.appjson.get('cubes_hostname') or 'localhost',
  app.appjson.get('cubes_port') or 5000 
)
try: 
  cubes_conn.request('GET', "/model")
except Exception, e: 
  raise Exception('Failed to access the Cubes server...(' + str(e) + ')')

app.model = json.loads(
  cubes_conn.getresponse().read().decode(encoding)
)

# Cubes Dimensions
app.dimensions = []
for name, elem in app.model.get('dimensions').items():
  levels = []
  for level_name in elem.get('levels').keys():
    if level_name == 'default': break
    else: levels.append(str(level_name))

  app.dimensions.append(
    CubesDimension(
      name = str(name), 
      label = app.labels.get('dimensions').get(name) or name, 
      levels = levels
    )
  )

app.dimensions.sort(cmp = lambda a,b: cmp(a.name, b.name))

# Labels as properties
class LabelStore:
  def add(self, key, value): 
    self.__dict__[key] = value

ui_labels = app.labels.get('ui')
app.ui_labels = LabelStore()
app.ui_labels.add('title',         ui_labels.get('title') or 'Cubes Bootstrap UI')
app.ui_labels.add('tab1',          ui_labels.get('tab1') or 'Simple drill down')
app.ui_labels.add('h1',            ui_labels.get('h1') or 'Cubes Bootstrap UI')
app.ui_labels.add('query',         ui_labels.get('query') or 'Query')
app.ui_labels.add('drill_down',    ui_labels.get('drill_down') or 'Drill down')
app.ui_labels.add('please_select', ui_labels.get('please_select') or '(Please select)')
app.ui_labels.add('submit',        ui_labels.get('submit') or 'Submit')
app.ui_labels.add('close',         ui_labels.get('close') or 'Close')
app.ui_labels.add('clear',         ui_labels.get('clear') or 'Clear')

app.chart_labels = {}
chart_labels = app.labels.get('chart')
for key in chart_labels.keys():
  app.ui_labels.add(key, chart_labels.get(key) or key)
  app.chart_labels[key] = chart_labels.get(key) or key

# Routing

@app.route('/')
def index():
  drilldown_key = request.args.get('drilldown', '')
  return render_template('index.html', 
    labels = app.ui_labels,
    drilldown_key = drilldown_key,
    dimensions = app.dimensions
  )

@app.route('/simple/chart')
def simple_chart():
  measure = app.appjson.get('measure', 'record_count')
  function_name = request.args.get('function_name', 'displayChart')
  element_id = request.args.get('element_id', 'chart_div')
  display_type = request.args.get('display_type', 'barchart')
  drilldown_key = request.args.get('drilldown', '')

  cut = request.args.get('cut', '')
  if cut != '': 
    [cut_key, cut_value] = cut.split(':')
    items_cut_value_matched = filter(lambda (k,v): v == cut_value, app.chart_labels.items())
    if len(items_cut_value_matched) > 0:
      value = items_cut_value_matched[0][0]
      cut = cut_key + ':' + value.split('.')[-1]

  if drilldown_key == '': 
    return 'function ' + function_name + '() {}'

  uri = "/aggregate?drilldown=" + drilldown_key
  if cut != '': 
    uri += '&cut=' + urllib.quote(cut.encode(encoding))
  cubes_conn.request('GET', uri)
  res = json.loads(cubes_conn.getresponse().read().decode(encoding))

  chart_values = []
  for elem in res.get('drilldown'):
    x = elem.get(drilldown_key) 
    if not x:
      x = elem.get(filter(lambda e: e.startswith(drilldown_key), elem)[0])
    value = elem.get(measure)
    chart_values.append(
      SimpleDrilldownChartValue(
        x = app.chart_labels.get(drilldown_key + '.' + str(x)) or x, 
        value = value
      )
    )
  chart_values.sort(cmp = lambda a,b: cmp(b.value, a.value))

  js = render_template('simple/' + display_type + '.js', 
    drilldown_key = drilldown_key,
    labels = app.ui_labels,
    function_name = function_name, 
    element_id = element_id,
    chart = SimpleDrilldownChart(
      label = SimpleDrilldownChartLabel(
        x = app.labels.get('dimensions').get(drilldown_key) or drilldown_key, 
        value = app.chart_labels.get(measure) or measure
      ),
      values = chart_values
    )
  )
  return minify(js)

@app.route('/favicon.ico')
def favicon():
  return app.send_static_file('favicon.ico')

# --- Server invocation ---

if __name__ == "__main__":
  app.debug = app.appjson.get('debug_mode') or False
  print 'Flask HTTP Server started...'
  app.run(
    host = app.appjson.get('server_hostname') or '0.0.0.0', 
    port = app.appjson.get('server_port') or 8000
  )
  print 'Flask HTTP Server stopped.'


