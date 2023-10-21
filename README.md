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
CREATE ROLE db_user WITH LOGIN PASSWORD 'db_password';
ALTER ROLE db_user CREATEDB;

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
