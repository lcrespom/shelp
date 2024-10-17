use once_cell::sync::Lazy;
use std::sync::{mpsc, Arc, Mutex};

pub struct Channel {
    sender: mpsc::Sender<String>,
    receiver: Arc<Mutex<mpsc::Receiver<String>>>, // Wrap Receiver in Arc<Mutex>
}

// Initialize a global channel instance
static CHANNEL: Lazy<Channel> = Lazy::new(|| {
    let (sender, receiver) = mpsc::channel();
    Channel {
        sender,
        receiver: Arc::new(Mutex::new(receiver)), // Use Arc to share the Mutex
    }
});

// Function to send a value to the channel
pub fn send_string(value: String) -> Result<(), String> {
    CHANNEL.sender.send(value).map_err(|e| e.to_string())
}

// Function to receive a value from the channel (blocking)
pub fn receive_string() -> Result<String, String> {
    // Lock the Mutex to access the Receiver
    let receiver = CHANNEL.receiver.lock().unwrap();
    // Call recv() blocks until a message is available
    receiver.recv().map_err(|e| e.to_string())
}
