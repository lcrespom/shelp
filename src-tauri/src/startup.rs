use std::fs;
use std::path::{Path, PathBuf};

const SHELP_HOME: &str = ".shelp";

pub fn check_first_use() {
    create_shelp_directory();
}

pub fn get_shelp_dir() -> PathBuf {
    let home_dir = dirs::home_dir().unwrap();
    home_dir.join(SHELP_HOME)
}

pub fn get_server_address() -> String {
    let mut port = "5431";
    let full_path = get_shelp_dir().join("shelp.zsh");
    let zsh = fs::read_to_string(full_path).unwrap_or("SHELP_PORT=5431".to_string());
    let lines: Vec<&str> = zsh.lines().collect();
    for line in lines {
        if line.starts_with("SHELP_PORT=") {
            port = line.splitn(2, '=').nth(1).unwrap();
            break;
        }
    }
    "127.0.0.1:".to_owned() + port
}

fn create_shelp_directory() -> bool {
    // Get the .shelp directory path
    let shelp_dir = get_shelp_dir();
    // Check if the directory exists
    if !Path::new(&shelp_dir).exists() {
        // Create the directory
        match fs::create_dir(&shelp_dir) {
            Ok(_) => {
                println!(
                    "Welcome to SHelp.\nDirectory {} created successfully.",
                    SHELP_HOME
                );
                true
            }
            Err(e) => {
                eprintln!("Failed to create {} directory: {}", SHELP_HOME, e);
                false
            }
        }
    } else {
        println!("Welcome back to SHelp.");
        false
    }
}
