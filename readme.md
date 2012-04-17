## Cubes Bootstrap UI

Bootstrap UI for Cubes with Google Visualization API. 

- Cubes 

https://github.com/Stiivi/cubes

## Requirement

### Python

Python 2.7.2

### Setup Cubes server

```sh
pip install sqlalchemy werkzeug
pip install cubes

git clone git://github.com/Stiivi/cubes.git
cd cubes
cd examples/hello_world

python prepare_data.py
slicer serve slicer.ini
```

### Setup Cubes Bootstrap UI

```sh
pip install flask slimit 

git clone https://github.com/seratch/cubes-bootstrap-ui.git
cd cubes-bootstrap-ui/
python cubesui.py
```

And then acess http://localhost:8000/

I'll see the following auto-generated UI.

![screenshot](https://github.com/seratch/cubes-bootstrap-ui/raw/master/doc/img/screenshot.png)

