/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://github.com/joelpurra/talkie>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import {
    promiseTry,
} from "../shared/promise";

import {
    getBackgroundPage,
} from "../shared/tabs";

import {
    knownEvents,
} from "../shared/events";

import {
    getStoredValue,
} from "../shared/storage";

import {
    eventToPromise,
    startFrontend,
    stopFrontend,
} from "../frontend/shared-frontend";

import DualLogger from "../frontend/dual-log";

const dualLogger = new DualLogger("popup.js");

const loadOptionsAndApply = () => promiseTry(
    () => {
        const hideDonationsOptionId = "options-popup-donate-buttons-hide";

        return Promise.resolve()
            .then(() => getStoredValue(hideDonationsOptionId))
            .then((hideDonations) => {
                hideDonations = hideDonations === true;

                if (hideDonations) {
                    const elementsToHide = []
                        .concat(Array.from(document.getElementsByTagName("footer")))
                        .concat(Array.from(document.getElementsByTagName("hr")));

                    elementsToHide.forEach((element) => {
                        element.style.display = "none";
                    });
                }

                return undefined;
            });
    }
);

const passClickToBackground = (background) => promiseTry(
        () => {
            try {
                dualLogger.dualLog("Start", "passClickToBackground");
                background.iconClick();
                dualLogger.dualLog("Done", "passClickToBackground");
            } catch (error) {
                dualLogger.dualLogError("Error", "passClickToBackground", error);
                throw error;
            }
        }
);

const updateProgress = (data) => {
    const progressBar = document.getElementById("progress");
    progressBar.max = data.max - data.min;
    progressBar.value = data.current;
};

const start = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => startFrontend())
            .then(() => loadOptionsAndApply())
            .then(() => getBackgroundPage())
            .then((background) => background.broadcaster.registerListeningAction(knownEvents.updateProgress, (/* eslint-disable no-unused-vars*/actionName/* eslint-enable no-unused-vars*/, actionData) => updateProgress(actionData)))
            .then(() => getBackgroundPage())
            .then((background) => passClickToBackground(background));
    }
);

const stop = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => stopFrontend());
    }
);

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("unload", eventToPromise.bind(null, stop));