

import psycopg2
from dotenv import load_dotenv
import os
from db_util import parse_explain, tree_representation, summary_representation


# Load environment variables, otherwise use defaults
if os.path.exists('.env'):
    load_dotenv()


TABLE_FOLDER = "./sql_setup/"
TABLE_FILES = ["region.sql", "nation.sql", "part.sql", "supplier.sql", "partsupp.sql", "customer.sql", "order.sql", "lineitem.sql"]


# Load Sample Queries for TESTING
def load_queries():
    QUERY_FOLDER = './data/queries/'
    queries = []
    for filename in os.listdir(QUERY_FOLDER):
        file_path = os.path.join(QUERY_FOLDER, filename)
        if not os.path.isfile(file_path): continue
        with open(file_path, "r") as f:
            query = f.read()
            queries.append(query)
    return queries


# Database Object to interface with PostgreSQL db
class Database:
    # Maintain singleton design pattern with static variable
    _instance_exists = False
    _created_tables = False

    def __init__(self):
        if self._instance_exists: raise Exception("Only one instance allowed!")
        self._instance_exists = True
        load_dotenv()
        self.db_user = os.getenv('DB_USER', 'postgres')
        self.db_password = os.getenv('DB_PASSWORD', 'db_password')
        self.db_host = os.getenv('DB_HOST', 'localhost')
        self.db_port = os.getenv('DB_PORT', 5432)
        self.connection = None
    
    def is_connected(self):
        return self.connection != None

    def connect(self, table_name, read_only=True):
        if self.connection != None: raise Exception("Connection already exists!")
        connection = psycopg2.connect(
            database=table_name, 
            user=self.db_user, 
            password=self.db_password, 
            host=self.db_host, 
            port=self.db_port
        )
        connection.set_session(readonly=read_only, autocommit=True)
        print("Connected to:", table_name)
        self.connection = connection

    def execute(self, query, needs_output=True):
        assert self.is_connected(), "Connection does not exist!"
        result = None
        with self.connection.cursor() as cursor:
            cursor = self.connection.cursor()
            cursor.execute(query)
            if needs_output:
                result = cursor.fetchall()
        
        if needs_output: return result
    
    def execute_with_headers(self, query, needs_output=True):
        assert self.is_connected(), "Connection does not exist!"
        result = None
        with self.connection.cursor() as cursor:
            cursor = self.connection.cursor()
            cursor.execute(query)
            if needs_output:
                result = cursor.fetchall()
                headers = [desc[0] for desc in cursor.description]
        
        if needs_output: return result, headers

    def close(self):
        if self.connection == None: raise Exception("Connection does not exist!")
        self.connection.close()
        self.connection = None

    # Only to be run if tables do not exist
    def create_tables(self, base_db_name, new_db_name):
        self.connect(base_db_name, False)
        self.execute(f"CREATE DATABASE {new_db_name};", False)
        self.execute("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user")
        print(f"Created database: {new_db_name}")

        self.close()

        self.connect(new_db_name, False)
        for file in TABLE_FILES:
            with open(f"{TABLE_FOLDER}/{file}") as f:
                cmd = f.read()
                self.execute(cmd, False)
            print(f"{file} has been created")
        print("All tables created")
        self.close()

# Ensure parsing works for a set of sample queries
def run_tests(db):
    try:
        all_queries = load_queries()
        for query in all_queries:
            result = db.execute("EXPLAIN (analyse, buffers) " + query)
            parsed_nodes = parse_explain(result)
            tree_rep = tree_representation(parsed_nodes)
            summary_rep = summary_representation(tree_rep)
        return True
    except Exception:
        return False
    

# Run this file directly to test connection
if __name__ == "__main__":
    print("Running db.py!")
    db = Database()
    db.connect(os.getenv('DATABASE_NAME', 'TPC-H'))
    assert run_tests(db)
    db.close()


