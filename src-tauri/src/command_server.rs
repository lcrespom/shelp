use std::thread;
use tauri::{Emitter, Manager};
use tiny_http::{Response, Server};

const SERVER_ADDRESS: &str = "127.0.0.1:7878";

pub fn setup_http_server(app: &mut tauri::App) {
    // Get the main window
    let main_window = app.get_webview_window("main").unwrap();
    // Spin up a separate thread to run the HTTP server
    thread::spawn(move || {
        let server = Server::http(SERVER_ADDRESS).unwrap();
        println!("Server listening in {}", SERVER_ADDRESS);
        for request in server.incoming_requests() {
            let url = request.url();
            println!("Got request: {}", url);
            let response = if url.starts_with("/_") {
                handle_back_end_command(url)
            } else {
                handle_front_end_command(url)
            };
            // Send the event to the Tauri webview
            main_window.emit("tash-command", url).unwrap();
            // Respond to the HTTP request
            let response = Response::from_string(response);
            request.respond(response).unwrap();
        }
    });
}

fn handle_back_end_command(_url: &str) -> &str {
    println!("Back end command");
    "Command handled by Tauri back end\n"
}

fn handle_front_end_command(_url: &str) -> &str {
    println!("Front end command");
    "Command sent to Tauri webview\n"
}
