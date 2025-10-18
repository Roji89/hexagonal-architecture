-- Create test database
CREATE DATABASE hexagonal_app_test;

-- Grant permissions to the user for both databases
GRANT ALL PRIVILEGES ON DATABASE hexagonal_app_dev TO hexagonal_user;
GRANT ALL PRIVILEGES ON DATABASE hexagonal_app_test TO hexagonal_user;

-- Switch to main database and create extensions
\c hexagonal_app_dev;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Switch to test database and create extensions
\c hexagonal_app_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create schemas if needed (optional)
\c hexagonal_app_dev;
CREATE SCHEMA IF NOT EXISTS public;

\c hexagonal_app_test;
CREATE SCHEMA IF NOT EXISTS public;