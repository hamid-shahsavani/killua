"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = __importStar(require("crypto-js"));
const react_1 = require("react");
const ssr_1 = require("../providers/ssr");
function useKillua(args) {
    //* current thunder key name in localstorage
    const thunderKeyName = `thunder${args.key
        .charAt(0)
        .toUpperCase()}${args.key.slice(1)}`;
    //* get uniqe user id for salt key
    function getUniqeUserId() {
        let parsedValue = '';
        function setSaltKeyToLocalstorage() {
            parsedValue = Math.floor(Math.random() * Date.now()).toString(36);
            localStorage.setItem('thunderSaltKey', CryptoJS.AES.encrypt(parsedValue, 'thunder').toString());
        }
        const localStorageValue = localStorage.getItem('thunderSaltKey');
        if (localStorageValue) {
            try {
                parsedValue = CryptoJS.AES.decrypt(localStorageValue, 'thunder').toString(CryptoJS.enc.Utf8);
            }
            catch (_a) {
                setSaltKeyToLocalstorage();
            }
        }
        else {
            setSaltKeyToLocalstorage();
        }
        return parsedValue;
    }
    //* set to localstorage
    function setToLocalstorage(args) {
        localStorage.setItem(args.key, args.encrypt
            ? CryptoJS.AES.encrypt(JSON.stringify(args.data), getUniqeUserId()).toString()
            : JSON.stringify(args.data));
        window.dispatchEvent(new Event('storage'));
    }
    //* get thunder from localstorage
    function getThunderFromLocalstorage() {
        // if ssr and not wrapped with SSRKilluaProvider && throw error
        if (typeof window === 'undefined')
            throw new Error('please wrap your app with <SSRKilluaProvider></SSRKilluaProvider> in ssr');
        // if thunder config not changed by developer && get thunder from localStorage
        let parsedValue = args.default;
        if (Object(getThundersChecksumFromLocalstorage())[thunderKeyName] ===
            CryptoJS.MD5(JSON.stringify(args)).toString()) {
            const localStorageValue = localStorage.getItem(thunderKeyName);
            if (localStorageValue) {
                try {
                    parsedValue = JSON.parse(args.encrypt
                        ? CryptoJS.AES.decrypt(localStorageValue, getUniqeUserId()).toString(CryptoJS.enc.Utf8)
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
        }
        return parsedValue;
    }
    //* get 'thundersExpire' from localStorage
    function getThundersExpireFromLocalstorage() {
        const removeAllThundersFromLocalstorage = () => {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('thunder') && key !== 'thunderExpire') {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach((key) => {
                localStorage.removeItem(key);
            });
        };
        let parsedValue = {};
        const localStorageValue = localStorage.getItem('thundersExpire');
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(CryptoJS.AES.decrypt(localStorageValue, getUniqeUserId()).toString(CryptoJS.enc.Utf8));
            }
            catch (_a) {
                setToLocalstorage({
                    key: 'thundersExpire',
                    data: {},
                    encrypt: true,
                });
                removeAllThundersFromLocalstorage();
            }
        }
        else {
            setToLocalstorage({
                key: 'thundersExpire',
                data: {},
                encrypt: true,
            });
            removeAllThundersFromLocalstorage();
        }
        return parsedValue;
    }
    //* get 'thundersChecksum' from localStorage
    function getThundersChecksumFromLocalstorage() {
        let parsedValue = {};
        const localStorageValue = localStorage.getItem('thundersChecksum');
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(CryptoJS.AES.decrypt(localStorageValue, getUniqeUserId()).toString(CryptoJS.enc.Utf8));
            }
            catch (_a) {
                setToLocalstorage({
                    key: 'thundersChecksum',
                    data: {},
                    encrypt: true,
                });
            }
        }
        else {
            setToLocalstorage({
                key: 'thundersChecksum',
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
                key: 'thundersChecksum',
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
                key: 'thundersExpire',
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
    const isServer = (0, ssr_1.useSSRKillua)();
    const [thunderState, setThunderState] = (0, react_1.useState)(isServer ? undefined : getThunderFromLocalstorage());
    (0, react_1.useEffect)(() => {
        if (isServer) {
            const thunderLocalstorageValue = getThunderFromLocalstorage();
            if (thunderLocalstorageValue !== thunderState) {
                setThunderState(getThunderFromLocalstorage());
            }
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
    //* update thunder state after updated localstorage value
    (0, react_1.useEffect)(() => {
        const getUpdatedThunderFromLocalstorage = () => {
            if (Object(getThundersChecksumFromLocalstorage())[thunderKeyName] ===
                CryptoJS.MD5(JSON.stringify(args)).toString()) {
                const thunderLocalstorageValue = getThunderFromLocalstorage();
                if (thunderLocalstorageValue !== thunderState) {
                    setThunderState(getThunderFromLocalstorage());
                }
            }
        };
        window.addEventListener('storage', getUpdatedThunderFromLocalstorage);
        return () => {
            window.removeEventListener('storage', getUpdatedThunderFromLocalstorage);
        };
    }, []);
    //* set expire time and remove expired thunder from localstorage
    (0, react_1.useEffect)(() => {
        let intervalId;
        const thundersExpireLocalstorage = getThundersExpireFromLocalstorage();
        // function for set expire time to 'thundersExpire' object
        function addThunderToThundersExpireLocalstorageHandler() {
            Object(thundersExpireLocalstorage)[thunderKeyName] =
                args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
            setToLocalstorage({
                key: 'thundersExpire',
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
                intervalId = setInterval(() => {
                    removeExpiredThunderHandler();
                }, Object(thundersExpireLocalstorage)[thunderKeyName] - Date.now());
            }
        }
        return () => {
            clearInterval(intervalId);
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
    // assign thunder config selectors to selectors with object
    const selectors = {};
    if (args.selectors) {
        for (const selectorName in args.selectors) {
            if (Object.prototype.hasOwnProperty.call(args.selectors, selectorName)) {
                const selectorFunc = args.selectors[selectorName];
                selectors[selectorName] = (payload) => selectorFunc(thunderState, payload);
            }
        }
    }
    // handler for update thunder state
    function setThunderHandler(value) {
        if (typeof value === 'function') {
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
        reducers,
        selectors,
        isReadyInSsr: thunderState !== undefined,
    };
}
exports.default = useKillua;
