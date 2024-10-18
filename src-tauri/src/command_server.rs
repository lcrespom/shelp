use serde::Serialize;
use std::thread;
use tauri::{Emitter, Manager, WebviewWindow};
use tiny_http::{Method, Response, Server};

use crate::command_channel::{clear_queue, receive_string};

const SERVER_ADDRESS: &str = "127.0.0.1:5431";

pub fn setup_http_server(app: &mut tauri::App) {
    // Get the main window
    let main_window = app.get_webview_window("main").unwrap();
    // Spin up a separate thread to run the HTTP server
    thread::spawn(move || {
        let server = Server::http(SERVER_ADDRESS).unwrap();
        println!("Server listening in {}", SERVER_ADDRESS);
        for mut request in server.incoming_requests() {
            let url = request.url().to_string();
            println!("Got request: {}", url);
            let mut body = String::new();
            if *request.method() == Method::Post {
                request.as_reader().read_to_string(&mut body).unwrap();
            } else {
                body = "".to_string();
            };
            clear_queue();
            if url.starts_with("/_") {
                let response = handle_back_end_command(&url[2..], &body);
                request.respond(Response::from_string(response)).unwrap();
            } else {
                handle_front_end_command(&url, &body, &main_window);
                println!("Waiting for channel message...");
                let response = receive_string().unwrap();
                println!("Got channel message: {}", response);
                request.respond(Response::from_string(response)).unwrap();
            }
        }
    });
}

fn handle_back_end_command(command: &str, _body: &str) -> &'static str {
    println!("Back end command: {}", command);
    let parts: Vec<&str> = command.split(':').collect();
    let verb = parts.get(0).unwrap();
    let params = parts.get(1..).unwrap();
    println!("Verb: {}, params: {:?}", verb, params);
    match *verb {
        _ => println!("Unknown command"),
    }
    "Command handled by Tauri back end\n"
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct CommandPayload<'a> {
    url: &'a str,
    body: &'a str,
}

fn handle_front_end_command(url: &str, body: &str, window: &WebviewWindow) -> &'static str {
    println!("Front end command: {}", url);
    window
        .emit("shelp-command", CommandPayload { url, body })
        .unwrap();
    "Command sent to Tauri webview\n"
}
