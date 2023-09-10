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
        localStorage.setItem(args.key, args.encrypt
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
                setThunderToLocalstorageAndStateHandler({
                    key: thunderKeyName,
                    data: args.default,
                    encrypt: args.encrypt,
                });
            }
        }
        else {
            setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: args.default,
                encrypt: args.encrypt,
            });
        }
        return parsedValue;
    }
    //* get 'thundersExpire' from localStorage
    const getThundersExpireFromLocalstorage = () => {
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
        let parsedValue = {};
        const localStorageValue = localStorage.getItem("thundersExpire");
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(CryptoJS.enc.Utf8));
            }
            catch (_a) {
                setToLocalstorage({
                    key: "thundersExpire",
                    data: {},
                    encrypt: true,
                });
                removeAllThundersFromLocalstorage();
            }
        }
        else {
            setToLocalstorage({
                key: "thundersExpire",
                data: {},
                encrypt: true,
            });
            removeAllThundersFromLocalstorage();
        }
        return parsedValue;
    };
    //* get 'thundersChecksum' from localStorage
    function getThundersChecksumFromLocalstorage() {
        let parsedValue = {};
        const localStorageValue = localStorage.getItem("thundersChecksum");
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(CryptoJS.enc.Utf8));
            }
            catch (_a) {
                setToLocalstorage({
                    key: "thundersChecksum",
                    data: {},
                    encrypt: true,
                });
            }
        }
        else {
            setToLocalstorage({
                key: "thundersChecksum",
                data: {},
                encrypt: true,
            });
        }
        return parsedValue;
    }
    //* detect change thunder config by developer and create again thunder key in localstorage
    (0, react_1.useEffect)(() => {
        const thundersChecksumLocalstorage = getThundersChecksumFromLocalstorage();
        // update thunder checksum in localStorage && reset thunder-key&thunder-state to default value handler
        const updateThunderChecksumHandler = () => {
            Object(thundersChecksumLocalstorage)[thunderKeyName] = CryptoJS.MD5(JSON.stringify(args)).toString();
            setToLocalstorage({
                key: "thundersChecksum",
                data: thundersChecksumLocalstorage,
                encrypt: true,
            });
            setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: args.default,
                encrypt: args.encrypt,
            });
        };
        // update expire time in 'thundersExpire' object
        function updateExpireTimeHandler() {
            const thundersExpireLocalstorage = getThundersExpireFromLocalstorage();
            Object(thundersExpireLocalstorage)[thunderKeyName] =
                args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
            setToLocalstorage({
                key: "thundersExpire",
                data: thundersExpireLocalstorage,
                encrypt: true,
            });
        }
        // if 'thundersChecksum' is not in localStorage ? (add key to 'thundersChecksum' with checksum && update thunder expire with args.expire && reset thunder-key&thunder-state to default value) : (if changed thunder config by developer && (update checksum && reset thunder-key&thunder-state to default value))
        if (!thundersChecksumLocalstorage.hasOwnProperty(thunderKeyName)) {
            updateThunderChecksumHandler();
            updateExpireTimeHandler();
        }
        else {
            if (Object(thundersChecksumLocalstorage)[thunderKeyName] !==
                CryptoJS.MD5(JSON.stringify(args)).toString()) {
                updateThunderChecksumHandler();
                updateExpireTimeHandler();
            }
        }
    }, []);
    //* thunder state with initial-value from localstorage
    const [thunderState, setThunderState] = (0, react_1.useState)(() => typeof window === "undefined" ? undefined : getThunderFromLocalstorage());
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
        setToLocalstorage({
            key: thunderKeyName,
            data: args.data,
            encrypt: args.encrypt,
        });
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
    (0, react_1.useEffect)(() => {
        let intervalId;
        let logIntervalId;
        function setExpireTimeHandlerAndRemoveExpiredThunder() {
            const thundersExpireLocalstorage = getThundersExpireFromLocalstorage();
            // function for set expire time to 'thundersExpire' object
            function addThunderToThundersExpireLocalstorageHandler() {
                Object(thundersExpireLocalstorage)[thunderKeyName] =
                    args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
                setToLocalstorage({
                    key: "thundersExpire",
                    data: thundersExpireLocalstorage,
                    encrypt: true,
                });
            }
            // function for remove expired thunder from localStorage and 'thundersExpire'
            function removeExpiredThunderHandler() {
                setThunderToLocalstorageAndStateHandler({
                    key: thunderKeyName,
                    data: args.default,
                    encrypt: args.encrypt,
                });
                addThunderToThundersExpireLocalstorageHandler();
            }
            if (thundersExpireLocalstorage) {
                // if thunder is not in 'thundersExpire' object && push it to 'thundersExpire' with expire time
                if (!thundersExpireLocalstorage.hasOwnProperty(thunderKeyName)) {
                    addThunderToThundersExpireLocalstorageHandler();
                }
                // if thunder is with expired time in 'thundersExpire' object ? (if thunder expired ? remove from localStorage and 'thundersExpire' object) : (setInterval for remove from localStorage and 'thundersExpire' object)
                if (Object(thundersExpireLocalstorage)[thunderKeyName]) {
                    if (Date.now() > Object(thundersExpireLocalstorage)[thunderKeyName]) {
                        removeExpiredThunderHandler();
                    }
                    else {
                        logIntervalId = setInterval(() => {
                            console.log(thunderKeyName, Object(thundersExpireLocalstorage)[thunderKeyName] - Date.now());
                        }, 1000);
                        intervalId = setInterval(() => {
                            removeExpiredThunderHandler();
                        }, Object(thundersExpireLocalstorage)[thunderKeyName] - Date.now());
                    }
                }
            }
        }
        setExpireTimeHandlerAndRemoveExpiredThunder();
        return () => {
            clearInterval(intervalId);
            clearInterval(logIntervalId);
        };
    }, [thunderState]);
    //* return thunder state and setThunder state function and detect isReady thunder state and reducers object
    // assign thunder config reducers to reducers object
    const reducers = {};
    if (args.reducers) {
        for (const actionName in args.reducers) {
            if (Object.prototype.hasOwnProperty.call(args.reducers, actionName)) {
                const actionFunc = args.reducers[actionName];
                reducers[actionName] = (payload) => {
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
        reducers,
    };
}
exports.default = useKillua;
