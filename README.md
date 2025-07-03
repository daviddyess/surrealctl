# SurrealDB Control Center

A command-line interface for managing SurrealDB instances. This CLI allows you to initialize, start, stop, configure, and check the status of SurrealDB databases.

## Features

- Initialize a new SurrealDB database
- Start and stop SurrealDB instances
- Configure database settings
- Check the status of running instances
- Background process management

## Installation

### Dependency

```
npm install surrealctl --save-dev
```

### Standalone / CLI Only

```
npm install -g surrealctl
```

### Development

1. Clone this repository:
   ```
   git clone https://github.com/daviddyess/surrealctl.git
   cd surrealctl
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Configuration

The CLI uses a `config.json` file for configuration. If this file doesn't exist, it will check for the following environment variables:

- `SURREAL_PATH`: The full path to your database file, including the database file with .db extension. This will be created if it doesn't exist
- `SURREAL_USER`: The username for database access
- `SURREAL_PASS`: The password for database access

Adding these to your environment variables is preferred if you are using the module as a dependency.

You can create a `config.json` file manually or use the `configure` command to set these values, if you are using the CLI as a standalone tool.

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

All commands can be run with `npm run` if in the surrealctl project directory or directly with `npx surrealctl`.

## Usage

### Initialize a new database

```
npx surrealctl init
```

```
npm run init
```

This command creates a new SurrealDB database using the configured settings.

### Start the database

```
npx surrealctl start
```

```
npm start
```

Starts the SurrealDB instance in the background.

### Stop the database

```
npx surrealctl stop
```

```
npm stop
```

Stops the running SurrealDB instance.

### Configure settings

```
npx configure -- -d ./my-data -u myuser -p mypassword
```

```
npm configure -- -d ./my-data -u myuser -p mypassword
```

Updates the configuration with new settings.

### Check status

```
npx surrealctl status
```

```
npm run status
```

Displays the current status of the SurrealDB instance.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
