from flask import Flask, render_template, jsonify,request
from db import Database
from db_util import parse_explain, tree_representation, summary_representation
from collections import defaultdict

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
        data = request.get_json()
        table = data["table"]
        from_tables = data["from_tables"]
        where_condition = data["where_condition"]
        if where_condition:
            query = f"SELECT {table}.ctid FROM {from_tables} WHERE {where_condition} order by ctid;"
        else:
            query = f"SELECT {table}.ctid FROM {from_tables} order by ctid;"
        query_result = DATABASE.execute(query)
        result = defaultdict(set)
        for x in query_result:
            block_id, tuple_id = x[0][1:-1].split(",")
            result[block_id].add(tuple_id)
        result = {key: sorted([int(x) for x in value]) for key, value in result.items()}
        blocks = list(result.keys())
        blocks_and_tuples_count = {key: len(value) for key, value in result.items()}
        return jsonify({'blocks': blocks, 'blocks_and_tuples_dict': result, "blocks_and_tuples_count": blocks_and_tuples_count})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/query3", methods=['POST'])
def run_sql_query_tuples_info():
    try:
        data = request.get_json()
        table = data["table"]
        block_id = data["block_id"]
        tuples_id = data["tuples_id"]
        # gives the tuples in a block
        tuples_as_string = "(" + tuples_id + ")"
        query = f"SELECT ctid,* FROM {table} WHERE (ctid::text::point)[0]={block_id}  AND (ctid::text::point)[1] in {tuples_as_string}  order by ctid ;"
        query_result, headers = DATABASE.execute_with_headers(query)
        result = []
        # gives the tuples that match the tuples accessed
        for x in query_result:
            result.append(x)
        return jsonify({'tuples': result, 'headers': headers, "count": len(result)})
    except Exception as e:
        return jsonify({'error': str(e)})
    


if __name__ == "__main__":
    DATABASE = Database()
    DATABASE.connect('tpc_h')
    app.run(port=8000,debug=DEVELOPMENT_ENV)
    DATABASE.close()