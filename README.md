# Shelp

A shell helper popup.

## ToDo

- Rust
  - [ ] Frist time use (if .shelp directory does not exist)
    - [x] Create ~/.shelp directory
    - [ ] Write shelp.zsh in ~/.shelp
    - [ ] Emit instructions in console, show welcome URL
  - [ ] Configuration
    - [ ] HTTP Port (through env variable)
    - [ ] CSS file
  - [ ] Extensibility
    - [ ] New routes / UIs
    - [ ] Global hotkeys
- React
  - [ ] Startup
    - [ ] Receive initial configuration from rust
    - [ ] Set window size and position
  - [x] Show / Hide window
  - [x] Refresh window on show
  - [x] Install router
  - [x] Install CSS library (Tailwind CSS)
  - [ ] Cool CSS:
    - [ ] Monokai for dark mode theme
    - [ ] Some light vs code theme
    - [ ] Configuration support to force the dark theme
  - [x] Welcome / home page
  - [x] Dirhistory route
    - [x] Page up / down
    - [x] Scroll to make selected item visible
    - [x] Write .dirHistory when user changes directory
  - [ ] History
  - [ ] Tab completion
- zsh
  - [ ] Dirhistory
    - [x] chpwd
    - [x] PgDown: open window on dirhistory route
    - [x] Set focus back to terminal
  - [ ] History
  - [ ] Tab completion
  - [x] Home / end
  - [ ] Test with oh-my-zsh
- Documentation
  - [ ] This readme
    - [ ] Installation
    - [ ] Development / contribution
  - [ ] User manual in HTML

## zsh setup examples

```zsh
# Key binding constants
PAGE_UP="^[[5~"
PAGE_DOWN="^[[6~"

# Define the function widget
function run_on_page_up() {
  echo "Page Up pressed"
  # Current buffer is in $BUFFER
  # $LBUFFER contains text left of cursor, $RBUFFER contains text right of cursor
}

# Register the function as a widget
zle -N run_on_page_up

# Bind the key to the widget
bindkey $PAGE_UP run_on_page_up


# #----- Predefined lifecycle functions -----
# Called every time a directory changes
chpwd() {
  echo "Current directory: $PWD"
}

# # Called before executing any command, $1 contains the whole command line
preexec() {
  echo "$(date): Running command: $1" >> ~/command_log.txt
}

# Called after executing any command, but before displaying the prompt
precmd() {
  echo "Last command exit status: $?"
}

#----- Other useful info -----
# Get the current terminal window bounds (Mac only):
BOUNDS=$(osascript -e 'tell application (path to frontmost application as text) to get bounds of front window')
# $BOUNDS will contain "x1, y1, x2, y2" bounds, e.g. "1502, 25, 3008, 1692"

# Handle tab auto-completion
bindkey "^I" custom_tab_function  # ^I is the representation of the Tab key in zsh
# Disable default tab completion
unsetopt complete_in_word
```

## Setting focus back to the terminal (MacOS only)

### Step 1: get the name of the terminal program

```zsh
TERMAPP=$(osascript -e 'tell application "System Events" to get the name of the first application process whose frontmost is true')
```

### Step 2: set focus back to the terminal application

```zsh
osascript -e "tell application \"$TERMAPP\" to activate"
```
