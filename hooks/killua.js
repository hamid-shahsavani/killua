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
    // set data to localstorage
    function setDataToLocalstorage(data, key, encrypt) {
        localStorage.setItem(key, encrypt
            ? CryptoJS.AES.encrypt(JSON.stringify(data), getUniqeBrowserId()).toString()
            : data);
    }
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
                setDataToLocalstorage(args.default, getThunderKeyName(), args.encrypt);
            }
        }
        else {
            // set current thunder expire time to localstorage
            if (thunderExpireLocalstorage) {
                Object(thunderExpireLocalstorage)[getThunderKeyName()] =
                    args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
                setDataToLocalstorage(thunderExpireLocalstorage, "thunderExpire", true);
            }
        }
        return parsedValue;
    }
    // get 'thunderExpire' from localStorage
    const getThunderExpireLocalstorage = () => {
        let parsedValue = {};
        const localStorageValue = localStorage.getItem("thunderExpire");
        const removeAllThundersFromLocalstorage = () => {
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
        };
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(CryptoJS.enc.Utf8));
            }
            catch (_a) {
                // delete all localStorage keys starting with 'thunder'
                removeAllThundersFromLocalstorage();
                // create 'thunderExpire' with an empty object encrypted
                setDataToLocalstorage({}, "thunderExpire", true);
            }
        }
        else {
            // delete all localStorage keys starting with 'thunder'
            removeAllThundersFromLocalstorage();
            // create 'thunderExpire' with an empty object encrypted
            setDataToLocalstorage({}, "thunderExpire", true);
        }
        return parsedValue;
    };
    // detect thunder config changed by developer and create again thunder key in localstorage
    function detectThunderConfigChangedByDeveloperHandler() {
        // set current thunder with default value to localstorage
        setDataToLocalstorage(args.default, getThunderKeyName(), args.encrypt);
        // set current thunder expire time to localstorage
        if (thunderExpireLocalstorage) {
            Object(thunderExpireLocalstorage)[getThunderKeyName()] =
                args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
            setDataToLocalstorage(thunderExpireLocalstorage, "thunderExpire", true);
        }
        // reload after change thunder config
        window.location.reload();
    }
    const prevExpireArgRef = (0, react_1.useRef)(null);
    const isFirstRender = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
        if (!isFirstRender.current && prevExpireArgRef.current !== args) {
            setTimeout(detectThunderConfigChangedByDeveloperHandler, 1000);
        }
        prevExpireArgRef.current = args;
        isFirstRender.current = false;
    }, [args]);
    // get thunder value from localstorage for initial value of thunderState
    const [thunder, setThunder] = (0, react_1.useState)(typeof window === "undefined" ? undefined : getThunderFromLocalstorage());
    (0, react_1.useEffect)(() => {
        if (thunder === undefined) {
            setThunder(getThunderFromLocalstorage());
        }
    }, []);
    // set expire time and remove expired thunder from localstorage
    const thunderExpireLocalstorage = getThunderExpireLocalstorage();
    (0, react_1.useEffect)(() => {
        let intervalIdOne;
        let intervalIdTwo;
        // if 'args.key' is not in 'thunderExpire' object && push it to 'thunderExpire' with expire time
        if (thunderExpireLocalstorage &&
            !Object(thunderExpireLocalstorage)[getThunderKeyName()]) {
            Object(thunderExpireLocalstorage)[getThunderKeyName()] =
                args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
            setDataToLocalstorage(thunderExpireLocalstorage, "thunderExpire", true);
        }
        // if date.now > expire time ? remove thunder expired from localStorage and 'thunderExpire' object : setInterval for remove from localStorage and 'thunderExpire' object
        if (thunderExpireLocalstorage &&
            Object(thunderExpireLocalstorage)[getThunderKeyName()] !== null) {
            // function for remove from localStorage and 'thunderExpire'
            function removeThunderExpiredThunder() {
                setThunder(args.default);
                setDataToLocalstorage(args.default, getThunderKeyName(), args.encrypt);
                Object(thunderExpireLocalstorage)[getThunderKeyName()] =
                    Date.now() + Number(args.expire) * 60 * 1000;
                setDataToLocalstorage(thunderExpireLocalstorage, "thunderExpire", true);
            }
            intervalIdOne = setInterval(() => {
                console.log(getThunderKeyName(), Object(thunderExpireLocalstorage)[getThunderKeyName()] - Date.now());
            }, 1000);
            // if thunder expire ? remove it from localStorage and 'thunderExpire' object : setInterval for remove from localStorage and 'thunderExpire' object
            if (Date.now() > Object(thunderExpireLocalstorage)[getThunderKeyName()]) {
                removeThunderExpiredThunder();
            }
            else {
                intervalIdTwo = setInterval(() => {
                    removeThunderExpiredThunder();
                }, Object(thunderExpireLocalstorage)[getThunderKeyName()] - Date.now());
            }
        }
        return () => {
            clearInterval(intervalIdOne);
            clearInterval(intervalIdTwo);
        };
    }, [thunder]);
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
            setDataToLocalstorage(thunder, getThunderKeyName(), args.encrypt);
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
