## Cubes Bootstrap UI

Bootstrap UI for Cubes with Google Chart Tools.

https://github.com/Stiivi/cubes

https://developers.google.com/chart/

## Demo

http://cubes.seratch.net/

## Requirement

### Python

Python 2.7.2

### Setup

Clone the app:

```sh
git clone https://github.com/seratch/cubes-bootstrap-ui.git
```

Setup Cubes server:

```sh
# cubes required
pip install sqlalchemy werkzeug
pip install cubes

# invoke Cubes server
cd cubes-bootstrap-ui/iris_cubes
# invoke app
slicer serve slicer.ini
```

On a different terminal, invoke cubes-bootstrap-ui:

```sh
# cubes-bootstrap-ui required
pip install flask slimit 
# invoke app
python cubesui.py
```

And then acess http://localhost:8000/

You'll see the following auto-generated UI.

![screenshot](https://github.com/seratch/cubes-bootstrap-ui/raw/master/doc/img/screenshot.png)

