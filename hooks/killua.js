"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
const react_1 = require("react");
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
//* get from localstorage
function getFromLocalstorage(args) {
    let parsedValue = args.default;
    const localStorageValue = localStorage.getItem(args.key);
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
function useKillua(args) {
    //* current thunder key name in localstorage
    const thunderKeyName = `thunder${args.key
        .charAt(0)
        .toUpperCase()}${args.key.slice(1)}`;
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
        : getFromLocalstorage({
            key: thunderKeyName,
            default: args.default,
            encrypt: args.encrypt,
        }));
    const isMountedRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!isMountedRef.current) {
            if (thunderState === undefined) {
                setThunderState(getFromLocalstorage({
                    key: thunderKeyName,
                    default: args.default,
                    encrypt: args.encrypt,
                }));
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
            const localstorageValue = getFromLocalstorage({
                key: thunderKeyName,
                default: args.default,
                encrypt: args.encrypt,
            });
            if (localstorageValue !== thunderState) {
                setThunderState(localstorageValue);
            }
        };
        window.addEventListener("storage", getUpdatedThunderFromLocalstorage);
        return () => {
            window.removeEventListener("storage", getUpdatedThunderFromLocalstorage);
        };
    }, []);
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
