# ToDo

- Rust
  - [x] Frist time use (if .shelp directory does not exist)
  - [x] Configuration: CSS and settings
    - [ ] Enable/disable fuzzy search
  - [ ] Extensibility
    - [ ] New routes / UIs
  - [ ] Eventually get rid of dependencies
    - [x] Get/set window focus in Rust to get rid of `osascript`
      - [x] Using `autopilot` crate to simulate Cmd+Tab press
            (Notice it will not work for the rare users that have reassigned the
            application switcher to a different key combination).
    - [ ] Use shelp to talk to itself to get rid of `curl` and `python3`
    - [ ] Reduce `shelp.zsh` to a minimum
    - [ ] Global key listener in Rust to even get rid of zsh "bindkey"
    - [x] Support all Unix environments: MacOS, Linux and WSL.
      - [x] Test in Windows WSL (Ubuntu)
      - [x] Test in Linux (Ubuntu)
    - [ ] Support even Windows cmd / PowerShell
    - [x] Get directory contents in Rust to avoid the loop in zsh and improve responsiveness
  - [ ] Dock shelp in menu bar
  - [ ] Hide the app icon from the alt-tab sequence (skipTaskbar is not available in Mac)
- React
  - [x] Startup
  - [x] Cool CSS
  - [x] SearchList: multi-search, multi-highlight
  - [x] Avoid flash of white when starting up with light mode and switching to dark mode
  - [x] Routes
    - [x] Welcome / home page
    - [x] Dirhistory route
    - [x] History
    - [x] Tab completion
  - [ ] Keyboard shortcut to toggle fuzzy search
  - [ ] Code refactor / make React part more canonical (eventually)
- zsh
  - [x] Dirhistory
  - [x] History
  - [x] Home / end
  - [x] File Search
    - [x] Do not show size of directories
  - [x] Shift-up => cd to parent directory
  - [x] Esc => clear line
  - [x] Test with oh-my-zsh (to enjoy nice prompt, syntax higlight, autocomplete...)
  - [x] Test from VSCode terminal
    - [x] Set focus back works after simulating Cmd+Tab with autopilot
    - [x] PageUp / PageDown not detected by VSCode terminal, but the history_popup and
          dir_history_popup widgets can be bound to other keys that are captured by VSCode
          terminal, such as "^F".
  - [ ] Detect when user hits ctrl+c and clean shelp queue
  - [ ] Shift-down => cd to previous directory in dirhistory
        Low priority, can be implemented with PageDown + Return
- Documentation
  - [x] README.md
    - [x] Installation
    - [x] Usage
    - [ ] Development / contribution
  - [ ] Brief guide in app welcome page
  - [ ] Custom app icon
  - [x] Create a proper dmg and publish it in GitHub
