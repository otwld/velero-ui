// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager};
use std::process::{Command, Stdio};
use std::env;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            let is_dev = env::var("TAURI_ENV_DEBUG").unwrap_or_default() == "true";

            if !is_dev {
                Command::new("node")
                    .args(["../../dist/apps/velero-ui-api/main.js"])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .spawn()
                    .expect("failed to start backend");
            } else {
                println!("🧪 Tauri dev mode — backend NestJS ignored!");
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
