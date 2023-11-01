from flask import Flask, render_template, jsonify,request
from db import Database
from db_util import parse_explain

DEVELOPMENT_ENV = True
app = Flask(__name__)
DATABASE = None


app_data = {
    "name": "Starter Template",
    "description": "A basic Flask app using bootstrap for layout",
    "author": "Jon",
    "html_title": "Jon template",
    "project_name": "Starter Template",
    "keywords": "flask, webapp, template, basic",
}


@app.route("/")
def index():
    return render_template("index.html", app_data=app_data)

@app.route("/query", methods=['POST'])
def run_sql_query():
    try:
        sql_query = request.get_json().get('sql_query')
        print("got the sql query:", sql_query);
        if sql_query:
            result = DATABASE.execute("EXPLAIN " + sql_query, True)
            parsed_nodes = parse_explain(result)

            return jsonify({'result': parsed_nodes})
        else:
            return jsonify({'error': 'No SQL query provided in the request'})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == "__main__":
    DATABASE = Database()
    DATABASE.connect('tpc_h')
    app.run(debug=DEVELOPMENT_ENV)
    DATABASE.close()