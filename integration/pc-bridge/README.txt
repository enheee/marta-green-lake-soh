A32 Control — rooms, scenes, schedules

Close the old server console, then double-click start.bat. Keep the console open.
The browser opens at http://127.0.0.1:8765/. Use Ctrl+F5 after an update.

32 channels begin with generic names, grouped into Room 1–4.
Use the pencil on each channel to rename it or change its room.
Edit room names or add rooms from the sidebar.

Away turns all 32 relays OFF when explicitly run.
Home and Sleep are empty templates: choose relay actions before running.
Unselected relays are unchanged. Saving settings does not execute a scene.

One disabled 22:00 schedule example is included. New schedules start disabled.
Choose a configured scene, time, weekdays, then enable explicitly.
Schedules use the PC clock and run only while this PC and its server are running.
They do not run when the PC is off/asleep or the server console is closed.
Missed times are not replayed; failed scenes are not automatically retried.

Controller: 192.168.68.108, KCS v3.27.2. HTTP control enabled.
../a32-controller-config.json stores the IP and HTTP secret outside the public folder.
../a32-automation.json stores rooms, scenes, schedules and events after the first save.
The IP is loaded on each command; changing the config does not require a restart.

Validation: 10 backend tests passed with a simulated controller; JavaScript syntax passed.
No physical relay was operated during this development.
Automated visual preview was unavailable in this execution environment.
