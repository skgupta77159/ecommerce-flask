from src import create_app
from flask import jsonify

app = create_app()


@app.errorhandler(403)
def forbidden(e):
    return jsonify(message="Forbidden"), 403


# hit when endpoint is not found
@app.errorhandler(404)
def forbidden(e):
    return jsonify(message="Endpoint Not Found"), 404


if __name__ == "__main__":
    app.run(debug=True)
