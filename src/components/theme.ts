export type ThemeChoice = "auto" | "day" | "night";

export const THEME_KEY = "hoshinfo-theme";

/**
 * Runs in <head> before first paint, as on Hoshikopi (its ADR 0010): Day from 6 AM to 6 PM on the
 * visitor's own clock, Night otherwise, unless they pinned one. It checks again every minute so an
 * open page turns at 6:00 and 18:00, crossfading where the browser can (a hidden tab switches at
 * once), and exposes itself as window.hoshinfoTheme for the switch's Auto.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement;function choice(){var c;try{c=localStorage.getItem("${THEME_KEY}")}catch(e){}if(c!=="day"&&c!=="night"){var h=new Date().getHours();c=h>=6&&h<18?"day":"night"}return c}function pick(){d.dataset.theme=choice()}pick();window.hoshinfoTheme=pick;setInterval(function(){var c=choice();if(c===d.dataset.theme)return;if(document.startViewTransition&&document.visibilityState==="visible")document.startViewTransition(function(){d.dataset.theme=c});else d.dataset.theme=c},60000)})();`;
