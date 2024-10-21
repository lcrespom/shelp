# ------------------------- Configuration -------------------------
SHELP_PORT=5431                             # TODO: implement in rust
SHELP_ALWAYS_ON_TOP=false                   # TODO: implement in JavaScript
SHELP_THEME="dark"                          # TODO: implement in JavaScript
SHELP_WINDOW_BOUNDS="800x600 -100 -100"     # TODO: implement in JavaScript
SHELP_HOST="localhost:$SHELP_PORT"
SHELP_MAX_HISTORY_LINES=500

# Key codes
KB_PAGE_UP="^[[5~"
KB_PAGE_DOWN="^[[6~"
KB_HOME="^[[H"
KB_END="^[[F"


# Get the name of the terminal application, to set focus later
TERMAPP=$(osascript -e 'tell application "System Events" to get the name of the first application process whose frontmost is true')

# Give focus back to terminal
function focus_term() {
    osascript -e "tell application \"$TERMAPP\" to activate"
}

# Record every time the user changes directory
function chpwd() {
    enc_dir=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$PWD'))")
    curl -s -o /dev/null "$SHELP_HOST/chpwd?dir=$enc_dir"
}

# Open shelp popup in the dir history page
function dir_history_popup() {
    new_dir=$(curl -s "$SHELP_HOST/dirHistory")
    if [[ -n "$new_dir" ]]; then
        cd $new_dir
        zle reset-prompt
    fi
    focus_term
}

# Open shelp popup in the history page
function history_popup() {
    enc_buffer=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$BUFFER'))")
    history_command=$(history -n -$SHELP_MAX_HISTORY_LINES | \
        curl -s -X POST --data-binary @- "$SHELP_HOST/history?filter=$enc_buffer")
    if [[ -n "$history_command" ]]; then
        LBUFFER="$history_command"
        RBUFFER=""
    fi
    focus_term
}

# Register the functions as widgets
zle -N dir_history_popup
zle -N history_popup

# Bind the key to the widget
bindkey $KB_PAGE_DOWN dir_history_popup
bindkey $KB_PAGE_UP history_popup

# Bind home and end keys for convenience
bindkey $KB_HOME beginning-of-line
bindkey $KB_END end-of-line
