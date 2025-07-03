#!/usr/bin/env node

import chalk from "chalk";
import { exec, spawn } from "child_process";
import { program } from "commander";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const CONFIG_FILE = path.join(process.cwd(), "config.json");
const PID_FILE = path.join(process.cwd(), "surrealdb.pid");

function log(message, type = "info") {
  const types = {
    info: chalk.blue("ℹ"),
    success: chalk.green("✔"),
    warning: chalk.yellow("⚠"),
    error: chalk.red("✖"),
  };
  console.log(`${types[type]} ${message}`);
}

program.version("1.0.0").description("CLI for managing SurrealDB instances");

program
  .command("init")
  .description("Initialize a new SurrealDB instance")
  .action((options) => {
    checkIfRunning((isRunning) => {
      if (isRunning) {
        log(
          "SurrealDB is already running. Use start --force to start anyway.",
          "warning",
        );
        return;
      }

      const config = readConfig();
      const args = [
        "start",
        "-A",
        config.dataDir,
        "--user",
        config.username,
        "--pass",
        config.password,
      ];

      const surrealProcess = spawn("surreal", args, {
        detached: true,
        stdio: ["ignore", "ignore", "ignore"],
      });

      surrealProcess.unref();

      // Save the PID to a file
      fs.writeFileSync(PID_FILE, surrealProcess.pid.toString());

      log(
        `SurrealDB instance started with PID ${surrealProcess.pid}`,
        "success",
      );
    });
  });

program
  .command("start")
  .description("Start a SurrealDB instance")
  .option("-f, --force", "Force start even if an instance is already running")
  .action((options) => {
    checkIfRunning((isRunning) => {
      if (isRunning && !options.force) {
        log(
          "SurrealDB is already running. Use --force to start anyway.",
          "warning",
        );
        return;
      }

      const config = readConfig();
      const args = ["start", "-A", config.dataDir];

      const surrealProcess = spawn("surreal", args, {
        detached: true,
        stdio: ["ignore", "ignore", "ignore"],
      });

      surrealProcess.unref();

      // Save the PID to a file
      fs.writeFileSync(PID_FILE, surrealProcess.pid.toString());

      log(
        `SurrealDB instance started with PID ${surrealProcess.pid}`,
        "success",
      );
    });
  });

program
  .command("stop")
  .description("Stop the SurrealDB instance")
  .action(() => {
    checkIfRunning((isRunning, pid) => {
      if (isRunning) {
        try {
          process.kill(pid);
          fs.unlinkSync(PID_FILE);
          log("SurrealDB instance stopped", "success");
        } catch (error) {
          log(`Error stopping SurrealDB: ${error.message}`, "error");
        }
      } else {
        log("No running SurrealDB instance found", "warning");
      }
    });
  });

program
  .command("configure")
  .description("Configure SurrealDB instance settings")
  .option("-d, --data-dir <path>", "Set the data directory")
  .option("-u, --username <username>", "Set the username")
  .option("-p, --password <password>", "Set the password")
  .action((options) => {
    const config = readConfig();
    if (options.dataDir) config.dataDir = options.dataDir;
    if (options.username) config.username = options.username;
    if (options.password) config.password = options.password;

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    log("Configuration updated", "success");
  });

program
  .command("status")
  .description("Check the status of the SurrealDB instance")
  .action(() => {
    checkIfRunning((isRunning, pid) => {
      if (isRunning) {
        log(`SurrealDB is running (PID: ${pid})`, "success");
      } else {
        log("SurrealDB is not running", "info");
      }
    });
  });

function readConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {
      dataDir: process.env?.SURREAL_PATH ?? "./data",
      username: process.env?.SURREAL_USER ?? "root",
      password: process.env?.SURREAL_PASS ?? "root",
    };
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
}

function checkIfRunning(callback) {
  if (fs.existsSync(PID_FILE)) {
    const pid = parseInt(fs.readFileSync(PID_FILE, "utf8"));
    exec(`ps -p ${pid} -o comm=`, (error, stdout, stderr) => {
      if (error) {
        // Process not found
        fs.unlinkSync(PID_FILE);
        callback(false);
      } else {
        const processName = stdout.trim();
        if (processName.includes("surreal")) {
          callback(true, pid);
        } else {
          log(
            `Found process (PID: ${pid}) is not a SurrealDB instance. Cleaning up.`,
            "warning",
          );
          fs.unlinkSync(PID_FILE);
          callback(false);
        }
      }
    });
  } else {
    callback(false);
  }
}

program.on("--help", () => {
  console.log("");
  console.log("Examples:");
  console.log("  $ surrealdb-cli start");
  console.log("  $ surrealdb-cli stop");
  console.log(
    "  $ surrealdb-cli configure -d ./my-data -u myuser -p mypassword",
  );
  console.log("  $ surrealdb-cli status");
});

program.parse(process.argv);

// If no arguments, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
