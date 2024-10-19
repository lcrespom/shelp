# Key codes
KB_PAGE_UP="^[[5~"
KB_PAGE_DOWN="^[[6~"
KB_HOME="^[[H"
KB_END="^[[F"

# shelp command server address
SHELP_HOST="localhost:5431"
MAX_HISTORY_LINES=500

# Get the name of the terminal application, to set focus later
TERMAPP=$(osascript -e 'tell application "System Events" to get the name of the first application process whose frontmost is true')

# Give focus back to terminal
function focus_term() {
    osascript -e "tell application \"$TERMAPP\" to activate"
}

# Record every time the user changes directory
function chpwd() {
    curl -s -o /dev/null "127.0.0.1:5431/chpwd?dir=$PWD"
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
    history_command=$(history -n -$MAX_HISTORY_LINES | curl -s -X POST --data-binary @- "$SHELP_HOST/history")
    if [[ -n "$history_command" ]]; then
        $LBUFFER="$history_command"
        $RBUFFER=""
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
