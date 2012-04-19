# Data preparation for the hello_world example

import sqlalchemy
import cubes
import cubes.tutorial.sql as tutorial
import logging

# 1. Prepare SQL data in memory

logger = logging.getLogger("cubes")
logger.setLevel(logging.WARN)

FACT_TABLE = "ft_iris"
FACT_VIEW = "vft_iris"

print "loading data..."

engine = sqlalchemy.create_engine('sqlite:///data.sqlite')
tutorial.create_table_from_csv(engine, 
  "iris.csv", 
  table_name=FACT_TABLE, 
  fields=[
    ("iris_id", "integer"),
    ("sepal_length", "string"), 
    ("sepal_width", "string"), 
    ("petal_length", "string"), 
    ("petal_width", "string"),
    ("species", "string")
  ],
  create_id=True 
)

model = cubes.load_model("model.json")

cube = model.cube("iris")
cube.fact = FACT_TABLE

# 2. Create the view (required for the default backend)

print "creating view '%s'..." % FACT_VIEW

connection = engine.connect()
dn = cubes.backends.sql.SQLDenormalizer(cube, connection)

dn.create_view(FACT_VIEW)

print "done"
