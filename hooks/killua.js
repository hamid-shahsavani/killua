"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
const react_1 = require("react");
function useKillua(args) {
    // for genrate uniqe browser id for encrypt key
    function uniqeBrowserId() {
        const browserInfo = window.navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        const browserName = browserInfo[1].toLowerCase();
        const browserVersion = browserInfo[2];
        return `${browserName}${browserVersion}${window.navigator.userAgent}`;
    }
    // localstorage key for thunder
    const thunderKey = `thunder${args.key
        .charAt(0)
        .toUpperCase()}${args.key.slice(1)}`;
    // for get thunder value from localstorage
    function getThunderFromLocalstorage() {
        let parsedValue = args.default;
        // convert args.key to thunder + first letter uppercase
        const localStorageValue = localStorage.getItem(thunderKey);
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(args.encrypt
                    ? CryptoJS.AES.decrypt(localStorageValue, uniqeBrowserId()).toString(CryptoJS.enc.Utf8)
                    : localStorageValue);
            }
            catch (_a) {
                localStorage.removeItem(thunderKey);
            }
        }
        return parsedValue;
    }
    // for set expire time
    (0, react_1.useEffect)(() => {
        // check if 'thunderExpire' exists in localStorage and decrypt it, or set it to null if decryption fails
        const getThunderExpireLocalstorage = () => {
            let parsedValue = null;
            const localStorageValue = localStorage.getItem("thunderExpire");
            if (localStorageValue) {
                try {
                    parsedValue = JSON.parse(CryptoJS.AES.decrypt(localStorageValue, uniqeBrowserId()).toString(CryptoJS.enc.Utf8));
                }
                catch (_a) {
                    localStorage.removeItem("thunderExpire");
                }
            }
            return parsedValue;
        };
        const thunderExpireLocalstorage = getThunderExpireLocalstorage();
        // check if 'thunderExpire' in localStorage
        if (!thunderExpireLocalstorage) {
            // create 'thunderExpire' with an empty object encrypted
            localStorage.setItem("thunderExpire", CryptoJS.AES.encrypt(JSON.stringify({}), uniqeBrowserId()).toString());
            // delete all localStorage keys starting with 'thunder'
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("thunder") && key !== "thunderExpire") {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach((key) => {
                localStorage.removeItem(key);
            });
        }
        // check if 'args.key' is not in 'thunderExpireLocalstorage' && push it to 'thunderExpireLocalstorage'
        if (thunderExpireLocalstorage &&
            !Object(thunderExpireLocalstorage)[thunderKey]) {
            Object(thunderExpireLocalstorage)[thunderKey] =
                args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
            localStorage.setItem("thunderExpire", CryptoJS.AES.encrypt(JSON.stringify(thunderExpireLocalstorage), uniqeBrowserId()).toString());
        }
        // check expire time for 'args.key' and remove it from localStorage and 'thunderExpire' if expired
        if (thunderExpireLocalstorage &&
            Object(thunderExpireLocalstorage)[thunderKey] !== null) {
            // date.now > expire time ? remove from localStorage and 'thunderExpire' : set timeout for remove from localStorage and 'thunderExpire'
            if (Date.now() > Object(thunderExpireLocalstorage)[thunderKey]) {
                localStorage.removeItem(thunderKey);
                delete Object(thunderExpireLocalstorage)[thunderKey];
                localStorage.setItem("thunderExpire", CryptoJS.AES.encrypt(JSON.stringify(thunderExpireLocalstorage), uniqeBrowserId()).toString());
            }
        }
    }, [args.key]);
    // get thunder value from localstorage (initial value)
    const [thunder, setThunder] = (0, react_1.useState)(typeof window !== undefined ? undefined : getThunderFromLocalstorage());
    (0, react_1.useEffect)(() => {
        if (thunder === undefined) {
            setThunder(getThunderFromLocalstorage());
        }
    }, []);
    // get updated thunder value from localstorage and set to thunderState (call after update localstorage value)
    (0, react_1.useEffect)(() => {
        const getUpdatedThunderFromLocalstorage = () => {
            const localstorageValue = getThunderFromLocalstorage();
            if (localstorageValue !== thunder) {
                setThunder(localstorageValue);
            }
        };
        window.addEventListener("storage", () => {
            getUpdatedThunderFromLocalstorage();
        });
        return () => {
            window.removeEventListener("storage", () => {
                getUpdatedThunderFromLocalstorage();
            });
        };
    }, []);
    // set thunder value to localstorage (call after update thunder state)
    (0, react_1.useEffect)(() => {
        if (thunder !== undefined) {
            localStorage.setItem(thunderKey, args.encrypt
                ? CryptoJS.AES.encrypt(JSON.stringify(thunder), uniqeBrowserId())
                : thunder);
            window.dispatchEvent(new Event("storage"));
        }
    }, [thunder]);
    // assign the actions defined in args.actions to the actions object
    const actions = {};
    if (args.actions) {
        for (const actionName in args.actions) {
            if (Object.prototype.hasOwnProperty.call(args.actions, actionName)) {
                const actionFunc = args.actions[actionName];
                actions[actionName] = (payload) => {
                    setThunder((prevState) => actionFunc(prevState, payload));
                };
            }
        }
    }
    //change returned from [thunder, setThunder function, thunderStateIsReady] to { thunder: thunderState, setThunder: setThunderFunction, thunderStateIsReady: thunderStateIsReady }
    return {
        value: thunder,
        setValue: (value) => {
            if (typeof value === "function") {
                setThunder((prev) => value(prev));
            }
            else {
                setThunder(value);
            }
        },
        isReady: thunder === undefined ? false : true,
        actions,
    };
}
exports.default = useKillua;
