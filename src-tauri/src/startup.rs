use std::fs;
use std::path::Path;

const SHELP_HOME: &str = ".shelp";

pub fn check_first_use() {
    if create_shelp_directory() {
        //TODO write shelp.zsh file
    }
}

fn create_shelp_directory() -> bool {
    // Get the home directory
    if let Some(home_dir) = dirs::home_dir() {
        // Create the .shelp directory path
        let shelp_dir = home_dir.join(SHELP_HOME);

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
    } else {
        eprintln!("Could not determine home directory.");
        false //TODO panic
    }
}
