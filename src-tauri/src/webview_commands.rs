use std::fs;
use std::fs::DirEntry;
use std::io;
use std::os::unix::fs::PermissionsExt;

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
pub fn get_dir(data: &str) -> String {
    match get_dir_lines(data) {
        Ok(lines) => lines,
        Err(_error) => String::new(),
    }
}

#[tauri::command]
pub fn send_response(data: &str) {
    match send_string(data.to_string()) {
        Ok(()) => println!("send_response sent '{}' to channel", data),
        Err(error) => println!("ERROR: send_response got error '{}'", error),
    }
}

// ------------------------- Helpers -------------------------

fn get_dir_lines(path: &str) -> io::Result<String> {
    let mut lines = String::new();
    for entry in fs::read_dir(path)? {
        let entry = entry?;
        lines.push_str(&get_permissions(&entry).unwrap_or("----------".to_string()));
        lines.push(' ');
        lines.push_str(&entry.file_name().to_string_lossy());
        lines.push('\n');
    }
    Ok(lines)
}

fn get_permissions(entry: &DirEntry) -> io::Result<String> {
    let mut str_perms = String::new();
    let dirch = if entry.metadata()?.is_dir() { 'd' } else { '-' };
    str_perms.push(dirch);
    let perms = entry.metadata()?.permissions();
    str_perms.push_str(&to_rwx(perms.mode()));
    Ok(str_perms)
}

fn to_rwx(perms: u32) -> String {
    (0..9)
        .rev()
        .map(|i| match (perms >> i) & 1 {
            1 => "xwr".chars().nth(i % 3).unwrap(),
            _ => '-',
        })
        .collect()
}
