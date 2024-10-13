use std::thread;
use tauri::{Emitter, Manager, WebviewWindow};
use tiny_http::{Response, Server};

const SERVER_ADDRESS: &str = "127.0.0.1:5431";

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
                handle_back_end_command(&url[2..])
            } else {
                handle_front_end_command(url, &main_window)
            };
            // Respond to the HTTP request
            let response = Response::from_string(response);
            request.respond(response).unwrap();
        }
    });
}

fn handle_back_end_command(command: &str) -> &str {
    println!("Back end command: {}", command);
    let parts: Vec<&str> = command.split(':').collect();
    let verb = parts.get(0).unwrap();
    let params = parts.get(1..).unwrap();
    println!("Verb: {}, params: {:?}", verb, params);
    match *verb {
        //"chpwd" => chpwd(params[0]),
        _ => println!("Unknown command"),
    }
    "Command handled by Tauri back end\n"
}

fn handle_front_end_command(url: &str, window: &WebviewWindow) -> &'static str {
    println!("Front end command: {}", url);
    // Send the event to the Tauri webview
    window.emit("tash-command", url).unwrap();
    "Command sent to Tauri webview\n"
}
