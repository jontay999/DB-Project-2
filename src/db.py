import psycopg2
from dotenv import load_dotenv
import os

class Database:
    # Maintain singleton design pattern with static variable
    _instance_exists = False

    def __init__(self):
        if self._instance_exists: raise Exception("Only one instance allowed!")
        self._instance_exists = True
        load_dotenv()
        self.db_user = os.getenv('DB_USER', 'db_user')
        self.db_password = os.getenv('DB_PASSWORD', 'db_password')
        self.db_host = os.getenv('DB_HOST', 'localhost')
        self.db_port = os.getenv('DB_PORT', 5432)
        self.connection = None
    
    def is_connected(self):
        return self.connection != None

    def connect(self, table_name):
        if self.connection != None: raise Exception("Connection already exists!")
        connection = psycopg2.connect(
            database=table_name, 
            user=self.db_user, 
            password=self.db_password, 
            host=self.db_host, 
            port=self.db_port
        )
        connection.set_session(readonly=True, autocommit=True)
        self.connection = connection

    def execute(self, query):
        assert self.is_connected(), "Connection does not exist!"
        cursor = self.connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        return rows

    def close(self):
        if self.connection == None: raise Exception("Connection does not exist!")
        self.connection.close()


if __name__ == "__main__":
    print("Running db.py! What do you think you're doing ....")