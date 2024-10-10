use std::thread;
use tauri::{Emitter, Manager};
use tiny_http::{Response, Server};

const SERVER_ADDRESS: &str = "127.0.0.1:7878";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn setup_http_server(app: &mut tauri::App) {
    // Get the main window
    let main_window = app.get_webview_window("main").unwrap();
    // Spin up a separate thread to run the HTTP server
    thread::spawn(move || {
        let server = Server::http(SERVER_ADDRESS).unwrap();
        println!("Server listening in {}", SERVER_ADDRESS);
        for request in server.incoming_requests() {
            println!("Got request: {}", request.url());
            //let message = format!("Message from HTTP request: {}", request.url().);
            // Send the event to the Tauri webview
            main_window.emit("tash-command", request.url()).unwrap();
            // Respond to the HTTP request
            let response = Response::from_string("Event sent to Tauri webview");
            request.respond(response).unwrap();
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            setup_http_server(app);
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
