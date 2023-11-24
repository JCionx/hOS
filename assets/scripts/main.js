let open_apps = []
let recent_apps = []
let installed_apps = []
let installed_apps_title = []
let installed_apps_icon = []
let installed_apps_url = []
let installed_apps_tmp = []
let installed_apps_title_tmp = []
let installed_apps_icon_tmp = []
let installed_apps_url_tmp = []

let controlPanelOpen = false;

if (localStorage.getItem("installed_id") == '' || localStorage.getItem("installed_id") == null) {
	installed_apps_tmp = [];
} else {
	installed_apps_tmp = localStorage.getItem("installed_id").split(",");
	installed_apps_title_tmp = localStorage.getItem("installed_title").split(",");
	installed_apps_icon_tmp = localStorage.getItem("installed_icon").split(",");
	installed_apps_url_tmp = localStorage.getItem("installed_url").split(",");
}

for (var i = 0; i < installed_apps_tmp.length; i++) {
	installApp(installed_apps_tmp[i], installed_apps_title_tmp[i], installed_apps_icon_tmp[i], installed_apps_url_tmp[i], true);
}


// Install system Apps
if (!installed_apps.includes("sys.hos.camera")) {
	installApp("sys.hos.camera", "Camera", "assets/apps/camera/assets/icons/icon.png", "assets/apps/camera/index.html");
}
if (!installed_apps.includes("sys.hos.hbrowser")) {
	installApp("sys.hos.hbrowser", "hBrowser", "assets/apps/browser/assets/icons/icon.png", "assets/apps/browser/index.html");
}


let current_app = ""

function saveInstalledApps() {
	localStorage.setItem("installed_id", installed_apps);
	localStorage.setItem("installed_title", installed_apps_title);
	localStorage.setItem("installed_icon", installed_apps_icon);
	localStorage.setItem("installed_url", installed_apps_url);
}

function openApp(app_id, app_title, app_icon, app_url, app_arg) {
	closePanel();
	minimizeApp();
	if (open_apps.includes(app_id)) {
		// show app
		current_app = app_id;
		document.getElementById(app_id + "_app").style.display = "block";
		document.getElementById(current_app + "_app").classList.add("openAppAnimation");
		setTimeout(() => {
			document.getElementById(current_app + "_app").classList.remove("openAppAnimation");
		}, 300);
	} else {
		// start app
		open_apps.push(app_id);
		current_app = app_id;
		let default_app = document.getElementById("app");
		let cloned_app = default_app.cloneNode(true);
		cloned_app.setAttribute("id", app_id + "_app");
		let url = app_url;
		if ((app_arg != null) && (app_arg != '')) {
			url += "?";
			for (let key in app_arg) {
				if (app_arg.hasOwnProperty(key)) {
					url += key + '=' + encodeURIComponent(app_arg[key]) + '&';
				}
			}
			url = url.slice(0, -1);
		}
		console.log(url);
		cloned_app.setAttribute("src", url);
		document.body.appendChild(cloned_app);
		addToRecents(app_id, app_title, app_icon, app_url);
		cloned_app.classList.add("openAppAnimation");
		setTimeout(() => {
			cloned_app.classList.remove("openAppAnimation");
		}, 300);
	}
}

function minimizeApp() {
	if (controlPanelOpen) {
		closePanel();
	}
	if (current_app == "") {
		console.log("No app is open");
	} else {
		document.getElementById(current_app + "_app").classList.add("closeAppAnimation");
		setTimeout(() => {
			document.getElementById(current_app + "_app").classList.remove("closeAppAnimation");
			document.getElementById(current_app + "_app").style.display = "none";
			current_app = "";
		}, 300);
	}
}

function closeApp(app_id) {
	if (app_id == null) {
		if (open_apps.includes(current_app)) {
			document.getElementById(current_app + "_app").remove();
			open_apps.splice(open_apps.indexOf(current_app + "_app"), 1);
			removeFromRecents(current_app);
			current_app = "";
		} else {
			console.log("Cannot close app because app is not open");
		}
	} else {
		if (open_apps.includes(app_id)) {
			document.getElementById(app_id + "_app").remove();
			open_apps.splice(open_apps.indexOf(app_id), 1);
			removeFromRecents(app_id);
			if (app_id == current_app) {
				current_app = "";
			}
		} else {
			console.log("Cannot close app because app is not open");
		}
	}
}

