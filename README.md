# Usage Guide - Windows [psycopg2]

## Setting up the Environment & Running the GUI Application

1. Clone the git repo. <br/>
   `git clone https://github.com/jontay999/DB-Project-2.git`
2. Open a new terminal and cd into the cloned repository.
3. Start virtual environment. <br/>
   `python3 -m pip install virtualenv` <br/>
   `virtualenv db_proj` <br/>
   `./db_proj/bin/activate`
4. Install all python libraries used in our project.<br/>
   `python3 -m pip install -r requirements.txt`
5. Pip install psycopg2, if pip install failed for psycopg2, proceed to Annex B (in our report).<br/>
   `python3 -m pip install -r psycopg2`
6. If PostgreSQL, pgAdmin4 and the TPC-H database have NOT been set up, continue to step 7. If they have been set up, skip to step 10.
7. Install PostgreSQL from the website (version 14.10).
8. Open pgAdmin4 and ensure the server is running.
9. Ensure the database TPC-H is set up and populated with data. (refer to annex A in project description).
10. Open the .env file which is saved at /src/directory and update the components according to your required configuration.

```bash
DB_USER=postgres
DB_PASSWORD=db_password
DB_HOST=localhost
DB_PORT=5432
DATABASE_NAME=TPC_H
```

11. Save the `.env` file and run the project.py file.
    `python3 project.py`
12. Open the resultant IP address in a browser.
    `http://127.0.0.1:8000`
