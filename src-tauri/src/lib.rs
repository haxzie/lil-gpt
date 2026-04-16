use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(target_os = "macos")]
fn setup_traffic_lights(app: &tauri::App) {
    use cocoa::appkit::{NSWindow, NSWindowButton, NSWindowTitleVisibility};
    use cocoa::base::{id, nil, NO, YES};
    use cocoa::foundation::NSString;
    use objc::{class, msg_send, sel, sel_impl};

    let window = app.get_webview_window("main").unwrap();
    let ns_window: id = window.ns_window().unwrap() as id;

    unsafe {
        // Make titlebar transparent so it blends with our UI
        ns_window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
        ns_window.setTitlebarAppearsTransparent_(YES);

        // Add an invisible toolbar to expand the titlebar height (~52px)
        let toolbar_id = NSString::alloc(nil).init_str("main-toolbar");
        let toolbar: id = msg_send![class!(NSToolbar), alloc];
        let toolbar: id = msg_send![toolbar, initWithIdentifier: toolbar_id];
        let _: () = msg_send![toolbar, setShowsBaselineSeparator: NO];
        let _: () = msg_send![ns_window, setToolbar: toolbar];

        // Now reposition the traffic lights to be vertically centered in our 48px TopBar
        // The titlebar container is now ~52px (flipped coords, y=0 at top)
        // Traffic light buttons are ~12px tall, center in 48px: y = (48 - 12) / 2 = 18
        let close: id = ns_window.standardWindowButton_(NSWindowButton::NSWindowCloseButton);
        let minimize: id = ns_window.standardWindowButton_(NSWindowButton::NSWindowMiniaturizeButton);
        let zoom: id = ns_window.standardWindowButton_(NSWindowButton::NSWindowZoomButton);

        let buttons = [close, minimize, zoom];
        let x_start: f64 = 16.0;
        let x_spacing: f64 = 20.0;

        for (i, button) in buttons.iter().enumerate() {
            let superview: id = msg_send![*button, superview];
            let superview_frame: cocoa::foundation::NSRect = msg_send![superview, frame];
            let button_frame: cocoa::foundation::NSRect = msg_send![*button, frame];

            // Position in 48px CSS topbar (flipped coords: y from top)
            let y_pos = (48.0 - button_frame.size.height) / 2.0 - 10.0;
            let x_pos = x_start + (i as f64) * x_spacing;

            let origin = cocoa::foundation::NSPoint::new(x_pos, y_pos);
            let _: () = msg_send![*button, setFrameOrigin: origin];
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            setup_traffic_lights(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
