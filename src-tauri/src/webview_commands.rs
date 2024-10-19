use std::fs;

use crate::{command_channel::send_string, startup};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
pub fn get_file(name: &str) -> String {
    let full_path = startup::get_shelp_dir().join(name);
    println!("Sending file '{}' to web view", full_path.display());
    match fs::read_to_string(full_path) {
        Ok(content) => content,
        Err(_error) => "".to_string(),
    }
}

#[tauri::command]
pub fn write_file(name: &str, data: &str) {
    let full_path = startup::get_shelp_dir().join(name);
    let path_str = full_path.display();
    match fs::write(full_path.clone(), data) {
        Ok(_) => println!("Wrote to file '{}'", path_str),
        Err(error) => println!("ERROR: fs::write '{}' got error '{}'", path_str, error),
    }
}

#[tauri::command]
pub fn send_response(data: &str) {
    match send_string(data.to_string()) {
        Ok(()) => println!("send_response sent '{}' to channel", data),
        Err(error) => println!("ERROR: send_response got error '{}'", error),
    }
}
