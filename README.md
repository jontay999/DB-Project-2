# DB-Project-2

## Source files `/src/`

- `explore.py`: contains the code for facilitating the exploration
- `interface.py`: GUI Code
- `project.py`: main file that invokes all the necessary procedure

## Quick Start:

```bash
pip3 install -r requirements.txt
cd src/
python3 project.py
```

## Python Setup

- To ensure no versioning issues, we use a python virtual environment

```bash
python3 -m install virtualenv
virtualenv db_proj
source /db_proj/bin/activate

pip install -r requirements.txt
```

### More setup instructions

#### MAC OSX (sry grace you settle windows yourself)

Install Postgres

```bash
# INSTALL POSTGRES
brew install postgresql

# Verify Installation
psql --version

# TO BEGIN
brew services start postgresql

# to begin interactive session
psql postgres

# TO END
brew services stop postgresql
```

```sql
-- SET UP YOUR USER AND PASSWORD
CREATE ROLE postgres WITH LOGIN PASSWORD 'db_password';
ALTER ROLE postgres CREATEDB;

-- To view users and privileges, RUN THIS
\du
```

If you prefer web-based GUI, can download [pgAdmin4](https://www.pgadmin.org/) and login with

```
host – 'localhost'
user – '<your-db-user>'
password – '<your-db-pw>'
maintenance database – 'postgres'
```

### Data Generation (MacOS)

1. Follow setup instructions [here](https://github.com/gregrahn/tpch-kit/blob/master/README.md)
2. `cd` into the `dbgen` folder and run `./dbgen` (make sure you specify your environment variable of output folder)
3. (You don't have to remove trailing delimiters as this is done already)
4. Run `ls | sed 's/^\(.*\)\.tbl$/mv "\1.tbl" "\1.csv"/' | sh` to rename all the `.tbl` to `.csv`

With regard to actually loading in the data, I wanted to explore these various optimization techniques, but I think the most convenient is just to use `pgAdmin4`. If you want to try to script it, you can take a look at [https://hakibenita.com/fast-load-data-python-postgresql](https://hakibenita.com/fast-load-data-python-postgresql)

### Things to take note of

- `postgres` only allows LOWERCASE table names

Handy cheatsheet of postgres commands

- `\l` : show all databases
- `\dt`: show all tables
- `\du`: show all users
- `\password`: change password
- `psql postgres -U <user>`: login as specific user (bash)
