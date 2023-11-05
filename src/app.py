from flask import Flask, render_template, jsonify,request
from db import Database
from db_util import parse_explain, tree_representation, summary_representation

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

@app.route("/test")
def test():
    return render_template("test.html", app_data=app_data)

@app.route("/query", methods=['POST'])
def run_sql_query():
    try:
        sql_query = request.get_json().get('sql_query')
        if sql_query:
            result = DATABASE.execute("EXPLAIN " + sql_query, True)
            parsed_nodes = parse_explain(result)
            
            tree_rep = tree_representation(parsed_nodes)
            summary_rep = summary_representation(tree_rep)
            # this is adjacency representation
            # for i in range(len(parsed_nodes)):
            #     parsed_nodes[i] = parsed_nodes[i].to_json()
            # return jsonify({'result': parsed_nodes})
            return jsonify({'result': tree_rep, 'summary': summary_rep})
        else:
            return jsonify({'error': 'No SQL query provided in the request'})
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route("/query2", methods=['POST'])
def run_sql_query_block_info():
    try:
        print("running query2")
        data = request.get_json()
        table = data["table"]
        where_condition = data["where_condition"]
        query = f"SELECT ctid FROM {table} WHERE {where_condition} order by ctid"
        print(query)
        result = DATABASE.execute(query)
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)})



if __name__ == "__main__":
    DATABASE = Database()
    DATABASE.connect('tpc_h')
    app.run(port=8000,debug=DEVELOPMENT_ENV)
    DATABASE.close()