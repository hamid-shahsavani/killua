"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
const react_1 = require("react");
function useKillua(args) {
    // current thunder key name in localstorage
    function getThunderKeyName() {
        return `thunder${args.key.charAt(0).toUpperCase()}${args.key.slice(1)}`;
    }
    // generate uniqe browser id for encrypt key
    function getUniqeBrowserId() {
        const browserInfo = window.navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        const browserName = browserInfo[1].toLowerCase();
        const browserVersion = browserInfo[2];
        return `${browserName}${browserVersion}${window.navigator.userAgent}`;
    }
    // detect thunder config changed by developer and create again thunder key in localstorage
    function detectThunderConfigChangedByDeveloperHandler() {
        // set current thunder with default value to localstorage
        localStorage.setItem(getThunderKeyName(), args.encrypt
            ? CryptoJS.AES.encrypt(JSON.stringify(args.default), getUniqeBrowserId()).toString()
            : JSON.stringify(args.default));
        // set current thunder expire time to localstorage
        if (thunderExpireLocalstorage) {
            Object(thunderExpireLocalstorage)[getThunderKeyName()] =
                args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
            localStorage.setItem("thunderExpire", CryptoJS.AES.encrypt(JSON.stringify(thunderExpireLocalstorage), getUniqeBrowserId()).toString());
        }
        // reload after change thunder config
        window.location.reload();
    }
    const prevExpireArgRef = (0, react_1.useRef)(null);
    const isFirstRender = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
        if (!isFirstRender.current && prevExpireArgRef.current !== args) {
            setTimeout(() => {
                detectThunderConfigChangedByDeveloperHandler();
            }, 100);
        }
        prevExpireArgRef.current = args;
        isFirstRender.current = false;
    }, [args]);
    // get thunder value from localstorage
    function getThunderFromLocalstorage() {
        let parsedValue = args.default;
        const localStorageValue = localStorage.getItem(getThunderKeyName());
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(args.encrypt
                    ? CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(CryptoJS.enc.Utf8)
                    : localStorageValue);
            }
            catch (_a) {
                localStorage.removeItem(getThunderKeyName());
            }
        }
        else {
            // set current thunder expire time to localstorage
            if (thunderExpireLocalstorage) {
                Object(thunderExpireLocalstorage)[getThunderKeyName()] =
                    args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
                localStorage.setItem("thunderExpire", CryptoJS.AES.encrypt(JSON.stringify(thunderExpireLocalstorage), getUniqeBrowserId()).toString());
            }
        }
        return parsedValue;
    }
    // set expire time and remove expired thunder from localstorage
    // for get 'thunderExpire' exists in localStorage and decrypted ? retruen decrypted value : null
    const getThunderExpireLocalstorage = () => {
        let parsedValue = null;
        const localStorageValue = localStorage.getItem("thunderExpire");
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(CryptoJS.enc.Utf8));
            }
            catch (_a) {
                localStorage.removeItem("thunderExpire");
            }
        }
        return parsedValue;
    };
    const thunderExpireLocalstorage = getThunderExpireLocalstorage();
    (0, react_1.useEffect)(() => {
        // check if 'thunderExpire' key in localStorage && create 'thunderExpire' with an empty object encrypted
        if (!thunderExpireLocalstorage) {
            // create 'thunderExpire' with an empty object encrypted
            localStorage.setItem("thunderExpire", CryptoJS.AES.encrypt(JSON.stringify({}), getUniqeBrowserId()).toString());
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
        // if 'args.key' is not in 'thunderExpire' object && push it to 'thunderExpire' with expire time
        if (thunderExpireLocalstorage &&
            !Object(thunderExpireLocalstorage)[getThunderKeyName()]) {
            Object(thunderExpireLocalstorage)[getThunderKeyName()] =
                args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
            localStorage.setItem("thunderExpire", CryptoJS.AES.encrypt(JSON.stringify(thunderExpireLocalstorage), getUniqeBrowserId()).toString());
        }
        // if date.now > expire time ? remove thunder expired from localStorage and 'thunderExpire' object : setInterval for remove from localStorage and 'thunderExpire' object
        if (thunderExpireLocalstorage &&
            Object(thunderExpireLocalstorage)[getThunderKeyName()] !== null) {
            // function for remove from localStorage and 'thunderExpire'
            function removeThunderExpiredThunder() {
                setThunder(args.default);
                localStorage.setItem(getThunderKeyName(), args.default);
                Object(thunderExpireLocalstorage)[getThunderKeyName()] =
                    Date.now() + Number(args.expire) * 60 * 1000;
                localStorage.setItem("thunderExpire", CryptoJS.AES.encrypt(JSON.stringify(thunderExpireLocalstorage), getUniqeBrowserId()).toString());
            }
            // if thunder expire ? remove it from localStorage and 'thunderExpire' object : setInterval for remove from localStorage and 'thunderExpire' object
            if (Date.now() >
                Object(thunderExpireLocalstorage)[getThunderKeyName()]) {
                removeThunderExpiredThunder();
            }
            else {
                setInterval(() => {
                    console.log(getThunderKeyName(), Object(thunderExpireLocalstorage)[getThunderKeyName()] -
                        Date.now());
                }, 1000);
                setInterval(() => {
                    removeThunderExpiredThunder();
                }, Object(thunderExpireLocalstorage)[getThunderKeyName()] - Date.now());
            }
        }
    }, []);
    // get thunder value from localstorage for initial value of thunderState
    const [thunder, setThunder] = (0, react_1.useState)(typeof window === "undefined" ? undefined : getThunderFromLocalstorage());
    (0, react_1.useEffect)(() => {
        if (thunder === undefined) {
            setThunder(getThunderFromLocalstorage());
        }
    }, []);
    // setThunder with updated localstorage value (call after update key in localstorage with setStateHandler function)
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
    // set thunder value to localstorage (call after update thunder state in first set thunder initial value and after update thunder state with setThunder function)
    (0, react_1.useEffect)(() => {
        if (thunder !== undefined) {
            localStorage.setItem(getThunderKeyName(), args.encrypt
                ? CryptoJS.AES.encrypt(JSON.stringify(thunder), getUniqeBrowserId())
                : thunder);
            window.dispatchEvent(new Event("storage"));
        }
    }, [thunder]);
    // assign thunder actions to actions object
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
    // return thunder state and setThunder function and isReady state and actions object
    function setStateHandler(value) {
        if (typeof value === "function") {
            setThunder((prev) => value(prev));
        }
        else {
            setThunder(value);
        }
    }
    return {
        thunder: thunder,
        setThunder: (value) => {
            setStateHandler(value);
        },
        isReady: thunder === undefined ? false : true,
        actions,
    };
}
exports.default = useKillua;