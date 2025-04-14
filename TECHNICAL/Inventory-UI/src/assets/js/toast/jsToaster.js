function showJSToaster(title, message, icon) {
    $.NotificationApp.send(title, message, "top-right", "rgba(0,0,0,0.2)", icon)
};