function addToRecents(app_id, app_title, app_icon, app_url) {
	if (recent_apps.includes(app_id)) {
		console.log("App already in recents");
	} else {
		recent_apps.push(app_id);
		let default_recent = document.getElementById("recent-app");
		let cloned_recent = default_recent.cloneNode(true);
		cloned_recent.setAttribute("id", app_id + "_recent");
		cloned_recent.querySelector("#recent-open-area").setAttribute("onclick", 'openApp(\'' + app_id + '\', \'' + app_title + '\', \'' + app_icon + '\', \'' + app_url + '\', \'\')');
		cloned_recent.querySelector("#recent-app-icon").setAttribute("src", app_icon);
		cloned_recent.querySelector("#recent-app-text").innerHTML = app_title;
		cloned_recent.querySelector("#close-app-icon").setAttribute("onclick", "closeApp(\'" + app_id + "'\)");
		document.getElementById("recent-apps").appendChild(cloned_recent);
	}
}

function removeFromRecents(app_id) {
	if (recent_apps.includes(app_id)) {
		document.getElementById(app_id + "_recent").remove();
		recent_apps.splice(recent_apps.indexOf(app_id), 1);
	} else {
		console.log("Cannot remove from recents because app is not on recents")
	}
}

function installApp(app_id, app_title, app_icon, app_url, refresh) {
	if (installed_apps.includes(app_id)) {
		console.log("App already installed");
		toast("App already installed");
	} else {
		installed_apps.push(app_id);
		installed_apps_title.push(app_title);
		installed_apps_icon.push(app_icon);
		installed_apps_url.push(app_url);
		if (!refresh) {
			saveInstalledApps();
			toast("App installed");
		}
		let default_install = document.getElementById("installed-app");
		let cloned_install = default_install.cloneNode(true);
		cloned_install.setAttribute("id", app_id + "_install");
		cloned_install.setAttribute("onclick", 'openApp(\'' + app_id + '\', \'' + app_title + '\', \'' + app_icon + '\', \'' + app_url + '\', \'\')');
		cloned_install.querySelector("#installed-app-icon").setAttribute("src", app_icon);
		cloned_install.querySelector("#installed-app-text").innerHTML = app_title;
		document.getElementById("installed-apps").appendChild(cloned_install);
	}
}

function uninstallApp(app_id) {
	if (installed_apps.includes(app_id)) {
		document.getElementById(app_id + "_install").remove();
		let app_position = installed_apps.indexOf(app_id)
		installed_apps.splice(app_position, 1);
		installed_apps_title.splice(app_position, 1);
		installed_apps_icon.splice(app_position, 1);
		installed_apps_url.splice(app_position, 1);
		saveInstalledApps();
		toast("App uninstalled");
	} else {
		console.log("Cannot uninstall app because app is not installed");
	}
}

function openPanel() {
	document.getElementById("control-panel").style.display = "block";
	document.getElementById("control-panel").classList.add("openMenuAnimation");
	setTimeout(() => {
		document.getElementById("control-panel").classList.remove("openMenuAnimation");
		controlPanelOpen = true;
	}, 300)
}

function closePanel() {
	document.getElementById("control-panel").classList.add("closeMenuAnimation");
	setTimeout(() => {
		document.getElementById("control-panel").style.display = "none";
		document.getElementById("control-panel").classList.remove("closeMenuAnimation");
		controlPanelOpen = false;
	}, 300)
}

function togglePanel() {
	if (controlPanelOpen) {
		closePanel();
	} else {
		openPanel();
	}
}

function toast(text, duration) {
	let toast_duration = 2000;
	if (duration != null) {
		toast_duration = duration;
	}
	document.getElementById("toast").style.display = "flex";
	document.getElementById("toast-text").innerHTML = text;
	setTimeout(() => {
		document.getElementById("toast").style.display = "none";
	}, toast_duration)
}
function updateTime() {
	let date = new Date();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	if (hours < 10) {
		hours = "0" + hours.toString();
	}
	if (minutes < 10) {
		minutes = "0" + minutes.toString();
	}
	document.getElementById("clock-widget-time").innerHTML = hours + ":" + minutes;
}

updateTime();

setInterval(updateTime, 1000);

// disable android context menu
window.oncontextmenu = function(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
};