# SurrealDB Control Center

A command-line interface for managing SurrealDB instances. This CLI allows you to initialize, start, stop, configure, and check the status of SurrealDB databases.

## Features

- Initialize a new SurrealDB database
- Start and stop SurrealDB instances
- Configure database settings
- Check the status of running instances
- Colored output for better readability
- Background process management

## Installation

1. Clone this repository:
   ```
   git clone https://codeberg.org/daviddyess/surrealctl.git
   cd surrealdb-cli
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. (Optional) Make the CLI executable:
   ```
   chmod +x index.js
   ```

4. (Optional) Link the CLI to use it globally:
   ```
   npm link
   ```

## Configuration

The CLI uses a `config.json` file for configuration. If this file doesn't exist, it will check for the following environment variables:

- `SURREAL_PATH`: The data directory for SurrealDB
- `SURREAL_USER`: The username for database access
- `SURREAL_PASS`: The password for database access

You can create a `config.json` file manually or use the `configure` command to set these values.

### Configuration File

`config.json`:

```json
{
  "dataDir": "./data",
  "username": "root",
  "password": "root"
}
```

## Commands

- `init`: Initialize a new SurrealDB database
- `start`: Start a SurrealDB instance
- `stop`: Stop the running SurrealDB instance
- `configure`: Update configuration settings
- `status`: Check the status of the SurrealDB instance

Use `npm run help` or `./index.js --help` for more information on available commands and options.

## Usage

### Initialize a new database

```
npm run init
```

or

```
./index.js init
```

This command creates a new SurrealDB database using the configured settings.

### Start the database

```
npm start
```

or

```
./index.js start
```

Starts the SurrealDB instance in the background.

### Stop the database

```
npm stop
```

or

```
./index.js stop
```

Stops the running SurrealDB instance.

### Configure settings

```
npm configure -- -d ./my-data -u myuser -p mypassword
```

or

```
./index.js configure -d ./my-data -u myuser -p mypassword
```

Updates the configuration with new settings.

### Check status

```
npm run status
```

or

```
./index.js status
```

Displays the current status of the SurrealDB instance.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
