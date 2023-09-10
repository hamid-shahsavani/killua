"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
const react_1 = require("react");
function useKillua(args) {
    //* current thunder key name in localstorage
    const thunderKeyName = `thunder${args.key
        .charAt(0)
        .toUpperCase()}${args.key.slice(1)}`;
    //* generate uniqe browser id for salt key
    function getUniqeBrowserId() {
        const browserInfo = window.navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        const browserName = browserInfo[1].toLowerCase();
        const browserVersion = browserInfo[2];
        return `${browserName}${browserVersion}${window.navigator.userAgent}`;
    }
    //* set to localstorage
    function setToLocalstorage(args) {
        localStorage.setItem(thunderKeyName, args.encrypt
            ? CryptoJS.AES.encrypt(JSON.stringify(args.data), getUniqeBrowserId()).toString()
            : JSON.stringify(args.data));
    }
    //* get thunder from localstorage
    function getThunderFromLocalstorage() {
        let parsedValue = args.default;
        const localStorageValue = localStorage.getItem(thunderKeyName);
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(args.encrypt
                    ? CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(CryptoJS.enc.Utf8)
                    : localStorageValue);
            }
            catch (_a) {
                setToLocalstorage({
                    key: args.key,
                    data: args.default,
                    encrypt: args.encrypt,
                });
            }
        }
        else {
            setToLocalstorage({
                key: args.key,
                data: args.default,
                encrypt: args.encrypt,
            });
        }
        return parsedValue;
    }
    //* detect changed property ['expire', 'default', 'encrypt'] in thunder config by developer and create again thunder key in localstorage
    function detectThunderConfigChangedByDeveloperHandler() {
        var _a, _b, _c;
        if (((_a = prevArgsRef.current) === null || _a === void 0 ? void 0 : _a.expire) !== args.expire ||
            ((_b = prevArgsRef.current) === null || _b === void 0 ? void 0 : _b.default) !== args.default ||
            ((_c = prevArgsRef.current) === null || _c === void 0 ? void 0 : _c.encrypt) !== args.encrypt) {
            console.log("detectThunderConfigChangedByDeveloperHandler");
            // set current thunder with default value to localstorage and state
            setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: args.default,
                encrypt: args.encrypt,
            });
        }
    }
    const prevArgsRef = (0, react_1.useRef)(null);
    const isFirstRender = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
        if (!isFirstRender.current) {
            detectThunderConfigChangedByDeveloperHandler();
        }
        prevArgsRef.current = args;
        isFirstRender.current = false;
    }, [args]);
    //* thunder state with initial-value from localstorage
    const [thunderState, setThunderState] = (0, react_1.useState)(() => typeof window === "undefined"
        ? undefined
        : getThunderFromLocalstorage());
    const isMountedRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!isMountedRef.current) {
            if (thunderState === undefined) {
                setThunderState(getThunderFromLocalstorage());
            }
            isMountedRef.current = true;
        }
    }, []);
    //* set thunder to localstorage and state handler
    function setThunderToLocalstorageAndStateHandler(args) {
        setToLocalstorage(args);
        setThunderState(args.data);
    }
    //* update thunder state in other browser tab with updated localstorage value
    (0, react_1.useEffect)(() => {
        const getUpdatedThunderFromLocalstorage = () => {
            const localstorageValue = getThunderFromLocalstorage();
            if (localstorageValue !== thunderState) {
                setThunderState(localstorageValue);
            }
        };
        window.addEventListener("storage", getUpdatedThunderFromLocalstorage);
        return () => {
            window.removeEventListener("storage", getUpdatedThunderFromLocalstorage);
        };
    }, []);
    //* set expire time and remove expired thunder from localstorage
    // get 'thunderExpire' from localStorage
    const getThunderExpireFromLocalstorage = () => {
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
                setToLocalstorage({
                    key: "thunderExpire",
                    data: {},
                    encrypt: true,
                });
            }
        }
        else {
            // delete all localStorage keys starting with 'thunder'
            removeAllThundersFromLocalstorage();
            // create 'thunderExpire' with an empty object encrypted
            setToLocalstorage({
                key: "thunderExpire",
                data: {},
                encrypt: true,
            });
        }
        return parsedValue;
    };
    // set expire time and remove expired thunder from localstorage
    const thunderExpireLocalstorage = getThunderExpireFromLocalstorage();
    (0, react_1.useEffect)(() => {
        function pushThunderToExpireThunderKeyInLocalstorage() {
            Object(thunderExpireLocalstorage)[thunderKeyName] =
                args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
            setToLocalstorage({
                key: "thunderExpire",
                data: thunderExpireLocalstorage,
                encrypt: true,
            });
        }
        let intervalId;
        let logIntervalId;
        if (thunderExpireLocalstorage !== undefined) {
            // if 'args.key' is not in 'thunderExpire' object && push it to 'thunderExpire' with expire time
            if (Object(thunderExpireLocalstorage)[thunderKeyName] === undefined) {
                pushThunderToExpireThunderKeyInLocalstorage();
            }
            // if date.now > expire time ? remove thunder expired from localStorage and 'thunderExpire' object : setInterval for remove from localStorage and 'thunderExpire' object
            if (thunderExpireLocalstorage &&
                Object(thunderExpireLocalstorage)[thunderKeyName] !== null) {
                // function for remove from localStorage and 'thunderExpire'
                function removeThunderExpiredThunder() {
                    setThunderToLocalstorageAndStateHandler({
                        key: thunderKeyName,
                        data: args.default,
                        encrypt: args.encrypt,
                    });
                    pushThunderToExpireThunderKeyInLocalstorage();
                }
                // if thunder expire ? remove it from localStorage and 'thunderExpire' object : setInterval for remove from localStorage and 'thunderExpire' object
                if (Date.now() > Object(thunderExpireLocalstorage)[thunderKeyName]) {
                    removeThunderExpiredThunder();
                }
                else {
                    logIntervalId = setInterval(() => {
                        console.log(thunderKeyName, Object(thunderExpireLocalstorage)[thunderKeyName] - Date.now());
                    }, 1000);
                    intervalId = setInterval(() => {
                        removeThunderExpiredThunder();
                    }, Object(thunderExpireLocalstorage)[thunderKeyName] - Date.now());
                }
            }
        }
        return () => {
            clearInterval(intervalId);
            clearInterval(logIntervalId);
        };
    }, [thunderState]);
    //* return thunder state and setThunder state function and detect isReady thunder state and actions object
    // assign thunder config actions to actions object
    const actions = {};
    if (args.actions) {
        for (const actionName in args.actions) {
            if (Object.prototype.hasOwnProperty.call(args.actions, actionName)) {
                const actionFunc = args.actions[actionName];
                actions[actionName] = (payload) => {
                    setThunderToLocalstorageAndStateHandler({
                        key: thunderKeyName,
                        data: actionFunc(thunderState, payload),
                        encrypt: args.encrypt,
                    });
                };
            }
        }
    }
    // handler for update thunder state
    function setThunderHandler(value) {
        if (typeof value === "function") {
            setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: value(thunderState),
                encrypt: args.encrypt,
            });
        }
        else {
            setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: value,
                encrypt: args.encrypt,
            });
        }
    }
    return {
        thunder: thunderState,
        setThunder: setThunderHandler,
        isReady: thunderState === undefined ? false : true,
        actions,
    };
}
exports.default = useKillua;
