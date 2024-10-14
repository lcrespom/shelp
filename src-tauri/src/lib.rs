mod command_server;
mod startup;
mod webview_commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    startup::check_first_use();
    tauri::Builder::default()
        .setup(|app| {
            command_server::setup_http_server(app);
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![webview_commands::greet])
        .invoke_handler(tauri::generate_handler![webview_commands::get_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
